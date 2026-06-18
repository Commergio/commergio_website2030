import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const migrationsDir = join(root, 'supabase', 'migrations');
const migrationFiles = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

const sql = migrationFiles
  .map((file) => readFileSync(join(migrationsDir, file), 'utf8'))
  .join('\n\n');

const adminPage = readFileSync(join(root, 'app', 'admin', 'page.tsx'), 'utf8');
const nextConfig = readFileSync(join(root, 'next.config.js'), 'utf8');

assert.doesNotMatch(
  adminPage,
  /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/,
  'admin auth bypass must not be enabled'
);

assert.match(
  nextConfig,
  /media-src[^"]*https:\/\/\*\.supabase\.co/,
  'CSP must allow Supabase-hosted signing videos to load'
);

const policyBlocks = [];
const createPolicyPattern =
  /CREATE POLICY\s+"([^"]+)"\s+ON\s+([^\s]+)\s+FOR\s+(SELECT|INSERT|UPDATE|DELETE)\s+([\s\S]*?);/gi;

for (const match of sql.matchAll(createPolicyPattern)) {
  policyBlocks.push({
    name: match[1],
    table: match[2].replace(/^public\./, '').toLowerCase(),
    operation: match[3].toUpperCase(),
    body: match[4].replace(/\s+/g, ' ').trim(),
  });
}

function policiesFor(table, operation) {
  return policyBlocks.filter((policy) => policy.table === table && policy.operation === operation);
}

function hasAnon(policy) {
  return /\bTO\s+[^;]*\banon\b/i.test(policy.body);
}

function requiresAdmin(policy) {
  return /public\.is_commergio_admin\(\)|\bis_commergio_admin\(\)/i.test(policy.body);
}

function assertPublicInsert(table) {
  assert(
    policiesFor(table, 'INSERT').some((policy) => hasAnon(policy) && /WITH CHECK \(true\)/i.test(policy.body)),
    `${table} must retain public INSERT for form submissions`
  );
}

function assertAdminOnly(table, operations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE']) {
  for (const operation of operations) {
    const policies = policiesFor(table, operation);
    assert(policies.length > 0, `${table} must define ${operation} policy`);
    for (const policy of policies) {
      assert(!hasAnon(policy), `${table} ${operation} policy "${policy.name}" must not grant anon access`);
      assert(requiresAdmin(policy), `${table} ${operation} policy "${policy.name}" must require admin`);
    }
  }
}

for (const table of ['products', 'partners', 'portfolio_projects']) {
  assert(
    policiesFor(table, 'SELECT').some((policy) => hasAnon(policy) && /USING \(true\)/i.test(policy.body)),
    `${table} must remain publicly readable`
  );
  assertAdminOnly(table, ['INSERT', 'UPDATE', 'DELETE']);
}

assertPublicInsert('messages');
assertAdminOnly('messages', ['SELECT', 'UPDATE', 'DELETE']);

assertAdminOnly('invoices');

assertPublicInsert('project_leads');
assertAdminOnly('project_leads', ['SELECT', 'UPDATE', 'DELETE']);

const signingSelectPolicies = policiesFor('partnership_signing_videos', 'SELECT');
assert(signingSelectPolicies.length > 0, 'signing videos must define SELECT policy');
assert(
  signingSelectPolicies.every((policy) => /is_published\s*=\s*true/i.test(policy.body) && requiresAdmin(policy)),
  'signing video SELECT must expose only published rows to public users while allowing admin reads'
);
assertAdminOnly('partnership_signing_videos', ['INSERT', 'UPDATE', 'DELETE']);

const storageSelectPolicies = policiesFor('storage.objects', 'SELECT');
assert(storageSelectPolicies.length > 0, 'storage.objects must define SELECT policy');
assert(
  storageSelectPolicies.every((policy) => !/partnership-(videos|thumbnails)'?\s*(?:,|\))[^;]*\bOR\b\s*true/i.test(policy.body)),
  'signing video storage listings must not be anonymously exposed'
);
assertAdminOnly('storage.objects', ['INSERT', 'UPDATE', 'DELETE']);

console.log('Security policy checks passed.');
