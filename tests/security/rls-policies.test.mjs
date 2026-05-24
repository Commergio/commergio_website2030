import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const sqlFiles = [
  'supabase/migrations/20260421165856_create_project_leads_table.sql',
  'supabase/migrations/20260509180000_cms_rls_and_storage_public_access.sql',
  'supabase/migrations/20260521120000_partnership_signing_videos.sql',
  'supabase/migrations/20260524110500_lock_down_cms_admin_policies.sql',
];

const allowedPublicInserts = new Set([
  'Anyone can submit a lead',
  'cms_messages_insert',
  'cms_project_leads_insert',
]);

const privateSelectTables = new Set([
  'public.messages',
  'public.invoices',
  'public.project_leads',
]);

const destructiveCommands = new Set(['INSERT', 'UPDATE', 'DELETE']);
const adminCheck = "lower(auth.jwt() ->> 'email') = 'info@commergio.com'";

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function policyBlocks(sql) {
  return [...sql.matchAll(/CREATE POLICY\s+"([^"]+)"\s+ON\s+([^\s]+)\s+FOR\s+(SELECT|INSERT|UPDATE|DELETE)[\s\S]*?;/gi)].map(
    ([block, name, table, command]) => ({
      block,
      name,
      table,
      command: command.toUpperCase(),
    }),
  );
}

const allPolicies = sqlFiles.flatMap((path) => policyBlocks(read(path)).map((policy) => ({ ...policy, path })));

for (const policy of allPolicies) {
  const grantsAnon = /\bTO\s+[^;]*\banon\b/i.test(policy.block);

  if (policy.command === 'SELECT' && privateSelectTables.has(policy.table)) {
    assert.equal(
      grantsAnon,
      false,
      `${policy.path}: ${policy.name} must not allow anonymous reads from ${policy.table}`,
    );
  }

  if (policy.table === 'public.partnership_signing_videos' && policy.command === 'SELECT' && grantsAnon) {
    assert.match(
      policy.block,
      /USING\s*\(\s*is_published\s*=\s*true\s*\)/i,
      `${policy.path}: anonymous signing-video reads must be limited to published rows`,
    );
  }

  if (!destructiveCommands.has(policy.command)) {
    continue;
  }

  const publicInsertAllowed = policy.command === 'INSERT' && allowedPublicInserts.has(policy.name);

  if (!publicInsertAllowed) {
    assert.equal(
      grantsAnon,
      false,
      `${policy.path}: ${policy.name} must not grant anonymous ${policy.command}`,
    );
    assert.match(
      policy.block,
      /\bTO\s+authenticated\b/i,
      `${policy.path}: ${policy.name} must target authenticated admin users`,
    );
    assert.ok(
      policy.block.includes(adminCheck),
      `${policy.path}: ${policy.name} must check the admin email claim`,
    );
  }
}

const adminPage = read('app/admin/page.tsx');
assert.doesNotMatch(
  adminPage,
  /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/,
  'Admin auth bypass must not be enabled',
);

const remediation = read('supabase/migrations/20260524110500_lock_down_cms_admin_policies.sql');
for (const oldPolicy of [
  'Authenticated users can view leads',
  'Authenticated users can update leads',
  'Authenticated users can delete leads',
]) {
  assert.match(
    remediation,
    new RegExp(`DROP POLICY IF EXISTS "${oldPolicy}"`),
    `Remediation migration must drop old broad policy: ${oldPolicy}`,
  );
}

console.log(`Validated ${allPolicies.length} RLS policies for anonymous access regressions.`);
