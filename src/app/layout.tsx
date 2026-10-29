import type { Metadata, Viewport } from 'next';
import React from 'react';
import '../index.css';
import { AppProviders } from '../components/providers/AppProviders';

export const metadata: Metadata = {
  metadataBase: new URL('https://mistybliss.com'),
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
  authors: [{ name: 'Misty Bliss Studio', url: 'https://mistybliss.com' }],
  creator: 'Misty Bliss',
  publisher: 'Misty Bliss',
  category: 'Home & Living',
  alternates: {
    canonical: 'https://mistybliss.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mistybliss.com',
    siteName: 'Misty Bliss',
    title: 'Misty Bliss – Artisanal Home Décor, Ceramics & Modern Living',
    description:
      'Discover thoughtfully curated artisanal home décor, hand-thrown stoneware ceramics, botanical arrangements, lighting, and tactile interior accents.',
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
    title: 'Misty Bliss – Artisanal Home Décor, Ceramics & Modern Living',
    description:
      'Discover thoughtfully curated artisanal home décor, hand-thrown stoneware ceramics, botanical arrangements, lighting, and tactile interior accents.',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    ],
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
  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    '@id': 'https://mistybliss.com/#store',
    name: 'Misty Bliss',
    alternateName: 'Misty Bliss Studio',
    url: 'https://mistybliss.com',
    logo: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    description:
      'Artisanal home décor studio specializing in hand-thrown stoneware vases, botanical arrangements, travertine lighting, and minimalist tactile living pieces.',
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Credit Card, PayPal, Apple Pay, Google Pay',
    telephone: '+1-503-555-0192',
    email: 'concierge@mistybliss.com',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-503-555-0192',
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://mistybliss.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://mistybliss.com/#website',
    url: 'https://mistybliss.com',
    name: 'Misty Bliss',
    description: 'Artisanal Home Décor, Ceramics & Modern Living',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://mistybliss.com/search?q={search_term_string}',
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
