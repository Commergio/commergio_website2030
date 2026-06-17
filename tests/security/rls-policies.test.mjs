import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

const cmsMigration = read('supabase/migrations/20260509180000_cms_rls_and_storage_public_access.sql');
const leadsMigration = read('supabase/migrations/20260421165856_create_project_leads_table.sql');
const signingMigration = read('supabase/migrations/20260521120000_partnership_signing_videos.sql');
const servicesMigration = read('supabase/migrations/20260601120000_company_services.sql');
const remediationMigration = read('supabase/migrations/20260617110500_lock_down_cms_admin_policies.sql');
const allPolicySql = [
  cmsMigration,
  leadsMigration,
  signingMigration,
  servicesMigration,
  remediationMigration,
].join('\n');

function policyBlocks(sql, policyName) {
  const escapedName = policyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return sql.match(new RegExp(`CREATE POLICY "${escapedName}"[\\s\\S]*?;`, 'g')) ?? [];
}

function assertPolicyIncludes(sql, policyName, expected) {
  const blocks = policyBlocks(sql, policyName);
  assert.ok(blocks.length > 0, `Expected policy "${policyName}" to exist`);
  for (const block of blocks) {
    assert.match(block, expected, `Policy "${policyName}" should include ${expected}`);
  }
}

function assertPolicyExcludes(sql, policyName, forbidden) {
  const blocks = policyBlocks(sql, policyName);
  assert.ok(blocks.length > 0, `Expected policy "${policyName}" to exist`);
  for (const block of blocks) {
    assert.doesNotMatch(block, forbidden, `Policy "${policyName}" should not include ${forbidden}`);
  }
}

const adminPredicate = /public\.is_commergio_admin\(\)/;

assert.match(
  allPolicySql,
  /CREATE OR REPLACE FUNCTION public\.is_commergio_admin\(\)/,
  'Expected migrations to define the shared admin predicate'
);

for (const sql of [cmsMigration, remediationMigration]) {
  for (const table of ['products', 'partners', 'portfolio']) {
    assertPolicyIncludes(sql, `cms_${table}_insert`, adminPredicate);
    assertPolicyIncludes(sql, `cms_${table}_update`, adminPredicate);
    assertPolicyIncludes(sql, `cms_${table}_delete`, adminPredicate);
    assertPolicyExcludes(sql, `cms_${table}_insert`, /TO anon|WITH CHECK \(true\)/);
  }

  assertPolicyIncludes(sql, 'cms_messages_select', adminPredicate);
  assertPolicyIncludes(sql, 'cms_messages_update', adminPredicate);
  assertPolicyIncludes(sql, 'cms_messages_delete', adminPredicate);
  assertPolicyIncludes(sql, 'cms_messages_insert', /TO anon, authenticated/);
  assertPolicyIncludes(sql, 'cms_messages_insert', /WITH CHECK \(true\)/);

  assertPolicyIncludes(sql, 'cms_invoices_select', adminPredicate);
  assertPolicyIncludes(sql, 'cms_invoices_insert', adminPredicate);
  assertPolicyIncludes(sql, 'cms_invoices_update', adminPredicate);
  assertPolicyIncludes(sql, 'cms_invoices_delete', adminPredicate);

  assertPolicyIncludes(sql, 'cms_storage_insert', adminPredicate);
  assertPolicyIncludes(sql, 'cms_storage_update', adminPredicate);
  assertPolicyIncludes(sql, 'cms_storage_delete', adminPredicate);
  assertPolicyExcludes(sql, 'cms_storage_insert', /TO anon|WITH CHECK \(bucket_id IN \([^)]+\)\);/);
}

for (const sql of [leadsMigration, remediationMigration]) {
  assertPolicyIncludes(sql, 'Anyone can submit a lead', /TO anon, authenticated/);
  assertPolicyIncludes(sql, 'Anyone can submit a lead', /WITH CHECK \(true\)/);
  assertPolicyIncludes(sql, 'Commergio admin can view leads', adminPredicate);
  assertPolicyIncludes(sql, 'Commergio admin can update leads', adminPredicate);
  assertPolicyIncludes(sql, 'Commergio admin can delete leads', adminPredicate);
}

for (const sql of [signingMigration, remediationMigration]) {
  assertPolicyIncludes(sql, 'public_signing_videos_select', /is_published = true/);
  assertPolicyIncludes(sql, 'admin_signing_videos_select', adminPredicate);
  assertPolicyIncludes(sql, 'cms_signing_videos_insert', adminPredicate);
  assertPolicyIncludes(sql, 'cms_signing_videos_update', adminPredicate);
  assertPolicyIncludes(sql, 'cms_signing_videos_delete', adminPredicate);
  assertPolicyExcludes(sql, 'cms_signing_videos_insert', /TO anon|WITH CHECK \(true\)/);
}

for (const sql of [servicesMigration, remediationMigration]) {
  assertPolicyIncludes(sql, 'public_company_services_select', /is_published = true/);
  assertPolicyIncludes(sql, 'admin_company_services_select', adminPredicate);
  assertPolicyIncludes(sql, 'cms_company_services_insert', adminPredicate);
  assertPolicyIncludes(sql, 'cms_company_services_update', adminPredicate);
  assertPolicyIncludes(sql, 'cms_company_services_delete', adminPredicate);
  assertPolicyExcludes(sql, 'cms_company_services_insert', /TO anon|WITH CHECK \(true\)/);
}

assert.doesNotMatch(
  read('app/admin/page.tsx'),
  /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/,
  'Admin auth bypass must stay disabled'
);

assert.match(
  read('next.config.js'),
  /media-src 'self' https:\/\/\*\.supabase\.co/,
  'CSP must allow Supabase-hosted signing videos to play'
);

assert.doesNotMatch(
  read('hooks/useCompanyServices.ts'),
  /data\.length\s*>\s*0/,
  'Empty company_services query results should not fall back to stale bundled services'
);

assert.match(
  read('components/StartProjectModal.tsx'),
  /const \{ error \} = await supabase\.from\('project_leads'\)\.insert/,
  'Project lead submission must inspect Supabase insert errors'
);

console.log('Security policy assertions passed');
