'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CheckCheck } from 'lucide-react';
import { notificationService } from '@/lib/services';
import { PageContainer } from '@/components/layout/PageContainer';
import { AlertCard } from '@/components/notification/AlertCard';
import { EmptyState } from '@/components/ui/Feedback';
import { localePath } from '@/lib/utils';
import type { FarmNotification } from '@/types';

/**
 * Screen 9: Notifications.
 * Every alert = what happened + why care + what to do.
 */
export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const locale = useLocale();
  const router = useRouter();

  const [list, setList] = useState<FarmNotification[] | null>(null);

  useEffect(() => {
    let alive = true;
    notificationService.getNotifications().then((n) => {
      if (alive) setList(n);
    });
    return () => {
      alive = false;
    };
  }, []);

  function handleAction(n: FarmNotification) {
    if (n.actionKey) {
      router.push(
        localePath(
          locale,
          n.type === 'price_down' || n.type === 'price_up' ? '/markets' : '/sell',
        ),
      );
    }
  }

  return (
    <PageContainer className="max-w-2xl">
      <header className="pt-space-lg pb-space-md flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">{t('title')}</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t('subtitle')}</p>
        </div>
        {list && list.length > 0 && (
          <button className="h-12 px-4 rounded-lg border-2 border-primary text-primary font-label-md text-label-md font-bold flex items-center gap-2">
            <CheckCheck className="w-5 h-5" />
            {t('markAll')}
          </button>
        )}
      </header>

      {!list ? (
        <div className="flex justify-center py-10">
          <span className="font-label-md text-label-md text-on-surface-variant">…</span>
        </div>
      ) : list.length === 0 ? (
        <EmptyState title={t('empty')} />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((n) => (
            <AlertCard key={n.id} notification={n} onAction={handleAction} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}