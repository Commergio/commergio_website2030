import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const adminPage = readFileSync('app/admin/page.tsx', 'utf8');
if (/TEMP_BYPASS_ADMIN_AUTH/.test(adminPage)) {
  throw new Error('Admin auth bypass flag must not exist in app/admin/page.tsx');
}

const migrationDir = 'supabase/migrations';
const sql = readdirSync(migrationDir)
  .filter((file) => file.endsWith('.sql'))
  .sort()
  .map((file) => readFileSync(join(migrationDir, file), 'utf8'))
  .join('\n\n');

const policyBlocks = sql.match(/CREATE POLICY[\s\S]*?;/g) ?? [];

const normalizeTable = (table) => table.replace(/^public\./, '');
const hasAnonRole = (roles) => /\banon\b/.test(roles);
const hasAdminCheck = (block) =>
  /lower\s*\(\s*auth\.jwt\(\)\s*->>\s*'email'\s*\)\s*=\s*'info@commergio\.com'/i.test(block);

const parsedPolicies = policyBlocks.map((block) => {
  const name = block.match(/CREATE POLICY\s+"([^"]+)"/)?.[1] ?? '<unknown>';
  const table = normalizeTable(block.match(/\sON\s+([a-zA-Z_][\w.]*)\s+FOR\s+(SELECT|INSERT|UPDATE|DELETE)/)?.[1] ?? '');
  const operation = block.match(/\sON\s+[a-zA-Z_][\w.]*\s+FOR\s+(SELECT|INSERT|UPDATE|DELETE)/)?.[1] ?? '';
  const roles = block.match(/\sTO\s+([\s\S]*?)\s+(?:USING|WITH CHECK)/)?.[1].replace(/\s+/g, ' ').trim() ?? '';
  return { name, table, operation, roles, block };
});

const cmsMutationTables = new Set([
  'products',
  'partners',
  'portfolio_projects',
  'messages',
  'invoices',
  'project_leads',
  'partnership_signing_videos',
  'storage.objects',
]);

const privateTables = new Set(['messages', 'invoices', 'project_leads']);

const publicInsertAllowed = (policy) =>
  policy.operation === 'INSERT' &&
  ((policy.table === 'messages' && policy.name === 'cms_messages_insert') ||
    (policy.table === 'project_leads' && policy.name === 'Anyone can submit a lead'));

for (const policy of parsedPolicies) {
  if (cmsMutationTables.has(policy.table) && ['INSERT', 'UPDATE', 'DELETE'].includes(policy.operation)) {
    if (hasAnonRole(policy.roles) && !publicInsertAllowed(policy)) {
      throw new Error(`${policy.name} allows anonymous ${policy.operation} on ${policy.table}`);
    }
    if (!publicInsertAllowed(policy) && !hasAdminCheck(policy.block)) {
      throw new Error(`${policy.name} ${policy.operation} on ${policy.table} is missing the admin email check`);
    }
  }

  if (privateTables.has(policy.table) && ['SELECT', 'UPDATE', 'DELETE'].includes(policy.operation)) {
    if (hasAnonRole(policy.roles)) {
      throw new Error(`${policy.name} allows anonymous ${policy.operation} on private table ${policy.table}`);
    }
    if (!hasAdminCheck(policy.block)) {
      throw new Error(`${policy.name} ${policy.operation} on private table ${policy.table} is missing the admin email check`);
    }
  }

  if (
    policy.table === 'partnership_signing_videos' &&
    policy.operation === 'SELECT' &&
    hasAnonRole(policy.roles) &&
    !/is_published\s*=\s*true/i.test(policy.block)
  ) {
    throw new Error(`${policy.name} exposes unpublished signing videos to anonymous users`);
  }

  if (
    policy.table === 'storage.objects' &&
    policy.operation === 'SELECT' &&
    hasAnonRole(policy.roles) &&
    /partnership-(?:videos|thumbnails)/.test(policy.block)
  ) {
    throw new Error(`${policy.name} allows anonymous listing of partnership signing video storage objects`);
  }
}

if (!/20260602110500_lock_down_cms_admin_policies/.test(readdirSync(migrationDir).join('\n'))) {
  throw new Error('Missing remediation migration for already-applied unsafe CMS policies');
}

console.log(`Security policy checks passed for ${parsedPolicies.length} RLS policies.`);
