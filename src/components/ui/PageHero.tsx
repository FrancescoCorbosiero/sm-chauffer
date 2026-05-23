'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface PageHeroProps {
  label?: string;
  title: string;
  description?: string;
  image?: string;
}

export default function PageHero({ label, title, description, image }: PageHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, 90]);
  const orbY = useTransform(scrollY, [0, 500], [0, -40]);

  return (
    <section
      ref={ref}
      className="grain relative bg-[var(--color-ink)] text-white pt-36 md:pt-44 pb-20 md:pb-24 overflow-hidden isolate"
    >
      {image && (
        <>
          <motion.div style={{ y: imageY }} className="absolute inset-0 will-change-transform">
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-50"
            />
          </motion.div>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink)]/90 via-[var(--color-ink)]/55 to-[var(--color-ink)] pointer-events-none"
          />
        </>
      )}

      <motion.div
        aria-hidden
        style={{ y: orbY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="orb orb-a -left-32 top-12 h-80 w-80 bg-[radial-gradient(circle,rgba(255,168,6,0.22),transparent_60%)]" />
        <div className="orb orb-b right-[-10%] bottom-[-30%] h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]" />
      </motion.div>

      <div className="container-x text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          {label && (
            <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.32em] text-white/70 mb-7">
              <span className="block w-10 h-px bg-[var(--color-accent)]/80" />
              {label}
              <span className="block w-10 h-px bg-[var(--color-accent)]/80" />
            </p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="text-[clamp(2.3rem,1rem+3.6vw,4.1rem)] font-light leading-[1.04] tracking-tight text-white"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.35 }}
              className="mt-7 text-white/75 leading-relaxed max-w-2xl"
            >
              {description}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
