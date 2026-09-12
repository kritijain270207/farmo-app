'use client';

import { useEffect, useState } from 'react';
import { Sun, CloudSun, CloudRain, Wind } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { API_BASE } from '@/lib/utils';

type WeatherCondition = 'sunny' | 'partly' | 'rain';

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  label: string;
  city: string;
}

const conditionIcon: Record<WeatherCondition, React.ReactNode> = {
  sunny: <Sun className="w-5 h-5" />,
  partly: <CloudSun className="w-5 h-5" />,
  rain: <CloudRain className="w-5 h-5" />,
};

const conditionKey: Record<WeatherCondition, string> = {
  sunny: 'sunny',
  partly: 'partly',
  rain: 'rainy',
};

function mapCondition(raw: string): WeatherCondition {
  const lower = raw.toLowerCase();
  if (lower.includes('rain') || lower.includes('बारिश')) return 'rain';
  if (lower.includes('cloud') || lower.includes('partly')) return 'partly';
  return 'sunny';
}

/** Compact weather summary — answers "can I go to mandi?" */
export function WeatherChip({ mode }: { mode?: WeatherCondition }) {
  const t = useTranslations('home.weather');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE}/api/weather?city=Nashik`)
      .then((r) => {
        if (!r.ok) throw new Error('weather fetch failed');
        return r.json();
      })
      .then((data: WeatherData) => {
        if (alive) setWeather(data);
      })
      .catch(() => {
        if (alive) setWeather(null);
      });
    return () => { alive = false; };
  }, []);

  const condition = mode ?? (weather ? mapCondition(weather.condition) : 'sunny');
  const icon = conditionIcon[condition];
  const tempText = weather ? `${weather.temp}°C` : '29°C';
  const label = t(conditionKey[condition]);

  return (
    <div className="flex items-center gap-3 px-space-md py-2.5 rounded-xl bg-surface-container-low">
      <span className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
        {icon}
      </span>
      <span className="font-label-md text-label-md text-on-surface-variant">
        {tempText} · {label}
      </span>
      <Wind className="w-4 h-4 text-on-surface-variant hidden sm:block" />
    </div>
  );
}
