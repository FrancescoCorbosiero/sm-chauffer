'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import BookingForm from '@/components/ui/BookingForm';
import MagneticButton from '@/components/ui/MagneticButton';
import { useTranslation } from '@/i18n/LanguageProvider';
import { IMAGES } from '@/lib/images';

function WordRise({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(' ');
  return (
    <span className="word-rise">
      {words.map((w, i) => (
        <span key={i} className="mr-[0.28em]">
          <span style={{ animationDelay: `${delay + i * 0.08}s` }}>{w}</span>
        </span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const t = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 600], [0, 120]);
  const orbY = useTransform(scrollY, [0, 600], [0, -60]);

  return (
    <section
      ref={ref}
      className="grain relative bg-[var(--color-ink)] text-white pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden isolate"
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0 will-change-transform">
        <Image
          src={IMAGES.hero}
          alt={t.hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink)]/95 via-[var(--color-ink)]/72 to-[var(--color-ink)]/45 pointer-events-none"
      />

      <motion.div
        aria-hidden
        style={{ y: orbY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="orb orb-a -left-40 top-32 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(255,168,6,0.35),transparent_60%)]" />
        <div className="orb orb-b right-[-12%] top-[10%] h-[520px] w-[520px] bg-[radial-gradient(circle,rgba(255,255,255,0.10),transparent_70%)]" />
        <div className="orb orb-a right-[6%] bottom-[-22%] h-[520px] w-[520px] bg-[radial-gradient(circle,rgba(255,168,6,0.18),transparent_65%)]" />
      </motion.div>

      <div
        aria-hidden
        className="absolute -right-[280px] -top-[260px] w-[820px] h-[820px] rounded-full border border-white/10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -right-[120px] -bottom-[360px] w-[680px] h-[680px] rounded-full border border-white/10 pointer-events-none"
      />

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-white/70 mb-7"
            >
              <span className="block w-10 h-px bg-[var(--color-accent)]/80" />
              {t.hero.eyebrow}
            </motion.p>

            <h1 className="text-[clamp(2.4rem,1rem+3.4vw,4.1rem)] font-light leading-[1.04] tracking-[-0.02em] text-white">
              <WordRise text={t.hero.titlePart1} />
              <br />
              <span className="italic font-normal text-white/95">
                <WordRise text={t.hero.titlePart2} delay={0.25} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.55 }}
              className="mt-7 max-w-md text-sm md:text-base text-white/72 leading-relaxed"
            >
              {t.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.7 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <MagneticButton
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-[var(--color-ink)] px-7 py-3.5 rounded-full text-xs font-medium uppercase tracking-[0.22em] hover:bg-white/90 transition-colors"
              >
                {t.hero.ctaBook}
              </MagneticButton>
              <Link
                href="/fleet"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white px-7 py-3.5 rounded-full text-xs font-medium uppercase tracking-[0.22em] border border-white/30 hover:bg-white hover:text-[var(--color-ink)] transition-colors"
              >
                {t.hero.ctaFleet}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.95 }}
              className="mt-12 flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-white/45"
            >
              <span>Milano · Brianza · Como · Bellagio · Tremezzo</span>
              <span aria-hidden className="h-px w-8 bg-white/20" />
              <span>24 / 7</span>
            </motion.div>
          </div>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut', delay: 0.35 }}
          >
            <BookingForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
