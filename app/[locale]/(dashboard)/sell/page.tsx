'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useFarmerStore } from '@/lib/stores/farmer';
import { marketService } from '@/lib/services';
import { localePath, currency, cls } from '@/lib/utils';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatusBadge } from '@/components/market/StatusBadge';
import { ProfitBreakdown } from '@/components/market/ProfitBreakdown';
import { LoadingState } from '@/components/ui/Feedback';
import { cropName } from '@/components/farmer/CropCard';
import type { SellDecision } from '@/types';

/**
 * Screen 5: Sell Decision.
 * Explains the recommendation — reasons, expected return, then one CTA.
 */
export default function SellPage() {
  const t = useTranslations('sell');
  const locale = useLocale();
  const router = useRouter();
  const { mainCrop, quantity } = useFarmerStore();

  const [decision, setDecision] = useState<SellDecision | null>(null);

  useEffect(() => {
    let alive = true;
    marketService.getSellDecision(mainCrop, quantity).then((d) => {
      if (alive) setDecision(d);
    });
    return () => {
      alive = false;
    };
  }, [mainCrop, quantity]);

  if (!decision) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  const decisionLabels = {
    sellNow: t('outcome.sellNow'),
    wait: t('outcome.wait'),
    divert: t('outcome.divert'),
  };

  const cropLabel = cropName(decision.crop.id, locale);

  return (
    <PageContainer className="max-w-2xl">
      <button
        onClick={() => router.push(localePath(locale, '/'))}
        className="flex items-center gap-2 mt-space-md mb-space-sm text-on-surface-variant hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-label-md text-label-md">{t('back')}</span>
      </button>

      <header className="mb-space-md">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile lg:text-headline-lg lg:leading-[38px] font-bold text-primary">
          {t('title', { crop: cropLabel })}
        </h1>
        <div className="mt-2">
          <StatusBadge decision={decision.decision} size="lg" labels={decisionLabels} />
        </div>
      </header>

      {/* Recommended mandi summary */}
      <div className="bg-surface-container-low rounded-lg p-space-md mb-space-md flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
          <MapPin className="w-4 h-4 text-secondary" />
          {decision.mandi.name.split(' /')[0]} · {decision.mandi.distanceKm} km · {decision.mandi.minutes} min
        </span>
        <span className="font-headline-sm text-headline-sm font-bold text-price-up">
          ₹{decision.mandi.priceChange} ↑
        </span>
      </div>

      {/* Reasons */}
      <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-space-md mb-space-md shadow-card">
        <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">
          {t('why')}
        </h2>
        <ul className="space-y-2">
          {decision.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-price-up-bg text-price-up flex items-center justify-center text-sm">
                ✓
              </span>
              <span className="font-body-md text-body-md text-on-surface">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expected return */}
      <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-space-md shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-headline-md text-headline-md font-bold text-primary">
            {t('returnTitle')}
          </h2>
          <span className="font-headline-sm text-headline-sm font-bold text-primary">
            {currency(decision.totalNet)}{' '}
            <span className="font-label-md text-label-md font-normal text-on-surface-variant">
              ({quantity} {t('qtyUnit')})
            </span>
          </span>
        </div>
        <ProfitBreakdown
          cropValue={decision.cropValue}
          transport={decision.transportCost}
          charges={decision.mandiCharges}
          net={decision.netAmount}
          labels={{
            cropValue: t('cropValue'),
            transport: t('transport'),
            charges: t('charges'),
            net: t('net'),
          }}
        />
      </div>

      {/* CTA */}
      <div className={cls('mt-space-lg flex flex-col gap-2')}>
        <button
          onClick={() => router.push(localePath(locale, '/markets'))}
          className="w-full h-14 rounded-lg bg-secondary text-on-secondary-container font-label-lg text-label-lg font-bold shadow-md active:scale-[0.99] transition-all"
        >
          {t('chooseMandi')}
        </button>
        <button
          onClick={() => router.push(localePath(locale, '/markets'))}
          className="w-full h-14 rounded-lg border-2 border-primary text-primary font-label-md text-label-md font-bold"
        >
          {t('seeOther')}
        </button>
      </div>
    </PageContainer>
  );
}