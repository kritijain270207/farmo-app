'use client';

import clsx from 'clsx';
import { Check } from 'lucide-react';
import { getCrop, crops } from '@/lib/services/mock-data';
import type { Crop, CropId } from '@/types';
import { useLocale } from 'next-intl';

/**
 * Visual crop card for onboarding & "my crops" — emoji + localized name.
 * Big square tap surface, selected state = forest green fill.
 */
export function CropCard({
  crop,
  selected,
  onSelect,
  compact,
}: {
  crop: Crop;
  selected?: boolean;
  onSelect?: (id: CropId) => void;
  compact?: boolean;
}) {
  const locale = useLocale();
  const name = crop.names[locale] ?? crop.names.hi ?? crop.names.en ?? crop.id;

  return (
    <button
      onClick={() => onSelect?.(crop.id)}
      aria-pressed={selected}
      className={clsx(
        'relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 transition-all tap-highlight',
        compact ? 'min-h-[96px] p-3' : 'min-h-[112px] p-4',
        selected
          ? 'bg-primary-container text-on-primary border-secondary shadow-md'
          : 'bg-surface-container-lowest text-on-surface border-outline-variant shadow-card',
      )}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
          <Check className="w-4 h-4" />
        </span>
      )}
      <span className="text-4xl leading-none" role="img" aria-label={name}>
        {crop.emoji}
      </span>
      <span className={clsx('font-label-md text-label-md font-bold', !selected && 'text-primary')}>
        {name}
      </span>
    </button>
  );
}

/** Grid of all crop cards for the onboarding picker. */
export function CropGrid({
  selected,
  onSelect,
}: {
  selected?: CropId;
  onSelect?: (id: CropId) => void;
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-space-md">
      {crops.map((c) => (
        <CropCard key={c.id} crop={c} selected={selected === c.id} onSelect={onSelect} />
      ))}
    </div>
  );
}

export function cropName(cropId: CropId, locale: string): string {
  const crop = getCrop(cropId);
  return crop.names[locale as keyof typeof crop.names] ?? crop.names.hi ?? crop.names.en ?? cropId;
}