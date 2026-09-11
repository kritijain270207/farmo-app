'use client';

import { Truck, Package, Warehouse } from 'lucide-react';
import { cls } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import type { VehicleType } from '@/types';

const VEHICLES: { id: VehicleType; Icon: typeof Truck; capacity: number }[] = [
  { id: 'tata_ace', Icon: Package, capacity: 25 },
  { id: 'pickup', Icon: Truck, capacity: 40 },
  { id: 'truck_10', Icon: Warehouse, capacity: 120 },
];

/**
 * Vehicle selection — large horizontal cards.
 * Selecting updates the transport estimate shown by the parent.
 */
export function VehicleSelector({
  selected,
  onSelect,
  costFor,
}: {
  selected: VehicleType;
  onSelect: (v: VehicleType) => void;
  costFor: (vehicle: VehicleType) => number;
}) {
  const t = useTranslations('markets');
  return (
    <div>
      <h3 className="font-headline-sm text-headline-sm font-bold text-primary mb-2">
        {t('selectVehicle')}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {VEHICLES.map(({ id, Icon }) => {
          const active = selected === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              aria-pressed={active}
              className={cls(
                'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all tap-highlight',
                active
                  ? 'bg-primary-container text-on-primary border-secondary shadow-md'
                  : 'bg-surface-container-lowest text-on-surface border-outline-variant',
              )}
            >
              <Icon className={cls('w-7 h-7', active ? 'text-tertiary-fixed' : 'text-secondary')} />
              <span className="font-label-md text-label-md font-bold text-center leading-tight">
                {t(`vehicles.${id}`)}
              </span>
              <span className="font-label-sm text-label-sm opacity-80">
                {currencyShort(costFor(id))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function currencyShort(n: number) {
  return `−₹${Math.round(n).toLocaleString('en-IN')}`;
}