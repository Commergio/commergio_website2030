/*
  # Restrict project lead management to the admin account

  Anonymous visitors must still be able to submit project leads, but stored
  leads contain private contact details and must not be readable or mutable by
  arbitrary authenticated Supabase users.
*/

DROP POLICY IF EXISTS "Authenticated users can view leads" ON project_leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON project_leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON project_leads;

CREATE POLICY "Admin can view leads"
  ON project_leads
  FOR SELECT
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "Admin can update leads"
  ON project_leads
  FOR UPDATE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com')
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'info@commergio.com');

CREATE POLICY "Admin can delete leads"
  ON project_leads
  FOR DELETE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'info@commergio.com');
