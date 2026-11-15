-- Remove Journal / blog feature
DROP POLICY IF EXISTS "Public read blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public write blog_posts" ON public.blog_posts;
DROP TABLE IF EXISTS public.blog_posts;
