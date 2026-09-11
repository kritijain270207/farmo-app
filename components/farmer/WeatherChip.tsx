'use client';

import { Sun, CloudSun, CloudRain, Wind } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Weather = 'sunny' | 'partly' | 'rain';

const meta: Record<Weather, { icon: React.ReactNode; textKey: string }> = {
  sunny: { icon: <Sun className="w-5 h-5" />, textKey: 'sunny' },
  partly: { icon: <CloudSun className="w-5 h-5" />, textKey: 'partly' },
  rain: { icon: <CloudRain className="w-5 h-5" />, textKey: 'rainy' },
};

/** Compact weather summary — answers "can I go to mandi?" */
export function WeatherChip({ mode = 'sunny' }: { mode?: Weather }) {
  const t = useTranslations('home.weather');
  const m = meta[mode];
  return (
    <div className="flex items-center gap-3 px-space-md py-2.5 rounded-xl bg-surface-container-low">
      <span className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
        {m.icon}
      </span>
      <span className="font-label-md text-label-md text-on-surface-variant">
        29°C · {t(m.textKey)}
      </span>
      <Wind className="w-4 h-4 text-on-surface-variant hidden sm:block" />
    </div>
  );
}