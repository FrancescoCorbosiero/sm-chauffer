'use client';

import { useEffect } from 'react';

export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = title;
    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);
}
