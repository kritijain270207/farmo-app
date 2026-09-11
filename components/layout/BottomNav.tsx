'use client';

import { Home, BarChart3, Mic, Users, User } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { localePath, stripLocale } from '@/lib/utils';
import { useTranslations } from 'next-intl';

const TABS = [
  { key: 'home' as const, path: '/', Icon: Home },
  { key: 'markets' as const, path: '/markets', Icon: BarChart3 },
  { key: 'saathi' as const, path: '/saathi', Icon: Mic },
  { key: 'buyers' as const, path: '/buyers', Icon: Users },
  { key: 'profile' as const, path: '/profile', Icon: User },
];

/**
 * Persistent bottom thumb-zone navigation.
 * AI Saathi is visually emphasized (center-ish, gold ring).
 */
export function BottomNav() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const current = stripLocale(pathname);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-outline-variant safe-bottom"
      aria-label="Primary"
    >
      <div className="flex items-stretch justify-between max-w-lg mx-auto px-2 py-1.5">
        {TABS.map(({ key, path, Icon }) => {
          const active = current === path || current.startsWith(`${path}/`);
          const isSaathi = key === 'saathi';
          return (
            <Link
              key={key}
              href={localePath(locale, path)}
              aria-current={active ? 'page' : undefined}
              className={
                isSaathi
                  ? 'flex flex-col items-center justify-center gap-0.5 -mt-5 min-w-[64px] min-h-[64px] rounded-full bg-primary text-on-primary shadow-lg ring-4 ring-background'
                  : 'flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[52px] '
              }
            >
              <Icon
                className={
                  isSaathi
                    ? 'w-7 h-7'
                    : `w-6 h-6 ${active ? 'text-primary font-bold' : 'text-on-surface-variant'}`
                }
              />
              <span
                className={
                  isSaathi
                    ? 'font-label-sm text-label-sm font-bold text-on-primary'
                    : `font-label-sm text-label-sm ${active ? 'text-primary font-bold' : 'text-on-surface-variant'}`
                }
              >
                {t(key)}
              </span>
              {!isSaathi && active && (
                <span className="absolute bottom-1 w-4 h-1 rounded-full bg-secondary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}