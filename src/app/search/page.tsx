import React from 'react';
import { SearchPage } from '../../views/SearchPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Home Décor | Misty Bliss',
  description: 'Search our artisanal ceramics, textiles, lighting, and botanical pieces.',
};

export default function Search() {
  return <SearchPage />;
}
