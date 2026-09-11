'use client';

import { Volume2 } from 'lucide-react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

/**
 * Language selection card — shows the native script + a speaker button.
 * Tap anywhere selects; speaker only plays the name out loud.
 */
export function LanguageCard({
  nativeName,
  selected,
  onSelect,
  onListen,
}: {
  nativeName: string;
  selected: boolean;
  onSelect: () => void;
  onListen: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-pressed={selected}
      className={clsx(
        'relative flex flex-col items-center justify-center gap-1.5 min-h-[88px] px-3 py-4 rounded-lg border-2 transition-all tap-highlight cursor-pointer',
        selected
          ? 'bg-primary-container text-on-primary border-secondary shadow-md'
          : 'bg-surface-container-lowest text-on-surface border-outline-variant shadow-card',
      )}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
          <Check className="w-4 h-4" />
        </span>
      )}
      <span className="font-headline-md text-headline-md font-semibold">{nativeName}</span>
      <button
        type="button"
        aria-label={`Listen to ${nativeName}`}
        className={clsx(
          'flex items-center justify-center w-9 h-9 rounded-full transition-colors',
          selected ? 'bg-on-primary/15 text-on-primary' : 'bg-secondary-fixed text-on-secondary-fixed',
        )}
        onClick={(e) => {
          e.stopPropagation();
          onListen();
        }}
      >
        <Volume2 className="w-5 h-5" />
      </button>
    </div>
  );
}