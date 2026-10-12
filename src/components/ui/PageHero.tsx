import Image from 'next/image';
import type { ReactNode } from 'react';
import Breadcrumbs, { type Crumb } from './Breadcrumbs';

interface PageHeroProps {
  eyebrow?: string;
  /** @deprecated alias of `eyebrow`, kept for the server-rendered landing pages. */
  label?: string;
  title: string;
  accent?: string;
  description?: string;
  image?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
  /** Full-width content rendered under the text, on the same background. */
  below?: ReactNode;
  size?: 'md' | 'lg';
}

/**
 * Internal-page hero on ink: breadcrumbs, eyebrow, split title, lede and an
 * optional slot (CTAs, chips). Left-aligned for an editorial feel. Has no
 * client-side state, so server pages can render it too.
 */
export default function PageHero({
  eyebrow,
  label,
  title,
  accent,
  description,
  image,
  crumbs,
  children,
  below,
  size = 'md',
}: PageHeroProps) {
  const kicker = eyebrow ?? label;
  return (
    <section className="ink-panel on-ink relative isolate overflow-clip">
      {image && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        </div>
      )}
      <div
        className={`container-x relative ${
          size === 'lg' ? 'pb-16 pt-8 md:pb-24 md:pt-12' : 'pb-12 pt-7 md:pb-20 md:pt-11'
        }`}
      >
        {crumbs && crumbs.length > 0 && (
          <div className="intro mb-10 md:mb-14">
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        <div className="max-w-3xl">
          {kicker && (
            <p className="intro eyebrow eyebrow-light" style={{ ['--d' as string]: 40 }}>
              {kicker}
            </p>
          )}
          <h1 className="intro mt-5 text-5xl text-white" style={{ ['--d' as string]: 100 }}>
            {title}
            {accent && (
              <>
                {' '}
                <span className="title-accent title-accent-light">{accent}</span>
              </>
            )}
          </h1>
          {description && (
            <p
              className="intro mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-white/70 md:text-lg"
              style={{ ['--d' as string]: 160 }}
            >
              {description}
            </p>
          )}
          {children && (
            <div className="intro mt-8" style={{ ['--d' as string]: 220 }}>
              {children}
            </div>
          )}
        </div>
        {below && <div className="mt-12 md:mt-16">{below}</div>}
      </div>
    </section>
  );
}
