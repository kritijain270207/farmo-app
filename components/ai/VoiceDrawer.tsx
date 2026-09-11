'use client';

import { useEffect, useState } from 'react';
import { X, Mic } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useVoice } from '@/lib/hooks/useVoice';
import { VoiceStateBanner } from './VoiceStateBanner';
import { SuggestionChips } from './SuggestionChips';
import { localePath } from '@/lib/utils';
import { aiService } from '@/lib/services';

/**
 * Voice-first quick-assist drawer.
 * Open on any screen → tap mic → hear the answer → optional deep-links.
 */
export function VoiceDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations('saathi');
  const locale = useLocale();
  const router = useRouter();
  const { status, transcript, startListening, stopListening, cancel, speak } = useVoice(
    locale === 'en' ? 'en-IN' : 'hi-IN',
  );
  const [answer, setAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      cancel();
      setAnswer(null);
    }
  }, [open, cancel]);

  function askQuick(question: string) {
    cancel();
    void aiService.chat(question, { crop: 'onion', quantity: 40 }).then((r) => {
      setAnswer(r);
      speak(r);
    });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-primary/40 transition-opacity duration-300 md:hidden',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className={clsx(
          'fixed z-50 left-0 right-0 bottom-0 md:top-20 md:bottom-auto mx-auto max-w-lg',
          'bg-surface-container-lowest rounded-t-2xl md:rounded-b-2xl border-t-2 border-primary shadow-lift',
          'transition-transform duration-300',
          open ? 'translate-y-0' : 'translate-y-full md:translate-y-[-200%]',
        )}
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
      >
        <div className="p-space-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
              <Mic className="w-6 h-6 text-secondary" />
              {t('title')}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-surface-container text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status */}
          <VoiceStateBanner status={status} />

          {/* Transcript */}
          {(transcript || answer) && (
            <div className="mt-space-sm max-h-48 overflow-y-auto">
              {transcript && (
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">
                  “{transcript}”
                </p>
              )}
              {answer && (
                <div className="bg-surface-container-low rounded-lg p-space-md">
                  <p className="font-body-md text-body-md text-primary">{answer}</p>
                </div>
              )}
            </div>
          )}

          {/* Mic control */}
          <div className="flex flex-col items-center my-space-md">
            <button
              onClick={() => (status === 'listening' ? stopListening() : startListening())}
              className={clsx(
                'relative w-20 h-20 rounded-full flex items-center justify-center transition-all',
                status === 'listening'
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-primary text-on-primary',
              )}
              aria-label={t('tapToSpeak')}
            >
              {status === 'listening' && (
                <span className="absolute inset-0 rounded-full bg-secondary-container/40 animate-mic-pulse" />
              )}
              <Mic className="w-9 h-9" />
            </button>
            <span className="mt-2 font-label-md text-label-md text-on-surface-variant">
              {t('tapToSpeak')}
            </span>
          </div>

          {/* Quick questions */}
          <SuggestionChips
            onPick={(q) => {
              void askQuick(q);
            }}
          />

          {/* Done → optional push to Saathi */}
          {answer && (
            <div className="mt-space-md flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  router.push(localePath(locale, '/saathi'));
                }}
                className="flex-1 h-14 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2"
              >
                {t('openSaathi')} →
              </button>
              <button
                onClick={onClose}
                className="h-14 px-4 rounded-lg border-2 border-primary text-primary font-label-md text-label-md font-bold"
              >
                {t('close')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}