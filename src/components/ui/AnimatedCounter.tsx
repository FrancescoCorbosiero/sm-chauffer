'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface Props {
  value: string;
  className?: string;
  durationMs?: number;
}

function analyse(display: string): {
  target: number;
  format: (n: number) => string;
} | null {
  const m = display.match(/(\d[\d.,]*)/);
  if (!m || m.index === undefined) return null;

  const raw = m[0];
  const before = display.slice(0, m.index);
  const after = display.slice(m.index + raw.length);

  const hasComma = raw.includes(',');
  const hasDot = raw.includes('.');

  let target: number;
  let format: (n: number) => string;

  if (!hasComma && !hasDot) {
    target = parseInt(raw, 10);
    format = (n) => `${before}${Math.round(n)}${after}`;
  } else if (hasComma && !hasDot) {
    const decimals = raw.split(',')[1].length;
    target = parseFloat(raw.replace(',', '.'));
    format = (n) => `${before}${n.toFixed(decimals).replace('.', ',')}${after}`;
  } else if (hasDot && !hasComma) {
    const parts = raw.split('.');
    if (parts.length === 2 && parts[1].length === 3 && parts[0].length <= 3) {
      target = parseInt(raw.replace('.', ''), 10);
      format = (n) =>
        `${before}${Math.round(n).toLocaleString('it-IT')}${after}`;
    } else {
      const decimals = parts[1].length;
      target = parseFloat(raw);
      format = (n) => `${before}${n.toFixed(decimals)}${after}`;
    }
  } else {
    const decimals = raw.split(',')[1].length;
    target = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
    format = (n) =>
      `${before}${n.toLocaleString('it-IT', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${after}`;
  }

  if (Number.isNaN(target)) return null;
  return { target, format };
}

export default function AnimatedCounter({ value, className = '', durationMs = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null!);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const analysis = analyse(value);
  const [display, setDisplay] = useState<string>(
    analysis ? analysis.format(0) : value,
  );

  useEffect(() => {
    if (!inView || !analysis) return;
    const start = performance.now();
    let raf = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setDisplay(analysis.format(analysis.target * ease(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, analysis, durationMs]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      {display}
    </span>
  );
}
