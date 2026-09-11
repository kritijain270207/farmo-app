'use client';

import { currency } from '@/lib/utils';

/**
 * Simple 7-day trend sparkline — no axes, no jargon.
 * Dots + 1 line + shaded area. Color + text label, never color alone.
 */
export function SimplePriceChart({
  points,
  up,
}: {
  points: { day: string; value: number }[];
  up: boolean;
}) {
  if (points.length < 2) return null;

  const w = 240;
  const h = 44;
  const min = Math.min(...points.map((p) => p.value));
  const max = Math.max(...points.map((p) => p.value));
  const range = max - min || 1;

  const stepX = w / (points.length - 1);
  const coords = points.map((p, i) => ({
    x: i * stepX,
    y: h - 6 - ((p.value - min) / range) * (h - 12),
  }));

  const line = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ');
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const stroke = up ? '#15803D' : '#B91C1C';
  const last = coords[coords.length - 1];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-label-sm text-on-surface-variant mb-1">
        <span>{points[points.length - 1].day}</span>
        <span className={up ? 'text-price-up font-semibold' : 'text-price-down font-semibold'}>
          {up ? '↑' : '↓'} {currency(points[points.length - 1].value)}
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-11 overflow-visible" role="img" aria-label="7-day price trend">
        <defs>
          <linearGradient id={`grad-${up ? 'up' : 'down'}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#grad-${up ? 'up' : 'down'})`} />
        <path d={line} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={last.x} cy={last.y} r="4" fill={stroke} />
      </svg>
    </div>
  );
}