-- Room collections for homepage / navigation

CREATE TABLE IF NOT EXISTS public.rooms (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read rooms" ON public.rooms;
DROP POLICY IF EXISTS "Public write rooms" ON public.rooms;
CREATE POLICY "Public read rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Public write rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.rooms (id, slug, name, description, image, sort_order)
VALUES
  ('room-living-room', 'living-room', 'Living Room', 'Create an inviting space for gatherings with tactile cushions, statement ceramics, and warm glow.', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80', 1),
  ('room-bedroom', 'bedroom', 'Bedroom', 'Restful sanctuaries composed of gentle muted linens, soothing scent diffusers, and soft lighting.', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80', 2),
  ('room-dining-room', 'dining-room', 'Dining Room', 'Table settings defined by artisanal stoneware, graceful candelabras, and botanical urns.', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80', 3),
  ('room-entryway', 'entryway', 'Entryway', 'Make a graceful first impression with architectural mirrors, key catchalls, and fresh greenery.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80', 4)
ON CONFLICT (id) DO NOTHING;
