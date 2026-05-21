/*
  # CMS public access for anon key (site + admin panel without Supabase session)

  The Next.js app uses the Supabase anon key in the browser. Row Level Security
  must allow anon to read published content and to insert/update/delete CMS rows
  when the admin UI runs without an authenticated Supabase user.

  Security note: Anyone with your anon key can mutate these tables if this policy
  is applied. Protect /admin at the edge (auth, IP allowlist, or disable bypass)
  and prefer authenticated policies in production.

  Requires tables: products, partners, portfolio_projects, messages, invoices
*/

-- ---------- PRODUCTS ----------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_products_select" ON public.products;
DROP POLICY IF EXISTS "cms_products_insert" ON public.products;
DROP POLICY IF EXISTS "cms_products_update" ON public.products;
DROP POLICY IF EXISTS "cms_products_delete" ON public.products;

CREATE POLICY "cms_products_select"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "cms_products_insert"
  ON public.products FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "cms_products_update"
  ON public.products FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "cms_products_delete"
  ON public.products FOR DELETE
  TO anon, authenticated
  USING (true);

-- ---------- PARTNERS ----------
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_partners_select" ON public.partners;
DROP POLICY IF EXISTS "cms_partners_insert" ON public.partners;
DROP POLICY IF EXISTS "cms_partners_update" ON public.partners;
DROP POLICY IF EXISTS "cms_partners_delete" ON public.partners;

CREATE POLICY "cms_partners_select"
  ON public.partners FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "cms_partners_insert"
  ON public.partners FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "cms_partners_update"
  ON public.partners FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "cms_partners_delete"
  ON public.partners FOR DELETE
  TO anon, authenticated
  USING (true);

-- ---------- PORTFOLIO ----------
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_portfolio_select" ON public.portfolio_projects;
DROP POLICY IF EXISTS "cms_portfolio_insert" ON public.portfolio_projects;
DROP POLICY IF EXISTS "cms_portfolio_update" ON public.portfolio_projects;
DROP POLICY IF EXISTS "cms_portfolio_delete" ON public.portfolio_projects;

CREATE POLICY "cms_portfolio_select"
  ON public.portfolio_projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "cms_portfolio_insert"
  ON public.portfolio_projects FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "cms_portfolio_update"
  ON public.portfolio_projects FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "cms_portfolio_delete"
  ON public.portfolio_projects FOR DELETE
  TO anon, authenticated
  USING (true);

-- ---------- CONTACT MESSAGES ----------
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_messages_select" ON public.messages;
DROP POLICY IF EXISTS "cms_messages_insert" ON public.messages;
DROP POLICY IF EXISTS "cms_messages_update" ON public.messages;
DROP POLICY IF EXISTS "cms_messages_delete" ON public.messages;

CREATE POLICY "cms_messages_select"
  ON public.messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "cms_messages_insert"
  ON public.messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "cms_messages_update"
  ON public.messages FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "cms_messages_delete"
  ON public.messages FOR DELETE
  TO anon, authenticated
  USING (true);

-- ---------- INVOICES ----------
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_invoices_select" ON public.invoices;
DROP POLICY IF EXISTS "cms_invoices_insert" ON public.invoices;
DROP POLICY IF EXISTS "cms_invoices_update" ON public.invoices;
DROP POLICY IF EXISTS "cms_invoices_delete" ON public.invoices;

CREATE POLICY "cms_invoices_select"
  ON public.invoices FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "cms_invoices_insert"
  ON public.invoices FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "cms_invoices_update"
  ON public.invoices FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "cms_invoices_delete"
  ON public.invoices FOR DELETE
  TO anon, authenticated
  USING (true);

-- ---------- PROJECT LEADS (anon read/update for admin without Supabase auth) ----------
ALTER TABLE public.project_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_project_leads_select" ON public.project_leads;
DROP POLICY IF EXISTS "cms_project_leads_update" ON public.project_leads;

CREATE POLICY "cms_project_leads_select"
  ON public.project_leads FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "cms_project_leads_update"
  ON public.project_leads FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ---------- STORAGE: buckets + object policies ----------
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('portfolio-images', 'portfolio-images', true),
  ('product-images', 'product-images', true),
  ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "cms_storage_select" ON storage.objects;
DROP POLICY IF EXISTS "cms_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "cms_storage_update" ON storage.objects;
DROP POLICY IF EXISTS "cms_storage_delete" ON storage.objects;

CREATE POLICY "cms_storage_select"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('portfolio-images', 'product-images', 'partner-logos'));

CREATE POLICY "cms_storage_insert"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id IN ('portfolio-images', 'product-images', 'partner-logos'));

CREATE POLICY "cms_storage_update"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id IN ('portfolio-images', 'product-images', 'partner-logos'))
  WITH CHECK (bucket_id IN ('portfolio-images', 'product-images', 'partner-logos'));

CREATE POLICY "cms_storage_delete"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id IN ('portfolio-images', 'product-images', 'partner-logos'));
