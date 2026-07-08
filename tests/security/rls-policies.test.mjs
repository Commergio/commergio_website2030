import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const migrationDir = join(root, 'supabase', 'migrations');
const migrations = Object.fromEntries(
  readdirSync(migrationDir)
    .filter((name) => name.endsWith('.sql'))
    .map((name) => [name, readFileSync(join(migrationDir, name), 'utf8')])
);

const adminPage = readFileSync(join(root, 'app', 'admin', 'page.tsx'), 'utf8');
assert.match(
  adminPage,
  /const\s+TEMP_BYPASS_ADMIN_AUTH\s*=\s*false;/,
  'admin authentication bypass must stay disabled'
);

const allSql = Object.values(migrations).join('\n');
const policyStatements = allSql
  .split(';')
  .map((statement) => statement.trim())
  .filter((statement) => /^CREATE\s+POLICY\b/i.test(statement));

for (const statement of policyStatements) {
  const rawTable = statement.match(/\bON\s+((?:(?:public|storage)\.)?\w+)/i)?.[1] ?? '';
  const table =
    rawTable && !rawTable.includes('.') && rawTable !== 'objects'
      ? `public.${rawTable}`
      : rawTable;
  const operation = statement.match(/\bFOR\s+(SELECT|INSERT|UPDATE|DELETE)\b/i)?.[1]?.toUpperCase() ?? '';
  const targetsAnon = /\bTO\s+[^;]*\banon\b/i.test(statement);

  assert(
    !(targetsAnon && ['UPDATE', 'DELETE'].includes(operation)),
    `anonymous users must not have ${operation} policy on ${table}`
  );

  assert(
    !(
      targetsAnon &&
      operation === 'INSERT' &&
      !['public.messages', 'public.project_leads'].includes(table)
    ),
    `anonymous INSERT is only allowed for public form submissions, not ${table}`
  );
}

for (const privateTable of ['messages', 'invoices', 'project_leads']) {
  const privateReadPolicyTargetsAnon = policyStatements.some(
    (statement) =>
      new RegExp(`\\bON\\s+public\\.${privateTable}\\s+FOR\\s+SELECT\\b`, 'i').test(statement) &&
      /\bTO\s+[^;]*\banon\b/i.test(statement)
  );
  assert.equal(
    privateReadPolicyTargetsAnon,
    false,
    `${privateTable} SELECT policies must not expose private data to anon users`
  );
}

for (const publicTable of ['company_services', 'partnership_signing_videos']) {
  const selectPolicy = policyStatements.find((statement) =>
    new RegExp(`\\bON\\s+public\\.${publicTable}\\s+FOR\\s+SELECT\\b`, 'i').test(statement)
  );
  assert.match(
    selectPolicy ?? '',
    /USING\s*\(\s*is_published\s+OR\s+public\.is_commergio_admin\(\)\s*\)/i,
    `${publicTable} public SELECT must be limited to published rows`
  );
}

for (const policyName of ['cms_storage_insert', 'cms_storage_update', 'cms_storage_delete']) {
  const adminStoragePolicy = new RegExp(
    `CREATE\\s+POLICY\\s+"${policyName}"[\\s\\S]*?public\\.is_commergio_admin\\(\\)`,
    'i'
  );
  assert.match(
    allSql,
    adminStoragePolicy,
    `${policyName} must require the Commergio admin account`
  );
}

console.log('Security policy checks passed.');
