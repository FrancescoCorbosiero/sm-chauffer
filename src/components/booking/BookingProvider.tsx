'use client';

import { Component, createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { bookingHref, draftFromParams, isBookingUrl, type BookingDraft } from '@/lib/booking';

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
// Entries are marked with this page load's id: after a reload, an entry
// flagged by the previous load is just the page, not the app.
const PAGE_LOAD = Math.random().toString(36).slice(2);
const isAppEntry = (state: unknown) => (state as Record<string, unknown> | null)?.[HISTORY_FLAG] === PAGE_LOAD;

/** If the app's code can't be fetched (offline, a new deploy), go to the booking page. */
class OverlayBoundary extends Component<{ href: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    window.location.assign(this.props.href);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

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
  const [session, setSession] = useState<{ id: number; handoff: Partial<BookingDraft>; path: string } | null>(null);

  const openBooking = useCallback<OpenBooking>((handoff = {}) => {
    setSession((s) => ({ id: (s?.id ?? 0) + 1, handoff, path: window.location.pathname }));
    setOpen(true);
    if (!isAppEntry(window.history.state)) window.history.pushState({ [HISTORY_FLAG]: PAGE_LOAD }, '');
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (isAppEntry(window.history.state)) window.history.back();
  }, []);

  // Back/forward: the app is open exactly on its own history entry.
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const mine = isAppEntry(e.state);
      setOpen(mine);
      if (mine) setSession((s) => ({ id: s?.id ?? 1, handoff: s?.handoff ?? {}, path: window.location.pathname }));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // It shows on the page it was opened on: navigating elsewhere hides it (its
  // history entry stays behind the new page), coming back shows it again.
  const shown = open && session?.path === pathname;

  // Every booking link opens the app in place.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (!isBookingUrl(url, window.location.origin) || window.location.pathname === '/contact') return;
      // Capture phase: Next's <Link> still runs its own onClick, then sees
      // defaultPrevented and does not navigate. The app opens in the next
      // task, once a menu closed by that onClick has released the page scroll.
      e.preventDefault();
      const handoff = draftFromParams(url.searchParams);
      window.setTimeout(() => openBooking(handoff), 0);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [openBooking]);

  // Fetch the app while the page is idle, so the first tap opens it at once.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => void loadOverlay().catch(() => {}));
    return () => cancel(id);
  }, []);

  return (
    <BookingContext.Provider value={openBooking}>
      {children}
      {session && (
        <OverlayBoundary href={bookingHref(session.handoff)}>
          <BookingOverlay open={shown} session={session.id} handoff={session.handoff} onClose={close} />
        </OverlayBoundary>
      )}
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
