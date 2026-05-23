'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BookingForm from '@/components/ui/BookingForm';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function HeroSection() {
  const t = useTranslation();

  return (
    <section className="relative bg-[var(--color-ink)] text-white pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      <Image
        src="https://picsum.photos/seed/luxury-car-hero-night/1920/1080"
        alt={t.hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-50"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink)]/95 via-[var(--color-ink)]/75 to-[var(--color-ink)]/55 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -right-[280px] -top-[260px] w-[820px] h-[820px] rounded-full border border-white/10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -right-[120px] -bottom-[360px] w-[680px] h-[680px] rounded-full border border-white/10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_55%)] pointer-events-none"
      />

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-white/60 mb-6">
              <span className="block w-8 h-px bg-white/40" />
              {t.hero.eyebrow}
            </p>

            <h1 className="text-[clamp(2rem,1rem+2.5vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-white">
              {t.hero.titlePart1}{' '}
              <span className="italic font-normal">{t.hero.titlePart2}</span>
            </h1>

            <p className="mt-5 max-w-md text-sm md:text-base text-white/70 leading-relaxed">
              {t.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-[var(--color-ink)] px-6 py-3 rounded-md text-xs font-medium uppercase tracking-[0.18em] hover:bg-white/90 transition-colors"
              >
                {t.hero.ctaBook}
              </Link>
              <Link
                href="/fleet"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white px-6 py-3 rounded-md text-xs font-medium uppercase tracking-[0.18em] border border-white/40 hover:bg-white hover:text-[var(--color-ink)] transition-colors"
              >
                {t.hero.ctaFleet}
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <BookingForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
