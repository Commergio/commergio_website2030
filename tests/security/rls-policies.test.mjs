import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

const migrations = [
  'supabase/migrations/20260421165856_create_project_leads_table.sql',
  'supabase/migrations/20260509180000_cms_rls_and_storage_public_access.sql',
  'supabase/migrations/20260521120000_partnership_signing_videos.sql',
  'supabase/migrations/20260601120000_company_services.sql',
  'supabase/migrations/20260611110500_lock_down_cms_admin_policies.sql',
];

const migrationSql = migrations.map(read).join('\n\n');

const adminPage = read('app/admin/page.tsx');
assert.doesNotMatch(
  adminPage,
  /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/,
  'Admin bypass must not be enabled in production code.',
);

assert.match(
  migrationSql,
  /CREATE OR REPLACE FUNCTION public\.is_commergio_admin\(\)[\s\S]*info@commergio\.com/,
  'Migrations must define the admin identity helper used by RLS policies.',
);

const policyBlocks = [...migrationSql.matchAll(/CREATE POLICY "([^"]+)"[\s\S]*?;\n/g)].map((match) => ({
  name: match[1],
  sql: match[0],
}));

const policy = (name) => {
  const matches = policyBlocks.filter((block) => block.name === name);
  assert.ok(matches.length > 0, `Missing policy: ${name}`);
  return matches[matches.length - 1].sql;
};

const assertAdminOnlyMutation = (name) => {
  const sql = policy(name);
  assert.match(sql, /TO authenticated/, `${name} must require an authenticated Supabase session.`);
  assert.doesNotMatch(sql, /TO anon/, `${name} must not allow the public anon role.`);
  assert.match(sql, /public\.is_commergio_admin\(\)/, `${name} must be restricted to the Commergio admin.`);
};

[
  'cms_products_insert',
  'cms_products_update',
  'cms_products_delete',
  'cms_partners_insert',
  'cms_partners_update',
  'cms_partners_delete',
  'cms_portfolio_insert',
  'cms_portfolio_update',
  'cms_portfolio_delete',
  'cms_messages_select',
  'cms_messages_update',
  'cms_messages_delete',
  'cms_invoices_select',
  'cms_invoices_insert',
  'cms_invoices_update',
  'cms_invoices_delete',
  'cms_project_leads_select',
  'cms_project_leads_update',
  'cms_project_leads_delete',
  'cms_signing_videos_insert',
  'cms_signing_videos_update',
  'cms_signing_videos_delete',
  'cms_company_services_insert',
  'cms_company_services_update',
  'cms_company_services_delete',
  'cms_storage_insert',
  'cms_storage_update',
  'cms_storage_delete',
].forEach(assertAdminOnlyMutation);

for (const name of ['cms_company_services_select', 'cms_signing_videos_select']) {
  const sql = policy(name);
  assert.match(sql, /TO anon, authenticated/, `${name} should keep public reads for published rows.`);
  assert.match(sql, /is_published/, `${name} must hide unpublished rows from public visitors.`);
  assert.match(sql, /public\.is_commergio_admin\(\)/, `${name} must let the admin see draft rows.`);
  assert.doesNotMatch(sql, /USING\s*\(\s*true\s*\)/, `${name} must not expose every row publicly.`);
}

for (const name of ['cms_messages_insert', 'Anyone can submit a lead']) {
  const sql = policy(name);
  assert.match(sql, /TO anon/, `${name} should continue to support public form submissions.`);
  assert.match(sql, /WITH CHECK\s*\(\s*true\s*\)/, `${name} should not block public form submissions.`);
}

const anonymousCmsMutations = policyBlocks.filter(({ name, sql }) => {
  const allowedPublicForms = name === 'cms_messages_insert' || name === 'Anyone can submit a lead';
  return !allowedPublicForms && /FOR (INSERT|UPDATE|DELETE)/.test(sql) && /TO anon/.test(sql);
});

assert.deepEqual(
  anonymousCmsMutations.map(({ name }) => name),
  [],
  'Only public form inserts may be available to the anon role.',
);

console.log('RLS policy security checks passed.');
