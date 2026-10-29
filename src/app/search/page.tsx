import React from 'react';
import { SearchPage } from '../../views/SearchPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Artisanal Home Décor & Ceramics | Misty Bliss',
  description:
    'Search our curated catalog of handcrafted stoneware vases, lifelike botanicals, travertine lighting, linen textiles, and thoughtful interior accents.',
  alternates: {
    canonical: 'https://mistybliss.com/search',
  },
  openGraph: {
    title: 'Search Artisanal Home Décor & Ceramics | Misty Bliss',
    description:
      'Search our curated catalog of handcrafted stoneware vases, lifelike botanicals, travertine lighting, and linen textiles.',
    url: 'https://mistybliss.com/search',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Artisanal Home Décor & Ceramics | Misty Bliss',
    description:
      'Search our curated catalog of handcrafted stoneware vases, lifelike botanicals, travertine lighting, and linen textiles.',
  },
};

export default function Search() {
  return <SearchPage />;
}
