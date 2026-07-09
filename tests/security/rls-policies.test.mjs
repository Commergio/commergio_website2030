import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const adminPage = readFileSync('app/admin/page.tsx', 'utf8');
const migration = readFileSync(
  'supabase/migrations/20260709110500_lock_down_admin_rls_policies.sql',
  'utf8'
);

const policyBlocks = [...migration.matchAll(/CREATE POLICY "([^"]+)"\s+ON\s+([^\s]+)\s+FOR\s+(SELECT|INSERT|UPDATE|DELETE)[\s\S]*?;/gi)]
  .map((match) => ({
    name: match[1],
    table: match[2],
    action: match[3].toUpperCase(),
    sql: match[0],
    normalized: match[0].replace(/\s+/g, ' '),
  }));

function policy(name) {
  const found = policyBlocks.find((block) => block.name === name);
  assert.ok(found, `Expected policy ${name} to exist`);
  return found;
}

function assertAdminOnly(name) {
  const block = policy(name);
  assert.match(block.normalized, /\bTO authenticated\b/, `${name} should only target authenticated users`);
  assert.doesNotMatch(block.normalized, /\bTO anon\b/, `${name} must not target anon users`);
  assert.match(block.sql, /public\.is_commergio_admin\(\)/, `${name} must check the admin email`);
}

test('admin dashboard does not bypass Supabase auth', () => {
  assert.match(adminPage, /const TEMP_BYPASS_ADMIN_AUTH = false;/);
});

test('migration defines the shared admin identity check', () => {
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.is_commergio_admin\(\)/);
  assert.match(migration, /auth\.jwt\(\) ->> 'email'/);
  assert.match(migration, /info@commergio\.com/);
});

test('private tables are readable and mutable only by the Commergio admin', () => {
  [
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
  ].forEach(assertAdminOnly);
});

test('public form submissions stay insert-only for anonymous users', () => {
  const messagesInsert = policy('cms_messages_insert');
  assert.equal(messagesInsert.action, 'INSERT');
  assert.match(messagesInsert.normalized, /\bTO anon, authenticated\b/);
  assert.match(messagesInsert.normalized, /\bWITH CHECK \(true\)/);

  const leadsInsert = policy('Anyone can submit a lead');
  assert.equal(leadsInsert.action, 'INSERT');
  assert.match(leadsInsert.normalized, /\bTO anon, authenticated\b/);
  assert.match(leadsInsert.normalized, /\bWITH CHECK \(true\)/);
});

test('CMS writes and storage writes require the Commergio admin', () => {
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
    'cms_signing_videos_insert',
    'cms_signing_videos_update',
    'cms_signing_videos_delete',
    'cms_company_services_insert',
    'cms_company_services_update',
    'cms_company_services_delete',
    'cms_storage_insert',
    'cms_storage_update',
    'cms_storage_delete',
  ].forEach(assertAdminOnly);
});

test('draft-only CMS tables expose only published rows to the public', () => {
  const signingVideosSelect = policy('cms_signing_videos_select');
  assert.match(signingVideosSelect.normalized, /\bTO anon, authenticated\b/);
  assert.match(signingVideosSelect.sql, /is_published OR public\.is_commergio_admin\(\)/);

  const companyServicesSelect = policy('cms_company_services_select');
  assert.match(companyServicesSelect.normalized, /\bTO anon, authenticated\b/);
  assert.match(companyServicesSelect.sql, /is_published OR public\.is_commergio_admin\(\)/);
});
