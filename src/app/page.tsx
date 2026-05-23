'use client';
import { useEffect, useState } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import FleetPreviewSection from '@/components/sections/FleetPreviewSection';
import ServicesSection from '@/components/sections/ServicesSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogPreviewSection from '@/components/sections/BlogPreviewSection';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';

let hasShownHomeLoader = false;

export default function HomePage() {
  const t = useTranslation();
  usePageTitle(t.meta.siteTitle, t.meta.siteDescription);
  const [showLoader, setShowLoader] = useState(true);
  const [isLoaderFadingOut, setIsLoaderFadingOut] = useState(false);

  useEffect(() => {
    const navigationType = window.performance.getEntriesByType('navigation')[0]?.type;

    if (navigationType !== 'reload' || hasShownHomeLoader) {
      setShowLoader(false);
      setIsLoaderFadingOut(false);
      return;
    }

    hasShownHomeLoader = true;
    setShowLoader(true);
    setIsLoaderFadingOut(false);

    const fadeStartId = window.setTimeout(() => {
      setIsLoaderFadingOut(true);
    }, 500);

    const hideId = window.setTimeout(() => {
      setShowLoader(false);
    }, 760);

    return () => {
      window.clearTimeout(fadeStartId);
      window.clearTimeout(hideId);
    };
  }, []);

  return (
    <div className="relative">
      {showLoader && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-[linear-gradient(180deg,#f8f4ec_0%,#ffffff_45%,#f3eee6_100%)] transition-opacity duration-300 ease-out ${
            isLoaderFadingOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="absolute inset-0 opacity-40" aria-hidden>
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 animate-[spin_10s_linear_infinite]" />
            <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 animate-[spin_6s_linear_infinite_reverse]" />
          </div>

          <div className="relative flex flex-col items-center text-center px-6">
            <div className="mb-6 h-16 w-16 rounded-full border border-[var(--color-border)] bg-white shadow-[var(--shadow-md)] flex items-center justify-center">
              <div className="h-7 w-7 rounded-full border-2 border-[var(--color-ink)] border-t-transparent animate-spin" />
            </div>
            <p className="eyebrow mb-4">Elite Royal Cars</p>
            <p className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--color-ink)]">
              Welcome back
            </p>
            <p className="mt-3 text-sm sm:text-base text-[var(--color-text-muted)] max-w-sm leading-relaxed">
              Stiamo preparando l&apos;esperienza migliore possibile.
            </p>
          </div>
        </div>
      )}
      <HeroSection />
      <StatsSection />
      <FleetPreviewSection />
      <ServicesSection />
      <WhyUsSection />
      <TestimonialsSection />
      <BlogPreviewSection />
    </div>
  );
}
