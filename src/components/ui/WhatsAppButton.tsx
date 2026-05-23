'use client';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function WhatsAppButton() {
  const t = useTranslation();
  return (
    <Link
      href="https://wa.me/390209952588"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.aria}
      className="group fixed right-5 bottom-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full transition-transform hover:-translate-y-0.5"
      style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
      }}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full ring-2 ring-[#0a0a0a]/40 animate-ping opacity-40"
      />
      <MessageCircle
        size={20}
        aria-hidden
        className="relative transition-transform group-hover:scale-110"
        style={{ color: '#ffffff' }}
      />
      <span
        className="relative hidden sm:inline text-sm font-medium"
        style={{ color: '#ffffff' }}
      >
        {t.whatsapp.label}
      </span>
    </Link>
  );
}
