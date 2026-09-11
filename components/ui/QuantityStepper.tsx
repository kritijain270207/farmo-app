'use client';

import { Minus, Plus } from 'lucide-react';

/**
 * Large quantity stepper for quintals.
 * Big +/- pads (56px) so farmers never need the soft keyboard.
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 1000,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        aria-label="Decrease"
        onClick={() => onChange(Math.max(min, value - 5))}
        className="w-14 h-14 flex items-center justify-center rounded-lg bg-surface-container text-primary font-bold text-2xl border-2 border-outline-variant hover:bg-surface-container-high transition-colors tap-highlight"
      >
        <Minus className="w-6 h-6" />
      </button>
      <div className="flex-1 text-center">
        <span className="font-price-hero-mobile text-price-hero-mobile font-bold text-primary leading-none">
          {value}
        </span>
        <span className="block font-label-sm text-label-sm text-on-surface-variant">{label}</span>
      </div>
      <button
        aria-label="Increase"
        onClick={() => onChange(Math.min(max, value + 5))}
        className="w-14 h-14 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-2xl hover:bg-primary-container transition-colors tap-highlight"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}