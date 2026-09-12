import createMiddleware from 'next-intl/middleware';

export const locales = ['hi', 'mr', 'te', 'kn', 'ta', 'bn', 'or', 'gu', 'as', 'en'] as const;
export const defaultLocale = 'hi';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};