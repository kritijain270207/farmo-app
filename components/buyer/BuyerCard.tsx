'use client';

import { ShieldCheck, Phone, Navigation, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { currency } from '@/lib/utils';
import type { Buyer } from '@/types';
import { cls } from '@/lib/utils';

/**
 * Buyer card — plain facts first (name, type, price, qty, distance),
 * business details hidden behind "विवरण देखें".
 */
export function BuyerCard({
  buyer,
  typeLabel,
  onTalk,
  onDetails,
}: {
  buyer: Buyer;
  typeLabel: string;
  onTalk: (b: Buyer) => void;
  onDetails: (b: Buyer) => void;
}) {
  const t = useTranslations('buyers');
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-space-md shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-14 h-14 rounded-lg bg-surface-container-high flex items-center justify-center text-2xl shrink-0">
            🏢
          </span>
          <div className="min-w-0">
            <h4 className="font-headline-sm text-headline-sm font-bold text-primary truncate">
              {buyer.name}
            </h4>
            <span className="font-label-sm text-label-sm text-on-surface-variant">{typeLabel}</span>
          </div>
        </div>
        {buyer.verified && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-price-up-bg text-price-up font-label-sm text-label-sm font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('verified')}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-surface-container-low p-3">
        <div>
          <span className="font-label-sm text-label-sm text-on-surface-variant block">
            {t('offeredPrice')}
          </span>
          <span className="font-headline-sm text-headline-sm font-bold text-primary">
            {currency(buyer.offeredPrice)}
            <span className="font-label-sm text-label-sm font-normal text-on-surface-variant">
              {' '}
              /Qtl
            </span>
          </span>
        </div>
        <div>
          <span className="font-label-sm text-label-sm text-on-surface-variant block">
            {t('needsLabel')}
          </span>
          <span className="font-headline-sm text-headline-sm font-bold text-primary">
            {buyer.requiredQty} <span className="font-label-sm text-label-sm font-normal">Qtl</span>
          </span>
        </div>
        <div>
          <span className="font-label-sm text-label-sm text-on-surface-variant block">
            {t('distance')}
          </span>
          <span className="flex items-center gap-1 font-headline-sm text-headline-sm font-bold text-primary">
            <Navigation className="w-4 h-4" /> {buyer.distanceKm} km
          </span>
        </div>
      </div>

      <div className={cls('mt-3 flex gap-2')}>
        <button
          onClick={() => onTalk(buyer)}
          className="flex-1 h-14 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-primary-container"
        >
          <Phone className="w-5 h-5" />
          {t('talk')}
        </button>
        <button
          onClick={() => onDetails(buyer)}
          className="h-14 px-4 rounded-lg border-2 border-primary text-primary font-label-md text-label-md font-bold flex items-center justify-center gap-1"
        >
          {t('details')}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}