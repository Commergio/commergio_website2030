import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const migrationsDir = join(root, 'supabase', 'migrations');
const adminPage = readFileSync(join(root, 'app', 'admin', 'page.tsx'), 'utf8');

assert.doesNotMatch(
  adminPage,
  /TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/,
  'Admin auth bypass must not be enabled',
);

const sqlFiles = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

const policies = [];

for (const file of sqlFiles) {
  const sql = readFileSync(join(migrationsDir, file), 'utf8');
  const policyPattern = /CREATE\s+POLICY\s+"([^"]+)"[\s\S]*?;/gi;

  for (const match of sql.matchAll(policyPattern)) {
    const block = match[0];
    const before = sql.slice(0, match.index);
    const line = before.split('\n').length;
    const operation = block.match(/\bFOR\s+(SELECT|INSERT|UPDATE|DELETE)\b/i)?.[1]?.toUpperCase();
    const relation = block.match(/\bON\s+([\w.]+)\s+FOR\b/i)?.[1]?.toLowerCase();

    policies.push({
      file,
      line,
      name: match[1],
      operation,
      relation,
      block,
      hasAnon: /\bTO\s+[^;]*\banon\b/i.test(block),
      hasAdminEmail: /lower\s*\(\s*auth\.jwt\(\)\s*->>\s*'email'\s*\)\s*=\s*'info@commergio\.com'/i.test(block),
    });
  }
}

const publicFormInserts = new Set(['public.messages', 'messages', 'public.project_leads', 'project_leads']);
const privateTables = new Set(['public.messages', 'messages', 'public.invoices', 'invoices', 'public.project_leads', 'project_leads']);

const violations = [];

for (const policy of policies) {
  const location = `${policy.file}:${policy.line} (${policy.name})`;

  if (!policy.operation || !policy.relation) {
    violations.push(`${location}: policy parser could not identify operation/relation`);
    continue;
  }

  const isPublicFormInsert =
    policy.operation === 'INSERT' && publicFormInserts.has(policy.relation);
  const isMutation = ['INSERT', 'UPDATE', 'DELETE'].includes(policy.operation);

  if (policy.hasAnon && isMutation && !isPublicFormInsert) {
    violations.push(`${location}: anon role must not be able to ${policy.operation} ${policy.relation}`);
  }

  if (isMutation && !isPublicFormInsert && !policy.hasAdminEmail) {
    violations.push(`${location}: admin mutation must be scoped to the admin email`);
  }

  if (policy.operation === 'SELECT' && privateTables.has(policy.relation)) {
    if (policy.hasAnon) {
      violations.push(`${location}: anon role must not read private table ${policy.relation}`);
    }
    if (!policy.hasAdminEmail) {
      violations.push(`${location}: private table reads must be scoped to the admin email`);
    }
  }

  if (policy.operation === 'SELECT' && policy.relation === 'public.partnership_signing_videos' && policy.hasAnon) {
    assert.match(
      policy.block,
      /\bis_published\s*=\s*true\b/i,
      `${location}: public signing-video reads must be limited to published rows`,
    );
  }
}

assert.deepEqual(violations, []);
