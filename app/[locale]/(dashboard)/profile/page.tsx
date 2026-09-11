'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Sprout, Languages, Bell, HelpCircle, Phone, LogOut, ChevronRight, Crop } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { useFarmerStore } from '@/lib/stores/farmer';
import { localePath } from '@/lib/utils';
import { PageContainer } from '@/components/layout/PageContainer';
import { cropName } from '@/components/farmer/CropCard';
import { localeMeta } from '@/lib/i18n/config';

/**
 * Screen 10: Profile.
 * Simple — name, village, language, crops, and a few plain actions.
 */
export default function ProfilePage() {
  const t = useTranslations('profile');
  const locale = useLocale();
  const router = useRouter();
  const farmer = useAuthStore((s) => s.farmer);
  const { name, village, state, mainCrop, quantity } = useFarmerStore();
  const logout = useAuthStore((s) => s.logout);

  const displayName = farmer?.name ?? name;
  const displayVillage = farmer?.village ?? `${village}, ${state}`;

  const actions = [
    { key: 'myCrops', href: '/', Icon: Crop, desc: `${cropName(mainCrop, locale)} · ${quantity} Qtl` },
    { key: 'language', href: '/welcome', Icon: Languages, desc: localeMeta[locale].label },
    { key: 'notifications', href: '/notifications', Icon: Bell, desc: '' },
    { key: 'help', href: '/saathi', Icon: HelpCircle, desc: '' },
    { key: 'support', href: '#', Icon: Phone, desc: '1800-180-1551' },
  ];

  return (
    <PageContainer className="max-w-2xl">
      <header className="pt-space-lg pb-space-md">
        <h1 className="font-headline-lg text-headline-lg font-bold text-primary">{t('title')}</h1>
      </header>

      {/* Identity card */}
      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-space-lg shadow-card flex items-center gap-4">
        <span className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
          <Sprout className="w-8 h-8" />
        </span>
        <div className="min-w-0">
          <h2 className="font-headline-md text-headline-md font-bold text-primary truncate">
            {displayName}
          </h2>
          <p className="font-label-sm text-label-sm text-on-surface-variant">{displayVillage}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
            {t('member')} · {farmer?.accountId ?? 'MH-NSK-88219'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-space-md bg-surface-container-lowest rounded-lg border border-outline-variant shadow-card divide-y divide-outline-variant overflow-hidden">
        {actions.map(({ key, href, Icon, desc }) => (
          <button
            key={key}
            onClick={() => router.push(localePath(locale, href))}
            className="w-full flex items-center justify-between gap-3 px-space-md py-3.5 tap-highlight hover:bg-surface-container-low transition-colors"
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-left min-w-0">
                <span className="block font-label-lg text-label-lg font-bold text-primary">
                  {t(key)}
                </span>
                {desc && (
                  <span className="block font-body-sm text-body-sm text-on-surface-variant truncate">
                    {desc}
                  </span>
                )}
              </span>
            </span>
            <ChevronRight className="w-5 h-5 text-on-surface-variant shrink-0" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          router.push(localePath(locale, '/welcome'));
        }}
        className="mt-space-md w-full h-14 rounded-lg border-2 border-error text-error font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
      >
        <LogOut className="w-5 h-5" />
        {t('logout')}
      </button>
    </PageContainer>
  );
}