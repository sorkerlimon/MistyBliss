import { MetadataRoute } from 'next';
import {
  fetchSupabaseProducts,
  fetchSupabaseCategories,
  fetchSupabaseRooms,
} from '../lib/supabase';
import { SITE_URL } from '../lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE_URL}/shipping-returns`, lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
  ];

  const dbCategories = (await fetchSupabaseCategories()) || [];
  const categoryPages: MetadataRoute.Sitemap = dbCategories.map((cat) => ({
    url: `${SITE_URL}/categories/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const dbRooms = (await fetchSupabaseRooms()) || [];
  const roomPages: MetadataRoute.Sitemap = dbRooms.map((room) => ({
    url: `${SITE_URL}/collections/${room.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const dbProducts = (await fetchSupabaseProducts()) || [];
  const productPages: MetadataRoute.Sitemap = dbProducts.map((prod) => ({
    url: `${SITE_URL}/products/${prod.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...roomPages, ...productPages];
}
