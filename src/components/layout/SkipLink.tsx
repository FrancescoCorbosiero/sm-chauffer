'use client';

import { useTranslation } from '@/i18n/LanguageProvider';

export default function SkipLink() {
  const t = useTranslation();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--color-ink)] focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
    >
      {t.skipToContent}
    </a>
  );
}
