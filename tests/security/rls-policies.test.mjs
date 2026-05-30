import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const read = (path) => readFileSync(join(repoRoot, path), 'utf8');

const adminPage = read('app/admin/page.tsx');
assert.doesNotMatch(
  adminPage,
  /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/,
  'admin auth bypass must not be enabled'
);

const nextConfig = read('next.config.js');
assert.match(
  nextConfig,
  /media-src[^"']*https:\/\/\*\.supabase\.co/,
  'CSP media-src must allow Supabase-hosted signing videos'
);

const migrationsDir = join(repoRoot, 'supabase/migrations');
const sql = readdirSync(migrationsDir)
  .filter((name) => name.endsWith('.sql'))
  .sort()
  .map((name) => read(`supabase/migrations/${name}`))
  .join('\n\n');

const policyBlocks = sql.match(/CREATE\s+POLICY[\s\S]*?;/gi) ?? [];
const normalizeTable = (table) => table.replace(/^public\./i, '').toLowerCase();
const rolesFor = (block) =>
  (block.match(/\bTO\s+([\s\S]*?)(?:\s+USING|\s+WITH\s+CHECK|;)/i)?.[1] ?? '')
    .replace(/\s+/g, ' ')
    .toLowerCase();

const publicInsertAllowed = new Set(['messages', 'project_leads']);
const privateTables = new Set(['messages', 'invoices', 'project_leads']);

for (const block of policyBlocks) {
  const tableMatch = block.match(/\bON\s+([^\s]+)\s+FOR\s+(SELECT|INSERT|UPDATE|DELETE)\b/i);
  assert.ok(tableMatch, `could not parse policy block:\n${block}`);

  const [, rawTable, actionRaw] = tableMatch;
  const table = normalizeTable(rawTable);
  const action = actionRaw.toUpperCase();
  const roles = rolesFor(block);
  const grantsAnon = /\banon\b/.test(roles);

  if (!grantsAnon) continue;

  const allowedPublicInsert = action === 'INSERT' && publicInsertAllowed.has(table);
  assert.ok(
    action === 'SELECT' || allowedPublicInsert,
    `anon must not be able to ${action} ${table}`
  );

  assert.ok(
    !(action === 'SELECT' && privateTables.has(table)),
    `anon must not be able to SELECT private table ${table}`
  );

  if (table === 'partnership_signing_videos' && action === 'SELECT') {
    assert.match(
      block,
      /is_published\s*=\s*true/i,
      'public signing video reads must be limited to published videos'
    );
  }

  if (table === 'storage.objects' && action === 'SELECT') {
    assert.doesNotMatch(
      block,
      /partnership-(?:videos|thumbnails)/i,
      'anon must not be able to list partnership signing video storage buckets'
    );
  }
}

for (const table of ['messages', 'invoices', 'project_leads', 'partnership_signing_videos']) {
  assert.match(
    sql,
    new RegExp(`ON\\s+(?:public\\.)?${table}[\\s\\S]*info@commergio\\.com`, 'i'),
    `${table} must have admin-email restricted policies`
  );
}
