import type { Metadata, Viewport } from 'next';
import React from 'react';
import '../index.css';
import { AppProviders } from '../components/providers/AppProviders';

export const metadata: Metadata = {
  metadataBase: new URL('https://mistybliss.com'),
  title: {
    default: 'Misty Bliss - Home Décor & Lifestyle',
    template: '%s | Misty Bliss',
  },
  description:
    'Discover thoughtfully curated home décor, ceramics, botanical arrangements, lighting, and artisanal accessories.',
  keywords: [
    'home decor',
    'ceramics',
    'stoneware vases',
    'botanical arrangements',
    'artisanal lighting',
    'minimalist interior design',
    'Misty Bliss',
  ],
  authors: [{ name: 'Misty Bliss Studio' }],
  creator: 'Misty Bliss',
  publisher: 'Misty Bliss',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mistybliss.com',
    siteName: 'Misty Bliss',
    title: 'Misty Bliss - Home Décor & Lifestyle',
    description:
      'Discover thoughtfully curated home décor, ceramics, botanical arrangements, lighting, and artisanal accessories.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Misty Bliss Artisanal Home Décor & Lifestyle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Misty Bliss - Home Décor & Lifestyle',
    description:
      'Discover thoughtfully curated home décor, ceramics, botanical arrangements, lighting, and artisanal accessories.',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF8F5',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Misty Bliss',
    description:
      'Discover thoughtfully curated home décor, ceramics, botanical arrangements, lighting, and artisanal accessories.',
    url: 'https://mistybliss.com',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BD',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://mistybliss.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#FAF8F5] text-[#292522] min-h-screen antialiased selection:bg-[#F1E5E1] selection:text-[#292522]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
