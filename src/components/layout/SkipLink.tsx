'use client';

import { useTranslation } from '@/i18n/LanguageProvider';

export default function SkipLink() {
  const t = useTranslation();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink"
    >
      {t.skipToContent}
    </a>
  );
}
