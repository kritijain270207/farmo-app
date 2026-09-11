'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { ArrowLeft, Phone } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { OtpInput } from '@/components/ui/OtpInput';
import { localePath, delay } from '@/lib/utils';

/**
 * Screen 2: Phone Login + OTP.
 * Very simple — one large field, one large button.
 * Auto OTP detection simulated via devOtp hint.
 */
export default function LoginPage() {
  const t = useTranslations('login');
  const locale = useLocale();
  const router = useRouter();
  const { status, phone, devOtp, sendOtp, verifyOtp } = useAuthStore();

  const [phoneInput, setPhoneInput] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const stage: 'phone' | 'otp' = status === 'otp-sent' ? 'otp' : 'phone';

  async function handleSendOtp() {
    const clean = phoneInput.replace(/\D/g, '');
    if (clean.length !== 10) {
      setError('कृपया 10 अंक का मोबाइल नंबर दर्ज करें');
      return;
    }
    setError('');
    setLoading(true);
    await sendOtp(clean);
    setLoading(false);
  }

  async function handleVerifyOtp() {
    setError('');
    setLoading(true);
    const ok = await verifyOtp(otp);
    setLoading(false);
    if (ok) {
      router.push(localePath(locale, '/setup'));
    } else {
      setError('OTP गलत है, फिर से दर्ज करें');
      setOtp('');
    }
  }

  async function handleAutoFill() {
    if (devOtp) {
      setOtp(devOtp);
      await delay(200);
      handleVerifyOtp();
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-margin">
      <div className="w-full max-w-md animate-fade-up">
        {stage === 'phone' ? (
          <>
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary text-center mb-1">
              {t('title')}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-6">
              {t('demoHint')}
            </p>

            <div className="relative mb-space-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline-sm font-bold text-primary">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                autoFocus
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                className="w-full h-16 pl-16 pr-4 font-headline-md text-headline-md border-2 border-outline-variant rounded-lg bg-surface-container-lowest tabular focus:border-primary focus:ring-4 focus:ring-secondary-fixed-dim"
                placeholder="1234567890"
                aria-label={t('phonePlaceholder')}
              />
            </div>

            {error && <p className="font-label-sm text-label-sm text-error mb-2">{error}</p>}

            <button
              onClick={handleSendOtp}
              disabled={loading || phoneInput.replace(/\D/g, '').length < 10}
              className="w-full h-14 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md active:scale-[0.99] transition-all disabled:opacity-40"
            >
              {loading ? '…' : t('sendOtp')}
            </button>

            <button
              onClick={() => router.push(localePath(locale, '/welcome'))}
              className="mt-4 flex items-center gap-2 mx-auto font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </>
        ) : (
          <>
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary text-center mb-1">
              {t('otpTitle')}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-6">
              {t('otpHint', { phone })}
            </p>

            <OtpInput value={otp} onChange={setOtp} autoFocus />

            {error && (
              <p className="font-label-sm text-label-sm text-error mt-2 text-center">{error}</p>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 6}
              className="w-full h-14 mt-space-md rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md active:scale-[0.99] transition-all disabled:opacity-40"
            >
              {loading ? '…' : t('verify')}
            </button>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleAutoFill}
                className="font-label-md text-label-md font-bold text-secondary underline"
              >
                {t('fillDemo')}
              </button>
              <button
                onClick={async () => {
                  setOtp('');
                  setError('');
                  await handleSendOtp();
                }}
                className="font-label-md text-label-md text-primary underline"
              >
                {t('resend')}
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4 justify-center text-on-surface-variant">
              <Phone className="w-4 h-4" />
              <span className="font-body-sm text-body-sm">{phone}</span>
              <button
                onClick={() => {
                  useAuthStore.setState({ status: 'unauthenticated', phone: null });
                  setPhoneInput('');
                }}
                className="font-label-sm text-label-sm underline text-primary"
              >
                Change
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}