/*
  # Restrict project lead administration

  The public signup flow can create authenticated users, so project_leads
  read/update/delete policies must not grant blanket access to the
  authenticated role. Keep anonymous lead submission open, but require the
  authorized admin email for administrative actions.
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
