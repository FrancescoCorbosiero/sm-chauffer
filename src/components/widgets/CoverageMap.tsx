'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUp, Building2, Clock3, Globe2, MapPin, Plane, Route, Waves } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { GEO_FRAME, GEO_LAKES, GEO_PROVINCES, GEO_SWITZERLAND } from '@/lib/coverageGeo';
import {
  COVERAGE_POINTS,
  HUB_ID,
  formatDuration,
  mapPosition,
  pointName,
  project,
  type CoverageGroup,
  type CoveragePoint,
} from '@/lib/coverage';
import { bookingHref } from '@/lib/booking';
import { useMotionAllowed } from '@/lib/hooks';

type Filter = 'all' | CoverageGroup;

const W = GEO_FRAME.width;
const H = GEO_FRAME.height;
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

const POSITIONS = Object.fromEntries(COVERAGE_POINTS.map((p) => [p.id, mapPosition(p)]));
const HUB = POSITIONS[HUB_ID];
// 20 km on the ground, in map units (1° of latitude ≈ 111.32 km).
const SCALE_KM = 20;
const SCALE_UNITS = (SCALE_KM / 111.32) * GEO_FRAME.k;

const GROUP_ICON: Record<CoverageGroup, typeof MapPin> = {
  city: Building2,
  lake: Waves,
  airport: Plane,
  intl: Globe2,
};

const LABEL_POS: Record<NonNullable<CoveragePoint['label']>, string> = {
  right: 'left-full top-1/2 -translate-y-1/2',
  left: 'right-full top-1/2 -translate-y-1/2',
  top: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
  bottom: 'top-full left-1/2 -translate-x-1/2 -mt-1',
};

/** SMIL starts at document time; restart the route car when it appears. */
const startMotion = (el: SVGAnimateMotionElement | null) => el?.beginElement();

/** Quadratic arc from the hub to a point, bowed to the left of travel. */
function arc(to: { x: number; y: number }): string {
  const dx = to.x - HUB.x;
  const dy = to.y - HUB.y;
  const len = Math.hypot(dx, dy) || 1;
  const bend = Math.min(70, len * 0.16);
  const cx = (HUB.x + to.x) / 2 + (dy / len) * bend;
  const cy = (HUB.y + to.y) / 2 - (dx / len) * bend;
  return `M${HUB.x.toFixed(1)},${HUB.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${to.x.toFixed(1)},${to.y.toFixed(1)}`;
}

/** Keep edge chips fully inside the frame. */
function chipAnchor(x: number, y: number): CSSProperties {
  const tx = x < W * 0.18 ? '0%' : x > W * 0.82 ? '-100%' : '-50%';
  const ty = y < H * 0.12 ? '0%' : y > H * 0.88 ? '-100%' : '-50%';
  return { left: pct(x, W), top: pct(y, H), transform: `translate(${tx}, ${ty})` };
}

export default function CoverageMap({
  variant = 'full',
  defaultId = 'mxp',
}: {
  variant?: 'full' | 'compact';
  defaultId?: string;
}) {
  const { t, locale } = useLanguage();
  const c = t.coverage;
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState(defaultId);
  // The route car is client-only: before hydration its SMIL clock is not running.
  const moving = useMotionAllowed();
  // Map units per CSS pixel, so the car on the route keeps its size on screen.
  const mapRef = useRef<HTMLDivElement>(null);
  const [upp, setUpp] = useState(1.25);
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setUpp(W / entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const inFilter = (p: CoveragePoint, f: Filter) => p.id === HUB_ID || f === 'all' || p.group === f;
  const visible = COVERAGE_POINTS.filter((p) => inFilter(p, filter));
  const selected = COVERAGE_POINTS.find((p) => p.id === selectedId) ?? COVERAGE_POINTS[0];
  const selPos = POSITIONS[selected.id];
  const isHubSelected = selected.id === HUB_ID;

  const pickFilter = (f: Filter) => {
    setFilter(f);
    if (!inFilter(selected, f) || selected.id === HUB_ID) {
      const first = COVERAGE_POINTS.find((p) => p.id !== HUB_ID && inFilter(p, f));
      if (first) setSelectedId(first.id);
    }
  };

  const dur = (m: number) => formatDuration(m, c.unitMin, c.unitHour);
  const name = (p: CoveragePoint) => pointName(p, locale);
  const filters: Filter[] = ['all', 'city', 'lake', 'airport', 'intl'];

  const lakeLabels = [
    { text: c.lakeComo, ...project(46.152, 9.2), always: true },
    { text: c.lakeMaggiore, ...project(45.94, 8.6), always: false },
    { text: c.lakeLugano, ...project(45.935, 9.03), always: false },
  ];
  const swiss = project(46.05, 8.79);

  const SelIcon = isHubSelected ? MapPin : GROUP_ICON[selected.group];
  const book = bookingHref(
    isHubSelected
      ? { from: selected.bookTo }
      : { type: selected.group === 'airport' ? 'airport-transfer' : 'one-way', to: selected.bookTo },
  );

  const filterBar = (
    <div role="group" aria-label={c.filterLabel} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
      {filters.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => pickFilter(f)}
          aria-pressed={filter === f}
          className="chip chip-dark shrink-0"
        >
          {c.filters[f]}
        </button>
      ))}
    </div>
  );

  const map = (
    <div
      ref={mapRef}
      role="group"
      aria-label={c.mapLabel}
      className="relative isolate w-full overflow-clip rounded-2xl border border-white/10 bg-[#0d0d10]"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
        <defs>
          <pattern id={`${uid}-hatch`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          </pattern>
          <radialGradient id={`${uid}-glow`}>
            <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <path d={GEO_SWITZERLAND} fill={`url(#${uid}-hatch)`} />
        {GEO_PROVINCES.map((p) => (
          <path
            key={p.name}
            d={p.d}
            fill={p.served ? '#1e1e22' : '#151518'}
            stroke={p.served ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.07)'}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path
          d={GEO_SWITZERLAND}
          fill="none"
          stroke="rgba(255,255,255,0.26)"
          strokeWidth="1.2"
          strokeDasharray="6 5"
          vectorEffect="non-scaling-stroke"
        />
        {GEO_LAKES.map((l) => (
          <path
            key={l.id}
            d={l.d}
            fill="#152430"
            stroke="rgba(130,175,205,0.30)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <circle cx={HUB.x} cy={HUB.y} r="160" fill={`url(#${uid}-glow)`} />
        {visible
          .filter((p) => p.id !== HUB_ID && p.id !== selected.id)
          .map((p) => (
            <path
              key={p.id}
              d={arc(POSITIONS[p.id])}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1"
              strokeDasharray={POSITIONS[p.id].off ? '3 5' : undefined}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        {!isHubSelected && (
          <g key={selected.id}>
            <path
              id={`${uid}-route`}
              d={arc(selPos)}
              fill="none"
              stroke="#ffffff"
              strokeLinecap="round"
              pathLength={1}
              className="[stroke-width:5] md:[stroke-width:3]"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: 0,
                animation: 'draw-line 0.9s cubic-bezier(0.22,1,0.36,1) both',
                ['--len' as string]: 1,
              }}
            />
            {/* A car travels the route, from Milan to the destination. */}
            {moving && (
              <g>
                <circle r={10 * upp} fill="rgba(255,255,255,0.22)" />
                <rect x={-7 * upp} y={-3.6 * upp} width={14 * upp} height={7.2 * upp} rx={3 * upp} fill="#fff" />
                <rect x={3.2 * upp} y={-2.6 * upp} width={2.2 * upp} height={5.2 * upp} rx={upp} fill="#0d0d10" opacity="0.55" />
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
                  <mpath href={`#${uid}-route`} />
                </animateMotion>
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Place names on the water / across the border. */}
      {lakeLabels.map((l) => (
        <span
          key={l.text}
          aria-hidden
          className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[12px] italic text-[#8fb4cc]/80 md:text-[13px] ${
            l.always ? '' : 'hidden md:block'
          }`}
          style={{ left: pct(l.x, W), top: pct(l.y, H) }}
        >
          {l.text}
        </span>
      ))}
      <span
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30 md:text-[11px]"
        style={{ left: pct(swiss.x, W), top: pct(swiss.y, H) }}
      >
        {c.switzerland}
      </span>

      {/* Pins */}
      {visible.map((p) => {
        const pos = POSITIONS[p.id];
        const isSel = p.id === selected.id;
        const isHub = p.id === HUB_ID;
        const label = `${name(p)}${isHub ? ` — ${c.groups.hub}` : ` — ≈ ${p.km} km, ${dur(p.minutes)}`}`;

        if (pos.off) {
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              aria-pressed={isSel}
              aria-label={`${label} (${c.offMap})`}
              className={`absolute z-10 inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold shadow-lg transition-colors md:gap-1.5 md:px-2.5 md:py-1 md:text-xs ${
                isSel
                  ? 'border-gold bg-gold text-on-gold'
                  : 'border-white/20 bg-ink/90 text-white/80 hover:border-gold hover:text-white'
              }`}
              style={chipAnchor(pos.x, pos.y)}
            >
              <ArrowUp size={12} aria-hidden style={{ transform: `rotate(${pos.angle + 90}deg)` }} />
              {name(p)}
            </button>
          );
        }

        return (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedId(p.id)}
            aria-pressed={isSel}
            aria-label={label}
            className={`group absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center ${
              p.minor && !isSel ? 'max-md:hidden' : ''
            } ${isSel ? 'z-20' : ''}`}
            style={{ left: pct(pos.x, W), top: pct(pos.y, H) }}
          >
            {isSel && !isHub && (
              <span
                aria-hidden
                className="absolute h-3.5 w-3.5 rounded-full bg-gold"
                style={{ animation: 'pin-ping 1.8s ease-out infinite' }}
              />
            )}
            {isHub ? (
              <span className="relative h-4 w-4 rounded-full border-2 border-gold bg-ink shadow-[0_0_0_6px_rgba(255,255,255,0.18)]" />
            ) : p.group === 'airport' ? (
              <span
                className={`relative flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                  isSel ? 'border-gold bg-gold text-on-gold' : 'border-white/30 bg-ink text-gold group-hover:border-gold'
                }`}
              >
                <Plane size={12} aria-hidden />
              </span>
            ) : (
              <span
                className={`relative rounded-full transition-all duration-300 ${
                  isSel ? 'h-3.5 w-3.5 bg-gold' : 'h-2.5 w-2.5 bg-white/85 group-hover:bg-gold'
                }`}
              />
            )}
            <span
              className={`pointer-events-none absolute whitespace-nowrap px-1 text-[11px] font-semibold tracking-wide [text-shadow:0_1px_6px_rgba(0,0,0,0.95)] md:text-xs ${
                LABEL_POS[p.label ?? 'right']
              } ${isSel || isHub ? 'text-white' : 'text-white/60 group-hover:text-white'} ${
                (p.minor || p.group === 'airport') && !isSel ? 'hidden md:block' : ''
              }`}
            >
              {name(p)}
            </span>
          </button>
        );
      })}

      {/* Scale bar + north */}
      <div aria-hidden className="pointer-events-none absolute bottom-3 left-3 md:bottom-4 md:left-4" style={{ width: pct(SCALE_UNITS, W) }}>
        <div className="h-1.5 border-x border-b border-white/40" />
        <span className="mt-1 block text-[10px] font-semibold tracking-wide text-white/55">{SCALE_KM} km</span>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 flex flex-col items-center text-[10px] font-semibold text-white/55 md:right-4 md:top-4"
      >
        <ArrowUp size={13} />N
      </div>
    </div>
  );

  const details = (
    <div aria-live="polite" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
        <SelIcon size={14} aria-hidden />
        {isHubSelected ? c.groups.hub : c.groups[selected.group]}
      </p>
      <h3 className="mt-3 text-[2rem] leading-tight text-white">{name(selected)}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-white/65">{selected.desc[locale] ?? selected.desc.it}</p>
      {!isHubSelected && (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-white/[0.05] px-4 py-3">
              <dt className="flex items-center gap-1.5 text-xs text-white/50">
                <Route size={13} aria-hidden /> {c.distance}
              </dt>
              <dd className="mt-1 font-display text-2xl text-white tabular">≈ {selected.km} km</dd>
            </div>
            <div className="rounded-xl bg-white/[0.05] px-4 py-3">
              <dt className="flex items-center gap-1.5 text-xs text-white/50">
                <Clock3 size={13} aria-hidden /> {c.time}
              </dt>
              <dd className="mt-1 font-display text-2xl text-white tabular">≈ {dur(selected.minutes)}</dd>
            </div>
          </dl>
          <p className="mt-2.5 text-xs text-white/55">
            {c.fromMilan} · {c.indicative}
          </p>
        </>
      )}
      <div className="mt-6 flex flex-wrap gap-2.5">
        <Link href={book} className="btn btn-gold btn-sm">
          {c.book}
          <ArrowRight size={15} aria-hidden />
        </Link>
        {selected.href && (
          <Link href={selected.href} className="btn btn-outline-light btn-sm">
            {c.discover}
          </Link>
        )}
      </div>
    </div>
  );

  // Every visible destination as a tappable row — on phones this is how the
  // smaller lakeside villages (hidden as pins) are reached.
  const list = (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">{c.listTitle}</p>
      <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {visible
          .filter((p) => p.id !== HUB_ID)
          .map((p) => {
            const isSel = p.id === selected.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  aria-pressed={isSel}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-[13px] transition-colors sm:px-3.5 sm:text-sm ${
                    isSel
                      ? 'border-gold/60 bg-gold/10 text-white'
                      : 'border-white/10 text-white/75 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span className="truncate font-medium">{name(p)}</span>
                  <span className="hidden shrink-0 text-xs text-white/50 tabular sm:inline">{dur(p.minutes)}</span>
                </button>
              </li>
            );
          })}
      </ul>
      <p className="mt-4 text-[13px] leading-relaxed text-white/55">{c.onRequest}</p>
    </div>
  );

  // Desktop: the list sits under the map (full page only — the home teaser
  // relies on the pins); phones always get it, after the details card.
  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="flex min-w-0 flex-col gap-4">
        {filterBar}
        {map}
        {variant === 'full' && <div className="mt-4 hidden lg:block">{list}</div>}
      </div>
      <div className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-24">
        {details}
        <div className="lg:hidden">{list}</div>
      </div>
    </div>
  );
}
