import React from 'react';
import { ShippingReturnsPage } from '../../views/ShippingReturnsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Returns Policy | Misty Bliss',
  description: 'Careful packaging, worldwide delivery details, transit timelines, and seamless 30-day return policy.',
};

export default function ShippingReturns() {
  return <ShippingReturnsPage />;
}
