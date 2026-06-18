import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const adminPage = readFileSync(join(root, 'app/admin/page.tsx'), 'utf8');
const migrations = [
  'supabase/migrations/20260421165856_create_project_leads_table.sql',
  'supabase/migrations/20260509180000_cms_rls_and_storage_public_access.sql',
  'supabase/migrations/20260521120000_partnership_signing_videos.sql',
  'supabase/migrations/20260601120000_company_services.sql',
  'supabase/migrations/20260618110500_lock_down_cms_admin_policies.sql',
].map((file) => ({
  file,
  sql: readFileSync(join(root, file), 'utf8'),
}));

const allSql = migrations.map(({ sql }) => sql).join('\n');

function createPolicyBlocks(sql) {
  return [...sql.matchAll(/CREATE POLICY\s+"([^"]+)"[\s\S]*?;/g)].map((match) => ({
    name: match[1],
    block: match[0],
  }));
}

function policyBlocksNamed(name) {
  return migrations.flatMap(({ file, sql }) =>
    createPolicyBlocks(sql)
      .filter((policy) => policy.name === name)
      .map((policy) => ({ file, ...policy }))
  );
}

function assertAdminOnlyPolicy(name) {
  const blocks = policyBlocksNamed(name);
  assert.ok(blocks.length > 0, `missing policy ${name}`);
  for (const { file, block } of blocks) {
    assert.match(block, /TO authenticated\b/, `${name} in ${file} must require an authenticated user`);
    assert.doesNotMatch(block, /TO\s+anon\b|TO\s+anon,\s*authenticated\b/, `${name} in ${file} must not grant anon access`);
    assert.match(block, /public\.is_commergio_admin\(\)/, `${name} in ${file} must check the admin email`);
  }
}

describe('admin and Supabase policy lockdown', () => {
  it('does not bypass the admin session check', () => {
    assert.doesNotMatch(adminPage, /TEMP_BYPASS_ADMIN_AUTH/);
    assert.match(adminPage, /supabase\.auth\.getSession\(\)/);
    assert.match(adminPage, /userEmail !== ADMIN_EMAIL\.toLowerCase\(\)/);
  });

  it('does not grant anonymous CMS or storage mutations', () => {
    const allowedPublicInsertPolicies = new Set([
      'Anyone can submit a lead',
      'cms_messages_insert',
    ]);

    for (const { file, sql } of migrations) {
      for (const { name, block } of createPolicyBlocks(sql)) {
        const isMutation = /FOR\s+(INSERT|UPDATE|DELETE)\b/.test(block);
        const grantsAnon = /TO\s+anon\b|TO\s+anon,\s*authenticated\b/.test(block);
        if (!isMutation || !grantsAnon || allowedPublicInsertPolicies.has(name)) continue;

        assert.fail(`${name} in ${file} grants anonymous mutation access:\n${block}`);
      }
    }
  });

  it('keeps private reads and all admin mutations behind the admin email check', () => {
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
      'Authenticated users can view leads',
      'Authenticated users can update leads',
      'Authenticated users can delete leads',
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
  });

  it('only exposes published rows for CMS content that has a publish flag', () => {
    for (const policyName of ['cms_signing_videos_select', 'cms_company_services_select']) {
      const blocks = policyBlocksNamed(policyName);
      assert.ok(blocks.length > 0, `missing policy ${policyName}`);
      for (const { file, block } of blocks) {
        assert.match(block, /TO anon,\s*authenticated\b/, `${policyName} in ${file} should remain public-readable`);
        assert.match(block, /is_published\s*=\s*true/, `${policyName} in ${file} must restrict public reads to published rows`);
        assert.match(block, /public\.is_commergio_admin\(\)/, `${policyName} in ${file} must let admins see drafts`);
        assert.doesNotMatch(block, /USING\s*\(\s*true\s*\)/, `${policyName} in ${file} must not expose drafts publicly`);
      }
    }
  });

  it('does not publicly list signing video storage objects', () => {
    for (const { file, sql } of migrations) {
      for (const { block } of createPolicyBlocks(sql).filter((policy) => policy.name === 'cms_storage_select')) {
        assert.match(block, /public\.is_commergio_admin\(\)/, `storage select in ${file} must include admin access`);
        assert.doesNotMatch(block, /partnership-videos|partnership-thumbnails/, `storage select in ${file} must not publicly list signing buckets`);
      }
    }
  });

  it('defines and uses the admin predicate', () => {
    assert.match(allSql, /CREATE OR REPLACE FUNCTION public\.is_commergio_admin\(\)/);
    assert.match(allSql, /auth\.jwt\(\)\s*->>\s*'email'/);
    assert.match(allSql, /info@commergio\.com/);
  });
});
