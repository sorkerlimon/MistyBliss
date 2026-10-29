import type { Metadata, Viewport } from 'next';
import React from 'react';
import '../index.css';
import { AppProviders } from '../components/providers/AppProviders';

const SITE_URL = 'https://mistybliss.contact-dream-developers.workers.dev';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Misty Bliss – Artisanal Home Décor, Ceramics & Modern Living',
    template: '%s | Misty Bliss',
  },
  description:
    'Discover thoughtfully curated artisanal home décor, hand-thrown stoneware ceramics, botanical arrangements, lighting, and tactile interior accents crafted for modern living.',
  keywords: [
    'home decor',
    'ceramics',
    'stoneware vases',
    'botanical arrangements',
    'artisanal lighting',
    'travertine trays',
    'minimalist interior design',
    'Misty Bliss',
    'handcrafted pottery',
    'modern luxury home accessories',
  ],
  authors: [{ name: 'Misty Bliss Studio', url: SITE_URL }],
  creator: 'Misty Bliss',
  publisher: 'Misty Bliss',
  category: 'Home & Living',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Misty Bliss',
    title: 'Misty Bliss – Artisanal Home Décor, Ceramics & Modern Living',
    description:
      'Discover thoughtfully curated artisanal home décor, hand-thrown stoneware ceramics, botanical arrangements, lighting, and tactile interior accents.',
    images: [
      {
        url: '/images/og-share.jpg',
        width: 1200,
        height: 630,
        alt: 'Misty Bliss',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Misty Bliss – Artisanal Home Décor, Ceramics & Modern Living',
    description:
      'Discover thoughtfully curated artisanal home décor, hand-thrown stoneware ceramics, botanical arrangements, lighting, and tactile interior accents.',
    images: ['/images/og-share.jpg'],
    creator: '@mistybliss',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/misty-bliss-logo-circle.png', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
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
  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    '@id': `${SITE_URL}/#store`,
    name: 'Misty Bliss',
    alternateName: 'Misty Bliss Studio',
    url: SITE_URL,
    logo: `${SITE_URL}/images/misty-bliss-logo-circle.png`,
    image: `${SITE_URL}/images/og-share.jpg`,
    description:
      'Artisanal home décor studio specializing in hand-thrown stoneware vases, botanical arrangements, travertine lighting, and minimalist tactile living pieces.',
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Credit Card, PayPal, Apple Pay, Google Pay',
    telephone: '+8801571376061',
    email: 'concierge@mistybliss.com',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+8801571376061',
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Misty Bliss',
    description: 'Artisanal Home Décor, Ceramics & Modern Living',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // FAQ Schema: Heavily indexed and prioritized by AI Chatbots (ChatGPT Search, Perplexity, Gemini)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What materials are used in Misty Bliss ceramics and home décor?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Misty Bliss pieces are handcrafted using natural grogged stoneware clay, unglazed terracotta, Italian honed travertine, solid brass, and 100% Belgian washed linen. All ceramic vases feature water-tight interior glazes safe for fresh blooms.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the Misty Bliss shipping time and policy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We provide complimentary carbon-neutral shipping on all orders over $75. Orders are carefully packaged in plastic-free recyclable materials and dispatched within 1–2 business days, typically arriving within 2–4 business days.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the return policy for Misty Bliss products?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer a 30-day hassle-free return window on all items in original condition. Return shipping labels are provided upon request via our concierge.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I care for hand-thrown stoneware and travertine?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ceramics can be cleaned with a damp soft cloth and mild soap. Honed travertine pieces should be wiped dry immediately if exposed to liquids to preserve the natural matte stone surface.',
        },
      },
    ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="bg-[#FAF8F5] text-[#292522] min-h-screen antialiased selection:bg-[#F1E5E1] selection:text-[#292522]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
