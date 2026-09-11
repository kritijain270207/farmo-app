'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

/**
 * Surface card — pure white, crisp low-contrast border, 16px radius.
 * Structural containment instead of heavy drop shadows (outdoor legibility).
 */
export function Card({
  className,
  children,
  padded = true,
  tone = 'white',
  onClick,
}: {
  className?: string;
  children: ReactNode;
  padded?: boolean;
  tone?: 'white' | 'tinted';
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-lg bg-surface-container-lowest border border-outline-variant shadow-card',
        tone === 'tinted' && 'bg-surface-container-low',
        padded && 'p-space-md',
        onClick && 'cursor-pointer tap-highlight active:scale-[0.99] transition-transform',
        className,
      )}
    >
      {children}
    </div>
  );
}