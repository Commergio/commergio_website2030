/*
  Company services CMS — run in Supabase SQL Editor if not using CLI migrations.
*/

CREATE TABLE IF NOT EXISTS public.company_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  title_ar text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  short_description_ar text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  description_ar text NOT NULL DEFAULT '',
  slug text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT 'Globe',
  color text NOT NULL DEFAULT '#3b82f6',
  category text NOT NULL DEFAULT '',
  category_ar text NOT NULL DEFAULT '',
  benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
  benefits_ar jsonb NOT NULL DEFAULT '[]'::jsonb,
  process jsonb NOT NULL DEFAULT '[]'::jsonb,
  process_ar jsonb NOT NULL DEFAULT '[]'::jsonb,
  ecosystem_angle integer NOT NULL DEFAULT 0,
  show_on_homepage boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS company_services_published_order_idx
  ON public.company_services (is_published, display_order);

CREATE OR REPLACE FUNCTION public.is_commergio_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@commergio.com';
$$;

ALTER TABLE public.company_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_company_services_select" ON public.company_services;
DROP POLICY IF EXISTS "cms_company_services_insert" ON public.company_services;
DROP POLICY IF EXISTS "cms_company_services_update" ON public.company_services;
DROP POLICY IF EXISTS "cms_company_services_delete" ON public.company_services;

CREATE POLICY "cms_company_services_select"
  ON public.company_services FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_commergio_admin());

CREATE POLICY "cms_company_services_insert"
  ON public.company_services FOR INSERT
  TO authenticated
  WITH CHECK (public.is_commergio_admin());

CREATE POLICY "cms_company_services_update"
  ON public.company_services FOR UPDATE
  TO authenticated
  USING (public.is_commergio_admin())
  WITH CHECK (public.is_commergio_admin());

CREATE POLICY "cms_company_services_delete"
  ON public.company_services FOR DELETE
  TO authenticated
  USING (public.is_commergio_admin());
