'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export default function ScrollReveal({ children, delay = 0, className = '', direction = 'up' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  const variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 24 : 0, x: direction === 'left' ? -32 : direction === 'right' ? 32 : 0 },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, delay } },
  };

  return (
    <div ref={ref} className={className}>
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={variants}>
        {children}
      </motion.div>
    </div>
  );
}
