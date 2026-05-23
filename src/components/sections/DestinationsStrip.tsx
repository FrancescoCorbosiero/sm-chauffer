'use client';
import Marquee from '@/components/ui/Marquee';

const destinations = [
  'Milano',
  'Como',
  'Bellagio',
  'Tremezzo',
  'Lago di Como',
  'Cernobbio',
  'Menaggio',
  'Varenna',
  'Lugano',
  'Malpensa',
  'Linate',
  'Orio al Serio',
];

export default function DestinationsStrip() {
  return (
    <section
      aria-label="Destinazioni servite"
      className="bg-white border-y border-[var(--color-border)] py-10 md:py-12"
    >
      <Marquee items={destinations} speedSeconds={42} />
    </section>
  );
}
