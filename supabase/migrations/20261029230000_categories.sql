-- Categories table for admin-managed storefront categories

CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT NOT NULL,
  image_source TEXT NOT NULL DEFAULT 'url',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Public write categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public write categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.categories (id, slug, name, short_name, description, image, image_source, sort_order)
VALUES
  ('cat-vases-ceramics', 'vases-ceramics', 'Vases & Ceramics', 'Ceramics', 'Sculptural stoneware, terracotta vessels, and textured porcelain handcrafted for modern spaces.', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80', 'url', 1),
  ('cat-artificial-flowers', 'artificial-flowers', 'Artificial Flowers & Botanicals', 'Botanicals', 'Hyper-realistic faux florals, dried pampas, and sculptural eucalyptus that stay fresh year-round.', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80', 'url', 2),
  ('cat-lighting', 'lighting', 'Lighting', 'Lighting', 'Warm ambient glow through brushed brass pendants, pleated linen lamps, and stone table lights.', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80', 'url', 3),
  ('cat-wall-decor', 'wall-decor', 'Wall Art & Mirrors', 'Wall Décor', 'Arched organic mirrors, textured plaster canvases, and framed gallery prints.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80', 'url', 4),
  ('cat-cushions-textiles', 'cushions-textiles', 'Cushions & Textiles', 'Textiles', 'Heavy washed linen cushions, bouclé lumbar covers, and raw-fringe alpaca throws.', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80', 'url', 5),
  ('cat-candles-holders', 'candles-holders', 'Candles & Holders', 'Candles', 'Soy wax taper candles, travertine candelabras, and architectural concrete vessels.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80', 'url', 6),
  ('cat-planters', 'planters', 'Planters', 'Planters', 'Fluted stoneware pots, elevated pedestal planters, and fiberclay indoor garden vessels.', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80', 'url', 7),
  ('cat-decorative-trays', 'decorative-trays', 'Decorative Trays', 'Trays', 'Honed travertine catchalls, ribbed oak serving boards, and scalloped marble centerpieces.', 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=900&q=80', 'url', 8),
  ('cat-tabletop-accessories', 'tabletop-accessories', 'Tabletop Accessories', 'Tabletop', 'Textured stoneware coasters, hand-blown carafe sets, and organic brass napkin accents.', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80', 'url', 9),
  ('cat-decorative-objects', 'decorative-objects', 'Decorative Objects', 'Objects', 'Tactile marble knot sculptures, wooden pedestal beads, and cast brass bookends.', 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=900&q=80', 'url', 10),
  ('cat-home-fragrance', 'home-fragrance', 'Home Fragrance', 'Fragrance', 'Essential oil reed diffusers, ceramic incense holders, and botanical room mists.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80', 'url', 11),
  ('cat-gifts', 'gifts', 'Curated Gifts', 'Gifts', 'Thoughtful housewarming bundles, hostess gift sets, and artisan crafted keepsakes.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80', 'url', 12)
ON CONFLICT (id) DO NOTHING;
