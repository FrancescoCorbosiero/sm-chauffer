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
      className="fixed right-5 bottom-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full transition-colors"
      style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
      }}
    >
      <MessageCircle size={20} aria-hidden style={{ color: '#ffffff' }} />
      <span className="hidden sm:inline text-sm font-medium" style={{ color: '#ffffff' }}>
        {t.whatsapp.label}
      </span>
    </Link>
  );
}
