import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const migrationsDir = join(root, 'supabase', 'migrations');
const migrationSql = readdirSync(migrationsDir)
  .filter((name) => name.endsWith('.sql'))
  .sort()
  .map((name) => readFileSync(join(migrationsDir, name), 'utf8'))
  .join('\n');

const policyBlocks = migrationSql.match(/CREATE POLICY[\s\S]*?;/g) || [];
const adminCheck = "lower(auth.jwt() ->> 'email') = 'info@commergio.com'";
const publicReadTables = new Set(['products', 'partners', 'portfolio_projects']);
const publicInsertTables = new Set(['messages', 'project_leads']);

function normalize(sql) {
  return sql.toLowerCase().replace(/\s+/g, ' ').trim();
}

function tableFor(block) {
  const normalized = normalize(block);
  if (normalized.includes(' on storage.objects ')) return 'storage.objects';
  const match = normalized.match(/\son\s+(?:public\.)?([a-z_]+)/);
  return match?.[1] || '';
}

function operationFor(block) {
  return normalize(block).match(/\sfor\s+(select|insert|update|delete)\s/)?.[1] || '';
}

function grantsAnon(block) {
  const normalized = normalize(block);
  return / to .*?\banon\b/.test(normalized);
}

function hasAdminCheck(block) {
  return normalize(block).includes(adminCheck);
}

for (const block of policyBlocks) {
  const table = tableFor(block);
  const operation = operationFor(block);
  const normalized = normalize(block);

  if (!grantsAnon(block)) {
    continue;
  }

  const allowedPublicRead = operation === 'select' && publicReadTables.has(table);
  const allowedPublicInsert = operation === 'insert' && publicInsertTables.has(table);
  const allowedMessagesInsert = table === 'messages' && operation === 'insert';
  const allowedPublishedSigningVideoRead =
    table === 'partnership_signing_videos' &&
    operation === 'select' &&
    normalized.includes('is_published = true');
  const allowedPublicStorageList =
    table === 'storage.objects' &&
    operation === 'select' &&
    normalized.includes("'portfolio-images'") &&
    normalized.includes("'product-images'") &&
    normalized.includes("'partner-logos'") &&
    !normalized.includes("'partnership-videos'") &&
    !normalized.includes("'partnership-thumbnails'");

  assert.ok(
    allowedPublicRead ||
      allowedPublicInsert ||
      allowedMessagesInsert ||
      allowedPublishedSigningVideoRead ||
      allowedPublicStorageList,
    `Unexpected anon ${operation.toUpperCase()} policy on ${table}:\n${block}`
  );
}

for (const block of policyBlocks) {
  const table = tableFor(block);
  const operation = operationFor(block);
  const publicInsert = operation === 'insert' && publicInsertTables.has(table);
  if (
    ['insert', 'update', 'delete'].includes(operation) &&
    !publicInsert
  ) {
    assert.ok(
      hasAdminCheck(block),
      `Mutation policy on ${table} is missing the admin email check:\n${block}`
    );
  }
}

const adminPage = readFileSync(join(root, 'app', 'admin', 'page.tsx'), 'utf8');
assert.equal(
  /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/.test(adminPage),
  false,
  'Admin auth bypass must not be enabled'
);

const csp = readFileSync(join(root, 'next.config.js'), 'utf8');
assert.match(
  csp,
  /media-src 'self' https:\/\/\*\.supabase\.co/,
  'CSP media-src must allow Supabase-hosted signing videos'
);

const startProjectModal = readFileSync(join(root, 'components', 'StartProjectModal.tsx'), 'utf8');
assert.match(
  startProjectModal,
  /const \{ error \} = await supabase\.from\('project_leads'\)\.insert/,
  'Project lead inserts must inspect Supabase errors'
);
assert.match(
  startProjectModal,
  /if \(error\) \{/,
  'Project lead form must not show success after an insert error'
);

console.log('Security policy checks passed.');
