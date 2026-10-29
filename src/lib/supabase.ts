import { createClient } from '@supabase/supabase-js';
import {
  Product,
  Order,
  PromoCode,
  OrderStatus,
  Category,
  CategoryImageSource,
  RoomCollection,
  RoomType,
  BlogPost,
  NewsletterSubscriber,
} from '../types';

// Read Supabase credentials with priority cascade:
// 1. import.meta.env.NEXT_PUBLIC_SUPABASE_URL / VITE_SUPABASE_URL
// 2. process.env.NEXT_PUBLIC_SUPABASE_URL
// 3. Fallback user provided project credentials
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as unknown as { env: Record<string, string> }).env : undefined;
const procEnv = typeof process !== 'undefined' ? process.env : undefined;

export const SUPABASE_URL: string =
  metaEnv?.NEXT_PUBLIC_SUPABASE_URL ||
  metaEnv?.VITE_SUPABASE_URL ||
  procEnv?.NEXT_PUBLIC_SUPABASE_URL ||
  'https://vdoabvrhapptxvdkymlp.supabase.co';

export const SUPABASE_PUBLISHABLE_KEY: string =
  metaEnv?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  metaEnv?.VITE_SUPABASE_ANON_KEY ||
  procEnv?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_jH9XPLPz-q3jOIQLBxXPlA_6PBprcsf';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_URL.includes('supabase.co') &&
  SUPABASE_PUBLISHABLE_KEY &&
  SUPABASE_PUBLISHABLE_KEY.length > 10
);

// Create Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface ConnectionTestResult {
  connected: boolean;
  latencyMs?: number;
  message: string;
  error?: string;
  tablesStatus?: {
    products: boolean;
    orders: boolean;
    promo_codes: boolean;
    newsletter_subscribers: boolean;
    categories: boolean;
    rooms: boolean;
    blog_posts: boolean;
  };
}

/**
 * Test connectivity with Supabase project and check available tables
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  try {
    // 1. Check basic endpoint accessibility
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok && response.status !== 200 && response.status !== 404) {
      return {
        connected: false,
        latencyMs,
        message: `Supabase returned HTTP ${response.status}`,
        error: `Failed to authenticate with Supabase API. Check your publishable key.`,
      };
    }

    // 2. Probe tables to check if database schema has been deployed
    const [productsProbe, ordersProbe, promosProbe, subscribersProbe, categoriesProbe, roomsProbe, blogProbe] =
      await Promise.allSettled([
        supabase.from('products').select('id').limit(1),
        supabase.from('orders').select('id').limit(1),
        supabase.from('promo_codes').select('id').limit(1),
        supabase.from('newsletter_subscribers').select('id').limit(1),
        supabase.from('categories').select('id').limit(1),
        supabase.from('rooms').select('id').limit(1),
        supabase.from('blog_posts').select('id').limit(1),
      ]);

    const tablesStatus = {
      products: productsProbe.status === 'fulfilled' && !productsProbe.value.error,
      orders: ordersProbe.status === 'fulfilled' && !ordersProbe.value.error,
      promo_codes: promosProbe.status === 'fulfilled' && !promosProbe.value.error,
      newsletter_subscribers: subscribersProbe.status === 'fulfilled' && !subscribersProbe.value.error,
      categories: categoriesProbe.status === 'fulfilled' && !categoriesProbe.value.error,
      rooms: roomsProbe.status === 'fulfilled' && !roomsProbe.value.error,
      blog_posts: blogProbe.status === 'fulfilled' && !blogProbe.value.error,
    };

    const hasAnyTable = Object.values(tablesStatus).some(Boolean);

    return {
      connected: true,
      latencyMs,
      message: hasAnyTable
        ? 'Connected to Supabase project with active tables.'
        : 'Connected to Supabase project endpoint. Ready to create tables using the SQL schema.',
      tablesStatus,
    };
  } catch (err: any) {
    return {
      connected: false,
      latencyMs: Date.now() - startTime,
      message: 'Could not connect to Supabase.',
      error: err?.message || 'Network error connecting to Supabase URL',
    };
  }
}

function mapProductRow(item: any): Product {
  return {
    id: item.id,
    slug: item.slug || item.id,
    name: item.name,
    description: item.description || '',
    price: Number(item.price),
    purchasePrice: item.purchase_price != null ? Number(item.purchase_price) : undefined,
    compareAtPrice: item.compare_at_price ? Number(item.compare_at_price) : undefined,
    categorySlug: item.category_slug,
    collectionSlugs: item.collection_slugs || ['living-room'],
    images: Array.isArray(item.images) ? item.images : [item.image_url || ''],
    material: item.material || 'Artisanal Natural Material',
    colors: item.colors || [{ name: 'Natural', hex: '#EAE5DC' }],
    dimensions: item.dimensions || 'H 20cm × Dia 15cm',
    stockStatus: item.stock_status || 'in_stock',
    isNew: Boolean(item.is_new),
    isBestseller: Boolean(item.is_bestseller),
    isFeatured: Boolean(item.is_featured),
    rating: Number(item.rating || 4.9),
    reviewCount: Number(item.review_count || 12),
    careInstructions: item.care_instructions || 'Wipe with soft clean cloth.',
    roomTypes: item.room_types || ['living-room'],
  };
}

/**
 * Fetch products from Supabase 'products' table
 */
export async function fetchSupabaseProducts(): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }

    return data.map(mapProductRow);
  } catch (err) {
    console.warn('Supabase products fetch skipped:', err);
    return null;
  }
}

/**
 * Upsert a full product list into Supabase (catalog seed / sync).
 */
export async function upsertSupabaseProducts(products: Product[]): Promise<number> {
  if (!products.length) return 0;
  try {
    const payload = products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      purchase_price: product.purchasePrice ?? null,
      compare_at_price: product.compareAtPrice || null,
      category_slug: product.categorySlug,
      collection_slugs: product.collectionSlugs,
      images: product.images,
      material: product.material,
      colors: product.colors,
      dimensions: product.dimensions,
      stock_status: product.stockStatus,
      is_new: product.isNew,
      is_bestseller: product.isBestseller,
      is_featured: product.isFeatured,
      rating: product.rating,
      review_count: product.reviewCount,
      care_instructions: product.careInstructions,
      room_types: product.roomTypes,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase bulk upsert products error:', error.message);
      return 0;
    }
    return products.length;
  } catch (err) {
    console.warn('Supabase bulk upsert products failed:', err);
    return 0;
  }
}

/**
 * Ensure the products table holds the full catalog, then return DB products.
 * Seeds when empty or when the remote count is behind the provided catalog.
 */
export async function ensureSupabaseProductsCatalog(catalog: Product[]): Promise<Product[] | null> {
  try {
    const existing = await fetchSupabaseProducts();
    const remoteCount = existing?.length ?? 0;

    if (remoteCount < catalog.length) {
      await upsertSupabaseProducts(catalog);
      return (await fetchSupabaseProducts()) ?? existing;
    }

    return existing;
  } catch (err) {
    console.warn('ensureSupabaseProductsCatalog failed:', err);
    return null;
  }
}

/**
 * Insert or update product in Supabase
 */
export async function upsertSupabaseProduct(product: Product): Promise<boolean> {
  try {
    const payload = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      purchase_price: product.purchasePrice ?? null,
      compare_at_price: product.compareAtPrice || null,
      category_slug: product.categorySlug,
      collection_slugs: product.collectionSlugs,
      images: product.images,
      material: product.material,
      colors: product.colors,
      dimensions: product.dimensions,
      stock_status: product.stockStatus,
      is_new: product.isNew,
      is_bestseller: product.isBestseller,
      is_featured: product.isFeatured,
      rating: product.rating,
      review_count: product.reviewCount,
      care_instructions: product.careInstructions,
      room_types: product.roomTypes,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase upsertProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase upsertProduct failed:', err);
    return false;
  }
}

/**
 * Delete product in Supabase
 */
export async function deleteSupabaseProduct(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetch orders from Supabase 'orders' table
 */
export async function fetchSupabaseOrders(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((item: any) => ({
      id: item.id,
      date: item.date || new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: item.created_at_timestamp || (item.created_at ? new Date(item.created_at).getTime() : Date.now()),
      customerName: item.customer_name,
      customerEmail: item.customer_email,
      customerPhone: item.customer_phone || '',
      shippingAddress: item.shipping_address,
      items: item.items || [],
      subtotal: Number(item.subtotal || 0),
      discount: Number(item.discount || 0),
      shippingFee: Number(item.shipping_fee || 0),
      total: Number(item.total || 0),
      status: (item.status as OrderStatus) || 'pending',
      paymentMethod: item.payment_method || 'card',
      shippingSpeed: item.shipping_speed || 'standard',
      notes: item.notes || '',
    }));
  } catch {
    return null;
  }
}

/**
 * Save new order into Supabase
 */
export async function saveSupabaseOrder(order: Order): Promise<boolean> {
  try {
    const payload = {
      id: order.id,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      shipping_address: order.shippingAddress,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping_fee: order.shippingFee,
      total: order.total,
      status: order.status,
      payment_method: order.paymentMethod,
      shipping_speed: order.shippingSpeed,
      notes: order.notes || null,
      created_at_timestamp: order.createdAt,
      date: order.date,
    };

    const { error } = await supabase.from('orders').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase saveOrder error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase saveOrder failed:', err);
    return false;
  }
}

/**
 * Update order status in Supabase
 */
export async function updateSupabaseOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  try {
    const { error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Delete order from Supabase
 */
export async function deleteSupabaseOrder(orderId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetch rooms from Supabase
 */
export async function fetchSupabaseRooms(): Promise<RoomCollection[] | null> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data) return null;

    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug as RoomType,
      name: item.name,
      description: item.description || '',
      image: item.image || '',
    }));
  } catch {
    return null;
  }
}

/**
 * Upsert rooms into Supabase (seed / sync).
 */
export async function upsertSupabaseRooms(rooms: RoomCollection[]): Promise<number> {
  if (!rooms.length) return 0;
  try {
    const payload = rooms.map((room, index) => ({
      id: room.id,
      slug: room.slug,
      name: room.name,
      description: room.description || '',
      image: room.image,
      sort_order: index + 1,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('rooms').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase upsert rooms error:', error.message);
      return 0;
    }
    return rooms.length;
  } catch {
    return 0;
  }
}

/**
 * Ensure rooms table is seeded, then return DB rooms.
 */
export async function ensureSupabaseRoomsCatalog(catalog: RoomCollection[]): Promise<RoomCollection[] | null> {
  try {
    const existing = await fetchSupabaseRooms();
    const remoteCount = existing?.length ?? 0;
    if (remoteCount < catalog.length) {
      await upsertSupabaseRooms(catalog);
      return (await fetchSupabaseRooms()) ?? existing;
    }
    return existing;
  } catch {
    return null;
  }
}

function mapBlogRow(item: any): BlogPost {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    subtitle: item.subtitle || '',
    excerpt: item.excerpt || '',
    content: Array.isArray(item.content) ? item.content : [],
    category: item.category || 'Studio Craft',
    author: {
      name: item.author_name || 'Misty Bliss Studio',
      role: item.author_role || 'Editor',
      avatar:
        item.author_avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    publishedDate: item.published_date || '',
    readTime: item.read_time || '3 min read',
    coverImage: item.cover_image || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    featured: Boolean(item.featured),
    relatedProductSlugs: Array.isArray(item.related_product_slugs) ? item.related_product_slugs : [],
  };
}

/**
 * Fetch blog posts from Supabase
 */
export async function fetchSupabaseBlogPosts(): Promise<BlogPost[] | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data.map(mapBlogRow);
  } catch {
    return null;
  }
}

/**
 * Upsert blog post in Supabase
 */
export async function upsertSupabaseBlogPost(post: BlogPost): Promise<boolean> {
  try {
    const payload = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      subtitle: post.subtitle || '',
      excerpt: post.excerpt || '',
      content: post.content || [],
      category: post.category,
      author_name: post.author.name,
      author_role: post.author.role,
      author_avatar: post.author.avatar,
      published_date: post.publishedDate,
      read_time: post.readTime,
      cover_image: post.coverImage,
      tags: post.tags || [],
      featured: Boolean(post.featured),
      related_product_slugs: post.relatedProductSlugs || [],
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('blog_posts').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase upsertBlogPost error:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete blog post in Supabase
 */
export async function deleteSupabaseBlogPost(postId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Ensure blog posts table is seeded, then return DB posts.
 */
export async function ensureSupabaseBlogCatalog(catalog: BlogPost[]): Promise<BlogPost[] | null> {
  try {
    const existing = await fetchSupabaseBlogPosts();
    const remoteCount = existing?.length ?? 0;
    if (remoteCount < catalog.length) {
      for (const post of catalog) {
        await upsertSupabaseBlogPost(post);
      }
      return (await fetchSupabaseBlogPosts()) ?? existing;
    }
    return existing;
  } catch {
    return null;
  }
}

/**
 * Fetch categories from Supabase
 */
export async function fetchSupabaseCategories(): Promise<Category[] | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data) return null;

    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      shortName: item.short_name || item.name,
      description: item.description || '',
      image: item.image || '',
      imageSource: (item.image_source === 'file' ? 'file' : 'url') as CategoryImageSource,
    }));
  } catch {
    return null;
  }
}

/**
 * Upsert category in Supabase
 */
export async function upsertSupabaseCategory(category: Category, sortOrder = 0): Promise<boolean> {
  try {
    const payload = {
      id: category.id,
      slug: category.slug,
      name: category.name,
      short_name: category.shortName,
      description: category.description || '',
      image: category.image,
      image_source: category.imageSource || 'url',
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('categories').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase upsertCategory error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase upsertCategory failed:', err);
    return false;
  }
}

/**
 * Delete category in Supabase
 */
export async function deleteSupabaseCategory(categoryId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', categoryId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetch promo codes from Supabase
 */
export async function fetchSupabasePromoCodes(): Promise<PromoCode[] | null> {
  try {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((item: any) => ({
      id: item.id,
      code: item.code,
      discountPercent: Number(item.discount_percent),
      minSpend: item.min_spend ? Number(item.min_spend) : undefined,
      status: item.status,
      usageCount: Number(item.usage_count || 0),
      expiryDate: item.expiry_date,
    }));
  } catch {
    return null;
  }
}

/**
 * Upsert promo code in Supabase
 */
export async function upsertSupabasePromoCode(promo: PromoCode): Promise<boolean> {
  try {
    const payload = {
      id: promo.id,
      code: promo.code.toUpperCase(),
      discount_percent: promo.discountPercent,
      min_spend: promo.minSpend || null,
      status: promo.status,
      usage_count: promo.usageCount || 0,
      expiry_date: promo.expiryDate,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('promo_codes').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Record newsletter subscriber in Supabase
 */
export async function recordNewsletterSubscriber(email: string, source: string = 'footer'): Promise<boolean> {
  try {
    const { error } = await supabase.from('newsletter_subscribers').upsert(
      {
        email: email.trim().toLowerCase(),
        source,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );
    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetch newsletter subscribers (newest first)
 */
export async function fetchSupabaseNewsletterSubscribers(): Promise<NewsletterSubscriber[] | null> {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, source, created_at')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((item: any) => ({
      id: item.id,
      email: item.email,
      source: item.source || 'footer',
      createdAt: item.created_at
        ? new Date(item.created_at).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })
        : '',
    }));
  } catch {
    return null;
  }
}

/**
 * Delete a newsletter subscriber by id
 */
export async function deleteSupabaseNewsletterSubscriber(id: number | string): Promise<boolean> {
  try {
    const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Seed initial sample catalog and orders into Supabase
 */
export async function seedSupabaseInitialData(
  products: Product[],
  orders: Order[],
  promos: PromoCode[]
): Promise<{ success: boolean; productsCount: number; ordersCount: number; promosCount: number; error?: string }> {
  try {
    let pCount = 0;
    let oCount = 0;
    let prCount = 0;

    // Seed products
    for (const p of products) {
      const ok = await upsertSupabaseProduct(p);
      if (ok) pCount++;
    }

    // Seed orders
    for (const o of orders) {
      const ok = await saveSupabaseOrder(o);
      if (ok) oCount++;
    }

    // Seed promos
    for (const pr of promos) {
      const ok = await upsertSupabasePromoCode(pr);
      if (ok) prCount++;
    }

    return {
      success: pCount > 0 || oCount > 0 || prCount > 0,
      productsCount: pCount,
      ordersCount: oCount,
      promosCount: prCount,
    };
  } catch (err: any) {
    return {
      success: false,
      productsCount: 0,
      ordersCount: 0,
      promosCount: 0,
      error: err?.message || 'Failed to seed Supabase database',
    };
  }
}

/**
 * Ready-to-run PostgreSQL Schema for Supabase SQL Editor
 * Run directly in: https://supabase.com/dashboard/project/vdoabvrhapptxvdkymlp/sql/new
 */
export const SUPABASE_SQL_MIGRATION_SCHEMA = `-- ========================================================
-- MISTY BLISS ECOMMERCE — SUPABASE DATABASE SCHEMA & SEED
-- Project: https://supabase.com/dashboard/project/vdoabvrhapptxvdkymlp/sql/new
-- ========================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  category_slug TEXT NOT NULL,
  collection_slugs JSONB DEFAULT '["living-room"]'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  material TEXT,
  colors JSONB DEFAULT '[]'::jsonb,
  dimensions TEXT,
  stock_status TEXT DEFAULT 'in_stock',
  is_new BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  rating NUMERIC(3, 2) DEFAULT 4.9,
  review_count INTEGER DEFAULT 12,
  care_instructions TEXT,
  room_types JSONB DEFAULT '["living-room"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_at_timestamp BIGINT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT 'card',
  shipping_speed TEXT DEFAULT 'standard',
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Promo Codes Table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  min_spend NUMERIC(10, 2),
  status TEXT NOT NULL DEFAULT 'active',
  usage_count INTEGER DEFAULT 0,
  expiry_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'footer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 6. Safe Idempotent Policies
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Public write products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public write products" ON public.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read orders" ON public.orders;
DROP POLICY IF EXISTS "Public write orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public write orders" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read promos" ON public.promo_codes;
DROP POLICY IF EXISTS "Public write promos" ON public.promo_codes;
CREATE POLICY "Public read promos" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Public write promos" ON public.promo_codes FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Public write newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public read newsletter" ON public.newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Public write newsletter" ON public.newsletter_subscribers FOR ALL USING (true);

-- 7. Seed Initial Dummy Products
INSERT INTO public.products (id, slug, name, description, price, compare_at_price, category_slug, collection_slugs, images, material, colors, dimensions, stock_status, is_new, is_bestseller, is_featured, rating, review_count, care_instructions, room_types)
VALUES
  ('mb-001', 'earthen-terracotta-vessel', 'Earthen Terracotta Vessel', 'Hand-thrown raw terracotta vase featuring subtle mineral glaze accents. Designed for dried florals or architectural display.', 148.00, 185.00, 'vases-vessels', '["living-room", "dining"]'::jsonb, '["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80"]'::jsonb, 'Raw Terracotta & Mineral Slip', '[{"name": "Warm Ochre", "hex": "#C87D55"}]'::jsonb, 'H 28cm × Dia 18cm', 'in_stock', true, true, true, 4.9, 18, 'Dust with dry microfiber cloth. Interior is unglazed; use dry florals only.', '["living-room", "dining"]'),
  ('mb-002', 'fluted-alabaster-pendant', 'Fluted Alabaster Pendant Lamp', 'Carved solid Spanish alabaster with brushed unlacquered brass hardware. Emits a soft, meditative warm glow with unique natural veining.', 380.00, 420.00, 'lighting-glow', '["living-room", "bedroom"]'::jsonb, '["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80"]'::jsonb, 'Solid Alabaster & Brushed Brass', '[{"name": "Cream Alabaster", "hex": "#F4EFEA"}]'::jsonb, 'Dia 24cm × H 18cm', 'in_stock', false, true, true, 5.0, 27, 'Wipe with soft cloth. Do not use chemical cleaners.', '["living-room", "bedroom"]'),
  ('mb-003', 'washed-belgian-linen-throw', 'Washed Belgian Linen Throw', 'Stone-washed 100% Belgian flax linen throw blanket with delicate eyelash fringe borders. Naturally thermo-regulating for year-round tactile comfort.', 165.00, null, 'textiles-linens', '["living-room", "bedroom"]'::jsonb, '["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80"]'::jsonb, '100% Belgian Flax Linen', '[{"name": "Muted Oat", "hex": "#D9CEBA"}]'::jsonb, '140cm × 200cm', 'in_stock', true, false, true, 4.8, 14, 'Machine wash gentle cycle cold. Tumble dry low or line dry.', '["living-room", "bedroom"]'),
  ('mb-004', 'honed-travertine-plinth', 'Honed Travertine Plinth Table', 'Sculptural monolithic side table carved from unfilled Italian travertine with softened eased edges and natural porous beauty.', 620.00, null, 'furniture-curations', '["living-room", "dining"]'::jsonb, '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"]'::jsonb, 'Italian Roman Travertine', '[{"name": "Warm Beige", "hex": "#D8C7B0"}]'::jsonb, 'W 35cm × D 35cm × H 45cm', 'in_stock', false, true, false, 4.9, 8, 'Seal periodically with stone sealant. Wipe spills immediately.', '["living-room"]')
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Initial Dummy Promo Codes
INSERT INTO public.promo_codes (id, code, discount_percent, min_spend, status, usage_count, expiry_date)
VALUES
  ('p-1', 'WELCOME15', 15, 50.00, 'active', 24, '2026-12-31'),
  ('p-2', 'SPRING20', 20, 100.00, 'active', 9, '2026-06-30'),
  ('p-3', 'VIP25', 25, 150.00, 'active', 5, '2026-09-30')
ON CONFLICT (id) DO NOTHING;

-- 9. Seed Initial Dummy Order
INSERT INTO public.orders (id, date, created_at, customer_name, customer_email, customer_phone, shipping_address, items, subtotal, discount, shipping_fee, total, status, payment_method, shipping_speed, notes)
VALUES
  (
    'ORD-7821',
    'Oct 22, 2026',
    NOW(),
    'Camilla Vance',
    'camilla.vance@example.com',
    '+1 (503) 882-9011',
    '742 Evergreen Terrace, Portland, OR 97201',
    '[{"productId": "mb-001", "name": "Earthen Terracotta Vessel", "price": 148.00, "quantity": 1, "selectedColor": "Warm Ochre", "image": "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80"}]'::jsonb,
    148.00,
    0.00,
    0.00,
    148.00,
    'processing',
    'card',
    'standard',
    'Customer requested fragile package marking.'
  )
ON CONFLICT (id) DO NOTHING;
`;

