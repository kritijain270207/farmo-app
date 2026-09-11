'use client';

import { Bell, Mic, Sprout, Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { localePath } from '@/lib/utils';
import { localeMeta } from '@/lib/i18n/config';

const NAV_LINKS = [
  { key: 'home', path: '/', icon: '🏠' },
  { key: 'markets', path: '/markets', icon: '📊' },
  { key: 'saathi', path: '/saathi', icon: '🎙️' },
  { key: 'buyers', path: '/buyers', icon: '👥' },
] as const;

export function LiveMicButton({
  onClick,
  hasAlert,
}: {
  onClick?: () => void;
  hasAlert?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Voice Assistant"
      className="relative flex items-center justify-center w-11 h-11 rounded-full bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary transition-colors"
    >
      <Mic className="w-6 h-6" />
      {hasAlert && (
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
        </span>
      )}
    </button>
  );
}

export function AppHeader({
  onOpenVoice,
  onOpenNotifications,
}: {
  onOpenVoice?: () => void;
  onOpenNotifications?: () => void;
}) {
  const t = useTranslations('app');
  const navT = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();

  return (
    <header className="fixed top-0 w-full z-40 bg-surface-container-lowest/95 backdrop-blur border-b border-outline-variant">
      <div className="h-16 md:h-20 max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-md">
        {/* Brand */}
        <Link href={localePath(locale, '/')} className="flex items-center gap-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-on-primary">
            <Sprout className="w-5 h-5" />
          </span>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary font-bold leading-none">
              Farmo फार्मों
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight mt-1 hidden sm:inline-block">
              {t('tagline')}
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-1 bg-surface-container-low p-1.5 rounded-lg">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.key}
              href={localePath(locale, l.path)}
              className="px-3 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            >
              {l.icon} {navT(l.key)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Language"
            onClick={() => router.push(localePath(locale === 'hi' ? 'en' : 'hi', '/'))}
            className="flex items-center gap-1 h-11 px-3 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors"
          >
            <Languages className="w-4 h-4" />
            <span className="font-label-sm text-label-sm font-bold">{localeMeta[locale].label}</span>
          </button>

          <LiveMicButton onClick={onOpenVoice} hasAlert />

          <button
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="relative flex items-center justify-center w-11 h-11 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-surface-container-lowest" />
          </button>
        </div>
      </div>
    </header>
  );
}