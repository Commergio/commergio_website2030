/*
  Lock down CMS, private data, signing-video, and storage policies.

  Earlier CMS migrations allowed the public anon key to mutate CMS data and read
  private submissions. The anon key is bundled in the browser, so RLS must be the
  source of truth: visitors get public content reads and form inserts only;
  admin reads/mutations require the configured Supabase user email.
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

DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.project_leads;
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.project_leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.project_leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON public.project_leads;
DROP POLICY IF EXISTS "cms_project_leads_select" ON public.project_leads;
DROP POLICY IF EXISTS "cms_project_leads_insert" ON public.project_leads;
DROP POLICY IF EXISTS "cms_project_leads_update" ON public.project_leads;
DROP POLICY IF EXISTS "cms_project_leads_delete" ON public.project_leads;

CREATE POLICY "cms_project_leads_insert"
  ON public.project_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

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

-- ---------- PARTNERSHIP SIGNING VIDEOS ----------
ALTER TABLE public.partnership_signing_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_signing_videos_select" ON public.partnership_signing_videos;
DROP POLICY IF EXISTS "cms_signing_videos_insert" ON public.partnership_signing_videos;
DROP POLICY IF EXISTS "cms_signing_videos_update" ON public.partnership_signing_videos;
DROP POLICY IF EXISTS "cms_signing_videos_delete" ON public.partnership_signing_videos;

CREATE POLICY "cms_signing_videos_select"
  ON public.partnership_signing_videos FOR SELECT
  TO anon, authenticated
  USING (
    is_published = true
    OR lower(auth.jwt() ->> 'email') = 'info@commergio.com'
  );

CREATE POLICY "cms_signing_videos_insert"
  ON public.partnership_signing_videos FOR INSERT
  TO authenticated
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_signing_videos_update"
  ON public.partnership_signing_videos FOR UPDATE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com')
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "cms_signing_videos_delete"
  ON public.partnership_signing_videos FOR DELETE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

-- ---------- STORAGE ----------
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('portfolio-images', 'portfolio-images', true),
  ('product-images', 'product-images', true),
  ('partner-logos', 'partner-logos', true),
  ('partnership-videos', 'partnership-videos', true),
  ('partnership-thumbnails', 'partnership-thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "cms_storage_select" ON storage.objects;
DROP POLICY IF EXISTS "cms_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "cms_storage_update" ON storage.objects;
DROP POLICY IF EXISTS "cms_storage_delete" ON storage.objects;

CREATE POLICY "cms_storage_select"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN (
    'portfolio-images', 'product-images', 'partner-logos',
    'partnership-videos', 'partnership-thumbnails'
  ));

CREATE POLICY "cms_storage_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN (
      'portfolio-images', 'product-images', 'partner-logos',
      'partnership-videos', 'partnership-thumbnails'
    )
    AND lower(auth.jwt() ->> 'email') = 'info@commergio.com'
  );

CREATE POLICY "cms_storage_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN (
      'portfolio-images', 'product-images', 'partner-logos',
      'partnership-videos', 'partnership-thumbnails'
    )
    AND lower(auth.jwt() ->> 'email') = 'info@commergio.com'
  )
  WITH CHECK (
    bucket_id IN (
      'portfolio-images', 'product-images', 'partner-logos',
      'partnership-videos', 'partnership-thumbnails'
    )
    AND lower(auth.jwt() ->> 'email') = 'info@commergio.com'
  );

CREATE POLICY "cms_storage_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id IN (
      'portfolio-images', 'product-images', 'partner-logos',
      'partnership-videos', 'partnership-thumbnails'
    )
    AND lower(auth.jwt() ->> 'email') = 'info@commergio.com'
  );
