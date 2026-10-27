import React from 'react';
import { ShopPage } from '../../../views/ShopPage';
import type { Metadata } from 'next';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formatted = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  return {
    title: `${formatted} Edit | Misty Bliss`,
    description: `Discover our curated ${formatted} edit for modern, tactile home living.`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  return <ShopPage initialCollection={slug} />;
}
