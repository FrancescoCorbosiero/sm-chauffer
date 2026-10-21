'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Plane, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import QuickBook from '@/components/booking/QuickBook';
import LiveStatus from '@/components/ui/LiveStatus';
import Stars from '@/components/ui/Stars';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { IMAGES } from '@/lib/images';
import { whatsappHref } from '@/lib/contact';

export default function HomeHero() {
  const t = useTranslation();
  const h = t.hero;

  const trust = [
    { icon: <ShieldCheck size={16} aria-hidden />, label: h.trustLicensed },
    { icon: <Plane size={16} aria-hidden />, label: h.trustFlight },
    { icon: <Clock size={16} aria-hidden />, label: h.trust247 },
  ];

  return (
    <section className="relative isolate overflow-clip bg-ink text-white">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src={IMAGES.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_72%] opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/75 to-ink lg:bg-gradient-to-r lg:from-ink lg:via-ink/70 lg:to-ink/10" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_90%_0%,rgba(255,255,255,0.07),transparent_60%)]" />
      </div>

      <div className="container-x grid grid-cols-1 items-center gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14 lg:pb-24 lg:pt-20 xl:gap-20">
        <div>
          <p
            className="intro inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[13px] text-white/85 backdrop-blur"
            style={{ ['--d' as string]: 0 }}
          >
            <LiveStatus />
          </p>

          <h1 className="intro mt-6 text-6xl text-white" style={{ ['--d' as string]: 80 }}>
            {h.titlePart1}{' '}
            <span className="title-accent title-accent-light block sm:inline">{h.titlePart2}</span>
          </h1>

          <p
            className="intro mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-white/70 sm:text-lg"
            style={{ ['--d' as string]: 160 }}
          >
            {h.description}
          </p>

          <div className="intro mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ ['--d' as string]: 240 }}>
            <Link href="/contact#prenota" className="btn btn-gold btn-lg w-full sm:w-auto">
              {t.actions.quote}
              <ArrowRight size={18} aria-hidden />
            </Link>
            <a
              href={whatsappHref(t.actions.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light btn-lg w-full sm:w-auto"
            >
              <WhatsAppIcon size={18} />
              WhatsApp
            </a>
          </div>

          <ul
            className="intro mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 text-sm text-white/75 sm:flex sm:flex-wrap"
            style={{ ['--d' as string]: 320 }}
          >
            <li className="col-span-2 inline-flex items-center gap-2.5 sm:col-span-1">
              <Stars size={15} label={t.testimonialsSection.starsAria.replace('{n}', '5')} />
              <span className="font-semibold text-white">{h.trustGoogle}</span>
            </li>
            {trust.map((item) => (
              <li key={item.label} className="inline-flex items-center gap-2">
                <span className="text-gold">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="intro lg:justify-self-end lg:w-full lg:max-w-[30rem]" style={{ ['--d' as string]: 200 }}>
          <QuickBook />
        </div>
      </div>
    </section>
  );
}
