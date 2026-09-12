import { defaultLocaleKey } from '@/lib/i18n/config';

/** Backend API base URL — configurable via NEXT_PUBLIC_API_URL env var. */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/** Build a locale-prefixed path, e.g. (hi, "/markets") -> "/markets", (te, "/markets") -> "/te/markets" */
export function localePath(locale: string, route: string): string {
  if (locale === defaultLocaleKey) return route;
  return `/${locale}${route === '/' ? '' : route}`;
}

/** Remove the locale prefix from a pathname ("/te/markets" -> "/markets") */
export function stripLocale(pathname: string): string {
  const seg = pathname.split('/')[1];
  if (seg && ['hi', 'mr', 'te', 'kn', 'ta', 'bn', 'or', 'gu', 'as', 'en'].includes(seg)) {
    return pathname.slice(seg.length + 1) || '/';
  }
  return pathname || '/';
}

/** Format ₹ amount with Indian digit grouping. */
export function currency(amount: number): string {
  return `₹${new Intl.NumberFormat('en-IN').format(Math.round(amount))}`;
}

/** Format a price per quintal token value. */
export function perQtl(amount: number): string {
  return `₹${new Intl.NumberFormat('en-IN').format(Math.round(amount))}/Qtl`;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function cls(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}