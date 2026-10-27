import React from 'react';
import { ShopPage } from '../../views/ShopPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Décor & Living | Misty Bliss',
  description:
    'Browse our curated collection of ceramics, botanical vessels, lighting, furniture accents, and decorative objects.',
};

export default function Shop() {
  return <ShopPage />;
}
