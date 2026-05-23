export default function SectionLabel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow mb-5 ${className}`.trim()}>{children}</p>;
}
