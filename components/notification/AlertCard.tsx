'use client';

import { TrendingUp, TrendingDown, CloudRain, Megaphone, Flame, Users, Settings } from 'lucide-react';
import type { FarmNotification } from '@/types';
import { cls } from '@/lib/utils';

const TONE: Record<
  FarmNotification['tone'],
  { icon: React.ReactNode; bar: string; chip: string }
> = {
  up: { icon: <TrendingUp className="w-5 h-5" />, bar: 'bg-price-up', chip: 'bg-price-up-bg text-price-up' },
  down: { icon: <TrendingDown className="w-5 h-5" />, bar: 'bg-error', chip: 'bg-error-container text-on-error-container' },
  warn: { icon: <Flame className="w-5 h-5" />, bar: 'bg-secondary', chip: 'bg-price-stable-bg text-price-stable' },
  info: { icon: <CloudRain className="w-5 h-5" />, bar: 'bg-primary', chip: 'bg-surface-container text-primary' },
};

/**
 * Notification card — answers: what happened, why care, what to do.
 */
export function AlertCard({
  notification,
  onAction,
}: {
  notification: FarmNotification;
  onAction?: (n: FarmNotification) => void;
}) {
  const tone = TONE[notification.tone];
  return (
    <div className="relative bg-surface-container-lowest rounded-lg border border-outline-variant shadow-card overflow-hidden">
      <span className={cls('absolute top-0 left-0 right-0 h-1', tone.bar)} />
      <div className="p-space-md pt-4">
        <div className="flex items-start gap-3">
          <span className={cls('w-10 h-10 rounded-full flex items-center justify-center shrink-0', tone.chip)}>
            {tone.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-label-md text-label-md font-bold text-primary leading-snug">
              {notification.title}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              {notification.body}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {notification.timeKey}
              </span>
              {notification.actionKey && (
                <button
                  onClick={() => onAction?.(notification)}
                  className="font-label-md text-label-md font-bold text-primary hover:underline px-2 py-1"
                >
                  {notification.actionKey} →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const notificationTypeIcon: Record<string, typeof Megaphone> = {
  price_up: Megaphone,
  price_down: TrendingDown,
  forecast: TrendingUp,
  weather: CloudRain,
  buyer: Users,
  system: Settings,
};