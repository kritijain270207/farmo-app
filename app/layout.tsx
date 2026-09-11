import type { ReactNode } from 'react';
import {
  Outfit,
  Tiro_Devanagari_Hindi,
  Tiro_Devanagari_Marathi,
  Noto_Sans_Bengali,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Noto_Sans_Kannada,
  Noto_Sans_Gujarati,
  Noto_Sans_Oriya,
} from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const tiroHi = Tiro_Devanagari_Hindi({
  subsets: ['devanagari'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-tiro-hi',
  display: 'swap',
});

const tiroMr = Tiro_Devanagari_Marathi({
  subsets: ['devanagari'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-tiro-mr',
  display: 'swap',
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-noto-bengali',
  display: 'swap',
});
const notoTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  variable: '--font-noto-tamil',
  display: 'swap',
});
const notoTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  variable: '--font-noto-telugu',
  display: 'swap',
});
const notoKannada = Noto_Sans_Kannada({
  subsets: ['kannada'],
  variable: '--font-noto-kannada',
  display: 'swap',
});
const notoGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  variable: '--font-noto-gujarati',
  display: 'swap',
});
const notoOdia = Noto_Sans_Oriya({
  subsets: ['oriya'],
  variable: '--font-noto-odia',
  display: 'swap',
});

const fonts = [
  outfit,
  tiroHi,
  tiroMr,
  notoBengali,
  notoTamil,
  notoTelugu,
  notoKannada,
  notoGujarati,
  notoOdia,
];

export const metadata = {
  title: 'Farmo — किसानों का ब्रह्मास्त्र',
  description:
    'A Brahmastra for Farmers. Real-time mandi intelligence, AI voice assistant, and direct buyer connections for Indian farmers.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={fonts.map((f) => f.variable).join(' ')}>{children}</body>
    </html>
  );
}