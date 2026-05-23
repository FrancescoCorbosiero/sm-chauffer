'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface BaseProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

type Props =
  | (BaseProps & { href: string; onClick?: never; type?: never })
  | (BaseProps & {
      href?: undefined;
      onClick?: () => void;
      type?: 'button' | 'submit';
    });

export default function MagneticButton({
  children,
  className = '',
  strength = 0.25,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 14, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 160, damping: 14, mass: 0.3 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.span style={{ x: sx, y: sy }} className="inline-flex">
      {children}
    </motion.span>
  );

  if ('href' in rest && rest.href) {
    return (
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-flex">
        <Link href={rest.href} className={className}>
          {inner}
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-flex">
      <button
        type={rest.type ?? 'button'}
        onClick={rest.onClick}
        className={className}
      >
        {inner}
      </button>
    </div>
  );
}
