'use client';
import HomeHero from '@/components/sections/HomeHero';
import StatsBand from '@/components/sections/StatsBand';
import ServicesShowcase from '@/components/sections/ServicesShowcase';
import HowItWorks from '@/components/sections/HowItWorks';
import FleetShowcase from '@/components/sections/FleetShowcase';
import CoverageTeaser from '@/components/sections/CoverageTeaser';
import PricingTeaser from '@/components/sections/PricingTeaser';
import Testimonials from '@/components/sections/Testimonials';
import FaqBlock from '@/components/sections/FaqBlock';
import BlogPreview from '@/components/sections/BlogPreview';
import CtaBand from '@/components/sections/CtaBand';
import { useTranslation } from '@/i18n/LanguageProvider';
import { usePageTitle } from '@/i18n/usePageTitle';

export default function HomePage() {
  const t = useTranslation();
  usePageTitle(t.meta.siteTitle, t.meta.siteDescription);

  return (
    <>
      <HomeHero />
      <StatsBand />
      <ServicesShowcase />
      <HowItWorks />
      <FleetShowcase />
      <CoverageTeaser />
      <PricingTeaser />
      <Testimonials />
      <FaqBlock />
      <BlogPreview />
      <CtaBand />
    </>
  );
}
