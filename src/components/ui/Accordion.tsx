'use client';

import { useId, useState } from 'react';
import { Plus } from 'lucide-react';

export interface AccordionItem {
  q: string;
  a: string;
}

/**
 * Accessible accordion (button + region). Answers stay in the DOM while
 * collapsed (good for SEO); the grid-rows trick animates the height.
 */
export default function Accordion({
  items,
  defaultOpen = 0,
  tone = 'light',
}: {
  items: AccordionItem[];
  defaultOpen?: number;
  tone?: 'light' | 'dark';
}) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  const dark = tone === 'dark';

  return (
    <div className={`border-t ${dark ? 'border-white/10' : 'border-line'}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${uid}-q${i}`;
        const panelId = `${uid}-a${i}`;
        return (
          <div key={item.q} className={`border-b ${dark ? 'border-white/10' : 'border-line'}`}>
            <h3 className="font-sans">
              <button
                id={btnId}
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-6 py-5 text-left md:py-6"
              >
                <span
                  className={`text-[1.0625rem] font-semibold leading-snug md:text-lg ${dark ? 'text-white' : 'text-ink'}`}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ${
                    isOpen
                      ? 'rotate-45 border-gold bg-gold text-on-gold'
                      : dark
                        ? 'border-white/20 text-white'
                        : 'border-line-strong text-ink'
                  }`}
                >
                  <Plus size={16} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-smooth ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className={`pb-6 pr-12 text-[15px] leading-relaxed md:text-base ${dark ? 'text-white/65' : 'text-muted'}`}>
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
