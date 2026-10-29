import React from 'react';
import { HomePage } from '../views/HomePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Misty Bliss - Home Décor & Lifestyle',
  description:
    'Discover thoughtfully curated home décor, ceramics, botanical arrangements, lighting, and artisanal accessories.',
  openGraph: {
    title: 'Misty Bliss - Home Décor & Lifestyle',
    description:
      'Discover thoughtfully curated home décor, ceramics, botanical arrangements, lighting, and artisanal accessories.',
    images: [{ url: '/images/og-share.jpg', width: 1200, height: 630, alt: 'Misty Bliss' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og-share.jpg'],
  },
};

export default function Page() {
  return <HomePage />;
}
