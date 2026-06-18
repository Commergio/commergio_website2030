import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const migrationsDir = join(root, 'supabase/migrations');
const migrationSql = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort()
  .map((file) => `\n-- ${file}\n${readFileSync(join(migrationsDir, file), 'utf8')}`)
  .join('\n');
const remediationSql = read('supabase/migrations/20260608110500_lock_down_cms_admin_policies.sql');

const policyPattern =
  /CREATE POLICY\s+"([^"]+)"\s+ON\s+((?:public|storage)\.)?([a-z_]+)\s+FOR\s+(SELECT|INSERT|UPDATE|DELETE)\s+TO\s+([a-z_,\s]+?)\s+(?:USING|WITH CHECK)/gi;

function policyBlocks(sql) {
  const blocks = [];
  const createPattern = /CREATE POLICY\s+"([^"]+)"[\s\S]*?;/gi;
  let match;
  while ((match = createPattern.exec(sql))) {
    blocks.push({ name: match[1], sql: match[0] });
  }
  return blocks;
}

function getPolicy(sql, name) {
  const block = policyBlocks(sql).find((policy) => policy.name === name);
  assert.ok(block, `Missing policy ${name}`);
  return block.sql;
}

function policyDefinitions(sql) {
  return policyBlocks(sql).map(({ name, sql: block }) => {
    const match = policyPattern.exec(block);
    policyPattern.lastIndex = 0;
    assert.ok(match, `Unable to parse policy ${name}`);
    return {
      name,
      block,
      table: `${match[2] ?? ''}${match[3]}`,
      operation: match[4].toUpperCase(),
      roles: match[5]
        .split(',')
        .map((role) => role.trim().toLowerCase())
        .filter(Boolean),
    };
  });
}

test('admin dashboard no longer has a temporary auth bypass', () => {
  const adminPage = read('app/admin/page.tsx');
  assert.doesNotMatch(adminPage, /TEMP_BYPASS_ADMIN_AUTH|setAuthed\(true\);\s*setChecking\(false\);\s*return;/);
  assert.match(adminPage, /session\.user\?\.email\?\.toLowerCase\(\)/);
  assert.match(adminPage, /ADMIN_EMAIL\.toLowerCase\(\)/);
});

test('all anonymous RLS grants are limited to public reads and public form inserts', () => {
  const publicSelectTables = new Set([
    'public.products',
    'public.partners',
    'public.portfolio_projects',
  ]);
  const publicInsertTables = new Set([
    'public.messages',
    'public.project_leads',
    'project_leads',
  ]);

  for (const policy of policyDefinitions(migrationSql)) {
    if (!policy.roles.includes('anon')) continue;

    if (policy.operation === 'SELECT' && publicSelectTables.has(policy.table)) {
      continue;
    }

    if (policy.operation === 'INSERT' && publicInsertTables.has(policy.table)) {
      continue;
    }

    if (policy.operation === 'SELECT' && policy.table === 'public.partnership_signing_videos') {
      assert.match(policy.block, /is_published\s*=\s*true/);
      continue;
    }

    if (policy.operation === 'SELECT' && policy.table === 'storage.objects') {
      if (/partnership-videos|partnership-thumbnails/.test(policy.block)) {
        assert.match(policy.block, /public\.is_commergio_admin\(\)/);
      }
      assert.doesNotMatch(policy.block, /FOR\s+(INSERT|UPDATE|DELETE)/i);
      continue;
    }

    assert.fail(
      `Unexpected anonymous ${policy.operation} grant on ${policy.table} in policy ${policy.name}`
    );
  }
});

test('admin-only policies require the Commergio admin helper', () => {
  assert.match(remediationSql, /CREATE OR REPLACE FUNCTION public\.is_commergio_admin\(\)/);

  const adminOnlyPolicyNames = [
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
  ];

  for (const policyName of adminOnlyPolicyNames) {
    const policy = getPolicy(remediationSql, policyName);
    assert.match(policy, /TO authenticated/);
    assert.doesNotMatch(policy, /TO\s+anon/i);
    assert.match(policy, /public\.is_commergio_admin\(\)/);
  }
});

test('public form inserts remain available', () => {
  for (const policyName of ['cms_messages_insert', 'cms_project_leads_insert']) {
    const policy = getPolicy(remediationSql, policyName);
    assert.match(policy, /TO anon,\s*authenticated/);
    assert.match(policy, /WITH CHECK\s*\(true\)/);
  }
});

test('unpublished signing videos and signing storage are not anonymously enumerable', () => {
  const tablePolicy = getPolicy(remediationSql, 'cms_signing_videos_select');
  assert.match(tablePolicy, /TO anon,\s*authenticated/);
  assert.match(tablePolicy, /is_published\s*=\s*true/);
  assert.match(tablePolicy, /OR public\.is_commergio_admin\(\)/);

  const storagePolicy = getPolicy(remediationSql, 'cms_storage_select');
  assert.match(storagePolicy, /TO anon,\s*authenticated/);
  assert.match(storagePolicy, /partnership-videos/);
  assert.match(storagePolicy, /partnership-thumbnails/);
  assert.match(storagePolicy, /AND public\.is_commergio_admin\(\)/);
});

test('Supabase-hosted public videos are permitted by CSP', () => {
  const nextConfig = read('next.config.js');
  assert.match(nextConfig, /media-src 'self' https:\/\/\*\.supabase\.co/);
});

test('project lead modal reports Supabase insert failures', () => {
  const modal = read('components/StartProjectModal.tsx');
  const i18n = read('lib/i18n.ts');
  assert.match(modal, /const \{ error \} = await supabase\.from\('project_leads'\)\.insert/);
  assert.match(modal, /if \(error\) throw error/);
  assert.match(modal, /setFormError\(m\.errSubmit\)/);
  assert.match(i18n, /errSubmit:/);
});
