'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

type PillTone = 'green' | 'amber' | 'red' | 'blue' | 'neutral' | 'gold';

const tones: Record<PillTone, string> = {
  green: 'bg-price-up-bg text-price-up',
  amber: 'bg-price-stable-bg text-price-stable',
  red: 'bg-price-down-bg text-price-down',
  blue: 'bg-primary-fixed/60 text-primary',
  neutral: 'bg-surface-container text-on-surface-variant',
  gold: 'bg-secondary-fixed text-on-secondary-fixed',
};

/** Circular status pill — distinguishes info badges from rectangular controls. */
export function Pill({
  tone = 'neutral',
  children,
  className,
  dot,
}: {
  tone?: PillTone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-md text-label-md whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {dot && <span className="w-2 h-2 rounded-full bg-current" />}
      {children}
    </span>
  );
}