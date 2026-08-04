/*
  Allow authenticated browsers to submit project leads.

  The original policy granted INSERT only to `anon`. Visitors with a Supabase
  session (admin sign-in or public /signup) use the `authenticated` role, so
  Start Project inserts were rejected while the modal still showed success.

  Preserve public anonymous inserts; do not change select/update/delete here.
*/

ALTER TABLE public.project_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.project_leads;
DROP POLICY IF EXISTS "cms_project_leads_insert" ON public.project_leads;

CREATE POLICY "Anyone can submit a lead"
  ON public.project_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
