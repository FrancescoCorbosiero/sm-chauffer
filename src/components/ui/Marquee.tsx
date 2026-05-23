'use client';

interface MarqueeProps {
  items: string[];
  speedSeconds?: number;
  className?: string;
}

export default function Marquee({ items, speedSeconds = 38, className = '' }: MarqueeProps) {
  if (items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <div
      className={`marquee-mask relative overflow-hidden ${className}`.trim()}
      aria-hidden
    >
      <div
        className="flex w-max animate-[marquee_var(--marquee-duration)_linear_infinite] gap-12 md:gap-16"
        style={{ ['--marquee-duration' as string]: `${speedSeconds}s` }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="flex items-center gap-6 text-2xl md:text-3xl font-light tracking-tight text-[var(--color-ink)] whitespace-nowrap"
          >
            <span className="italic font-normal">{item}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--color-ink)]/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
