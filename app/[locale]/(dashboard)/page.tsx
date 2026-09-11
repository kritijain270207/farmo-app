'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Mic, BarChart3, Users, Bell, Volume2, Plus } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { useFarmerStore } from '@/lib/stores/farmer';
import { useUiStore } from '@/lib/stores/ui';
import { marketService } from '@/lib/services';
import { localePath } from '@/lib/utils';
import { PageContainer } from '@/components/layout/PageContainer';
import { WeatherChip } from '@/components/farmer/WeatherChip';
import { RecommendationCard } from '@/components/market/RecommendationCard';
import { StatusBadge } from '@/components/market/StatusBadge';
import { SimplePriceChart } from '@/components/market/SimplePriceChart';
import { LoadingState } from '@/components/ui/Feedback';
import { cropName } from '@/components/farmer/CropCard';
import type { CropId, SellDecision } from '@/types';

const QUICK_ACTIONS = [
  { key: 'askFarmo', href: '/saathi', icon: Mic, tone: 'bg-secondary-container text-on-secondary-container' },
  { key: 'checkMarkets', href: '/markets', icon: BarChart3, tone: 'bg-primary text-on-primary' },
  { key: 'findBuyers', href: '/buyers', icon: Users, tone: 'bg-surface-container-highest text-primary' },
  { key: 'alerts', href: '/notifications', icon: Bell, tone: 'bg-error-container text-on-error-container' },
] as const;

const TRACKED: { crop: CropId; decision: 'sell_now' | 'wait' | 'divert'; up: boolean }[] = [
  { crop: 'onion', decision: 'sell_now', up: true },
  { crop: 'wheat', decision: 'wait', up: false },
  { crop: 'soybean', decision: 'divert', up: false },
];

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const router = useRouter();
  const farmer = useAuthStore((s) => s.farmer);
  const status = useAuthStore((s) => s.status);
  const { name, mainCrop, quantity } = useFarmerStore();
  const setVoiceOpen = useUiStore((s) => s.setVoiceOpen);

  const [decision, setDecision] = useState<SellDecision | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') {
      router.replace(localePath(locale, '/welcome'));
      return;
    }
    let alive = true;
    marketService.getSellDecision(mainCrop, quantity).then((d) => {
      if (alive) setDecision(d);
    });
    return () => {
      alive = false;
    };
  }, [status, mainCrop, quantity, locale, router]);

  const decisionLabels = {
    sellNow: t('decision.sellNow'),
    wait: t('decision.wait'),
    divert: t('decision.divert'),
  };

  return (
    <PageContainer>
      {/* Greeting + weather */}
      <section className="pt-space-lg pb-space-md animate-fade-up">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile lg:text-headline-lg lg:leading-[38px] font-bold text-primary tracking-tight">
              {t('greeting', { name: farmer?.name ?? name })}
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-tertiary-container" />
              {t('accountId')}: {farmer?.accountId ?? 'MH-NSK-88219'} · {farmer?.village ?? 'नासिक'}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <WeatherChip mode="sunny" />
        </div>
      </section>

      {/* Voice hero */}
      <section className="my-space-sm animate-fade-up">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary-container via-primary to-primary-container p-space-lg text-on-primary shadow-md">
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-space-lg">
            <button
              onClick={() => setVoiceOpen(true)}
              className="flex items-center gap-4 w-full md:w-auto"
            >
              <span className="relative shrink-0 w-20 h-20 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                <span className="absolute inset-0 rounded-full bg-secondary-container/40 animate-mic-pulse" />
                <span className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center shadow-inner">
                  <Mic className="w-8 h-8 text-on-secondary-fixed" />
                </span>
              </span>
              <span className="text-left">
                <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold leading-tight block">
                  {t('speak')}
                </span>
                <span className="font-body-sm text-body-sm text-on-primary-container block mt-1">
                  {t('tapToSpeak')}
                </span>
              </span>
            </button>

            <div className="hidden lg:flex flex-col items-end gap-2">
              <span className="font-label-sm text-label-sm text-on-primary-container font-semibold">
                {t('faqLabel')}:
              </span>
              {['faq1', 'faq2', 'faq3'].map((k) => (
                <span key={k} className="text-body-sm font-body-sm text-on-primary/90">
                  “{t(k)}”
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Brahmastra recommendation */}
      <section className="my-space-md">
        {decision ? (
          <RecommendationCard
            decision={decision}
            decisionTime="08:30 AM"
            onSellHow={() => router.push(localePath(locale, '/sell'))}
          />
        ) : (
          <LoadingState label={t('loading')} />
        )}
      </section>

      {/* Quick actions */}
      <section className="my-space-md">
        <div className="flex items-center justify-between mb-space-sm">
          <h2 className="font-headline-md text-headline-md font-bold text-primary">
            {t('quickTitle')}
          </h2>
          <span className="font-label-sm text-label-sm text-on-surface-variant">{t('quickSub')}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {QUICK_ACTIONS.map(({ key, href, icon: Icon, tone }) => {
            const IconEl = Icon;
            return (
              <button
                key={key}
                onClick={() => router.push(localePath(locale, href))}
                className="flex flex-col justify-between items-start p-space-lg rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-card min-h-[120px] tap-highlight text-left"
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-inner ${tone}`}>
                    <IconEl className="w-6 h-6" />
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-primary">{t(key)}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{t(`${key}Sub`)}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* My crops */}
      <section className="my-space-md">
        <div className="flex items-center justify-between mb-space-sm">
          <h2 className="font-headline-md text-headline-md font-bold text-primary">{t('myCrops')}</h2>
          <button
            onClick={() => setVoiceOpen(true)}
            className="font-label-lg text-label-lg font-bold text-secondary hover:underline flex items-center gap-1"
          >
            <Plus className="w-5 h-5" />
            {t('addCrop')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {TRACKED.map(({ crop, decision: dec, up }) => (
            <CropStatusCard
              key={crop}
              cropId={crop}
              decision={dec}
              up={up}
              decisionLabels={decisionLabels}
            />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

function CropStatusCard({
  cropId,
  decision: dec,
  up,
  decisionLabels,
}: {
  cropId: CropId;
  decision: 'sell_now' | 'wait' | 'divert';
  up: boolean;
  decisionLabels: { sellNow: string; wait: string; divert: string };
}) {
  const t = useTranslations('home');
  const locale = useLocale();
  const { price, data, adviceKey } = useCropData(cropId);

  return (
    <div className="bg-surface-container-lowest rounded-lg p-space-md border border-outline-variant shadow-card relative overflow-hidden">
      <span
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          dec === 'sell_now' ? 'bg-tertiary-container' : dec === 'wait' ? 'bg-secondary-container' : 'bg-error'
        }`}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl" role="img">
            {cropIcon(cropId)}
          </span>
          <div>
            <h4 className="font-headline-sm text-headline-sm font-bold text-primary">{cropName(cropId, locale)}</h4>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {t('stock')}: {stock(cropId)} {t('qtyUnit')}
            </span>
          </div>
        </div>
        <button
          aria-label={t('listen')}
          onClick={() => playLine(`${cropName(cropId, locale)}, ${adviceKey}`)}
          className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-end justify-between mt-3">
        <div>
          <span className="font-price-hero-mobile text-price-hero-mobile font-bold text-primary">{price}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">/Qtl</span>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold ${
            up ? 'bg-price-up-bg text-price-up' : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          {up ? '↑' : '→'} {changeFor(cropId)}
        </span>
      </div>

      <div className="my-3">
        <SimplePriceChart points={data} up={up} />
      </div>

      <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low mb-3">
        <span className="font-label-sm text-label-sm text-on-surface-variant">{t('advice')}:</span>
        <StatusBadge decision={dec} labels={decisionLabels} />
      </div>
      <button className="w-full py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold">
        {dec === 'sell_now' ? `${t('bookAt')} ${dec === 'sell_now' ? 'Lasalgaon' : ''}`.trim() : t('viewDetails')}
      </button>
    </div>
  );
}

function useCropData(cropId: CropId) {
  const [price, setPrice] = useState('₹—');
  const [data, setData] = useState<{ day: string; value: number }[]>([]);
  const adviceKey = cropId;

  useEffect(() => {
    let alive = true;
    marketService.getPriceTrend(cropId).then((points) => {
      if (!alive) return;
      setData(points);
      const last = points[points.length - 1]?.value;
      if (last) setPrice(`₹${last.toLocaleString('en-IN')}`);
    });
    return () => {
      alive = false;
    };
  }, [cropId]);

  return { price, data, adviceKey };
}

function cropIcon(cropId: CropId) {
  const map: Record<CropId, string> = {
    onion: '🧅',
    wheat: '🌾',
    soybean: '🌱',
    chili: '🌶️',
    tomato: '🍅',
    peanut: '🥜',
    cotton: '☁️',
    rice: '🍚',
  };
  return map[cropId];
}

function stock(cropId: CropId) {
  return cropId === 'onion' ? 40 : cropId === 'wheat' ? 80 : 25;
}

function changeFor(cropId: CropId) {
  return cropId === 'onion' ? '₹120' : cropId === 'wheat' ? 'स्थिर' : '₹50';
}

function playLine(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'hi-IN';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }
}