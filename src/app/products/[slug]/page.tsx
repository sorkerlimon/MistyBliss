import React from 'react';
import { ProductDetailsPage } from '../../../views/ProductDetailsPage';
import { PRODUCTS } from '../../../data/mockData';
import type { Metadata } from 'next';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Details | Misty Bliss',
      description: 'Artisanal home décor and curated lifestyle objects.',
    };
  }

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80';

  return {
    title: `${product.name} | Misty Bliss`,
    description: product.description,
    openGraph: {
      title: `${product.name} - $${product.price} | Misty Bliss`,
      description: product.description,
      images: [
        {
          url: primaryImage,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Misty Bliss`,
      description: product.description,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  return <ProductDetailsPage slug={slug} />;
}
