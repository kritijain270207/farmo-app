'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Phone } from 'lucide-react';
import { useFarmerStore } from '@/lib/stores/farmer';
import { buyerService } from '@/lib/services';
import { PageContainer } from '@/components/layout/PageContainer';
import { BuyerCard } from '@/components/buyer/BuyerCard';
import { LoadingState } from '@/components/ui/Feedback';
import type { Buyer } from '@/types';

/**
 * Screen 8: Buyers.
 * "Who wants to buy your crop?" — verified + offered price, nothing more.
 */
export default function BuyersPage() {
  const t = useTranslations('buyers');
  const typeT = useTranslations('buyers.types');
  const { mainCrop } = useFarmerStore();

  const [buyers, setBuyers] = useState<Buyer[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [calling, setCalling] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    buyerService.getBuyers(mainCrop).then((b) => {
      if (alive) setBuyers(b);
    });
    return () => {
      alive = false;
    };
  }, [mainCrop]);

  function handleTalk(buyer: Buyer) {
    setCalling(buyer.id);
    setTimeout(() => setCalling(null), 2500);
  }

  return (
    <PageContainer className="max-w-3xl">
      <header className="pt-space-lg pb-space-md">
        <h1 className="font-headline-lg text-headline-lg font-bold text-primary">{t('title')}</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{t('subtitle')}</p>
      </header>

      {!buyers ? (
        <LoadingState />
      ) : (
        <div className="flex flex-col gap-4">
          {buyers.map((b) => (
            <div key={b.id}>
              <BuyerCard
                buyer={b}
                typeLabel={typeT(b.typeKey)}
                onTalk={handleTalk}
                onDetails={(b) => setExpanded(b.id)}
              />
              {expanded === b.id && (
                <div className="mt-2 rounded-lg bg-surface-container p-space-md animate-fade-up">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                    {t('offer')}
                  </p>
                  <p className="font-body-md text-body-md text-primary">
                    {b.name} · {typeT(b.typeKey)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-on-surface-variant" />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {b.distanceKm} km · {t('verified')}: {b.verified ? t('yes') : t('no')}
                    </span>
                  </div>
                  <button className="mt-2 h-12 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {b.phone}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {calling && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-primary text-on-primary rounded-lg p-3 shadow-lift z-50 flex items-center gap-2 animate-fade-up">
          <span className="w-3 h-3 rounded-full bg-tertiary-fixed animate-pulse" />
          <span className="font-body-sm text-body-sm">{t('calling', { phone: buyers?.find((b) => b.id === calling)?.phone })}</span>
        </div>
      )}
    </PageContainer>
  );
}