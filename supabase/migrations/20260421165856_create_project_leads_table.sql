/*
  # Create project_leads table

  1. New Tables
    - `project_leads`
      - `id` (uuid, primary key)
      - `name` (text, required) - Lead's full name
      - `company` (text) - Company name
      - `email` (text) - Contact email
      - `phone` (text) - Phone/WhatsApp
      - `service` (text) - Service or product of interest
      - `budget_range` (text) - Budget range selection
      - `message` (text) - Project description
      - `status` (text) - Lead status: new, contacted, qualified, closed
      - `source` (text) - Where the lead came from (pricing, product, contact)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Public users can INSERT (to submit leads)
    - Only the Commergio admin account can SELECT/UPDATE/DELETE private leads
*/

CREATE TABLE IF NOT EXISTS project_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  company text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  service text DEFAULT '',
  budget_range text DEFAULT '',
  message text DEFAULT '',
  status text DEFAULT 'new',
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_leads ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_commergio_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@commergio.com';
$$;

GRANT EXECUTE ON FUNCTION public.is_commergio_admin() TO anon, authenticated;

CREATE POLICY "Anyone can submit a lead"
  ON project_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Commergio admin can view leads"
  ON project_leads
  FOR SELECT
  TO authenticated
  USING (public.is_commergio_admin());

CREATE POLICY "Commergio admin can update leads"
  ON project_leads
  FOR UPDATE
  TO authenticated
  USING (public.is_commergio_admin())
  WITH CHECK (public.is_commergio_admin());

CREATE POLICY "Commergio admin can delete leads"
  ON project_leads
  FOR DELETE
  TO authenticated
  USING (public.is_commergio_admin());
