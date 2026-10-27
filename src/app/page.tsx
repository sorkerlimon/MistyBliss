import React from 'react';
import { HomePage } from '../views/HomePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Misty Bliss - Home Décor & Lifestyle',
  description:
    'Discover thoughtfully curated home décor, ceramics, botanical arrangements, lighting, and artisanal accessories.',
};

export default function Page() {
  return <HomePage />;
}
