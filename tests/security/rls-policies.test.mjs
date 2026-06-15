import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(relPath) {
  return readFileSync(join(root, relPath), 'utf8');
}

const migrationDir = join(root, 'supabase/migrations');
const migrationSql = readdirSync(migrationDir)
  .filter((name) => name.endsWith('.sql'))
  .sort()
  .map((name) => readFileSync(join(migrationDir, name), 'utf8'))
  .join('\n\n');

function policyBlocks(sql) {
  return [...sql.matchAll(/CREATE POLICY\s+"([^"]+)"\s+ON\s+([^\s]+)\s+FOR\s+(SELECT|INSERT|UPDATE|DELETE)([\s\S]*?);/gi)].map(
    ([body, name, table, command, rest]) => ({
      body,
      name,
      table: table.replace(/^public\./, ''),
      command: command.toUpperCase(),
      rest,
      grantsAnon: /\bTO\s+[^;]*\banon\b/i.test(rest),
    })
  );
}

const policies = policyBlocks(migrationSql);

function isPublicFormInsert(policy) {
  return policy.command === 'INSERT' && ['messages', 'project_leads'].includes(policy.table);
}

describe('admin access controls', () => {
  it('does not ship the temporary admin auth bypass', () => {
    const adminPage = read('app/admin/page.tsx');

    assert.equal(adminPage.includes('TEMP_BYPASS_ADMIN_AUTH'), false);
  });
});

describe('Supabase RLS policies', () => {
  it('keeps private tables unreadable by anon clients', () => {
    const privateTables = new Set(['messages', 'invoices', 'project_leads']);
    const anonymousPrivateReads = policies.filter(
      (policy) => privateTables.has(policy.table) && policy.command === 'SELECT' && policy.grantsAnon
    );

    assert.deepEqual(
      anonymousPrivateReads.map((policy) => `${policy.table}:${policy.name}`),
      []
    );
  });

  it('does not allow anon CMS or storage mutations', () => {
    const anonymousMutations = policies.filter(
      (policy) => ['INSERT', 'UPDATE', 'DELETE'].includes(policy.command) && policy.grantsAnon && !isPublicFormInsert(policy)
    );

    assert.deepEqual(
      anonymousMutations.map((policy) => `${policy.table}:${policy.command}:${policy.name}`),
      []
    );
  });

  it('requires the Commergio admin account for CMS and storage mutations', () => {
    const adminMutationTables = new Set([
      'products',
      'partners',
      'portfolio_projects',
      'messages',
      'invoices',
      'project_leads',
      'partnership_signing_videos',
      'company_services',
      'storage.objects',
    ]);

    const adminlessMutations = policies.filter(
      (policy) =>
        adminMutationTables.has(policy.table) &&
        ['INSERT', 'UPDATE', 'DELETE'].includes(policy.command) &&
        !isPublicFormInsert(policy) &&
        !/public\.is_commergio_admin\(\)/i.test(policy.body)
    );

    assert.deepEqual(
      adminlessMutations.map((policy) => `${policy.table}:${policy.command}:${policy.name}`),
      []
    );
  });

  it('limits draft CMS rows with publish flags to admin users', () => {
    for (const table of ['partnership_signing_videos', 'company_services']) {
      const selectPolicies = policies.filter((policy) => policy.table === table && policy.command === 'SELECT');

      assert.ok(selectPolicies.length > 0, `expected a SELECT policy for ${table}`);
      assert.ok(
        selectPolicies.every((policy) => /is_published\s*=\s*true/i.test(policy.body) && /public\.is_commergio_admin\(\)/i.test(policy.body)),
        `expected ${table} SELECT policies to expose only published rows publicly`
      );
    }
  });
});
