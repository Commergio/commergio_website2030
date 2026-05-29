import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const repoRoot = process.cwd();
const migrationsDir = join(repoRoot, 'supabase', 'migrations');
const migrationFiles = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();
const sql = migrationFiles
  .map((file) => readFileSync(join(migrationsDir, file), 'utf8'))
  .join('\n\n');

const adminPage = readFileSync(join(repoRoot, 'app', 'admin', 'page.tsx'), 'utf8');
const nextConfig = readFileSync(join(repoRoot, 'next.config.js'), 'utf8');

function policyBlocks(source) {
  return [...source.matchAll(/CREATE POLICY\s+"([^"]+)"[\s\S]*?;/gi)].map((match) => ({
    name: match[1],
    body: match[0],
  }));
}

function normalize(value) {
  return value.replace(/\s+/g, ' ').toLowerCase();
}

const policies = policyBlocks(sql);
const policiesByName = new Map(policies.map((policy) => [policy.name, policy.body]));

function requirePolicy(name) {
  const body = policiesByName.get(name);
  assert.ok(body, `Expected policy "${name}" to exist`);
  return normalize(body);
}

assert.doesNotMatch(
  adminPage,
  /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/,
  'Admin auth bypass must not be enabled',
);

assert.match(
  nextConfig,
  /media-src[^"']*https:\/\/\*\.supabase\.co/,
  'CSP must allow Supabase-hosted published videos to play',
);

const allowedPublicMutations = new Set([
  'Anyone can submit a lead',
  'cms_messages_insert',
  'cms_project_leads_insert',
]);

for (const { name, body } of policies) {
  const normalized = normalize(body);
  const mutates = /\bfor (insert|update|delete)\b/.test(normalized);
  const grantsAnon = /\bto\s+anon\b|\bto\s+anon\s*,\s*authenticated\b/.test(normalized);

  assert.ok(
    !mutates || !grantsAnon || allowedPublicMutations.has(name),
    `Policy "${name}" grants anon CMS mutation access`,
  );
}

for (const name of [
  'cms_products_insert',
  'cms_products_update',
  'cms_products_delete',
  'cms_partners_insert',
  'cms_partners_update',
  'cms_partners_delete',
  'cms_portfolio_insert',
  'cms_portfolio_update',
  'cms_portfolio_delete',
  'cms_messages_select',
  'cms_messages_update',
  'cms_messages_delete',
  'cms_invoices_select',
  'cms_invoices_insert',
  'cms_invoices_update',
  'cms_invoices_delete',
  'Authenticated admin can view leads',
  'Authenticated admin can update leads',
  'Authenticated admin can delete leads',
  'cms_signing_videos_insert',
  'cms_signing_videos_update',
  'cms_signing_videos_delete',
  'cms_storage_insert',
  'cms_storage_update',
  'cms_storage_delete',
]) {
  const body = requirePolicy(name);
  assert.match(body, /to authenticated/, `Policy "${name}" must require auth`);
  assert.match(body, /info@commergio\.com/, `Policy "${name}" must require the admin email`);
}

for (const name of ['cms_messages_select', 'cms_invoices_select']) {
  const body = requirePolicy(name);
  assert.doesNotMatch(body, /to anon/, `Policy "${name}" must not expose private data to anon`);
}

const signingVideoSelect = requirePolicy('cms_signing_videos_select');
assert.match(
  signingVideoSelect,
  /is_published\s*=\s*true/,
  'Public signing-video SELECT must be limited to published rows',
);
assert.match(
  signingVideoSelect,
  /info@commergio\.com/,
  'Admin must still be able to read unpublished signing videos',
);

console.log('Security policy checks passed');
