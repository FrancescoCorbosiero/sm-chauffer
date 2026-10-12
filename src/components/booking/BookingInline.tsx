'use client';

import { Suspense, useMemo, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { KonstaProvider } from 'konsta/react';
import { draftFromParams, type BookingDraft } from '@/lib/booking';
import { useMediaQuery } from '@/lib/hooks';
import BookingFlow from './app/BookingFlow';

/**
 * The booking app embedded in /contact (#prenota). The prerendered HTML holds
 * the empty first step; on the client it restarts from the query string a
 * booking link handed over, and from the tab's saved draft. On wide screens
 * the trip map moves to a sticky column next to the form, above `aside`.
 */
export default function BookingInline({ aside }: { aside?: ReactNode }) {
  return (
    <Suspense fallback={<Inline handoff={null} aside={aside} />}>
      <InlineFromParams aside={aside} />
    </Suspense>
  );
}

function InlineFromParams({ aside }: { aside?: ReactNode }) {
  const search = useSearchParams().toString();
  const handoff = useMemo(() => draftFromParams(new URLSearchParams(search)), [search]);
  // A new hand-off (different query) starts a fresh flow.
  return <Inline key={search || 'client'} handoff={handoff} aside={aside} />;
}

function Inline({ handoff, aside }: { handoff: Partial<BookingDraft> | null; aside?: ReactNode }) {
  const wide = useMediaQuery('(min-width: 1024px)');
  return (
    <KonstaProvider theme="ios" dark={false}>
      <BookingFlow variant="inline" handoff={handoff} mapInBody={!wide}>
        {({ header, body, footer, preview }) => (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="k-ios min-w-0 overflow-clip rounded-[2rem] bg-ivory ring-1 ring-line lg:col-span-7">
              {header}
              {body}
              {footer}
            </div>
            <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-24 lg:col-span-5">
              <div className="hidden lg:block">{preview}</div>
              {aside}
            </div>
          </div>
        )}
      </BookingFlow>
    </KonstaProvider>
  );
}
