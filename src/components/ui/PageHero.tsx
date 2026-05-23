'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PageHeroProps {
  label?: string;
  title: string;
  description?: string;
  image?: string;
}

export default function PageHero({ label, title, description, image }: PageHeroProps) {
  return (
    <section className="relative bg-[var(--color-ink)] text-white pt-36 md:pt-44 pb-20 md:pb-24 overflow-hidden">
      {image && (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-55"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink)]/90 via-[var(--color-ink)]/60 to-[var(--color-ink)] pointer-events-none"
          />
        </>
      )}

      <div className="container-x text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          {label && (
            <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-white/60 mb-6">
              <span className="block w-8 h-px bg-white/40" />
              {label}
              <span className="block w-8 h-px bg-white/40" />
            </p>
          )}
          <h1 className="text-[clamp(2.2rem,1rem+3.5vw,4rem)] font-light leading-[1.05] tracking-tight text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-6 text-white/75 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
