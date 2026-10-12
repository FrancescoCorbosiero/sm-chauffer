'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import { preload } from 'react-dom';
import { ArrowLeft, ArrowRight, Briefcase, Users } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { vehicles } from '@/lib/data';
import { carFrameStyle, fits, vehicleName } from '@/lib/fleet';
import { FLEET_PHOTOS } from '@/lib/fleetPhotos';
import { bookingHref } from '@/lib/booking';
import { useReducedMotion } from '@/lib/hooks';
import Stepper from '@/components/ui/Stepper';
import CarStage, { STAGE_SIZES } from './CarStage';

/** A number that counts to its new value (seats, bags, rate). */
function Count({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (reduced || start === value) {
      from.current = value;
      setShown(value);
      return;
    }
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 650);
      const eased = 1 - (1 - k) ** 3;
      const v = Math.round(start + (value - start) * eased);
      from.current = v;
      setShown(v);
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced]);
  return <>{shown}</>;
}

/**
 * The fleet as a showroom: one car at a time on a lit stage, picked from the
 * dock below (tabs: arrow keys, swipe on the stage, or the arrows). Each car
 * drives in and brakes; its figures count to their values. With `finder`,
 * passengers and bags dim the cars that are too small and move the stage to
 * one that fits.
 */
export default function Showroom({
  heading,
  intro = 'scroll',
  finder = false,
  priority = false,
  footer,
}: {
  heading?: ReactNode;
  intro?: 'load' | 'scroll' | 'none';
  finder?: boolean;
  priority?: boolean;
  footer?: ReactNode;
}) {
  const t = useTranslation();
  const s = t.showroom;
  const f = t.fleetPage;
  const fc = t.fleetCard;
  const uid = useId();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [pax, setPax] = useState(1);
  const [bags, setBags] = useState(1);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const vehicle = vehicles[index];
  const copy = t.vehicles[vehicle.id];
  const name = vehicleName(vehicle, t);
  const fitting = vehicles.filter((v) => fits(v, pax, bags));

  // Warm the other cars' photos so each one drives in at once.
  useEffect(() => {
    for (const v of vehicles) {
      const photo = FLEET_PHOTOS[v.image];
      const { props } = getImageProps({
        src: v.image,
        alt: '',
        width: photo?.width ?? 1200,
        height: photo?.height ?? 800,
        sizes: STAGE_SIZES,
      });
      preload(props.src, { as: 'image', imageSrcSet: props.srcSet, imageSizes: props.sizes, fetchPriority: 'low' });
    }
  }, []);

  const go = (next: number, dir?: number) => {
    const n = (next + vehicles.length) % vehicles.length;
    if (n === index) return;
    setDirection(dir ?? (n > index ? 1 : -1));
    setIndex(n);
  };

  // The finder moves the stage to the smallest car that fits.
  const onCapacity = (nextPax: number, nextBags: number) => {
    setPax(nextPax);
    setBags(nextBags);
    if (fits(vehicle, nextPax, nextBags)) return;
    const candidates = vehicles
      .map((v, i) => ({ v, i }))
      .filter(({ v }) => fits(v, nextPax, nextBags))
      .sort((a, b) => a.v.passengers - b.v.passengers);
    if (candidates[0]) go(candidates[0].i);
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    let target = -1;
    if (delta) target = (i + delta + vehicles.length) % vehicles.length;
    if (e.key === 'Home') target = 0;
    if (e.key === 'End') target = vehicles.length - 1;
    if (target < 0) return;
    e.preventDefault();
    go(target, delta || undefined);
    tabs.current[target]?.focus();
  };

  const rate = vehicle.priceOnRequest ? null : vehicle.pricePerHour;
  const panelId = `${uid}-panel`;

  return (
    <div className="showroom">
      {heading}

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${index}`}
        className="relative"
      >
        <div
          onPointerDown={(e) => {
            swipe.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={(e) => {
            const start = swipe.current;
            swipe.current = null;
            if (!start) return;
            const dx = e.clientX - start.x;
            const dy = e.clientY - start.y;
            if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
            go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
          }}
          onPointerCancel={() => {
            swipe.current = null;
          }}
          style={{ touchAction: 'pan-y' }}
          className="relative -mx-5 sm:mx-0"
        >
          <CarStage
            vehicle={vehicle}
            direction={direction}
            intro={intro}
            priority={priority}
            className="aspect-[5/4] [--car-w:0.76] sm:aspect-[16/10] sm:rounded-[2rem] sm:[--car-w:0.6] lg:aspect-[21/9] lg:[--car-w:0.46]"
          >
            <div className="absolute inset-x-0 top-0 z-[3] flex items-start justify-between p-5 sm:p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70 tabular">
                {String(index + 1).padStart(2, '0')}
                <span className="text-white/35"> / {String(vehicles.length).padStart(2, '0')}</span>
              </p>
              {copy?.badge && (
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
                  {copy.badge}
                </span>
              )}
            </div>
            <div className="absolute inset-y-0 left-0 right-0 z-[3] hidden items-center justify-between px-5 sm:flex">
              <button type="button" onClick={() => go(index - 1, -1)} aria-label={s.prev} className="stage-arrow">
                <ArrowLeft size={20} aria-hidden />
              </button>
              <button type="button" onClick={() => go(index + 1, 1)} aria-label={s.next} className="stage-arrow">
                <ArrowRight size={20} aria-hidden />
              </button>
            </div>
          </CarStage>
        </div>
        <p className="mt-3 text-center text-[12px] text-white/45 sm:hidden">{s.swipe}</p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div key={vehicle.id} className="step-in min-w-0 lg:col-span-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/55">
              {fc.categories[vehicle.category]}
            </p>
            <h3 className="mt-2 text-[2.4rem] leading-[1.02] text-white sm:text-5xl">{name}</h3>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-white/70">{copy?.description}</p>
            {copy?.ideal && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={f.colIdeal}>
                {copy.ideal.map((tag) => (
                  <li key={tag} className="rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/80">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="min-w-0 lg:col-span-5">
            <dl className="grid grid-cols-3 divide-x divide-white/10 overflow-clip rounded-2xl border border-white/10">
              <div className="px-4 py-4 sm:px-5">
                <dt className="spec-label">
                  <Users size={13} aria-hidden className="shrink-0" />
                  {f.colSeats}
                </dt>
                <dd className="mt-2 font-display text-[2rem] leading-none text-white tabular">
                  <Count value={vehicle.passengers} />
                </dd>
              </div>
              <div className="px-4 py-4 sm:px-5">
                <dt className="spec-label">
                  <Briefcase size={13} aria-hidden className="shrink-0" />
                  {f.colBags}
                </dt>
                <dd className="mt-2 font-display text-[2rem] leading-none text-white tabular">
                  <Count value={vehicle.bags} />
                </dd>
              </div>
              <div className="px-4 py-4 sm:px-5">
                <dt className="spec-label">{f.colRate}</dt>
                <dd className="mt-2 font-display text-[2rem] leading-none text-white tabular">
                  {rate === null ? (
                    <span className="font-sans text-[15px] font-semibold">{fc.onRequest}</span>
                  ) : (
                    <>
                      €<Count value={rate} />
                      <span className="font-sans text-[13px] text-white/60">{fc.perHour}</span>
                    </>
                  )}
                </dd>
              </div>
            </dl>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
              <Link href={bookingHref({ car: vehicle.id })} className="btn btn-gold">
                {t.vehicleDetail.book}
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link href={`/fleet/${vehicle.id}`} className="btn btn-outline-light">
                {s.details}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        role="tablist"
        aria-label={s.pick}
        className="no-scrollbar -mx-5 mt-8 flex snap-x gap-2.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-5 lg:gap-3"
      >
        {vehicles.map((v, i) => {
          const active = i === index;
          const ok = !finder || fits(v, pax, bags);
          return (
            <button
              key={v.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${uid}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={panelId}
              tabIndex={active ? 0 : -1}
              aria-label={`${vehicleName(v, t)}, ${fc.seats.replace('{n}', String(v.passengers))}`}
              onClick={() => go(i)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`group relative flex min-w-[9.5rem] shrink-0 snap-start flex-col overflow-clip rounded-2xl text-left transition-opacity duration-300 lg:min-w-0 ${
                ok ? '' : 'opacity-40'
              }`}
            >
              <span className="car-stage relative block aspect-[16/9] w-full bg-[#ececef] [--car-w:0.78] [--floor:0.86]">
                <span className="car-frame" style={carFrameStyle(v, { sized: false })}>
                  <Image src={v.image} alt="" width={240} height={160} sizes="200px" className="mix-blend-multiply" />
                </span>
              </span>
              <span className="flex items-center justify-between gap-2 bg-white/[0.06] px-3 py-2.5">
                <span className="truncate text-[13px] font-semibold text-white">{vehicleName(v, t)}</span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[12px] text-white/55">
                  <Users size={12} aria-hidden />
                  {v.passengers}
                </span>
              </span>
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-0 rounded-2xl ring-inset transition-[box-shadow] duration-300 ${
                  active ? 'ring-2 ring-white' : 'ring-1 ring-white/10 group-hover:ring-white/40'
                }`}
              />
              {!ok && (
                <span className="absolute left-2 top-2 rounded-full bg-ink/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                  {f.tooSmall}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {finder && (
        <div className="mt-6 flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h3 className="text-[1.6rem] leading-tight text-white">{f.finderTitle}</h3>
            <p className="mt-1 text-[14px] text-white/60">{f.moreThan}</p>
          </div>
          <div className="grid grid-cols-1 items-end gap-4 sm:flex sm:flex-wrap sm:gap-6">
            <div className="sm:min-w-[11rem]">
              <span id={`${uid}-pax`} className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
                <Users size={13} aria-hidden />
                {t.quickBook.passengers}
              </span>
              <Stepper
                id={`${uid}-pax-value`}
                labelledBy={`${uid}-pax`}
                value={pax}
                min={1}
                max={18}
                onChange={(n) => onCapacity(n, bags)}
                decLabel={`${t.quickBook.passengers} −1`}
                incLabel={`${t.quickBook.passengers} +1`}
                tone="dark"
              />
            </div>
            <div className="sm:min-w-[11rem]">
              <span id={`${uid}-bags`} className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
                <Briefcase size={13} aria-hidden />
                {t.contactPage.form.bags}
              </span>
              <Stepper
                id={`${uid}-bags-value`}
                labelledBy={`${uid}-bags`}
                value={bags}
                min={0}
                max={18}
                onChange={(n) => onCapacity(pax, n)}
                decLabel={`${t.contactPage.form.bags} −1`}
                incLabel={`${t.contactPage.form.bags} +1`}
                tone="dark"
              />
            </div>
            <p aria-live="polite" className="pb-2.5 font-display text-[1.5rem] leading-none text-white tabular">
              {fitting.length === 1 ? f.matchOne : f.matches.replace('{n}', String(fitting.length))}
            </p>
          </div>
        </div>
      )}

      {footer}
    </div>
  );
}
