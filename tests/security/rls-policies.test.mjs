import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const adminPage = readFileSync(join(root, 'app/admin/page.tsx'), 'utf8');
const migrationsDir = join(root, 'supabase/migrations');
const migrationFiles = readdirSync(migrationsDir)
  .filter((name) => name.endsWith('.sql'))
  .sort();
const migrations = Object.fromEntries(
  migrationFiles.map((name) => [name, readFileSync(join(migrationsDir, name), 'utf8')])
);
const allSql = Object.values(migrations).join('\n');
const lockDownSql = migrations['20260531110500_lock_down_cms_admin_policies.sql'];

assert.ok(lockDownSql, 'expected lockdown remediation migration to exist');
assert.ok(!adminPage.includes('TEMP_BYPASS_ADMIN_AUTH'), 'admin auth bypass flag must not exist');

const adminCheck = "lower(auth.jwt() ->> 'email') = 'info@commergio.com'";
const publicContentTables = ['products', 'partners', 'portfolio_projects'];
const privateTables = ['messages', 'invoices', 'project_leads'];
const adminMutationTables = [
  ...publicContentTables,
  ...privateTables,
  'partnership_signing_videos',
];

function policyBlock(sql, policyName) {
  const escaped = policyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = sql.match(new RegExp(`CREATE POLICY "${escaped}"[\\s\\S]*?;`));
  assert.ok(match, `missing policy ${policyName}`);
  return match[0];
}

function assertAdminPolicy(policyName) {
  const block = policyBlock(lockDownSql, policyName);
  assert.match(block, /TO authenticated/, `${policyName} must require authenticated role`);
  assert.ok(block.includes(adminCheck), `${policyName} must check the admin email`);
}

for (const table of publicContentTables) {
  assertAdminPolicy(`cms_${table === 'portfolio_projects' ? 'portfolio' : table}_insert`);
  assertAdminPolicy(`cms_${table === 'portfolio_projects' ? 'portfolio' : table}_update`);
  assertAdminPolicy(`cms_${table === 'portfolio_projects' ? 'portfolio' : table}_delete`);
}

for (const action of ['select', 'insert', 'update', 'delete']) {
  assertAdminPolicy(`cms_invoices_${action}`);
}

for (const action of ['select', 'update', 'delete']) {
  assertAdminPolicy(`cms_messages_${action}`);
}

for (const action of ['view', 'update', 'delete']) {
  assertAdminPolicy(`Authenticated admin can ${action} leads`);
}

for (const action of ['insert', 'update', 'delete']) {
  assertAdminPolicy(`cms_signing_videos_${action}`);
}
assertAdminPolicy('admin_signing_videos_select');
assertAdminPolicy('cms_storage_insert');
assertAdminPolicy('cms_storage_update');
assertAdminPolicy('cms_storage_delete');

assert.match(
  policyBlock(lockDownSql, 'cms_messages_insert'),
  /TO anon, authenticated[\s\S]*WITH CHECK \(true\)/,
  'contact form inserts should remain public'
);
assert.match(
  policyBlock(lockDownSql, 'Anyone can submit a lead'),
  /TO anon, authenticated[\s\S]*WITH CHECK \(true\)/,
  'project lead submissions should remain public'
);
assert.match(
  policyBlock(lockDownSql, 'public_signing_videos_select'),
  /USING \(is_published = true\)/,
  'public signing video reads must only expose published videos'
);

for (const table of adminMutationTables) {
  const anonMutation = new RegExp(`ON public\\.${table} FOR (?:UPDATE|DELETE)[^;]*?TO anon`);
  assert.ok(!anonMutation.test(allSql), `${table} update/delete policies must not include anon`);
}

for (const table of ['products', 'partners', 'portfolio_projects', 'invoices', 'partnership_signing_videos']) {
  const anonInsert = new RegExp(`ON public\\.${table} FOR INSERT[^;]*?TO anon`);
  assert.ok(!anonInsert.test(allSql), `${table} insert policies must not include anon`);
}

for (const action of ['INSERT', 'UPDATE', 'DELETE']) {
  const anonStorageMutation = new RegExp(`ON storage\\.objects FOR ${action}[^;]*?TO anon`);
  assert.ok(!anonStorageMutation.test(allSql), `storage ${action.toLowerCase()} policies must not include anon`);
}
