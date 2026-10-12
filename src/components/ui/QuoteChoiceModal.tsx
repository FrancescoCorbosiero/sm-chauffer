'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Loader2, Mail, X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import {
  buildMailtoUrl,
  buildQuoteMessage,
  buildWhatsAppUrl,
  type QuotePayload,
} from '@/lib/quoteMessage';
import TurnstileWidget from '@/components/security/TurnstileWidget';
import WhatsAppIcon from './WhatsAppIcon';
import { hasTurnstile } from '@/lib/security';

interface Props {
  open: boolean;
  payload: QuotePayload | null;
  onClose: () => void;
  /** Called after the request was delivered by email (not for WhatsApp/mailto). */
  onSent?: () => void;
  /** Honeypot value from the form; bots fill it, humans leave it empty. */
  honeypot?: string;
}

type SendStatus = 'idle' | 'sending' | 'sent';

export default function QuoteChoiceModal({ open, payload, onClose, onSent, honeypot = '' }: Props) {
  const { t, locale } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<SendStatus>('idle');
  // Turnstile token, kept in a ref so the async send handler always reads the
  // latest value (React state wouldn't update inside its closure).
  const tokenRef = useRef('');
  const onTurnstileVerify = useCallback((token: string) => {
    tokenRef.current = token;
  }, []);

  useEffect(() => {
    if (!open) return;
    setStatus('idle');
    // Fresh widget each open → reset any stale token.
    tokenRef.current = '';
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], iframe'),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.focus();

    return () => {
      root.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      if (opener?.isConnected) opener.focus();
    };
  }, [open, onClose]);

  if (!open || !payload) return null;

  const message = buildQuoteMessage(payload);
  const m = t.quoteModal;

  const handleWhatsApp = () => {
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    onClose();
  };

  // Wait (briefly) for Turnstile to issue a token. The widget loads async, so a
  // fast click can land before the token exists — without this the POST would
  // carry an empty token, fail server verification (403), and wrongly fall back
  // to mailto. Polls the ref up to ~8s, then gives up (degrades to mailto).
  const waitForTurnstileToken = async (): Promise<string> => {
    if (!hasTurnstile || tokenRef.current) return tokenRef.current;
    const deadline = Date.now() + 8000;
    while (!tokenRef.current && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return tokenRef.current;
  };

  // Try a real server-side send via SES. If the endpoint isn't configured
  // (503) or anything fails, fall back to the visitor's mail client (mailto).
  const handleEmail = async () => {
    setStatus('sending');
    try {
      const turnstileToken = await waitForTurnstileToken();
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          company: honeypot,
          locale,
          // Anti-bot signals: ms the visitor spent on the page (real users take
          // seconds; scripted POSTs are instant) + the Turnstile token.
          elapsedMs: Math.round(performance.now()),
          turnstileToken,
        }),
      });
      if (res.ok) {
        setStatus('sent');
        onSent?.();
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
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label={m.close}
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="intro relative w-full max-w-md rounded-t-3xl bg-white p-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] shadow-xl outline-none sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={m.close}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-ivory hover:text-ink"
        >
          <X size={20} aria-hidden />
        </button>

        {status === 'sent' ? (
          <div className="py-2 text-center" aria-live="polite">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft">
              <Check size={26} className="text-gold-deep" aria-hidden />
            </div>
            <h2 id="quote-modal-title" className="text-3xl text-ink">
              {m.sent}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{m.sentBody}</p>
            <button type="button" onClick={onClose} className="btn btn-primary btn-block mt-7">
              {m.close}
            </button>
          </div>
        ) : (
          <>
            <h2 id="quote-modal-title" className="pr-10 text-3xl leading-tight text-ink">
              {m.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{m.description}</p>

            <div className="mt-7 space-y-3">
              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={status === 'sending'}
                className="btn btn-primary btn-lg btn-block"
              >
                <WhatsAppIcon size={19} className="text-gold" />
                {m.sendWhatsApp}
              </button>
              <button
                type="button"
                onClick={handleEmail}
                disabled={status === 'sending'}
                className="btn btn-outline btn-lg btn-block"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={18} aria-hidden className="animate-spin" />
                    {m.sending}
                  </>
                ) : (
                  <>
                    <Mail size={18} aria-hidden />
                    {m.sendEmail}
                  </>
                )}
              </button>
              {/* Invisible CAPTCHA — renders only when Turnstile is configured. */}
              <TurnstileWidget onVerify={onTurnstileVerify} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
