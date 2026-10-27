import React from 'react';
import { ShopPage } from '../../../views/ShopPage';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formatted = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  return {
    title: `${formatted} Collection | Misty Bliss`,
    description: `Explore handcrafted ${formatted} décor, statement ceramics, and intentional accessories at Misty Bliss.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return <ShopPage initialCategory={slug} />;
}
