import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const migrationsDir = join(root, 'supabase', 'migrations');
const migrationFiles = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

const migrations = migrationFiles
  .map((file) => ({
    file,
    sql: readFileSync(join(migrationsDir, file), 'utf8'),
  }));

const allSql = migrations.map(({ sql }) => sql).join('\n');
const adminPage = readFileSync(join(root, 'app', 'admin', 'page.tsx'), 'utf8');

function normalize(sql) {
  return sql.replace(/\s+/g, ' ').trim();
}

function policyBlocks() {
  return migrations.flatMap(({ file, sql }) => {
    const blocks = sql.match(/CREATE POLICY[\s\S]*?;/gi) || [];
    return blocks.map((block) => ({ file, block, normalized: normalize(block) }));
  });
}

const policies = policyBlocks();

function tableName(policy) {
  if (/ON\s+storage\.objects/i.test(policy.block)) return 'storage.objects';
  return /ON\s+(public\.)?([a-z_]+)/i.exec(policy.block)?.[2] || '';
}

function command(policy) {
  return /FOR\s+(SELECT|INSERT|UPDATE|DELETE)/i.exec(policy.block)?.[1].toUpperCase() || '';
}

function allowsAnon(policy) {
  return /TO\s+[^;]*\banon\b/i.test(policy.block);
}

function hasAdminCheck(policy) {
  return /public\.is_commergio_admin\(\)/i.test(policy.block);
}

const publicFormInserts = new Set(['messages', 'project_leads']);
const adminManagedTables = new Set([
  'products',
  'partners',
  'portfolio_projects',
  'invoices',
  'partnership_signing_videos',
  'company_services',
]);
const privateTables = new Set(['messages', 'invoices', 'project_leads']);

assert.match(
  adminPage,
  /const\s+TEMP_BYPASS_ADMIN_AUTH\s*=\s*false;/,
  'Admin dashboard must not bypass Supabase authentication.',
);

assert.match(
  allSql,
  /CREATE OR REPLACE FUNCTION public\.is_commergio_admin\(\)/,
  'RLS migrations must define the admin identity helper.',
);

for (const policy of policies) {
  const table = tableName(policy);
  const action = command(policy);
  const location = `${policy.file}: ${policy.normalized}`;

  if (['INSERT', 'UPDATE', 'DELETE'].includes(action)) {
    const isAllowedPublicFormInsert =
      action === 'INSERT' && publicFormInserts.has(table) && allowsAnon(policy);

    assert.ok(
      !allowsAnon(policy) || isAllowedPublicFormInsert,
      `Anonymous ${action} is only allowed for public form inserts: ${location}`,
    );

    if (!isAllowedPublicFormInsert && (adminManagedTables.has(table) || table === 'storage.objects')) {
      assert.ok(
        hasAdminCheck(policy),
        `Admin-managed ${table} ${action} policy must check public.is_commergio_admin(): ${location}`,
      );
    }
  }

  if (action === 'SELECT' && privateTables.has(table)) {
    assert.ok(
      !allowsAnon(policy) && hasAdminCheck(policy),
      `Private ${table} SELECT must be admin-only: ${location}`,
    );
  }
}

for (const table of ['partnership_signing_videos', 'company_services']) {
  const selectPolicies = policies.filter((policy) => tableName(policy) === table && command(policy) === 'SELECT');
  assert.ok(selectPolicies.length > 0, `${table} must have a SELECT policy.`);
  assert.ok(
    selectPolicies.some((policy) => /is_published\s*=\s*true/i.test(policy.block) && hasAdminCheck(policy)),
    `${table} public SELECT must be limited to published rows while allowing admin reads.`,
  );
}

const storageWritePolicies = policies.filter(
  (policy) => tableName(policy) === 'storage.objects' && ['INSERT', 'UPDATE', 'DELETE'].includes(command(policy)),
);
assert.ok(storageWritePolicies.length > 0, 'Storage write policies must exist.');
for (const policy of storageWritePolicies) {
  assert.ok(!allowsAnon(policy), `Storage writes must not allow anon: ${policy.file}`);
  assert.ok(hasAdminCheck(policy), `Storage writes must require admin: ${policy.file}`);
}

console.log('RLS/admin security policy checks passed.');
