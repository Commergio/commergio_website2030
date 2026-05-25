import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const read = (path) => readFileSync(resolve(root, path), 'utf8');

const adminPage = read('app/admin/page.tsx');
const projectLeadsMigration = read('supabase/migrations/20260421165856_create_project_leads_table.sql');
const cmsMigration = read('supabase/migrations/20260509180000_cms_rls_and_storage_public_access.sql');
const signingVideosMigration = read('supabase/migrations/20260521120000_partnership_signing_videos.sql');
const lockdownMigration = read('supabase/migrations/20260525110500_lock_down_cms_admin_policies.sql');

const adminGuard = /lower\s*\(\s*auth\.jwt\(\)\s*->>\s*'email'\s*\)\s*=\s*'info@commergio\.com'/i;

function policy(sql, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = sql.match(new RegExp(`CREATE POLICY "${escapedName}"[\\s\\S]*?;`, 'i'));
  assert.ok(match, `Missing policy ${name}`);
  return match[0];
}

function assertAdminOnly(sql, name) {
  const block = policy(sql, name);
  assert.match(block, /\bTO authenticated\b/i, `${name} must require an authenticated user`);
  assert.doesNotMatch(block, /\bTO\s+anon\b/i, `${name} must not grant anon access`);
  assert.match(block, adminGuard, `${name} must check the admin email`);
}

function assertPublicInsert(sql, name) {
  const block = policy(sql, name);
  assert.match(block, /\bFOR INSERT\b/i);
  assert.match(block, /\bTO anon,\s*authenticated\b/i, `${name} should allow public form submissions`);
  assert.match(block, /\bWITH CHECK\s*\(\s*true\s*\)/i);
}

function assertPublicRead(sql, name) {
  const block = policy(sql, name);
  assert.match(block, /\bFOR SELECT\b/i);
  assert.match(block, /\bTO anon,\s*authenticated\b/i, `${name} should allow public reads`);
}

test('admin auth bypass remains disabled', () => {
  assert.doesNotMatch(adminPage, /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/);
});

test('project lead private reads and mutations require the admin account', () => {
  assertPublicInsert(projectLeadsMigration, 'Anyone can submit a lead');
  assertAdminOnly(projectLeadsMigration, 'Authenticated users can view leads');
  assertAdminOnly(projectLeadsMigration, 'Authenticated users can update leads');
  assertAdminOnly(projectLeadsMigration, 'Authenticated users can delete leads');
});

test('CMS content mutations are admin-only while public reads remain available', () => {
  for (const name of [
    'cms_products_select',
    'cms_partners_select',
    'cms_portfolio_select',
  ]) {
    assertPublicRead(cmsMigration, name);
  }

  for (const name of [
    'cms_products_insert',
    'cms_products_update',
    'cms_products_delete',
    'cms_partners_insert',
    'cms_partners_update',
    'cms_partners_delete',
    'cms_portfolio_insert',
    'cms_portfolio_update',
    'cms_portfolio_delete',
  ]) {
    assertAdminOnly(cmsMigration, name);
  }
});

test('private messages, invoices, and leads are not anonymously readable or mutable', () => {
  assertPublicInsert(cmsMigration, 'cms_messages_insert');

  for (const name of [
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
  ]) {
    assertAdminOnly(cmsMigration, name);
  }
});

test('partnership signing drafts and mutations are admin-only', () => {
  const selectPolicy = policy(signingVideosMigration, 'cms_signing_videos_select');
  assert.match(selectPolicy, /\bis_published\b/i);
  assert.match(selectPolicy, adminGuard);

  for (const name of [
    'cms_signing_videos_insert',
    'cms_signing_videos_update',
    'cms_signing_videos_delete',
  ]) {
    assertAdminOnly(signingVideosMigration, name);
  }
});

test('storage writes are admin-only in both storage policy definitions', () => {
  for (const sql of [cmsMigration, signingVideosMigration, lockdownMigration]) {
    assertPublicRead(sql, 'cms_storage_select');

    for (const name of [
      'cms_storage_insert',
      'cms_storage_update',
      'cms_storage_delete',
    ]) {
      assertAdminOnly(sql, name);
    }
  }
});

test('lockdown migration repairs already-applied unsafe policies', () => {
  for (const policyName of [
    'Authenticated users can view leads',
    'Authenticated users can update leads',
    'Authenticated users can delete leads',
    'cms_messages_select',
    'cms_messages_update',
    'cms_messages_delete',
    'cms_invoices_select',
    'cms_invoices_insert',
    'cms_invoices_update',
    'cms_invoices_delete',
    'cms_project_leads_select',
    'cms_project_leads_update',
    'cms_signing_videos_insert',
    'cms_signing_videos_update',
    'cms_signing_videos_delete',
    'cms_storage_insert',
    'cms_storage_update',
    'cms_storage_delete',
  ]) {
    assert.match(lockdownMigration, new RegExp(`DROP POLICY IF EXISTS "${policyName}"`, 'i'));
  }

  assertPublicInsert(lockdownMigration, 'cms_messages_insert');
  assertPublicInsert(lockdownMigration, 'Anyone can submit a lead');
  assert.match(policy(lockdownMigration, 'cms_signing_videos_select'), /\bis_published\b/i);
});
