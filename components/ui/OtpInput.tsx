'use client';

import { useRef } from 'react';
import { cls } from '@/lib/utils';

/**
 * Large OTP boxes — 6 digits, auto-advance, paste-friendly.
 * Generous 56px+ tap targets.
 */
export function OtpInput({
  value,
  onChange,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const LENGTH = 6;

  function handleChange(index: number, raw: string) {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return;
    const next = value.split('');
    for (let i = 0; i < digits.length; i++) {
      if (index + i < LENGTH) next[index + i] = digits[i];
    }
    const joined = next.join('').slice(0, LENGTH);
    onChange(joined);
    const focusTo = Math.min(index + digits.length, LENGTH - 1);
    refs.current[focusTo]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (value[index]) {
        // Clear current cell
        const next = value.split('');
        next[index] = '';
        onChange(next.join(''));
      } else if (index > 0) {
        // Move to previous cell and clear it
        const next = value.split('');
        next[index - 1] = '';
        onChange(next.join(''));
        refs.current[index - 1]?.focus();
      }
    }
  }

  return (
    <div className="flex justify-between gap-2" role="group" aria-label="OTP">
      {Array.from({ length: LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          autoFocus={autoFocus && i === 0}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={cls(
            'w-12 h-14 md:w-14 text-center font-headline-md text-headline-md font-bold border-2 rounded-lg bg-surface-container-lowest tabular',
            value[i]
              ? 'border-primary text-primary'
              : 'border-outline-variant text-on-surface',
            i === (value.length || 0) && 'border-secondary focus-visible:ring-4 focus-visible:ring-secondary-fixed-dim',
          )}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}