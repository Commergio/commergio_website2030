/*
  # Lock down CMS/admin policies

  A previous migration allowed anonymous users with the browser anon key to read
  private admin data and mutate CMS tables/storage. Preserve public site reads and
  form submissions, but require the authorized admin account for private reads and
  all admin mutations.
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
  TO authenticated
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_products_update"
  ON public.products FOR UPDATE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com')
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_products_delete"
  ON public.products FOR DELETE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

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
  TO authenticated
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_partners_update"
  ON public.partners FOR UPDATE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com')
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_partners_delete"
  ON public.partners FOR DELETE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

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
  TO authenticated
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_portfolio_update"
  ON public.portfolio_projects FOR UPDATE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com')
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_portfolio_delete"
  ON public.portfolio_projects FOR DELETE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

-- ---------- CONTACT MESSAGES ----------
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_messages_select" ON public.messages;
DROP POLICY IF EXISTS "cms_messages_insert" ON public.messages;
DROP POLICY IF EXISTS "cms_messages_update" ON public.messages;
DROP POLICY IF EXISTS "cms_messages_delete" ON public.messages;

CREATE POLICY "cms_messages_select"
  ON public.messages FOR SELECT
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_messages_insert"
  ON public.messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "cms_messages_update"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com')
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_messages_delete"
  ON public.messages FOR DELETE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

-- ---------- INVOICES ----------
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_invoices_select" ON public.invoices;
DROP POLICY IF EXISTS "cms_invoices_insert" ON public.invoices;
DROP POLICY IF EXISTS "cms_invoices_update" ON public.invoices;
DROP POLICY IF EXISTS "cms_invoices_delete" ON public.invoices;

CREATE POLICY "cms_invoices_select"
  ON public.invoices FOR SELECT
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_invoices_insert"
  ON public.invoices FOR INSERT
  TO authenticated
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_invoices_update"
  ON public.invoices FOR UPDATE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com')
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_invoices_delete"
  ON public.invoices FOR DELETE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

-- ---------- PROJECT LEADS ----------
ALTER TABLE public.project_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.project_leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.project_leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON public.project_leads;
DROP POLICY IF EXISTS "Admin can view leads" ON public.project_leads;
DROP POLICY IF EXISTS "Admin can update leads" ON public.project_leads;
DROP POLICY IF EXISTS "Admin can delete leads" ON public.project_leads;
DROP POLICY IF EXISTS "cms_project_leads_select" ON public.project_leads;
DROP POLICY IF EXISTS "cms_project_leads_update" ON public.project_leads;
DROP POLICY IF EXISTS "cms_project_leads_delete" ON public.project_leads;

CREATE POLICY "cms_project_leads_select"
  ON public.project_leads FOR SELECT
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_project_leads_update"
  ON public.project_leads FOR UPDATE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com')
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_project_leads_delete"
  ON public.project_leads FOR DELETE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

-- ---------- STORAGE ----------
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
  TO authenticated
  WITH CHECK (
    bucket_id IN ('portfolio-images', 'product-images', 'partner-logos')
    AND lower(auth.jwt() ->> 'email') = 'info@commergio.com'
  );

CREATE POLICY "cms_storage_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('portfolio-images', 'product-images', 'partner-logos')
    AND lower(auth.jwt() ->> 'email') = 'info@commergio.com'
  )
  WITH CHECK (
    bucket_id IN ('portfolio-images', 'product-images', 'partner-logos')
    AND lower(auth.jwt() ->> 'email') = 'info@commergio.com'
  );

CREATE POLICY "cms_storage_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('portfolio-images', 'product-images', 'partner-logos')
    AND lower(auth.jwt() ->> 'email') = 'info@commergio.com'
  );
