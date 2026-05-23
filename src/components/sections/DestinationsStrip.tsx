'use client';
import Marquee from '@/components/ui/Marquee';

const destinations = [
  'Milano',
  'Brianza',
  'Monza',
  'Malpensa',
  'Linate',
  'Orio al Serio',
  'Lago di Como',
  'Sankt Moritz',
  'Cortina',
  'Lugano',
  'Bergamo',
  'Verona',
  'Torino',
  'Portofino',
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
