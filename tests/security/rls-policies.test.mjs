import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const adminPage = readFileSync(join(root, 'app/admin/page.tsx'), 'utf8');
assert(
  !/TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/.test(adminPage),
  'temporary admin auth bypass must not be enabled'
);

const remediation = readFileSync(
  join(root, 'supabase/migrations/20260601121000_lock_down_cms_admin_policies.sql'),
  'utf8'
);

assert.match(
  remediation,
  /CREATE OR REPLACE FUNCTION public\.is_commergio_admin\(\)/,
  'admin policy helper must exist'
);

function policy(name) {
  const pattern = new RegExp(
    `CREATE POLICY "${name}"[\\s\\S]*?(?=\\n\\n(?:CREATE POLICY|DROP POLICY|ALTER TABLE|INSERT INTO|--)|$)`,
    'm'
  );
  const match = remediation.match(pattern);
  assert(match, `missing policy ${name}`);
  return match[0];
}

function assertAdminOnlyPolicy(name) {
  const block = policy(name);
  assert.match(block, /TO authenticated\b/, `${name} must require an authenticated user`);
  assert.doesNotMatch(block, /TO anon\b|TO anon,\s*authenticated\b/, `${name} must not allow anon`);
  assert.match(block, /public\.is_commergio_admin\(\)/, `${name} must require Commergio admin`);
}

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
].forEach(assertAdminOnlyPolicy);

for (const name of ['cms_company_services_select', 'cms_signing_videos_select']) {
  const block = policy(name);
  assert.match(block, /TO anon,\s*authenticated\b/, `${name} should allow public reads`);
  assert.match(block, /is_published/, `${name} must hide unpublished rows from public users`);
  assert.match(block, /public\.is_commergio_admin\(\)/, `${name} must let admin read drafts`);
}

for (const name of ['cms_messages_insert', 'cms_project_leads_insert']) {
  const block = policy(name);
  assert.match(block, /TO anon,\s*authenticated\b/, `${name} should allow public form submissions`);
  assert.match(block, /WITH CHECK \(true\)/, `${name} should not block public form submissions`);
}
