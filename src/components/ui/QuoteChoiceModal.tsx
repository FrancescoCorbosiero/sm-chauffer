'use client';

import { useEffect, useRef } from 'react';
import { X, Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import {
  buildMailtoUrl,
  buildQuoteMessage,
  buildWhatsAppUrl,
  type QuotePayload,
} from '@/lib/quoteMessage';

interface Props {
  open: boolean;
  payload: QuotePayload | null;
  onClose: () => void;
}

export default function QuoteChoiceModal({ open, payload, onClose }: Props) {
  const t = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || !payload) return null;

  const message = buildQuoteMessage(payload, t);

  const handleEmail = () => {
    window.location.href = buildMailtoUrl(message);
    onClose();
  };

  const handleWhatsApp = () => {
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label={t.quoteModal.close}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative bg-white rounded-2xl shadow-[var(--shadow-lg)] w-full max-w-md p-7 sm:p-8 outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.quoteModal.close}
          className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-ink)] p-1 transition-colors"
        >
          <X size={20} />
        </button>

        <h2
          id="quote-modal-title"
          className="text-2xl font-light leading-tight text-[var(--color-ink)] pr-8"
        >
          {t.quoteModal.title}
        </h2>
        <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
          {t.quoteModal.description}
        </p>

        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-[var(--color-ink)] text-white text-sm font-medium tracking-wide transition-opacity hover:opacity-90"
          >
            <MessageCircle size={18} aria-hidden />
            {t.quoteModal.sendWhatsApp}
          </button>
          <button
            type="button"
            onClick={handleEmail}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-white border border-[var(--color-border)] text-[var(--color-ink)] text-sm font-medium tracking-wide transition-colors hover:border-[var(--color-ink)]"
          >
            <Mail size={18} aria-hidden />
            {t.quoteModal.sendEmail}
          </button>
        </div>
      </div>
    </div>
  );
}
