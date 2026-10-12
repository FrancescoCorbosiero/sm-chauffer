import { Star } from 'lucide-react';

/** Five-star rating row. `label` is the accessible text (e.g. "5 out of 5 stars"). */
export default function Stars({
  value = 5,
  size = 15,
  label,
  className = '',
}: {
  value?: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const n = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span role="img" aria-label={label} className={`inline-flex items-center gap-0.5 ${className}`.trim()}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          aria-hidden
          className={i < n ? 'fill-gold text-gold' : 'text-current opacity-25'}
        />
      ))}
    </span>
  );
}
