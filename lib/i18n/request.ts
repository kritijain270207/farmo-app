import { getRequestConfig } from 'next-intl/server';
import { isLocale } from './config';
import { defaultLocale } from '../../middleware';

export default getRequestConfig(async ({ requestLocale }) => {
  let requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : defaultLocale;

  // Lazy-load messages for the requested locale.
  const messages = (
    await import(`../../messages/${locale}.json`)
  ).default;

  return {
    locale,
    messages,
  };
});