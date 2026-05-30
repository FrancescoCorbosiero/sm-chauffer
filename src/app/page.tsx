'use client';
import { useEffect, useState } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import DestinationsStrip from '@/components/sections/DestinationsStrip';
import FleetPreviewSection from '@/components/sections/FleetPreviewSection';
import ServicesSection from '@/components/sections/ServicesSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import CtaBanner from '@/components/sections/CtaBanner';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogPreviewSection from '@/components/sections/BlogPreviewSection';
import FaqSection from '@/components/sections/FaqSection';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';

let hasShownHomeLoader = false;

export default function HomePage() {
  const t = useTranslation();
  usePageTitle(t.meta.siteTitle, t.meta.siteDescription);
  const [showLoader, setShowLoader] = useState(true);
  const [isLoaderFadingOut, setIsLoaderFadingOut] = useState(false);

  useEffect(() => {
    const navEntry = window.performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming | undefined;
    const navigationType = navEntry?.type;

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
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-white transition-opacity duration-300 ease-out ${
            isLoaderFadingOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <p className="eyebrow">Chauffeur SK Luxury Milano</p>
          <div className="h-6 w-6 rounded-full border-2 border-[var(--color-ink)] border-t-transparent animate-spin" />
        </div>
      )}
      <HeroSection />
      <StatsSection />
      <DestinationsStrip />
      <FleetPreviewSection />
      <ServicesSection />
      <WhyUsSection />
      <CtaBanner />
      <TestimonialsSection />
      <FaqSection />
      <BlogPreviewSection />
    </div>
  );
}
