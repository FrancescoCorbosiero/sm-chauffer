'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from './LanguageProvider';
import { DEFAULT_LOCALE } from './types';

/**
 * Localizes the document title and meta description. In the default
 * (Italian) locale the server-rendered metadata is kept untouched — it is the
 * SEO-canonical copy — until the visitor switches language on the page.
 *
 * Next.js commits its metadata <title> after hydration, which would silently
 * undo a one-off assignment, so the localized values are re-applied whenever
 * the head changes.
 */
export function usePageTitle(title: string, description?: string) {
  const { locale } = useLanguage();
  const localized = useRef(false);

  useEffect(() => {
    if (locale === DEFAULT_LOCALE && !localized.current) return;
    localized.current = true;

    const apply = () => {
      if (document.title !== title) document.title = title;
      const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (description && meta && meta.content !== description) meta.content = description;
    };
    apply();

    const observer = new MutationObserver(apply);
    observer.observe(document.head, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['content'],
    });
    return () => observer.disconnect();
  }, [locale, title, description]);
}
