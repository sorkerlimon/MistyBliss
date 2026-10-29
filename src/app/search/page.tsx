import React from 'react';
import { SearchPage } from '../../views/SearchPage';
import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Search Home Decor Items Online | Misty Bliss Bangladesh',
  description:
    'Search Misty Bliss home decor — ceramics, vases, lighting, wall decor, cushions, candles, and interior accessories available online in Bangladesh.',
  alternates: {
    canonical: `${SITE_URL}/search`,
  },
  openGraph: {
    title: 'Search Home Decor Items Online | Misty Bliss Bangladesh',
    description:
      'Find ceramics, lighting, wall decor, and luxury home decoration items at Misty Bliss.',
    url: `${SITE_URL}/search`,
    type: 'website',
  },
};

export default function Search() {
  return <SearchPage />;
}
