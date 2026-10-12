'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sheet } from 'react-modal-sheet';
import { KonstaProvider } from 'konsta/react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks';
import type { BookingDraft } from '@/lib/booking';
import BookingFlow from './app/BookingFlow';

/**
 * The booking app on top of any page: a full-height bottom sheet on phones
 * and tablets (swipe down to close, keyboard-aware), a floating drawer on the
 * right on desktop. Loaded on demand by BookingProvider.
 */
export default function BookingOverlay({
  open,
  session,
  handoff,
  onClose,
}: {
  open: boolean;
  /** Changes on every opening from a link: the flow restarts from its hand-off. */
  session: number;
  handoff: Partial<BookingDraft>;
  onClose: () => void;
}) {
  const desktop = useMediaQuery('(min-width: 1024px)');
  return (
    <KonstaProvider theme="ios" dark={false}>
      {desktop ? (
        <Drawer key={session} open={open} handoff={handoff} onClose={onClose} />
      ) : (
        <MobileSheet key={session} open={open} handoff={handoff} onClose={onClose} />
      )}
    </KonstaProvider>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** Keeps Tab and Shift+Tab inside the open app. */
function trapTab(e: KeyboardEvent, container: HTMLElement | null) {
  if (e.key !== 'Tab' || !container) return;
  const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;
  if (!container.contains(active)) {
    e.preventDefault();
    first.focus();
  } else if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

function MobileSheet({
  open,
  handoff,
  onClose,
}: {
  open: boolean;
  handoff: Partial<BookingDraft>;
  onClose: () => void;
}) {
  const t = useTranslation();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Focus moves into the sheet once it is up and back to the opener after it
  // closes; with a keyboard (tablets), Tab stays inside and Escape closes.
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else trapTab(e, containerRef.current);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <Sheet
      isOpen={open}
      onClose={onClose}
      detent="full"
      avoidKeyboard
      prefersReducedMotion={reduced}
      onOpenEnd={() => containerRef.current?.querySelector<HTMLElement>('h3[tabindex="-1"]')?.focus({ preventScroll: true })}
      onCloseEnd={() => {
        if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
      }}
    >
      <BookingFlow variant="sheet" handoff={handoff} onClose={onClose}>
        {({ header, body, footer }) => (
          <Sheet.Container
            ref={containerRef}
            className="booking-sheet k-ios"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.bookNow}
          >
            <Sheet.Header>
              <div className="flex justify-center pt-2">
                <Sheet.DragIndicator />
              </div>
              {header}
            </Sheet.Header>
            <Sheet.Content scrollClassName="overscroll-contain">{body}</Sheet.Content>
            {footer}
          </Sheet.Container>
        )}
      </BookingFlow>
      <Sheet.Backdrop
        onTap={onClose}
        tabIndex={-1}
        aria-label={t.quoteModal.close}
        className="!bg-ink/55 backdrop-blur-[2px]"
      />
    </Sheet>
  );
}

function Drawer({
  open,
  handoff,
  onClose,
}: {
  open: boolean;
  handoff: Partial<BookingDraft>;
  onClose: () => void;
}) {
  const t = useTranslation();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);

  // Page scroll locked behind it. A layout effect, like the sheet's own lock:
  // when a rotating tablet swaps drawer and sheet, one lock is released
  // before the other is taken.
  useLayoutEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const gap = window.innerWidth - root.clientWidth;
    const prev = { overflow: root.style.overflow, padding: document.body.style.paddingRight };
    root.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      root.style.overflow = prev.overflow;
      document.body.style.paddingRight = prev.padding;
    };
  }, [open]);

  // Modal behaviour: focus kept inside, Escape closes, focus returns to the
  // opener.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>('h3[tabindex="-1"]')?.focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      trapTab(e, panelRef.current);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKey);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label={t.quoteModal.close}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
          />
          <BookingFlow variant="sheet" handoff={handoff} onClose={onClose}>
            {({ header, body, footer }) => (
              <motion.aside
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={t.nav.bookNow}
                className="booking-drawer k-ios absolute bottom-3 right-3 top-3 flex w-[min(30rem,calc(100vw-1.5rem))] flex-col overflow-clip rounded-[1.75rem] bg-ivory shadow-xl"
                initial={reduced ? { opacity: 0 } : { x: '108%' }}
                animate={reduced ? { opacity: 1 } : { x: 0 }}
                exit={reduced ? { opacity: 0 } : { x: '108%' }}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 40 }}
              >
                <div className="pt-2">{header}</div>
                <div data-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  {body}
                </div>
                {footer}
              </motion.aside>
            )}
          </BookingFlow>
        </div>
      )}
    </AnimatePresence>
  );
}
