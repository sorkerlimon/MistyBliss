import React from 'react';
import { CheckoutPage } from '../../views/CheckoutPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Misty Bliss',
  description: 'Complete your artisanal home décor order securely.',
};

export default function Checkout() {
  return <CheckoutPage />;
}
