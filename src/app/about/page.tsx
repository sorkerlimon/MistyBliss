import React from 'react';
import { AboutPage } from '../../views/AboutPage';
import type { Metadata } from 'next';
import { SITE_URL } from '../../lib/site';

export const metadata: Metadata = {
  title: 'About Misty Bliss | Home Decor Brand in Bangladesh',
  description:
    'Learn about Misty Bliss — a home decor brand in Bangladesh offering luxury ceramics, lighting, wall decor, and stylish interior accessories for modern living spaces.',
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function About() {
  return <AboutPage />;
}
