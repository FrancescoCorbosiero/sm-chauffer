'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Mail, MessageCircle, Check, Loader2 } from 'lucide-react';
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
  /** Honeypot value from the form; bots fill it, humans leave it empty. */
  honeypot?: string;
}

type SendStatus = 'idle' | 'sending' | 'sent';

export default function QuoteChoiceModal({ open, payload, onClose, honeypot = '' }: Props) {
  const t = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<SendStatus>('idle');

  useEffect(() => {
    if (!open) return;
    setStatus('idle');
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

  const message = buildQuoteMessage(payload);

  const handleWhatsApp = () => {
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    onClose();
  };

  // Try a real server-side send via SES. If the endpoint isn't configured
  // (503) or anything fails, fall back to the visitor's mail client (mailto).
  const handleEmail = async () => {
    setStatus('sending');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, company: honeypot }),
      });
      if (res.ok) {
        setStatus('sent');
        return;
      }
    } catch {
      // network error — fall through to mailto
    }
    setStatus('idle');
    window.location.href = buildMailtoUrl(message);
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

        {status === 'sent' ? (
          <div className="py-2 text-center" aria-live="polite">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
              <Check size={24} className="text-[var(--color-accent-hover)]" aria-hidden />
            </div>
            <h2 id="quote-modal-title" className="text-2xl font-light text-[var(--color-ink)]">
              {t.quoteModal.sent}
            </h2>
            <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
              {t.quoteModal.sentBody}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 w-full rounded-xl bg-[var(--color-ink)] py-3.5 px-5 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90"
            >
              {t.quoteModal.close}
            </button>
          </div>
        ) : (
          <>
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
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-[var(--color-ink)] text-white text-sm font-medium tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <MessageCircle size={18} aria-hidden />
                {t.quoteModal.sendWhatsApp}
              </button>
              <button
                type="button"
                onClick={handleEmail}
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-white border border-[var(--color-border)] text-[var(--color-ink)] text-sm font-medium tracking-wide transition-colors hover:border-[var(--color-ink)] disabled:opacity-60"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={18} aria-hidden className="animate-spin" />
                    {t.quoteModal.sending}
                  </>
                ) : (
                  <>
                    <Mail size={18} aria-hidden />
                    {t.quoteModal.sendEmail}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
