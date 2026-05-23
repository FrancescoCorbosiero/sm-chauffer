import SectionLabel from './SectionLabel';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const wrap =
    align === 'center'
      ? 'text-center mx-auto items-center'
      : 'text-left items-start';
  return (
    <header
      className={`flex flex-col max-w-2xl ${wrap} ${className}`.trim()}
      style={align === 'center' ? { marginInline: 'auto' } : undefined}
    >
      {label && <SectionLabel>{label}</SectionLabel>}
      <h2 className="text-[clamp(1.8rem,1.2rem+2vw,2.85rem)] font-light leading-[1.08] tracking-tight">
        {title}
      </h2>
      <span
        aria-hidden
        className={`mt-5 block h-px bg-gradient-to-r from-transparent via-[var(--color-ink)]/30 to-transparent w-24 ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
      {description && (
        <p className="mt-5 text-[var(--color-text-muted)] leading-relaxed max-w-xl">
          {description}
        </p>
      )}
    </header>
  );
}
