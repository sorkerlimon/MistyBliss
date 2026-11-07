-- Shop settings: delivery zones + tax (single-row config)

CREATE TABLE IF NOT EXISTS public.shop_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  delivery_enabled BOOLEAN NOT NULL DEFAULT true,
  delivery_zones JSONB NOT NULL DEFAULT '[]'::jsonb,
  tax_enabled BOOLEAN NOT NULL DEFAULT false,
  tax_percent NUMERIC(6, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read shop_settings" ON public.shop_settings;
DROP POLICY IF EXISTS "Public write shop_settings" ON public.shop_settings;
CREATE POLICY "Public read shop_settings" ON public.shop_settings FOR SELECT USING (true);
CREATE POLICY "Public write shop_settings" ON public.shop_settings FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.shop_settings (id, delivery_enabled, delivery_zones, tax_enabled, tax_percent)
VALUES (
  'default',
  true,
  '[
    {"id":"zone-dhaka-city","name":"Dhaka City","fee":85,"active":true},
    {"id":"zone-outside-dhaka","name":"Outside Dhaka","fee":180,"active":true}
  ]'::jsonb,
  false,
  5
)
ON CONFLICT (id) DO NOTHING;
