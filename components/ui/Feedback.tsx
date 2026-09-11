'use client';

import { Sprout } from 'lucide-react';

/** Simple shimmer-free loading block (slow networks, large friendly). */
export function LoadingState({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 animate-fade-up" role="status">
      <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center">
        <Sprout className="w-7 h-7 text-primary animate-pulse" />
      </div>
      <span className="font-label-md text-label-md text-on-surface-variant">{label ?? '…'}</span>
    </div>
  );
}

/** Empty state for notifications/listless sections. */
export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <span className="text-5xl">🌾</span>
      <p className="font-headline-sm text-headline-sm font-bold text-primary">{title}</p>
      {subtitle && (
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">{subtitle}</p>
      )}
    </div>
  );
}

/** Error state with retry. */
export function ErrorState({
  title,
  retryLabel,
  onRetry,
}: {
  title: string;
  retryLabel?: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <span className="text-5xl">⚠️</span>
      <p className="font-headline-sm text-headline-sm font-bold text-primary">{title}</p>
      <button
        onClick={onRetry}
        className="h-12 px-6 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold"
      >
        {retryLabel ?? 'Retry'}
      </button>
    </div>
  );
}