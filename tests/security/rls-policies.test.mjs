import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

const migrationsDir = join(root, 'supabase/migrations');
const migrationFiles = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();
const migrationSql = Object.fromEntries(
  migrationFiles.map((file) => [file, readFileSync(join(migrationsDir, file), 'utf8')])
);

const allSql = Object.values(migrationSql).join('\n');

function assertNoAnonPolicy(table, actions) {
  for (const action of actions) {
    const pattern = new RegExp(
      `ON\\s+${table.replace('.', '\\.')}\\s+FOR\\s+${action}\\s+TO\\s+anon\\b`,
      'i'
    );
    assert.equal(
      pattern.test(allSql),
      false,
      `${table} ${action} must not be granted to anon`
    );
  }
}

const adminPage = read('app/admin/page.tsx');
assert.equal(
  /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/.test(adminPage),
  false,
  'admin auth bypass must stay disabled'
);

assert.match(
  allSql,
  /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.is_commergio_admin\(\)/i,
  'admin helper function must exist for RLS policies'
);

for (const table of ['public.products', 'public.partners', 'public.portfolio_projects']) {
  assertNoAnonPolicy(table, ['INSERT', 'UPDATE', 'DELETE']);
}

assertNoAnonPolicy('public.messages', ['SELECT', 'UPDATE', 'DELETE']);
assertNoAnonPolicy('public.invoices', ['SELECT', 'INSERT', 'UPDATE', 'DELETE']);
assertNoAnonPolicy('public.project_leads', ['SELECT', 'UPDATE', 'DELETE']);
assertNoAnonPolicy('public.partnership_signing_videos', ['INSERT', 'UPDATE', 'DELETE']);
assertNoAnonPolicy('public.company_services', ['INSERT', 'UPDATE', 'DELETE']);
assertNoAnonPolicy('storage.objects', ['INSERT', 'UPDATE', 'DELETE']);

assert.match(
  allSql,
  /ON\s+public\.partnership_signing_videos\s+FOR\s+SELECT[\s\S]*USING\s*\(\s*is_published\s*=\s*true\s+OR\s+public\.is_commergio_admin\(\)\s*\)/i,
  'public signing video reads must be limited to published rows'
);
assert.match(
  allSql,
  /ON\s+public\.company_services\s+FOR\s+SELECT[\s\S]*USING\s*\(\s*is_published\s*=\s*true\s+OR\s+public\.is_commergio_admin\(\)\s*\)/i,
  'public company service reads must be limited to published rows'
);

assert.ok(
  migrationFiles.includes('20260706110500_lock_down_cms_admin_policies.sql'),
  'an idempotent remediation migration must be present for already-applied policies'
);

const startProjectModal = read('components/StartProjectModal.tsx');
assert.match(
  startProjectModal,
  /const\s+\{\s*error\s*\}\s*=\s*await\s+supabase\.from\('project_leads'\)\.insert/,
  'project lead submission must inspect Supabase insert errors'
);
assert.match(
  startProjectModal,
  /setFormError\(m\.errSubmit\)/,
  'project lead submission failures must be shown to users'
);

const servicesHook = read('hooks/useCompanyServices.ts');
assert.match(
  servicesHook,
  /if\s*\(\s*!error\s*&&\s*data\s*\)/,
  'empty service query results must be treated as authoritative database results'
);

const nextConfig = read('next.config.js');
assert.match(
  nextConfig,
  /media-src 'self' https:\/\/\*\.supabase\.co/,
  'CSP media-src must allow Supabase-hosted published videos'
);
