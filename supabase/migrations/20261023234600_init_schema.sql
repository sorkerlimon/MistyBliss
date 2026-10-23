-- Misty Bliss ecommerce schema and seed data.

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

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'footer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Public write products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public write products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read orders" ON public.orders;
DROP POLICY IF EXISTS "Public write orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public write orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read promos" ON public.promo_codes;
DROP POLICY IF EXISTS "Public write promos" ON public.promo_codes;
CREATE POLICY "Public read promos" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Public write promos" ON public.promo_codes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Public write newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public read newsletter" ON public.newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Public write newsletter" ON public.newsletter_subscribers FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.products (id, slug, name, description, price, compare_at_price, category_slug, collection_slugs, images, material, colors, dimensions, stock_status, is_new, is_bestseller, is_featured, rating, review_count, care_instructions, room_types)
VALUES
  ('mb-001', 'earthen-terracotta-vessel', 'Earthen Terracotta Vessel', 'Hand-thrown raw terracotta vase featuring subtle mineral glaze accents. Designed for dried florals or architectural display.', 148.00, 185.00, 'vases-vessels', '["living-room", "dining"]'::jsonb, '["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80"]'::jsonb, 'Raw Terracotta & Mineral Slip', '[{"name": "Warm Ochre", "hex": "#C87D55"}]'::jsonb, 'H 28cm × Dia 18cm', 'in_stock', true, true, true, 4.9, 18, 'Dust with dry microfiber cloth. Interior is unglazed; use dry florals only.', '["living-room", "dining"]'),
  ('mb-002', 'fluted-alabaster-pendant', 'Fluted Alabaster Pendant Lamp', 'Carved solid Spanish alabaster with brushed unlacquered brass hardware. Emits a soft, meditative warm glow with unique natural veining.', 380.00, 420.00, 'lighting-glow', '["living-room", "bedroom"]'::jsonb, '["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80"]'::jsonb, 'Solid Alabaster & Brushed Brass', '[{"name": "Cream Alabaster", "hex": "#F4EFEA"}]'::jsonb, 'Dia 24cm × H 18cm', 'in_stock', false, true, true, 5.0, 27, 'Wipe with soft cloth. Do not use chemical cleaners.', '["living-room", "bedroom"]'),
  ('mb-003', 'washed-belgian-linen-throw', 'Washed Belgian Linen Throw', 'Stone-washed 100% Belgian flax linen throw blanket with delicate eyelash fringe borders. Naturally thermo-regulating for year-round tactile comfort.', 165.00, null, 'textiles-linens', '["living-room", "bedroom"]'::jsonb, '["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80"]'::jsonb, '100% Belgian Flax Linen', '[{"name": "Muted Oat", "hex": "#D9CEBA"}]'::jsonb, '140cm × 200cm', 'in_stock', true, false, true, 4.8, 14, 'Machine wash gentle cycle cold. Tumble dry low or line dry.', '["living-room", "bedroom"]'),
  ('mb-004', 'honed-travertine-plinth', 'Honed Travertine Plinth Table', 'Sculptural monolithic side table carved from unfilled Italian travertine with softened eased edges and natural porous beauty.', 620.00, null, 'furniture-curations', '["living-room", "dining"]'::jsonb, '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"]'::jsonb, 'Italian Roman Travertine', '[{"name": "Warm Beige", "hex": "#D8C7B0"}]'::jsonb, 'W 35cm × D 35cm × H 45cm', 'in_stock', false, true, false, 4.9, 8, 'Seal periodically with stone sealant. Wipe spills immediately.', '["living-room"]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.promo_codes (id, code, discount_percent, min_spend, status, usage_count, expiry_date)
VALUES
  ('p-1', 'WELCOME15', 15, 50.00, 'active', 24, '2026-12-31'),
  ('p-2', 'SPRING20', 20, 100.00, 'active', 9, '2026-06-30'),
  ('p-3', 'VIP25', 25, 150.00, 'active', 5, '2026-09-30')
ON CONFLICT (id) DO NOTHING;

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
