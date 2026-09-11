'use client';

import { Bot, Mic, Radio, AlertTriangle, Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import type { VoiceStatus } from '@/types';

/** Visual state for the voice assistant — no technical jargon. */
export function VoiceStateBanner({ status }: { status: VoiceStatus }) {
  const t = useTranslations('saathi');

  const config: Record<VoiceStatus, { icon: React.ReactNode; label: string; tone: string }> = {
    idle: {
      icon: <Mic className="w-5 h-5" />,
      label: t('idle'),
      tone: 'bg-surface-container text-on-surface-variant',
    },
    listening: {
      icon: <Radio className="w-5 h-5 animate-pulse" />,
      label: t('listening'),
      tone: 'bg-secondary-container/20 text-on-secondary-container',
    },
    processing: {
      icon: <Bot className="w-5 h-5" />,
      label: t('processing'),
      tone: 'bg-primary-container/10 text-primary',
    },
    speaking: {
      icon: <Volume2 className="w-5 h-5" />,
      label: t('speaking'),
      tone: 'bg-primary text-on-primary',
    },
    error: {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: t('error'),
      tone: 'bg-error-container text-on-error-container',
    },
  };

  const c = config[status];

  return (
    <div
      className={clsx(
        'flex items-center justify-center gap-2 rounded-full px-4 py-2 font-label-md text-label-md transition-colors duration-300',
        c.tone,
      )}
      aria-live="polite"
    >
      {c.icon}
      <span>
        {c.label}
      </span>
    </div>
  );
}