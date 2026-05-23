'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function CtaBanner() {
  const t = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const orbX = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section
      ref={ref}
      className="grain relative bg-[var(--color-ink)] text-white py-24 md:py-32 overflow-hidden isolate"
    >
      <motion.div
        aria-hidden
        style={{ x: orbX }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="orb orb-a left-[20%] top-[10%] h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(255,168,6,0.22),transparent_65%)]" />
        <div className="orb orb-b right-[10%] bottom-[-20%] h-[480px] w-[480px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]" />
      </motion.div>

      <div className="container-x relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.34em] text-white/60 mb-7"
          >
            <span className="block w-8 h-px bg-[var(--color-accent)]/80" />
            {t.hero.eyebrow}
            <span className="block w-8 h-px bg-[var(--color-accent)]/80" />
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2rem,1.2rem+2.6vw,3.4rem)] font-light leading-[1.06] tracking-tight"
          >
            Il tuo prossimo trasferimento,{' '}
            <span className="italic font-normal text-white/95">curato nei dettagli.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-white/70 leading-relaxed max-w-xl mx-auto"
          >
            Risposta in pochi minuti via WhatsApp o email. Tariffa chiara, autista dedicato,
            puntualità garantita a Milano, in Brianza e in tutta Italia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10"
          >
            <MagneticButton
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-[var(--color-ink)] px-8 py-4 rounded-full text-xs font-medium uppercase tracking-[0.24em] hover:bg-white/90 transition-colors"
            >
              {t.hero.ctaBook} <ArrowRight size={14} />
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
