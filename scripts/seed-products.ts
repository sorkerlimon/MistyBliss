/**
 * Seed the full Misty Bliss catalog into Supabase.
 * Usage: npx tsx scripts/seed-products.ts
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PRODUCTS } from '../src/data/mockData';
import type { Product } from '../src/types';

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (!m) continue;
      const key = m[1].trim();
      let val = m[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* optional */
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

function toRow(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    compare_at_price: product.compareAtPrice ?? null,
    category_slug: product.categorySlug,
    collection_slugs: product.collectionSlugs,
    images: product.images,
    material: product.material,
    colors: product.colors,
    dimensions: product.dimensions,
    stock_status: product.stockStatus,
    is_new: Boolean(product.isNew),
    is_bestseller: Boolean(product.isBestseller),
    is_featured: Boolean(product.isFeatured),
    rating: product.rating,
    review_count: product.reviewCount,
    care_instructions: product.careInstructions,
    room_types: product.roomTypes,
    updated_at: new Date().toISOString(),
  };
}

async function main() {
  const supabase = createClient(url!, key!);
  const rows = PRODUCTS.map(toRow);
  console.log(`Upserting ${rows.length} products…`);

  const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Upsert failed:', error.message);
    process.exit(1);
  }

  const { count, error: countErr } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  if (countErr) {
    console.error('Count failed:', countErr.message);
    process.exit(1);
  }

  console.log(`Done. products table has ${count} rows.`);
}

main();
