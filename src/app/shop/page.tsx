import React from 'react';
import { ShopPage } from '../../views/ShopPage';
import type { Metadata } from 'next';
import { OG_IMAGE, SITE_URL } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Shop Home Decor Online in Bangladesh',
  description:
    'Browse and buy home decor online in Bangladesh — ceramics, vases, lighting, wall decor, cushions, candles, and luxury interior accessories at Misty Bliss.',
  alternates: { canonical: `${SITE_URL}/shop` },
  openGraph: {
    title: 'Shop Home Decor Online in Bangladesh | Misty Bliss',
    description:
      'Browse ceramics, lighting, wall decor, and luxury home decoration items. Order online with WhatsApp support.',
    url: `${SITE_URL}/shop`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Shop Misty Bliss Home Decor' }],
  },
};

export default function Shop() {
  return <ShopPage />;
}
