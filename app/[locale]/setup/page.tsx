'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { useFarmerStore } from '@/lib/stores/farmer';
import { useAuthStore } from '@/lib/stores/auth';
import { CropGrid } from '@/components/farmer/CropCard';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { localePath } from '@/lib/utils';
import type { CropId } from '@/types';

/**
 * Screen 3: Basic Farmer Setup.
 * Keep onboarding extremely short — only what's needed for core recommendations.
 * Voice input: placeholder mic icon next to text fields.
 */
export default function SetupPage() {
  const t = useTranslations('setup');
  const locale = useLocale();
  const router = useRouter();
  const { name, village, mainCrop, quantity, setName, setVillage, setMainCrop, setQuantity, completeSetup } =
    useFarmerStore();
  const skipSetup = useAuthStore((s) => s.skipSetup);

  const [nameLocal, setNameLocal] = useState(name);
  const [villageLocal, setVillageLocal] = useState(`${village}·${useFarmerStore.getState().state}`);

  function handleFinish() {
    const cleanVillage = villageLocal.split('·')[0] || 'नासिक';
    setName(nameLocal);
    setVillage(cleanVillage);
    completeSetup();
    skipSetup({
      id: 'fm-88219',
      name: nameLocal,
      phone: '9876543210',
      village: cleanVillage,
      state: villageLocal.split('·')[1] || 'महाराष्ट्र',
      accountId: 'MH-NSK-88219',
      crops: [mainCrop],
      quantity,
    });
    router.push(localePath(locale, '/'));
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-margin">
      <div className="w-full max-w-md animate-fade-up pb-space-2xl">
        <button
          onClick={() => router.push(localePath(locale, '/login'))}
          className="flex items-center gap-2 mb-6 text-on-surface-variant hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-label-md text-label-md">Back</span>
        </button>

        <h1 className="font-headline-lg text-headline-lg font-bold text-primary mb-1">
          {t('title')}
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-lg">
          {t('subtitle')}
        </p>

        {/* Progress dots */}
        <div className="flex gap-2 mb-space-lg">
          {[1, 2, 3, 4].map((s, i) => (
            <span key={i} className={`h-2 flex-1 rounded-full ${i < 3 ? 'bg-primary' : 'bg-surface-container-high'}`} />
          ))}
        </div>

        <div className="space-y-space-lg">
          {/* Name */}
          <div>
            <label className="font-label-md text-label-md text-on-surface block mb-1.5">
              {t('title')} <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={nameLocal}
              onChange={(e) => setNameLocal(e.target.value)}
              className="w-full h-16 px-4 font-headline-sm text-headline-sm border-2 border-outline-variant rounded-lg bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-secondary-fixed-dim"
              placeholder={t('namePlaceholder')}
            />
          </div>

          {/* Village */}
          <div>
            <label className="font-label-md text-label-md text-on-surface block mb-1.5">
              {t('village')} <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={villageLocal}
              onChange={(e) => setVillageLocal(e.target.value)}
              className="w-full h-16 px-4 font-headline-sm text-headline-sm border-2 border-outline-variant rounded-lg bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-secondary-fixed-dim"
              placeholder={t('villagePlaceholder')}
            />
          </div>

          {/* Crop picker */}
          <div>
            <label className="font-label-md text-label-md text-on-surface block mb-1.5">
              {t('cropLabel')}
            </label>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">{t('cropHint')}</p>
            <CropGrid selected={mainCrop} onSelect={(id: CropId) => setMainCrop(id)} />
          </div>

          {/* Quantity */}
          <div>
            <label className="font-label-md text-label-md text-on-surface block mb-1.5">
              {t('qtyLabel')}
            </label>
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              label={t('qtyUnit')}
            />
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!nameLocal.trim()}
          className="w-full h-14 mt-space-xl rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md active:scale-[0.99] transition-all disabled:opacity-40"
        >
          {t('finish')}
        </button>
      </div>
    </div>
  );
}