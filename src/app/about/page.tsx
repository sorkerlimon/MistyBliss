import React from 'react';
import { AboutPage } from '../../views/AboutPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story & Studio Philosophy | Misty Bliss',
  description: 'Learn about our passion for slow craftsmanship, raw textures, and mindful home sanctuaries.',
};

export default function About() {
  return <AboutPage />;
}
