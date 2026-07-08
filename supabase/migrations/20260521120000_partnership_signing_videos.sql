/*
  Partnership signing videos — table, RLS, storage buckets
  Run in Supabase SQL Editor if you are not using Supabase CLI migrations.
*/

CREATE TABLE IF NOT EXISTS public.partnership_signing_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name text NOT NULL DEFAULT '',
  partner_name_ar text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  title_ar text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  description_ar text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  thumbnail_url text NOT NULL DEFAULT '',
  recorded_at date,
  is_published boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS partnership_signing_videos_published_order_idx
  ON public.partnership_signing_videos (is_published, display_order);

CREATE OR REPLACE FUNCTION public.is_commergio_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@commergio.com';
$$;

ALTER TABLE public.partnership_signing_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_signing_videos_select" ON public.partnership_signing_videos;
DROP POLICY IF EXISTS "cms_signing_videos_insert" ON public.partnership_signing_videos;
DROP POLICY IF EXISTS "cms_signing_videos_update" ON public.partnership_signing_videos;
DROP POLICY IF EXISTS "cms_signing_videos_delete" ON public.partnership_signing_videos;

CREATE POLICY "cms_signing_videos_select"
  ON public.partnership_signing_videos FOR SELECT
  TO anon, authenticated
  USING (is_published OR public.is_commergio_admin());

CREATE POLICY "cms_signing_videos_insert"
  ON public.partnership_signing_videos FOR INSERT
  TO authenticated
  WITH CHECK (public.is_commergio_admin());

CREATE POLICY "cms_signing_videos_update"
  ON public.partnership_signing_videos FOR UPDATE
  TO authenticated
  USING (public.is_commergio_admin())
  WITH CHECK (public.is_commergio_admin());

CREATE POLICY "cms_signing_videos_delete"
  ON public.partnership_signing_videos FOR DELETE
  TO authenticated
  USING (public.is_commergio_admin());

INSERT INTO storage.buckets (id, name, public)
VALUES
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
  USING (
    bucket_id IN ('portfolio-images', 'product-images', 'partner-logos')
    OR (
      public.is_commergio_admin()
      AND bucket_id IN ('partnership-videos', 'partnership-thumbnails')
    )
  );

CREATE POLICY "cms_storage_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_commergio_admin()
    AND bucket_id IN (
      'portfolio-images', 'product-images', 'partner-logos',
      'partnership-videos', 'partnership-thumbnails'
    )
  );

CREATE POLICY "cms_storage_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    public.is_commergio_admin()
    AND bucket_id IN (
      'portfolio-images', 'product-images', 'partner-logos',
      'partnership-videos', 'partnership-thumbnails'
    )
  )
  WITH CHECK (
    public.is_commergio_admin()
    AND bucket_id IN (
      'portfolio-images', 'product-images', 'partner-logos',
      'partnership-videos', 'partnership-thumbnails'
    )
  );

CREATE POLICY "cms_storage_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    public.is_commergio_admin()
    AND bucket_id IN (
      'portfolio-images', 'product-images', 'partner-logos',
      'partnership-videos', 'partnership-thumbnails'
    )
  );
