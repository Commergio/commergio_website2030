import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const migrationsDir = join(root, 'supabase', 'migrations');

const createMigration = readFileSync(
  join(migrationsDir, '20260421165856_create_project_leads_table.sql'),
  'utf8'
);

assert.match(
  createMigration,
  /CREATE POLICY "Anyone can submit a lead"[\s\S]*?TO anon,\s*authenticated[\s\S]*?WITH CHECK \(true\)/,
  'greenfield project_leads INSERT must allow anon and authenticated'
);

assert.doesNotMatch(
  createMigration,
  /CREATE POLICY "Anyone can submit a lead"[\s\S]*?TO anon\s*\n\s*WITH CHECK \(true\)/,
  'greenfield project_leads INSERT must not be anon-only'
);

const remediationName = '20260804120000_allow_authenticated_project_lead_inserts.sql';
const remediationPath = join(migrationsDir, remediationName);
const remediation = readFileSync(remediationPath, 'utf8');

assert.match(
  remediation,
  /DROP POLICY IF EXISTS "Anyone can submit a lead" ON public\.project_leads/,
  'remediation must replace the anon-only insert policy'
);

assert.match(
  remediation,
  /CREATE POLICY "Anyone can submit a lead"[\s\S]*?TO anon,\s*authenticated[\s\S]*?WITH CHECK \(true\)/,
  'remediation must allow authenticated Start Project inserts'
);

const migrationFiles = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
assert.ok(
  migrationFiles.includes(remediationName),
  'remediation migration must be present for already-deployed databases'
);

const laterCms = readFileSync(
  join(migrationsDir, '20260509180000_cms_rls_and_storage_public_access.sql'),
  'utf8'
);

assert.equal(
  /cms_project_leads_insert/.test(laterCms),
  false,
  'cms_rls migration never added project_leads INSERT for authenticated — remediation is required'
);

console.log('project-leads-insert-policy: ok');
