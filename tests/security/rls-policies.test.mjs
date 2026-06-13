import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const migrationsDir = path.join(repoRoot, 'supabase/migrations');
const migrationFiles = readdirSync(migrationsDir)
  .filter((name) => name.endsWith('.sql'))
  .map((name) => path.join(migrationsDir, name));

const allSql = migrationFiles.map((file) => readFileSync(file, 'utf8')).join('\n\n');
const policyStatements = [...allSql.matchAll(/CREATE\s+POLICY[\s\S]*?;/gi)].map((match) => match[0]);

const allowedPublicFormInserts = new Set(['public.messages:insert', 'public.project_leads:insert', 'project_leads:insert']);

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function parsePolicy(statement) {
  const normalized = normalizeWhitespace(statement);
  const table = normalized.match(/\sON\s+([a-z_][\w.]*?)\s+FOR\s+/i)?.[1];
  const operation = normalized.match(/\sFOR\s+(SELECT|INSERT|UPDATE|DELETE)\s+/i)?.[1]?.toLowerCase();
  return { normalized, table, operation };
}

test('admin dashboard does not bypass Supabase admin authentication', () => {
  const adminPage = readFileSync(path.join(repoRoot, 'app/admin/page.tsx'), 'utf8');
  assert.doesNotMatch(adminPage, /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/);
});

test('anonymous role cannot mutate CMS tables or storage objects', () => {
  const violations = policyStatements
    .map(parsePolicy)
    .filter(({ normalized, table, operation }) => {
      if (!table || !operation || !['insert', 'update', 'delete'].includes(operation)) return false;
      if (!/\bTO\s+[^;]*\banon\b/i.test(normalized)) return false;
      return !allowedPublicFormInserts.has(`${table}:${operation}`);
    })
    .map(({ normalized }) => normalized);

  assert.deepEqual(violations, []);
});

test('non-form mutations require the Commergio admin JWT check', () => {
  const violations = policyStatements
    .map(parsePolicy)
    .filter(({ normalized, table, operation }) => {
      if (!table || !operation || !['insert', 'update', 'delete'].includes(operation)) return false;
      if (allowedPublicFormInserts.has(`${table}:${operation}`)) return false;
      return !/\bis_commergio_admin\s*\(/i.test(normalized);
    })
    .map(({ normalized }) => normalized);

  assert.deepEqual(violations, []);
});

test('private admin data is not readable with the anonymous role', () => {
  const privateTables = new Set(['public.messages', 'public.invoices', 'public.project_leads', 'project_leads']);
  const violations = policyStatements
    .map(parsePolicy)
    .filter(({ normalized, table, operation }) => {
      return operation === 'select' && privateTables.has(table) && /\bTO\s+[^;]*\banon\b/i.test(normalized);
    })
    .map(({ normalized }) => normalized);

  assert.deepEqual(violations, []);
});

test('public CMS reads for draftable content only expose published rows', () => {
  const draftableTables = new Set(['public.company_services', 'public.partnership_signing_videos']);
  const violations = policyStatements
    .map(parsePolicy)
    .filter(({ normalized, table, operation }) => {
      if (operation !== 'select' || !draftableTables.has(table)) return false;
      if (!/\bTO\s+[^;]*\banon\b/i.test(normalized)) return false;
      return !/\bis_published\s*=\s*true\b/i.test(normalized);
    })
    .map(({ normalized }) => normalized);

  assert.deepEqual(violations, []);
});

test('CSP allows Supabase-hosted video playback', () => {
  const nextConfig = readFileSync(path.join(repoRoot, 'next.config.js'), 'utf8');
  assert.match(nextConfig, /media-src[^\n]*https:\/\/\*\.supabase\.co/);
});
