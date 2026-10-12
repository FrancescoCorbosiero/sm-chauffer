'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/i18n/LanguageProvider';
import { carFrameStyle, vehicleName } from '@/lib/fleet';
import { FLEET_PHOTOS } from '@/lib/fleetPhotos';
import { useReducedMotion } from '@/lib/hooks';
import type { Vehicle } from '@/lib/types';

export const STAGE_SIZES = '(max-width: 1024px) 92vw, 62vw';

/** The model without the brand: "Classe S", "S-Class", "Range Rover". */
function stageName(name: string): string {
  return name.replace(/^Mercedes(-Benz)?\s+/i, '');
}

interface OnStage {
  /** Unique per appearance (the same car can come back while still leaving). */
  key: number;
  vehicle: Vehicle;
  /** +1: arrived from the right / leaves to the left. */
  dir: number;
  leaving: boolean;
}

/**
 * One car on the showroom stage: spotlit, reflected on the floor, framed the
 * same way whatever its photo. Changing `vehicle` drives the old car off and
 * the new one in (it brakes and settles); a light sweep then runs over the
 * paint. All CSS (globals.css, "Showroom stage"); reduced motion: cars swap.
 */
export default function CarStage({
  vehicle,
  direction = 1,
  intro = 'none',
  priority = false,
  className = '',
  children,
}: {
  vehicle: Vehicle;
  /** +1 when the next car comes from the right, −1 from the left. */
  direction?: number;
  /** How the first car appears: on load, following the scroll, or already parked. */
  intro?: 'load' | 'scroll' | 'none';
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const t = useTranslation();
  const reduced = useReducedMotion();
  const [sweep, setSweep] = useState(0);
  const [cars, setCars] = useState<OnStage[]>([{ key: 0, vehicle, dir: 0, leaving: false }]);

  // A new vehicle: the current one leaves, the new one arrives (derived
  // state, updated during render).
  const current = cars[cars.length - 1];
  if (current.vehicle.id !== vehicle.id) {
    setCars((prev) => [
      ...(reduced ? [] : prev.map((c) => (c.leaving ? c : { ...c, leaving: true, dir: direction }))),
      { key: prev[prev.length - 1].key + 1, vehicle, dir: direction, leaving: false },
    ]);
  }
  const isFirst = current.key === 0;

  // Sweep the light after a car arrives, then every few seconds while on screen.
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced) return;
    const el = stageRef.current;
    if (!el) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(el);
    const arrive = window.setTimeout(() => setSweep((n) => n + 1), isFirst && intro !== 'none' ? 1700 : 1100);
    const loop = window.setInterval(() => {
      if (visible && document.visibilityState === 'visible') setSweep((n) => n + 1);
    }, 7000);
    return () => {
      io.disconnect();
      window.clearTimeout(arrive);
      window.clearInterval(loop);
    };
  }, [vehicle.id, reduced, intro, isFirst]);

  const name = stageName(vehicleName(vehicle, t));

  return (
    <div ref={stageRef} className={`stage car-stage ${className}`.trim()}>
      <div aria-hidden className="stage-beam" />
      <p aria-hidden key={`name-${current.key}`} className="stage-name step-in" style={{ '--n': name.length } as CSSProperties}>
        {name}
      </p>

      {!reduced && !isFirst && (
        <div aria-hidden key={`streaks-${current.key}`}>
          {[0.48, 0.6, 0.71].map((top, i) => (
            <span
              key={top}
              data-run="true"
              className="stage-streak"
              style={
                {
                  top: `${top * 100}%`,
                  left: '31%',
                  animationDelay: `${i * 70}ms`,
                  '--from': current.dir >= 0 ? '170%' : '-170%',
                  '--to': current.dir >= 0 ? '-170%' : '170%',
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {cars.map((c) => {
        const photo = FLEET_PHOTOS[c.vehicle.image];
        const frame = carFrameStyle(c.vehicle);
        const motion = c.leaving
          ? c.dir >= 0
            ? 'car-out-left'
            : 'car-out-right'
          : c.key === 0
            ? intro === 'load'
              ? 'car-arrive-load'
              : intro === 'scroll'
                ? 'car-arrive-scroll'
                : ''
            : c.dir >= 0
              ? 'car-in-right'
              : 'car-in-left';
        const eager = priority && c.key === 0;
        return (
          <div
            key={c.key}
            aria-hidden={c.leaving || undefined}
            className={`stage-car ${motion}`}
            onAnimationEnd={(e) => {
              if (c.leaving && e.target === e.currentTarget) setCars((prev) => prev.filter((x) => x.key !== c.key));
            }}
          >
            {/* Brake dive: the nose dips as the car stops, then settles. */}
            <div className={`absolute inset-0 ${!c.leaving && c.key > 0 ? 'car-brake' : ''}`}>
              <span className="car-frame car-reflection" style={frame} aria-hidden>
                <Image
                  src={c.vehicle.image}
                  alt=""
                  width={photo?.width ?? 1200}
                  height={photo?.height ?? 800}
                  sizes={STAGE_SIZES}
                  loading={eager ? 'eager' : undefined}
                />
              </span>
              {/* Multiplied over its reflection, so the photo's white lets it show. */}
              <span className="car-frame mix-blend-multiply" style={frame}>
                <Image
                  src={c.vehicle.image}
                  alt={c.leaving ? '' : vehicleName(c.vehicle, t)}
                  width={photo?.width ?? 1200}
                  height={photo?.height ?? 800}
                  sizes={STAGE_SIZES}
                  preload={eager}
                  loading={eager ? 'eager' : undefined}
                />
              </span>
              {photo?.silhouette && !c.leaving && (
                <span
                  key={sweep}
                  aria-hidden
                  data-run={sweep > 0 ? 'true' : undefined}
                  className="car-frame car-sweep"
                  style={{
                    ...frame,
                    WebkitMaskImage: `url(${photo.silhouette})`,
                    maskImage: `url(${photo.silhouette})`,
                  }}
                />
              )}
            </div>
          </div>
        );
      })}

      {children}
    </div>
  );
}
