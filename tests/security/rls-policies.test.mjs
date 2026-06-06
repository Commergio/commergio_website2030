import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const adminPage = readFileSync(join(root, 'app/admin/page.tsx'), 'utf8');
const migrationsDir = join(root, 'supabase/migrations');
const migrationFiles = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

const sql = migrationFiles
  .map((file) => readFileSync(join(migrationsDir, file), 'utf8'))
  .join('\n');

assert(
  !adminPage.includes('TEMP_BYPASS_ADMIN_AUTH'),
  'Admin dashboard must not include a hard-coded auth bypass flag.'
);

assert(
  !adminPage.includes('setAuthed(true);\n      setChecking(false);\n      return;'),
  'Admin dashboard must not grant access before checking the Supabase session.'
);

assert(
  sql.includes('public.is_commergio_admin()'),
  'Migrations must define and use the Commergio admin predicate.'
);

const policies = [...sql.matchAll(/CREATE POLICY\s+"([^"]+)"\s+ON\s+([\w.]+)\s+FOR\s+(SELECT|INSERT|UPDATE|DELETE)\s+TO\s+([^;]+?)(?:USING|WITH CHECK)\s+([\s\S]*?);/gi)]
  .map((match) => ({
    name: match[1],
    table: match[2].replace(/^public\./, ''),
    action: match[3].toUpperCase(),
    roles: match[4].replace(/\s+/g, ' ').trim(),
    body: match[5].replace(/\s+/g, ' ').trim(),
  }));

assert(policies.length > 0, 'Expected to find RLS policies in migrations.');

const allowAnonInsert = new Set(['messages', 'project_leads']);
const unsafeAnonMutations = policies.filter(
  (policy) =>
    /\banon\b/i.test(policy.roles) &&
    ['INSERT', 'UPDATE', 'DELETE'].includes(policy.action) &&
    !(policy.action === 'INSERT' && allowAnonInsert.has(policy.table))
);

assert.deepEqual(
  unsafeAnonMutations.map(({ name, table, action }) => `${table}.${name}.${action}`),
  [],
  'Only public form tables may allow anonymous inserts; no anonymous CMS/private mutations are allowed.'
);

const privateTables = new Set(['messages', 'invoices', 'project_leads']);
const unsafePrivateReads = policies.filter(
  (policy) =>
    privateTables.has(policy.table) &&
    policy.action === 'SELECT' &&
    /\banon\b/i.test(policy.roles)
);

assert.deepEqual(
  unsafePrivateReads.map(({ name, table }) => `${table}.${name}`),
  [],
  'Private admin tables must not be selectable with the anonymous role.'
);

const protectedMutations = policies.filter(
  (policy) =>
    ['INSERT', 'UPDATE', 'DELETE'].includes(policy.action) &&
    !(
      policy.action === 'INSERT' &&
      allowAnonInsert.has(policy.table)
    )
);

const missingAdminPredicate = protectedMutations.filter(
  (policy) => !policy.body.includes('public.is_commergio_admin()')
);

assert.deepEqual(
  missingAdminPredicate.map(({ name, table, action }) => `${table}.${name}.${action}`),
  [],
  'Every CMS/private mutation policy must require the Commergio admin predicate.'
);

const signingSelectPolicies = policies.filter(
  (policy) =>
    policy.table === 'partnership_signing_videos' &&
    policy.action === 'SELECT'
);

assert(
  signingSelectPolicies.length > 0,
  'Expected a signing-video SELECT policy.'
);

assert(
  signingSelectPolicies.every(
    (policy) =>
      policy.body.includes('is_published = true') &&
      policy.body.includes('public.is_commergio_admin()')
  ),
  'Signing-video SELECT policies must expose only published rows publicly while allowing admin access.'
);

const unsafeSigningStorageSelect = policies.filter(
  (policy) =>
    policy.table === 'storage.objects' &&
    policy.action === 'SELECT' &&
    /partnership-videos|partnership-thumbnails/.test(policy.body) &&
    !policy.body.includes('public.is_commergio_admin()')
);

assert.deepEqual(
  unsafeSigningStorageSelect.map(({ name }) => name),
  [],
  'Signing-video storage object listing must be admin-only.'
);

console.log(`RLS security scan passed across ${migrationFiles.length} migration files.`);
