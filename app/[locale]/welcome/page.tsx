'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { Sprout } from 'lucide-react';
import { LanguageCard } from '@/components/farmer/LanguageCard';
import { localeMeta, type Locale } from '@/lib/i18n/config';
import { locales } from '@/lib/i18n/config';
import { localePath, delay } from '@/lib/utils';

/**
 * Screen 1: Welcome + Language.
 * Full-screen, warm, no header, no navigation.
 * "Do not require typing."
 */
export default function WelcomePage() {
  const router = useRouter();
  const currentLocale = useLocale();
  const [selected, setSelected] = useState<Locale>('hi');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setTouched(true);
  }, []);

  function playName(locale: Locale) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(localeMeta[locale].native);
    u.lang = locale === 'en' ? 'en-IN' : `${locale}-IN`;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }

  async function handleContinue() {
    // In a real app, persist locale. For demo, switch via middleware by navigating
    // to the locale-prefixed path. If locale is 'hi' (default), go to /login.
    await delay(150);
    router.push(localePath(selected, '/login'));
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-margin md:px-margin-tablet">
      <div className="w-full max-w-lg text-center animate-fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-lift">
            <Sprout className="w-8 h-8" />
          </span>
          <div className="text-left">
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary">Farmo</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {localeMeta[selected].native} · A Brahmastra for Farmers
            </p>
          </div>
        </div>

        <h2 className="font-headline-md text-headline-md font-bold text-primary mb-1">
          {selected === 'hi' ? 'अपनी भाषा चुनें' : 'Choose your language'}
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
          Tap to select · Tap 🔊 to hear
        </p>

        {/* Language grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-space-sm mb-space-xl">
          {locales.map((loc) => (
            <LanguageCard
              key={loc}
              nativeName={localeMeta[loc].native}
              selected={selected === loc}
              onSelect={() => {
                setSelected(loc);
                playName(loc);
              }}
              onListen={() => playName(loc)}
            />
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!touched}
          className="w-full h-14 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold hover:bg-primary-container shadow-md active:scale-[0.99] transition-all disabled:opacity-40"
        >
          {selected === 'hi' ? 'आगे बढ़ें' : 'Proceed'}
        </button>
      </div>
    </div>
  );
}