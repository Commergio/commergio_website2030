/*
  # Restrict project lead administration

  Public signup can create authenticated users. The project_leads table accepts
  anonymous lead submissions, but read/update/delete access must be limited to
  the authorized admin account at the database policy layer.
*/

DROP POLICY IF EXISTS "Authenticated users can view leads" ON project_leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON project_leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON project_leads;
DROP POLICY IF EXISTS "Admin can view leads" ON project_leads;
DROP POLICY IF EXISTS "Admin can update leads" ON project_leads;
DROP POLICY IF EXISTS "Admin can delete leads" ON project_leads;

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
