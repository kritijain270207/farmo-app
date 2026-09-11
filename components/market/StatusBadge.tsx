'use client';

import clsx from 'clsx';
import { TrendingUp, TrendingDown, Pause, AlertTriangle } from 'lucide-react';
import type { DecisionType } from '@/types';

const DECISION_META: Record<
  DecisionType,
  { labelKey: 'sellNow' | 'wait' | 'divert'; icon: React.ReactNode; className: string }
> = {
  sell_now: {
    labelKey: 'sellNow',
    icon: <TrendingUp className="w-6 h-6" />,
    className: 'bg-tertiary-container text-on-tertiary-container',
  },
  wait: {
    labelKey: 'wait',
    icon: <Pause className="w-6 h-6" />,
    className: 'bg-secondary-fixed text-on-secondary-fixed',
  },
  divert: {
    labelKey: 'divert',
    icon: <AlertTriangle className="w-6 h-6" />,
    className: 'bg-error-container text-on-error-container',
  },
};

/**
 * Sell decision indicator. NEVER color-alone:
 * badge bg + icon + bold English/Hindi label.
 */
export function StatusBadge({
  decision,
  size = 'md',
  labels,
}: {
  decision: DecisionType;
  size?: 'md' | 'lg';
  labels: { sellNow: string; wait: string; divert: string };
}) {
  const meta = DECISION_META[decision];
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-lg font-bold shadow-sm',
        size === 'lg' ? 'px-5 py-3 text-headline-md text-headline-md' : 'px-3 py-2 text-label-md text-label-md',
        meta.className,
      )}
    >
      {meta.icon}
      {labels[meta.labelKey]}
    </span>
  );
}