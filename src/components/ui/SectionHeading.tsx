import type { ReactNode } from 'react';

/**
 * Eyebrow + split title (plain half + italic gold accent) + lede, with an
 * optional action (a link) that sits to the right on wide screens.
 */
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  tone = 'light',
  action,
  as: Tag = 'h2',
  layout = 'stack',
  className = '',
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  action?: ReactNode;
  as?: 'h1' | 'h2';
  /** `split`: title on the left, description in a column on the right (md+). */
  layout?: 'stack' | 'split';
  className?: string;
}) {
  const dark = tone === 'dark';
  const centered = align === 'center';
  if (layout === 'split') {
    return (
      <div className={`grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end md:gap-10 ${className}`.trim()}>
        <div className="md:col-span-7">
          {eyebrow && <p className={`eyebrow ${dark ? 'eyebrow-light' : ''}`}>{eyebrow}</p>}
          <Tag className={`mt-4 text-4xl ${dark ? 'text-white' : 'text-ink'}`}>
            {title}
            {accent && <> <span className="title-accent">{accent}</span></>}
          </Tag>
        </div>
        {(description || action) && (
          <div className="md:col-span-5">
            {description && (
              <p className={`text-[1.0625rem] leading-relaxed ${dark ? 'text-white/65' : 'text-muted'}`}>{description}</p>
            )}
            {action && <div className="mt-5">{action}</div>}
          </div>
        )}
      </div>
    );
  }
  return (
    <div
      className={`flex flex-col gap-6 ${centered ? 'items-center text-center' : ''} ${
        action && !centered ? 'md:flex-row md:items-end md:justify-between md:gap-10' : ''
      } ${className}`.trim()}
    >
      <div className={`max-w-2xl ${centered ? 'mx-auto flex flex-col items-center' : ''}`}>
        {eyebrow && <p className={`eyebrow ${dark ? 'eyebrow-light' : ''}`}>{eyebrow}</p>}
        <Tag className={`mt-4 text-4xl ${dark ? 'text-white' : 'text-ink'}`}>
          {title}
          {accent && (
            <>
              {' '}
              <span className={`title-accent ${dark ? 'title-accent-light' : ''}`}>{accent}</span>
            </>
          )}
        </Tag>
        {description && (
          <p className={`mt-5 text-[1.0625rem] leading-relaxed ${dark ? 'text-white/65' : 'text-muted'}`}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
