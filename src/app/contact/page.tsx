import React from 'react';
import { ContactPage } from '../../views/ContactPage';
import type { Metadata } from 'next';
import { SITE_PHONE, SITE_URL } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Contact Misty Bliss | Home Decor WhatsApp Support Bangladesh',
  description: `Contact Misty Bliss for home decor orders, styling advice, and delivery in Bangladesh. WhatsApp ${SITE_PHONE} or message our online concierge.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function Contact() {
  return <ContactPage />;
}
