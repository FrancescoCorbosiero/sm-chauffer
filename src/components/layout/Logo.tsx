import Image from 'next/image';
import Link from 'next/link';

/**
 * Brand lockup: the circular SK emblem (cropped out of /logo.png) next to
 * the "Transfer Luxury Driver" wordmark and a short gold tagline. Built
 * for dark surfaces (header, footer, mobile menu).
 */
export default function Logo({
  label,
  tagline,
  onClick,
  size = 'md',
}: {
  label: string;
  tagline?: string;
  onClick?: () => void;
  size?: 'md' | 'lg';
}) {
  const emblem = size === 'lg' ? 'h-12 w-12' : 'h-9 w-9 sm:h-10 sm:w-10';
  return (
    <Link href="/" aria-label={label} onClick={onClick} className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
      <span
        className={`relative block shrink-0 overflow-hidden rounded-full bg-ink ring-1 ring-white/15 transition-[box-shadow] duration-300 group-hover:ring-gold/60 ${emblem}`}
      >
        <Image
          src="/logo.png"
          alt=""
          fill
          sizes="48px"
          priority
          className="scale-[1.48] object-cover"
        />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="truncate font-display text-[1.12rem] font-medium tracking-[0.005em] text-white sm:text-[1.3rem]">
          Transfer Luxury Driver
        </span>
        {tagline && (
          <span className="mt-1.5 hidden truncate text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-gold xs:block">
            {tagline}
          </span>
        )}
      </span>
    </Link>
  );
}
