'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { MapPin, PiggyBank } from 'lucide-react';
import { useFarmerStore } from '@/lib/stores/farmer';
import { marketService } from '@/lib/services';
import { currency, cls } from '@/lib/utils';
import { PageContainer } from '@/components/layout/PageContainer';
import { MandiCard } from '@/components/market/MandiCard';
import { ProfitBreakdown } from '@/components/market/ProfitBreakdown';
import { VehicleSelector } from '@/components/market/VehicleSelector';
import { LoadingState } from '@/components/ui/Feedback';
import type { Mandi, VehicleType } from '@/types';

type SortKey = 'profit' | 'nearest' | 'transport';

const VEHICLE_MULT = { tata_ace: 1.4, pickup: 1.0, truck_10: 2.2 } as const;

/**
 * Screen 6: Market Comparison.
 * Ranks mandis by NET IN-HAND, not raw mandi price.
 * Advanced detail behind "पूरी जानकारी".
 */
export default function MarketsPage() {
  const t = useTranslations('markets');
  const locale = useLocale();
  const { mainCrop, quantity } = useFarmerStore();

  const [mandis, setMandis] = useState<Mandi[] | null>(null);
  const [sort, setSort] = useState<SortKey>('profit');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<VehicleType>('pickup');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    marketService.getMandis(mainCrop).then((m) => {
      if (!alive) return;
      setMandis(m);
      setSelectedId(m.find((x) => x.isRecommended)?.id ?? m[0]?.id ?? null);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [mainCrop]);

  const sorted = useMemo(() => {
    if (!mandis) return [];
    const copy = [...mandis];
    if (sort === 'nearest') copy.sort((a, b) => a.distanceKm - b.distanceKm);
    else if (sort === 'transport') copy.sort((a, b) => a.transportCost - b.transportCost);
    else copy.sort((a, b) => b.netInHand - a.netInHand);
    return copy.map((m, i) => ({ ...m, rank: i + 1 }));
  }, [mandis, sort]);

  const selected = sorted.find((m) => m.id === selectedId) ?? sorted[0];

  const vehicleCost = (vehicleV: VehicleType) =>
    Math.round((selected?.transportCost ?? 0) * VEHICLE_MULT[vehicleV]);
  const netWithVehicle = (selected?.marketPrice ?? 0) - vehicleCost(vehicle) - (selected?.mandiCharges ?? 0);
  const sharedSaving = Math.round((selected?.transportCost ?? 0) * 0.35);

  if (loading || !mandis) {
    return (
      <PageContainer>
        <LoadingState label={t('loading')} />
      </PageContainer>
    );
  }

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'profit', label: t('sortBest') },
    { key: 'nearest', label: t('sortNearest') },
    { key: 'transport', label: t('sortLowerTransport') },
  ];

  return (
    <PageContainer>
      <header className="pt-space-lg pb-space-md">
        <h1 className="font-headline-lg text-headline-lg font-bold text-primary">{t('title')}</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{t('subtitle')}</p>
      </header>

      {/* Sort chips */}
      <div className="flex flex-wrap gap-2 mb-space-md">
        {sortOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            aria-pressed={sort === key}
            className={cls(
              'h-12 px-4 rounded-full border-2 font-label-md text-label-md transition-all tap-highlight',
              sort === key
                ? 'bg-primary-container text-on-primary border-primary-container font-bold'
                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant',
            )}
          >
            {sort === key && '✓ '}
            {label}
          </button>
        ))}
      </div>

      {/* Mandi list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md items-start">
        <div className="flex flex-col gap-4">
          {sorted.map((m) => (
            <MandiCard
              key={m.id}
              mandi={m}
              selected={selected?.id === m.id}
              onSelect={setSelectedId}
              rankLabels={{ recommended: t('recommended'), rank: t('rank') }}
            />
          ))}
        </div>

        {/* Detail / profit simulator */}
        {selected && (
          <div className="lg:sticky lg:top-24 bg-surface-container-lowest rounded-lg border border-outline-variant p-space-lg shadow-card">
            <h2 className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              {selected.name.split(' /')[0]}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {selected.distanceKm} km · {selected.minutes} min · {t('arrival', { n: selected.arrivalToday })}
            </p>

            <div className="mt-3 rounded-lg bg-surface-container p-space-md text-center">
              <span className="font-label-sm text-label-sm text-on-surface-variant block">
                {t('netForYou')}
              </span>
              <span className="font-price-hero text-price-hero font-bold text-primary block leading-none">
                {currency(netWithVehicle)}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">/Qtl</span>
            </div>

            <ProfitBreakdown
              cropValue={selected.marketPrice}
              transport={vehicleCost(vehicle)}
              charges={selected.mandiCharges}
              net={netWithVehicle}
              labels={{
                cropValue: t('mandiPrice2'),
                transport: t('transport'),
                charges: t('charges'),
                net: t('net'),
              }}
            />

            <div className="mt-space-md">
              <VehicleSelector selected={vehicle} onSelect={setVehicle} costFor={vehicleCost} />
            </div>

            {/* Shared transport */}
            <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-price-up-bg text-price-up font-label-md text-label-md font-bold">
              <PiggyBank className="w-5 h-5 shrink-0" />
              {t('sharedSave', { amount: currency(sharedSaving) })}
            </div>

            <button className="mt-space-md w-full h-14 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md active:scale-[0.99]">
              {t('chooseThis', { net: currency(netWithVehicle) })}
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}