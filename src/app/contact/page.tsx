import React from 'react';
import { ContactPage } from '../../views/ContactPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Customer Concierge | Misty Bliss',
  description: 'Reach our studio concierge for product advice, sizing guidance, custom orders, or shipping assistance.',
};

export default function Contact() {
  return <ContactPage />;
}
