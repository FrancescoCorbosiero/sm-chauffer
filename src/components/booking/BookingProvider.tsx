'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { draftFromParams, isBookingUrl, type BookingDraft } from '@/lib/booking';

const loadOverlay = () => import('./BookingOverlay');
const BookingOverlay = dynamic(loadOverlay, { ssr: false });
const Toaster = dynamic(() => import('sonner').then((m) => m.Toaster), { ssr: false });

type OpenBooking = (handoff?: Partial<BookingDraft>) => void;
const BookingContext = createContext<OpenBooking | null>(null);

/** Opens the booking app in place (falls back to /contact outside the provider). */
export function useOpenBooking(): OpenBooking | null {
  return useContext(BookingContext);
}

const HISTORY_FLAG = 'tldBooking';

/**
 * Makes every "Book" link on the site open the booking app in place instead
 * of navigating to /contact: links built by bookingHref() keep working as
 * plain links (no JavaScript, new tab, crawlers), and a click is intercepted
 * here with the link's query string as the hand-off. On /contact itself the
 * page hosts the inline flow, so links behave normally there.
 *
 * Opening pushes a history entry, so the phone's back button or gesture
 * closes the app instead of leaving the page.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<{ id: number; handoff: Partial<BookingDraft> } | null>(null);
  const pushed = useRef(false);

  const openBooking = useCallback<OpenBooking>((handoff = {}) => {
    setSession((s) => ({ id: (s?.id ?? 0) + 1, handoff }));
    setOpen(true);
    if (!pushed.current) {
      window.history.pushState({ [HISTORY_FLAG]: true }, '');
      pushed.current = true;
    }
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    }
  }, []);

  // Back/forward: the app is open exactly on its own history entry.
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const mine = Boolean((e.state as Record<string, unknown> | null)?.[HISTORY_FLAG]);
      pushed.current = mine;
      setOpen(mine);
      if (mine) setSession((s) => s ?? { id: 1, handoff: {} });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Navigating elsewhere closes it (its history entry stays behind the new page).
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    pushed.current = false;
    setOpen(false);
  }, [pathname]);

  // Every booking link opens the app in place.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (!isBookingUrl(url, window.location.origin) || window.location.pathname === '/contact') return;
      // Capture phase: Next's <Link> still runs its own onClick (menus close),
      // then sees defaultPrevented and does not navigate.
      e.preventDefault();
      openBooking(draftFromParams(url.searchParams));
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [openBooking]);

  // Fetch the app while the page is idle, so the first tap opens it at once.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => void loadOverlay());
    return () => cancel(id);
  }, []);

  return (
    <BookingContext.Provider value={openBooking}>
      {children}
      {session && <BookingOverlay open={open} session={session.id} handoff={session.handoff} onClose={close} />}
      <Toaster
        position="top-center"
        offset={{ top: 'calc(env(safe-area-inset-top) + 14px)' }}
        mobileOffset={{ top: 'calc(env(safe-area-inset-top) + 10px)' }}
        toastOptions={{ className: '!rounded-2xl !font-sans !text-[14px]' }}
        visibleToasts={2}
      />
    </BookingContext.Provider>
  );
}
