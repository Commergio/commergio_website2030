import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const migrationsDir = join(root, 'supabase', 'migrations');
const migrationFiles = readdirSync(migrationsDir)
  .filter((name) => name.endsWith('.sql'))
  .sort();

const migrations = migrationFiles
  .map((name) => `\n-- ${name}\n${readFileSync(join(migrationsDir, name), 'utf8')}`)
  .join('\n');

const adminPage = readFileSync(join(root, 'app', 'admin', 'page.tsx'), 'utf8');
assert.doesNotMatch(
  adminPage,
  /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/,
  'admin authentication bypass must not be enabled'
);

assert.match(
  migrations,
  /CREATE OR REPLACE FUNCTION public\.is_commergio_admin\(\)/,
  'admin RLS helper must be defined'
);

const publicInsertTables = new Set(['public.messages', 'public.project_leads', 'project_leads']);
const policyBlocks = migrations
  .split(/\n(?=CREATE POLICY )/g)
  .filter((block) => block.trimStart().startsWith('CREATE POLICY '));

for (const block of policyBlocks) {
  const name = block.match(/CREATE POLICY\s+"([^"]+)"/)?.[1] ?? '<unknown>';
  const table = block.match(/\sON\s+([a-z_]+(?:\.[a-z_]+)?)/i)?.[1] ?? '<unknown>';
  const command = block.match(/\sFOR\s+(SELECT|INSERT|UPDATE|DELETE)\b/i)?.[1]?.toUpperCase();
  const roles = block.match(/\sTO\s+([^\n]+?)\s+(?:USING|WITH CHECK)/is)?.[1] ?? '';
  const grantsAnon = /\banon\b/i.test(roles);

  if (!command || !grantsAnon) continue;

  if (command === 'INSERT') {
    assert(
      publicInsertTables.has(table),
      `${name} grants anonymous INSERT on ${table}; only public form tables may accept anon inserts`
    );
  } else if (command === 'UPDATE' || command === 'DELETE') {
    assert.fail(`${name} grants anonymous ${command} on ${table}`);
  }
}

for (const table of ['public.messages', 'public.invoices', 'public.project_leads']) {
  const privateSelect = policyBlocks.find((block) => {
    const blockTable = block.match(/\sON\s+([a-z_]+(?:\.[a-z_]+)?)/i)?.[1];
    return blockTable === table && /\sFOR\s+SELECT\b/i.test(block);
  });
  assert(privateSelect, `${table} must have an explicit SELECT policy`);
  assert.doesNotMatch(privateSelect, /\sTO\s+anon\b/i, `${table} SELECT must not be public`);
  assert.match(privateSelect, /public\.is_commergio_admin\(\)/, `${table} SELECT must be admin-only`);
}

for (const table of ['public.company_services', 'public.partnership_signing_videos']) {
  const publicSelect = policyBlocks.find((block) => {
    const blockTable = block.match(/\sON\s+([a-z_]+(?:\.[a-z_]+)?)/i)?.[1];
    return blockTable === table && /\sFOR\s+SELECT\b/i.test(block);
  });
  assert(publicSelect, `${table} must have an explicit SELECT policy`);
  assert.match(publicSelect, /is_published\s*=\s*true/, `${table} public SELECT must require published rows`);
}

const storageMutations = policyBlocks.filter(
  (block) => /\sON\s+storage\.objects\b/i.test(block) && /\sFOR\s+(INSERT|UPDATE|DELETE)\b/i.test(block)
);
assert(storageMutations.length > 0, 'storage mutation policies must be present');
for (const block of storageMutations) {
  assert.doesNotMatch(block, /\sTO\s+anon\b/i, 'storage mutations must not grant anon access');
  assert.match(block, /public\.is_commergio_admin\(\)/, 'storage mutations must require admin');
}

console.log('RLS security policy checks passed.');
