import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const adminCheck = "lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@commergio.com'";

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

function getPolicy(sql, policyName) {
  const escapedName = policyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = sql.match(new RegExp(`CREATE POLICY "${escapedName}"[\\s\\S]*?;`, 'm'));
  assert.ok(match, `Expected policy "${policyName}" to exist`);
  return match[0];
}

function assertAdminOnlyPolicy(sql, policyName) {
  const policy = getPolicy(sql, policyName);
  assert.match(policy, /\bTO authenticated\b/, `${policyName} must require authenticated users`);
  assert.doesNotMatch(policy, /\bTO anon\b/, `${policyName} must not allow anon`);
  assert.ok(policy.includes(adminCheck), `${policyName} must check the admin email`);
}

test('admin dashboard does not bypass Supabase auth', () => {
  const adminPage = read('app/admin/page.tsx');

  assert.doesNotMatch(adminPage, /TEMP_BYPASS_ADMIN_AUTH/);
  assert.doesNotMatch(adminPage, /setAuthed\(true\);\s*setChecking\(false\);\s*return;/);
});

test('historical CMS migration does not grant anonymous admin mutations', () => {
  const sql = read('supabase/migrations/20260509180000_cms_rls_and_storage_public_access.sql');
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
    'cms_storage_insert',
    'cms_storage_update',
    'cms_storage_delete',
  ].forEach((policy) => assertAdminOnlyPolicy(sql, policy));
});

test('project lead private policies are admin-only', () => {
  const sql = read('supabase/migrations/20260421165856_create_project_leads_table.sql');
  [
    'Authenticated users can view leads',
    'Authenticated users can update leads',
    'Authenticated users can delete leads',
  ].forEach((policy) => assertAdminOnlyPolicy(sql, policy));
});

test('signing video migration does not grant anonymous writes', () => {
  const sql = read('supabase/migrations/20260521120000_partnership_signing_videos.sql');
  [
    'cms_signing_videos_insert',
    'cms_signing_videos_update',
    'cms_signing_videos_delete',
    'cms_storage_insert',
    'cms_storage_update',
    'cms_storage_delete',
  ].forEach((policy) => assertAdminOnlyPolicy(sql, policy));
});

test('remediation migration restores admin-only private access and mutations', () => {
  const sql = read('supabase/migrations/20260523110500_lock_down_cms_admin_policies.sql');
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
    'cms_storage_insert',
    'cms_storage_update',
    'cms_storage_delete',
  ].forEach((policy) => assertAdminOnlyPolicy(sql, policy));
});
