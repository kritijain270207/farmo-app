import { defaultLocale, locales } from '../../middleware';

export { defaultLocale as defaultLocaleKey, locales } from '../../middleware';

export type Locale = (typeof locales)[number];

export const localeList: Locale[] = [...locales];

export const localeMeta: Record<string, { label: string; native: string; englishName: string }> = {
  hi: { label: 'हिंदी', native: 'हिंदी', englishName: 'Hindi' },
  mr: { label: 'मराठी', native: 'मराठी', englishName: 'Marathi' },
  te: { label: 'తెలుగు', native: 'తెలుగు', englishName: 'Telugu' },
  kn: { label: 'ಕನ್ನಡ', native: 'ಕನ್ನಡ', englishName: 'Kannada' },
  ta: { label: 'தமிழ்', native: 'தமிழ்', englishName: 'Tamil' },
  bn: { label: 'বাংলা', native: 'বাংলা', englishName: 'Bengali' },
  or: { label: 'ଓଡ଼ିଆ', native: 'ଓଡ଼ିଆ', englishName: 'Odia' },
  gu: { label: 'ગુજરાતી', native: 'ગુજરાતી', englishName: 'Gujarati' },
  as: { label: 'অসমীয়া', native: 'অসমীয়া', englishName: 'Assamese' },
  en: { label: 'English', native: 'English', englishName: 'English' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}