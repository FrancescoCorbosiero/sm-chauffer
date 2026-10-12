'use client';

import { memo, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Clock3, Route, Timer } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { GEO_FRAME, GEO_LAKES, GEO_PROVINCES, GEO_SWITZERLAND } from '@/lib/coverageGeo';
import { HUB_ID, formatDuration, pointName, project } from '@/lib/coverage';
import { getPlace, routeBetween, type Place } from '@/lib/places';
import { useReducedMotion } from '@/lib/hooks';

/**
 * The trip on a map: the same Lombardy geometry as the coverage map, framed
 * on the pickup and the destination as soon as they are recognised. The
 * camera glides to the new frame, the route draws itself and a car travels
 * along it, with the indicative distance and drive time. No map tiles, no
 * API keys: nothing leaves the site.
 */

const W = GEO_FRAME.width;
const H = GEO_FRAME.height;
const EDGE = 26;
const MILAN = project(45.4642, 9.19);

type Box = { x: number; y: number; w: number; h: number };
type Pt = { x: number; y: number; off: boolean };

const inFrame = (q: { x: number; y: number }) => q.x >= EDGE && q.x <= W - EDGE && q.y >= EDGE && q.y <= H - EDGE;

/**
 * A place on the map; outside the frame it is pinned to the edge, on the
 * line from `toward` (from Milan when `toward` is outside too).
 */
function position(p: Place, toward: { x: number; y: number }): Pt {
  const raw = project(p.lat, p.lon);
  if (inFrame(raw)) return { ...raw, off: false };
  if (!inFrame(toward)) toward = MILAN;
  const dx = raw.x - toward.x;
  const dy = raw.y - toward.y;
  const ts = [
    dx > 0 ? (W - EDGE - toward.x) / dx : dx < 0 ? (EDGE - toward.x) / dx : Infinity,
    dy > 0 ? (H - EDGE - toward.y) / dy : dy < 0 ? (EDGE - toward.y) / dy : Infinity,
  ].filter((t) => t > 0);
  const t = Math.min(1, ...ts);
  return { x: toward.x + dx * t, y: toward.y + dy * t, off: true };
}

/**
 * The camera: the points with some air around them, at the viewport's
 * aspect, never wider than the mapped frame (outside it there is no map).
 */
function frameFor(points: Pt[], aspect: number): Box {
  const maxW = Math.min(W, H * aspect);
  let w: number;
  let cx: number;
  let cy: number;
  if (points.length === 0) {
    // Overview: Milan low in the frame, the lakes above it.
    w = maxW;
    cx = W / 2;
    cy = MILAN.y - (w / aspect) * 0.18;
  } else {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);
    w = Math.min(maxW, Math.max(points.length === 1 ? 420 : 300, spanX * 1.7, spanY * 1.8 * aspect));
  }
  const h = w / aspect;
  const x = Math.min(Math.max(cx - w / 2, 0), W - w);
  const y = Math.min(Math.max(cy - h / 2, 0), H - h);
  return { x, y, w, h };
}

/**
 * Quadratic arc between two points, bowed to the left of travel, or to the
 * right when the left is off the map (two ends pinned to the same edge).
 */
function arcPath(a: Pt, b: Pt): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  let bend = Math.min(80, len * 0.18);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  if (!inFrame({ x: mx + (dy / len) * bend, y: my - (dx / len) * bend })) bend = -bend;
  const cx = mx + (dy / len) * bend;
  const cy = my - (dx / len) * bend;
  return `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
}

/** SMIL starts at document time; restart the route car when it appears. */
const startMotion = (el: SVGAnimateMotionElement | null) => el?.beginElement();

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * The camera box. It glides when the framed places change (`subject`) and
 * jumps on resize or first render, so it never pans on its own.
 */
function useCamera(target: Box, subject: string, still: boolean): Box {
  const [box, setBox] = useState(target);
  const current = useRef(target);
  const lastSubject = useRef(subject);
  const key = `${target.x.toFixed(1)},${target.y.toFixed(1)},${target.w.toFixed(1)},${target.h.toFixed(1)}`;

  useEffect(() => {
    const from = current.current;
    const to = target;
    const glide = !still && lastSubject.current !== subject;
    lastSubject.current = subject;
    if (!glide) {
      current.current = to;
      setBox(to);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 950);
      const k = ease(t);
      const next = {
        x: from.x + (to.x - from.x) * k,
        y: from.y + (to.y - from.y) * k,
        w: from.w + (to.w - from.w) * k,
        h: from.h + (to.h - from.h) * k,
      };
      current.current = next;
      setBox(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` is the target's identity
  }, [key, subject, still]);

  return box;
}

const Geography = memo(function Geography({ hatchId }: { hatchId: string }) {
  return (
    <g>
      <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#0d0d10" />
      <path d={GEO_SWITZERLAND} fill={`url(#${hatchId})`} />
      {GEO_PROVINCES.map((p) => (
        <path
          key={p.name}
          d={p.d}
          fill={p.served ? '#1b1b1f' : '#141417'}
          stroke={p.served ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path
        d={GEO_SWITZERLAND}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        strokeDasharray="5 5"
        vectorEffect="non-scaling-stroke"
      />
      {GEO_LAKES.map((l) => (
        <path
          key={l.id}
          d={l.d}
          fill="#14222c"
          stroke="rgba(130,175,205,0.28)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  );
});

export default function TripMap({
  from,
  to,
  hourly = false,
  hours,
  hint,
  className = '',
}: {
  from: Place | null;
  to: Place | null;
  hourly?: boolean;
  hours?: number | null;
  /** Shown when there is no route to describe yet. */
  hint?: string;
  className?: string;
}) {
  const { t, locale } = useLanguage();
  const b = t.booking;
  const c = t.coverage;
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 400, h: 225 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const end = hourly ? null : to;
  const a = from ? position(from, end ? project(end.lat, end.lon) : MILAN) : null;
  const z = end ? position(end, a && !a.off ? a : MILAN) : null;
  const pts = [a, z].filter((p): p is Pt => p !== null);
  const aspect = size.w / size.h;
  const box = useCamera(frameFor(pts, aspect), `${from?.id ?? ''}>${end?.id ?? ''}`, reduced);
  const upp = box.w / size.w; // map units per CSS pixel

  const route = from && end && a && z ? routeBetween(from, end) : null;
  const sameSpot = Boolean(from && end && from.id === end.id);
  const routeKey = a && z && !sameSpot ? `${from?.id}-${end?.id}` : '';
  const routeD = routeKey && a && z ? arcPath(a, z) : '';
  const routeId = `${uid}-route`;

  const name = (p: Place) => {
    if (p.point) return pointName(p.point, locale);
    return b.places[p.id as keyof typeof b.places] ?? p.value;
  };
  const dur = (m: number) => formatDuration(m, c.unitMin, c.unitHour);

  // A name beside its pin; one that would run under the chip in the
  // bottom-left corner (about 225 × 60 px with its margin) goes above the pin.
  const label = (p: Pt, text: string, key: string) => {
    const rightSide = p.x < box.x + box.w * 0.62;
    const fs = 12.5 * upp;
    const textW = text.length * fs * 0.56;
    let x = p.x + (rightSide ? 11 : -11) * upp;
    let y = p.y + 4.2 * upp;
    let anchor: 'start' | 'end' | 'middle' = rightSide ? 'start' : 'end';
    if (p.y > box.y + box.h - 60 * upp && (rightSide ? x : x - textW) < box.x + 225 * upp) {
      x = Math.min(Math.max(p.x, box.x + textW / 2 + 8 * upp), box.x + box.w - textW / 2 - 8 * upp);
      y = p.y - 13 * upp;
      anchor = 'middle';
    }
    return (
      <text
        key={key}
        x={x}
        y={y}
        textAnchor={anchor}
        fontSize={fs}
        fontWeight={600}
        fill="#fff"
        stroke="#0d0d10"
        strokeOpacity={0.85}
        strokeWidth={3 * upp}
        strokeLinejoin="round"
        paintOrder="stroke"
        style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.01em' }}
      >
        {text}
      </text>
    );
  };

  let chip: React.ReactNode = null;
  if (hourly && from) {
    chip = (
      <>
        <Timer size={13} aria-hidden />
        {hours ? b.mapHourly.replace('{h}', String(hours)) : b.mapHourlyNoHours}
      </>
    );
  } else if (route) {
    chip = (
      <>
        <Route size={13} aria-hidden />
        <span className="tabular">≈ {route.km} km</span>
        <span aria-hidden className="text-white/35">·</span>
        <Clock3 size={13} aria-hidden />
        <span className="tabular">{dur(route.minutes)}</span>
      </>
    );
  }

  const summary = route && from && end
    ? `${name(from)} → ${name(end)}: ≈ ${route.km} km, ${dur(route.minutes)}`
    : b.mapEmpty;

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={summary}
      className={`relative isolate overflow-clip bg-[#0d0d10] ${className}`.trim()}
    >
      <svg
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        focusable="false"
      >
        <defs>
          <pattern id={`${uid}-hatch`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(255,255,255,0.045)" strokeWidth="3" />
          </pattern>
          <radialGradient id={`${uid}-glow`}>
            <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <Geography hatchId={`${uid}-hatch`} />

        {pts.length === 0 && <circle cx={MILAN.x} cy={MILAN.y} r={150} fill={`url(#${uid}-glow)`} />}

        {/* Hourly: the driver stays around the pickup. */}
        {hourly && a && (
          <g>
            <circle cx={a.x} cy={a.y} r={70} fill={`url(#${uid}-glow)`} />
            <circle
              cx={a.x}
              cy={a.y}
              r={46}
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeDasharray="4 6"
              vectorEffect="non-scaling-stroke"
              className={reduced ? '' : 'trip-orbit'}
              style={{ transformOrigin: `${a.x}px ${a.y}px` }}
            />
          </g>
        )}

        {routeD && (
          <g key={routeKey}>
            <path d={routeD} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {/* Width in map units: a non-scaling stroke would lay the dashes
                that draw the line in screen pixels, and break it when zoomed. */}
            <path
              id={routeId}
              d={routeD}
              fill="none"
              stroke="#fff"
              strokeWidth={2.6 * upp}
              strokeLinecap="round"
              pathLength={1}
              className={reduced ? '' : 'trip-draw'}
            />
            {!reduced && (
              <g>
                <circle r={10 * upp} fill="rgba(255,255,255,0.22)" />
                <rect x={-7 * upp} y={-3.6 * upp} width={14 * upp} height={7.2 * upp} rx={3 * upp} fill="#fff" />
                <rect x={3.2 * upp} y={-2.6 * upp} width={2.2 * upp} height={5.2 * upp} rx={1 * upp} fill="#0d0d10" opacity="0.55" />
                <animateMotion
                  ref={startMotion}
                  begin="indefinite"
                  dur="4.6s"
                  repeatCount="indefinite"
                  rotate="auto"
                  keyPoints="0;0;1;1"
                  keyTimes="0;0.18;0.82;1"
                  calcMode="linear"
                >
                  <mpath href={`#${routeId}`} />
                </animateMotion>
              </g>
            )}
          </g>
        )}

        {/* Pins: a ring for the pickup, a square for the destination. */}
        {a && (
          <g>
            <circle cx={a.x} cy={a.y} r={8 * upp} fill="#0d0d10" stroke="#fff" strokeWidth={3 * upp} />
            {from && label(a, name(from), 'a')}
          </g>
        )}
        {z && !sameSpot && (
          <g>
            <rect x={z.x - 7 * upp} y={z.y - 7 * upp} width={14 * upp} height={14 * upp} rx={2 * upp} fill="#fff" />
            <rect x={z.x - 2.6 * upp} y={z.y - 2.6 * upp} width={5.2 * upp} height={5.2 * upp} fill="#0d0d10" />
            {end && label(z, name(end), 'z')}
          </g>
        )}
        {pts.length === 0 && (
          <g>
            <circle cx={MILAN.x} cy={MILAN.y} r={6 * upp} fill="#fff" />
            {label({ ...MILAN, off: false }, pointName(getPlace(HUB_ID)!.point!, locale), 'hub')}
          </g>
        )}
      </svg>

      <div aria-hidden className="pointer-events-none absolute bottom-3 left-3">
        {chip ? (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/60 px-3 py-1.5 text-[12px] font-semibold text-white ring-1 ring-white/15 backdrop-blur-md">
            {chip}
          </span>
        ) : (
          <span className="whitespace-nowrap rounded-full bg-black/50 px-3 py-1.5 text-[12px] font-medium text-white/80 ring-1 ring-white/10 backdrop-blur-md">
            {hint ?? b.mapEmpty}
          </span>
        )}
      </div>
    </div>
  );
}
