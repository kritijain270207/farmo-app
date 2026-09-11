'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { currency, cls } from '@/lib/utils';

export interface ProfitLabels {
  cropValue: string;
  transport: string;
  charges: string;
  net: string;
}

/**
 * Simple profit breakdown in plain visual blocks.
 * NOT an accounting table — three lines + a big net number.
 */
export function ProfitBreakdown({
  cropValue,
  transport,
  charges,
  net,
  labels,
  reasons,
}: {
  cropValue: number;
  transport: number;
  charges: number;
  net: number;
  labels: ProfitLabels;
  reasons?: string[];
}) {
  return (
    <div>
      {reasons && reasons.length > 0 && (
        <ul className="mb-3 space-y-2">
          {reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-price-up-bg text-price-up flex items-center justify-center">
                ✓
              </span>
              <span className="font-body-sm text-body-sm text-on-surface">{r}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="divide-y divide-outline-variant rounded-lg bg-surface-container-lowest border border-outline-variant">
        <Row label={labels.cropValue} value={currency(cropValue)} />
        <Row
          label={labels.transport}
          value={`− ${currency(transport)}`}
          icon={<ArrowDown className="w-4 h-4 text-price-down" />}
        />
        <Row
          label={labels.charges}
          value={`− ${currency(charges)}`}
          icon={<ArrowDown className="w-4 h-4 text-price-down" />}
        />
        <div
          className={cls(
            'flex items-center justify-between px-space-md py-3 bg-primary-container text-on-primary rounded-b-lg',
          )}
        >
          <span className="font-label-lg text-label-lg font-bold">{labels.net}</span>
          <span className="flex items-center gap-1.5 font-price-hero-mobile text-price-hero-mobile font-bold">
            <ArrowUp className="w-5 h-5 text-tertiary-fixed" />
            {currency(net)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-space-md py-2.5">
      <span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
        {icon}
        {label}
      </span>
      <span className="font-label-md text-label-md font-bold text-on-surface tabular">{value}</span>
    </div>
  );
}