'use client';

import { MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const SUGGESTION_KEYS = ['faq1', 'faq2', 'faq3'] as const;

/** Tappable example questions — one tap instead of typing. */
export function SuggestionChips({ onPick }: { onPick: (question: string) => void }) {
  const t = useTranslations('home');
  return (
    <div>
      <p className="font-label-sm text-label-sm text-on-surface-variant font-semibold mb-2">
        {t('faqLabel')}
      </p>
      <div className="flex flex-col gap-2">
        {SUGGESTION_KEYS.map((key) => {
          const text = t(key);
          return (
            <button
              key={key}
              onClick={() => onPick(text)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-surface-container text-on-surface text-left font-body-sm text-body-sm hover:bg-surface-container-high transition-colors tap-highlight"
            >
              <MessageCircle className="w-4 h-4 text-secondary shrink-0" />
              <span>&ldquo;{text}&rdquo;</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}