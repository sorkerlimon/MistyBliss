import React from 'react';
import { HomePage } from '../views/HomePage';
import type { Metadata } from 'next';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, OG_IMAGE, SITE_URL } from '../lib/site';

export const metadata: Metadata = {
  title: { absolute: DEFAULT_TITLE },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  keywords: [
    'home decor',
    'home decor Bangladesh',
    'buy home decor online',
    'luxury home decor',
    'online home decor shopping Bangladesh',
    'home decoration items',
    'Misty Bliss',
  ],
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Misty Bliss Home Decor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return <HomePage />;
}
