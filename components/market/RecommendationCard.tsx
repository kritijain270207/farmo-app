'use client';

import { Verified, Volume2, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { ProfitBreakdown } from './ProfitBreakdown';
import { currency } from '@/lib/utils';
import { useVoice } from '@/lib/hooks/useVoice';
import type { SellDecision } from '@/types';
import { localePath } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

/**
 * HERO BRAHMASTRA RECOMMENDATION.
 * One glance must answer: "What do I do with my crop?"
 * Progressive disclosure: reasons hidden behind "क्यों?".
 */
export function RecommendationCard({
  decision,
  decisionTime,
  onSellHow,
}: {
  decision: SellDecision;
  decisionTime: string;
  onSellHow?: () => void;
}) {
  const t = useTranslations('home');
  const locale = useLocale();
  const router = useRouter();
  const [whyOpen, setWhyOpen] = useState(false);
  const { speak } = useVoice('hi-IN');
  const { crop, mandi, quantity } = decision;
  const cropLabel = crop.names[locale as keyof typeof crop.names] ?? crop.names.hi;

  const decisionLabels = {
    sellNow: t('decision.sellNow'),
    wait: t('decision.wait'),
    divert: t('decision.divert'),
  };

  return (
    <section className="bg-surface-container-lowest rounded-lg p-space-lg shadow-card border border-outline-variant">
      {/* Header badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-space-md">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
            <Verified className="w-4 h-4" />
            {t('decision.badge')}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">
            {t('decision.note')}
          </span>
        </div>
        <button
          aria-label={t('listen')}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-surface-container text-primary"
          onClick={() =>
            speak(
              `आज ${cropLabel} को ${mandi.name.split(' /')[0]} में बेचें। हाथ में ₹${decision.netAmount} प्रति क्विंटल मिलेगा।`,
            )
          }
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main decision row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
        {/* Left: crop + decision */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="w-16 h-16 rounded-lg bg-surface-container-high flex items-center justify-center text-4xl shrink-0">
              {crop.emoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                  {t('lotLabel')}
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
                  {quantity} {t('common.qtyUnit')}
                </span>
              </div>
              <h3 className="font-headline-lg-mobile text-headline-lg-mobile lg:text-headline-lg lg:leading-[38px] font-bold text-on-background leading-tight">
                {cropLabel}
              </h3>
            </div>
          </div>

          {/* Decision badge + supporting line */}
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge decision={decision.decision} labels={decisionLabels} />
            <p className="font-body-sm text-body-sm text-primary font-medium">
              {t('decision.supportLine')}
            </p>
          </div>

          {/* Mini mandi info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
            <div className="p-3 bg-surface-container-low rounded-lg">
              <span className="font-label-sm text-label-sm text-on-surface-variant block">
                {t('recommendedMandi')}
              </span>
              <span className="font-headline-sm text-headline-sm font-bold text-primary block mt-0.5">
                {mandi.name.split(' /')[0]}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {mandi.distanceKm} {t('common.km')} · ~{mandi.minutes} {t('common.min')}
              </span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg">
              <span className="font-label-sm text-label-sm text-on-surface-variant block">
                {t('mandiPrice')}
              </span>
              <span className="font-headline-sm text-headline-sm font-bold text-primary block mt-0.5">
                {currency(mandi.marketPrice)} {t('common.perQtl')}
              </span>
              <span className="font-label-sm text-label-sm text-price-up font-bold">
                ↑ {currency(mandi.priceChange)} {t('trendDiff')}
              </span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg">
              <span className="font-label-sm text-label-sm text-on-surface-variant block">
                {t('transportLabour')}
              </span>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface-variant block mt-0.5">
                − {currency(mandi.transportCost + mandi.mandiCharges)} {t('common.perQtl')}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {t('transportOk')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: net in-hand + CTA */}
        <div className="lg:col-span-5 flex flex-col justify-center bg-surface-container p-space-lg rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary">
              {t('netInHand')}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold">
              {t('netAfterCharges')}
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="font-price-hero-mobile text-price-hero-mobile lg:text-price-hero lg:leading-[44px] font-bold text-primary leading-none">
              {currency(decision.netAmount)}
            </span>
            <span className="font-headline-sm text-headline-sm font-semibold text-on-surface-variant">
              {t('common.perQtl')}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-surface-container-lowest flex items-center justify-between mb-3 shadow-inner">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {t('totalEarn')} {quantity} {t('common.qtyUnit')}:
            </span>
            <span className="font-headline-md text-headline-md font-bold text-primary">
              {currency(decision.totalNet)}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onSellHow}
              className="w-full h-14 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container shadow-md active:scale-[0.99] transition-all"
            >
              <span>{t('seeHowToSell')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setWhyOpen((v) => !v)}
              className="w-full h-12 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
            >
              {whyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{t('why')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progressive disclosure: why drawer */}
      {whyOpen && (
        <div className="mt-4 border-t border-outline-variant pt-4 animate-fade-up">
          <h4 className="font-headline-sm text-headline-sm font-bold text-primary mb-3">
            {t('whyTitle')}
          </h4>
          <ProfitBreakdown
            cropValue={decision.cropValue}
            transport={decision.transportCost}
            charges={decision.mandiCharges}
            net={decision.netAmount}
            labels={{
              cropValue: t('breakdown.cropValue'),
              transport: t('breakdown.transport'),
              charges: t('breakdown.charges'),
              net: t('breakdown.net'),
            }}
            reasons={decision.reasons}
          />
          <button
            onClick={() => router.push(localePath(locale, '/markets'))}
            className="mt-3 w-full h-14 rounded-lg border-2 border-primary text-primary font-label-md text-label-md font-bold"
          >
            {t('seeMarkets')}
          </button>
        </div>
      )}
    </section>
  );
}