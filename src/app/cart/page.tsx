import React from 'react';
import { CartPage } from '../../views/CartPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Bag | Misty Bliss',
  description: 'Review your selected artisanal decor items and proceed to secure checkout.',
};

export default function Cart() {
  return <CartPage />;
}
