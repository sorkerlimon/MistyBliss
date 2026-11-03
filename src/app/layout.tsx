import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Bengali, Plus_Jakarta_Sans } from 'next/font/google';
import React from 'react';
import '../index.css';
import { AppProviders } from '../components/providers/AppProviders';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  LOGO_IMAGE,
  OG_IMAGE,
  PRIMARY_KEYWORDS,
  SITE_EMAIL,
  SITE_ADDRESS,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
} from '../lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['500', '600', '700'],
  variable: '--font-noto-bengali',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...PRIMARY_KEYWORDS],
  authors: [{ name: `${SITE_NAME} Studio`, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Home & Living',
  applicationName: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    alternateLocale: ['en_US'],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Misty Bliss – Luxury Home Decor Bangladesh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
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
      { url: LOGO_IMAGE, type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  other: {
    'geo.region': 'BD',
    'geo.placename': 'Bangladesh',
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
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${LOGO_IMAGE}`,
    image: `${SITE_URL}${OG_IMAGE}`,
    email: SITE_EMAIL,
    telephone: SITE_PHONE,
    sameAs: [`https://wa.me/${SITE_PHONE.replace(/\D/g, '')}`],
  };

  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    '@id': `${SITE_URL}/#store`,
    name: SITE_NAME,
    alternateName: 'Misty Bliss Home Decor',
    url: SITE_URL,
    logo: `${SITE_URL}${LOGO_IMAGE}`,
    image: `${SITE_URL}${OG_IMAGE}`,
    description: DEFAULT_DESCRIPTION,
    priceRange: '৳৳',
    currenciesAccepted: 'BDT',
    paymentAccepted: 'Cash, bKash, Nagad, Credit Card, Bank Transfer',
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    areaServed: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_ADDRESS,
      addressLocality: 'Dhaka',
      addressCountry: 'BD',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_PHONE,
      contactType: 'customer service',
      availableLanguage: ['English', 'Bengali'],
      areaServed: 'BD',
    },
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
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
    name: SITE_NAME,
    description: 'Buy luxury home decor online in Bangladesh',
    inLanguage: 'en-BD',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where can I buy home decor online in Bangladesh?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Misty Bliss is an online home decor store in Bangladesh offering ceramics, vases, lighting, wall decor, cushions, candles, and stylish interior accessories. Shop at mistybliss.online or message us on WhatsApp for quick ordering help.',
        },
      },
      {
        '@type': 'Question',
        name: 'What home decoration items does Misty Bliss sell?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We sell luxury home decor including stoneware ceramics, vases, artificial flowers, lighting, wall art, cushions, candles, planters, decorative trays, and curated gift sets.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I order from Misty Bliss?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Browse products on mistybliss.online and contact us on WhatsApp at ${SITE_PHONE} for order confirmation, pricing, and delivery support anywhere in Bangladesh.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Does Misty Bliss deliver home decor across Bangladesh?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Misty Bliss delivers home decor items across Bangladesh. Contact our WhatsApp concierge for delivery timelines and charges to your city.',
        },
      },
    ],
  };

  return (
    <html
      lang="en-BD"
      className={`scroll-smooth ${inter.variable} ${plusJakarta.variable} ${notoBengali.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
