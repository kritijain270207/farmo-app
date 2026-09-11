'use client';

import { Star, Navigation } from 'lucide-react';
import { currency, cls } from '@/lib/utils';
import type { Mandi } from '@/types';
import { useTranslations } from 'next-intl';

/**
 * Mandi card ranked by NET IN-HAND, not raw price.
 * The recommended (best profit) option is visually highlighted.
 */
export function MandiCard({
  mandi,
  selected,
  onSelect,
  rankLabels,
}: {
  mandi: Mandi;
  selected: boolean;
  onSelect: (id: string) => void;
  rankLabels: { recommended: string; rank: string };
}) {
  const t = useTranslations('markets');
  return (
    <button
      onClick={() => onSelect(mandi.id)}
      aria-pressed={selected}
      className={cls(
        'relative w-full text-left rounded-lg border-2 p-space-md transition-all tap-highlight',
        selected
          ? 'border-secondary bg-surface-container-lowest shadow-md'
          : 'border-outline-variant bg-surface-container-lowest shadow-card',
        mandi.isRecommended && !selected && 'border-price-up/50',
      )}
    >
      {mandi.isRecommended && (
        <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-price-up text-white font-label-sm text-label-sm font-bold shadow-sm">
          <Star className="w-3.5 h-3.5 fill-current" />
          {rankLabels.recommended}
        </span>
      )}

      <div className="flex items-start justify-between gap-2 pt-1">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-label-lg text-label-lg text-on-surface-variant font-bold">
              {rankLabels.rank} {mandi.rank}
            </span>
            <h4 className="font-headline-sm text-headline-sm font-bold text-primary truncate">
              {mandi.name.split(' /')[0]}
            </h4>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Navigation className="w-3.5 h-3.5 text-on-surface-variant" />
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {mandi.distanceKm} {t('common.km')} · ~{mandi.minutes} {t('common.min')}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="font-label-sm text-label-sm text-on-surface-variant block">
            {t('net')}
          </span>
          <span className="font-price-hero-mobile text-price-hero-mobile font-bold text-primary leading-tight">
            {currency(mandi.netInHand)}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant"> /Qtl</span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-outline-variant pt-2">
        <MiniStat label={t('mandiPrice')} value={currency(mandi.marketPrice)} />
        <MiniStat
          label={t('transport')}
          value={`− ${currency(mandi.transportCost)}`}
          tone="muted"
        />
        <MiniStat label={t('charges')} value={`− ${currency(mandi.mandiCharges)}`} tone="muted" />
      </div>
    </button>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: 'muted' }) {
  return (
    <div>
      <span className="font-label-sm text-label-sm text-on-surface-variant block">{label}</span>
      <span
        className={cls(
          'font-label-md text-label-md font-bold tabular',
          tone === 'muted' ? 'text-on-surface-variant' : 'text-primary',
        )}
      >
        {value}
      </span>
    </div>
  );
}