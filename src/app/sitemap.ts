import { MetadataRoute } from 'next';
import { fetchSupabaseProducts, fetchSupabaseCategories, ensureSupabaseRoomsCatalog } from '../lib/supabase';
import { CATEGORIES, ROOMS } from '../data/mockData';
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

  const dbCategories = await fetchSupabaseCategories();
  const categories = dbCategories && dbCategories.length > 0 ? dbCategories : CATEGORIES;
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/categories/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const dbRooms = await ensureSupabaseRoomsCatalog(ROOMS);
  const rooms = dbRooms && dbRooms.length > 0 ? dbRooms : ROOMS;
  const roomPages: MetadataRoute.Sitemap = rooms.map((room) => ({
    url: `${SITE_URL}/collections/${room.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const dbProducts = await fetchSupabaseProducts();
  const productPages: MetadataRoute.Sitemap = (dbProducts || []).map((prod) => ({
    url: `${SITE_URL}/products/${prod.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...roomPages, ...productPages];
}
