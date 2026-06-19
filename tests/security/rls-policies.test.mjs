import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();
const migrationsDir = join(root, 'supabase', 'migrations');

function readSql() {
  return readdirSync(migrationsDir)
    .filter((name) => name.endsWith('.sql'))
    .sort()
    .map((name) => ({
      name,
      sql: readFileSync(join(migrationsDir, name), 'utf8'),
    }));
}

function policyBlocks(sql) {
  return [...sql.matchAll(/CREATE\s+POLICY\b[\s\S]*?;/gi)].map((match) => match[0]);
}

function policyDetails(block) {
  const normalized = block.replace(/\s+/g, ' ');
  const target = normalized.match(/\bON\s+([a-z0-9_.]+)\s+FOR\s+(SELECT|INSERT|UPDATE|DELETE)\b/i);
  return {
    normalized,
    table: target?.[1]?.toLowerCase() ?? '',
    action: target?.[2]?.toUpperCase() ?? '',
    grantsAnon: /\bTO\b[^;]*\banon\b/i.test(normalized),
  };
}

test('admin auth bypass is disabled', () => {
  const adminPage = readFileSync(join(root, 'app', 'admin', 'page.tsx'), 'utf8');
  assert.doesNotMatch(adminPage, /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/);
});

test('anonymous policies cannot mutate CMS, private, or storage data', () => {
  const allowedAnonMutations = new Set([
    'public.messages:INSERT',
    'public.project_leads:INSERT',
    'project_leads:INSERT',
  ]);
  const failures = [];

  for (const { name, sql } of readSql()) {
    for (const block of policyBlocks(sql)) {
      const details = policyDetails(block);
      if (!details.table || !details.action || details.action === 'SELECT' || !details.grantsAnon) {
        continue;
      }

      const key = `${details.table}:${details.action}`;
      if (!allowedAnonMutations.has(key)) {
        failures.push(`${name}: ${key} grants anon mutation`);
      }
    }
  }

  assert.deepEqual(failures, []);
});

test('private admin tables are not readable by anon policies', () => {
  const privateTables = new Set(['public.messages', 'public.invoices', 'public.project_leads', 'project_leads']);
  const failures = [];

  for (const { name, sql } of readSql()) {
    for (const block of policyBlocks(sql)) {
      const details = policyDetails(block);
      if (details.action === 'SELECT' && details.grantsAnon && privateTables.has(details.table)) {
        failures.push(`${name}: ${details.table} grants anon SELECT`);
      }
    }
  }

  assert.deepEqual(failures, []);
});

test('public services and signing video reads are limited to published rows', () => {
  const publishedTables = new Set(['public.company_services', 'public.partnership_signing_videos']);
  const failures = [];

  for (const { name, sql } of readSql()) {
    for (const block of policyBlocks(sql)) {
      const details = policyDetails(block);
      if (
        details.action === 'SELECT' &&
        details.grantsAnon &&
        publishedTables.has(details.table) &&
        !/\bis_published\b/i.test(details.normalized)
      ) {
        failures.push(`${name}: ${details.table} anon SELECT is not filtered by is_published`);
      }
    }
  }

  assert.deepEqual(failures, []);
});

test('anonymous storage policies cannot list signing video objects', () => {
  const failures = [];

  for (const { name, sql } of readSql()) {
    for (const block of policyBlocks(sql)) {
      const details = policyDetails(block);
      if (
        details.table === 'storage.objects' &&
        details.action === 'SELECT' &&
        details.grantsAnon &&
        details.normalized.includes("'partnership-videos'")
      ) {
        failures.push(`${name}: anon storage SELECT includes partnership-videos bucket`);
      }
    }
  }

  assert.deepEqual(failures, []);
});
