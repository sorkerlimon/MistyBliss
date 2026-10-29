-- Internal purchase/cost price for admin (not shown on storefront)

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(10, 2);
