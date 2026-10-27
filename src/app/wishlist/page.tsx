import React from 'react';
import { WishlistPage } from '../../views/WishlistPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Wishlist | Misty Bliss',
  description: 'Saved pieces for your home curation and interior inspiration.',
};

export default function Wishlist() {
  return <WishlistPage />;
}
