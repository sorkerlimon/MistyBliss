-- Journal / blog posts for Misty Bliss homepage + admin

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  category TEXT NOT NULL DEFAULT 'Studio Craft',
  author_name TEXT NOT NULL DEFAULT 'Misty Bliss Studio',
  author_role TEXT DEFAULT 'Editor',
  author_avatar TEXT DEFAULT '',
  published_date TEXT NOT NULL,
  read_time TEXT DEFAULT '3 min read',
  cover_image TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  related_product_slugs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public write blog_posts" ON public.blog_posts;
CREATE POLICY "Public read blog_posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Public write blog_posts" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.blog_posts (
  id, slug, title, subtitle, excerpt, content, category,
  author_name, author_role, author_avatar, published_date, read_time,
  cover_image, tags, featured, related_product_slugs
) VALUES
(
  'post-1',
  'tactile-silence-raw-earth',
  'The Tactile Silence of Raw Earth: Inside our Cascadia Stoneware Kilns',
  'How grogged clay, open flame, and matte mineral washes ground our living spaces.',
  'Explore how hand-thrown clay and earthen vessels establish visual calm and tactile texture in modern living sanctuaries.',
  '["There is an unhurried cadence to working with unprocessed stoneware. Long before a vessel reaches the drying shelf, the potter must negotiate with the natural tension of grog—tiny fragments of pre-fired clay that impart grain, resistance, and permanence.","In our Bend studio, each vessel undergoes a slow 48-hour bisque firing followed by a high-temperature reduction soak. We deliberately leave the exterior wall unglazed, celebrating the raw iron flecks and natural ochre blush that only emerge in proximity to open kiln flame.","When brought into a modern home, these pieces do more than hold seasonal botanicals; they absorb ambient harshness, offering a grounding visual focal point that invites slow contemplation."]'::jsonb,
  'Studio Craft',
  'Elena Rostova',
  'Master Ceramist & Studio Lead',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'Oct 18, 2026',
  '4 min read',
  'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80',
  '["Ceramics","Slow Living","Stoneware","Craftsmanship"]'::jsonb,
  true,
  '["earthen-terracotta-vessel","ridged-ceramic-table-lamp"]'::jsonb
),
(
  'post-2',
  'styling-unfilled-travertine',
  'How to Style Honed Travertine & Embrace Organic Negative Space',
  'The porous elegance of Italian limestone and why architectural restraint matters.',
  'Honed travertine brings ancient geological history into contemporary minimalist rooms without feeling cold or austere.',
  '["Unlike polished marble with its reflective gloss, unfilled Roman travertine is defined by porous cavities and honeyed earthen striations. Its natural voids are not flaws—they are centuries of mineral springs etching their journey into stone.","To style a travertine plinth or catchall bowl, resist the temptation to crowd its surface. Allow at least forty percent of the stone face to remain completely bare.","Pairing stone with contrasting tactile textures—a single sprig of dried eucalyptus, a matte beeswax taper, or a woven Belgian linen throw—enhances the depth of each material exponentially."]'::jsonb,
  'Interior Styling',
  'Marcus Sterling',
  'Interior Architecture Stylist',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'Oct 12, 2026',
  '3 min read',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  '["Travertine","Styling","Minimalism","Sculptural Furniture"]'::jsonb,
  false,
  '["honed-travertine-plinth"]'::jsonb
),
(
  'post-3',
  'eternal-botanicals-foliage',
  'The Art of Eternal Botanicals: Bringing Foliage into Sunless Spaces',
  'From preserved meadow grasses to hand-assembled silk stems that defy seasons.',
  'Discover thoughtful curation tips for styling hyper-realistic botanical branches in bedrooms, bathrooms, and low-light hallways.',
  '["Low-light areas like entryways, guest suites, and shaded library nooks often make live plant maintenance stressful. Preserved botanicals and botanical silks offer a deliberate architectural alternative.","Our approach centers on botanical realism: subtle stem variations, delicate vein details, and natural asymmetry. We never recommend symmetrical groupings; instead, let stems arch naturally as they would toward autumn sunlight.","Pairing dark olive branches with our rough earthenware vases creates an instantaneous seasonal transition that requires zero watering or pruning."]'::jsonb,
  'Botanical Notes',
  'Aiko Tanaka',
  'Botanical Designer & Florist',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  'Oct 08, 2026',
  '5 min read',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
  '["Botanicals","Floral Styling","Preserved Stems","Home Wellness"]'::jsonb,
  false,
  '["earthen-terracotta-vessel"]'::jsonb
),
(
  'post-4',
  'woven-in-flanders-belgian-flax',
  'Woven in Flanders: The Thermo-Regulating Secrets of Pure Flax Linen',
  'Why stone-washed linen remains the ultimate tactile textile for all four seasons.',
  'From flax fields in Kortrijk to our finished throws and cushion covers, understand why Belgian linen only grows softer with every wash.',
  '["Flax is one of humanity’s oldest cultivated fibers, and European flax grown in the coastal climate of Flanders produces long, durable staple fibers that synthetic yarns simply cannot mimic.","Its hollow cellular structure naturally draws moisture away in warmer months while trapping body heat when the evening chill sets in.","Our stone-washing process tames the initial crispness of raw flax, leaving a billowy drape that wrinkles with effortless elegance on a sofa or linen-dressed bed."]'::jsonb,
  'Material Studies',
  'Claire Dupont',
  'Textile Curator',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'Sep 29, 2026',
  '4 min read',
  'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
  '["Belgian Linen","Textiles","Bedding","Sustainable Craft"]'::jsonb,
  false,
  '["washed-belgian-linen-throw"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
