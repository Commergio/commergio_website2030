import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const migrationsDir = new URL('../../supabase/migrations/', import.meta.url);
const migrationFiles = readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort();

const allSql = migrationFiles
  .map((file) => `-- ${file}\n${readFileSync(join(migrationsDir.pathname, file), 'utf8')}`)
  .join('\n\n');

function latestPolicyBody(policyName) {
  const dropMarker = `DROP POLICY IF EXISTS "${policyName}"`;
  const lastDropIndex = allSql.lastIndexOf(dropMarker);
  assert.notEqual(lastDropIndex, -1, `Expected ${policyName} to be dropped before recreation`);

  const createIndex = allSql.indexOf(`CREATE POLICY "${policyName}"`, lastDropIndex);
  assert.notEqual(createIndex, -1, `Expected ${policyName} to be recreated after its final drop`);

  const nextCreateIndex = allSql.indexOf('\nCREATE POLICY "', createIndex + 1);
  const nextSectionIndex = allSql.indexOf('\n-- ----------', createIndex + 1);
  const end = Math.min(
    ...[nextCreateIndex, nextSectionIndex].filter((index) => index !== -1),
    allSql.length,
  );

  return allSql.slice(createIndex, end);
}

test('admin/private table policies require the Commergio admin session', () => {
  const adminOnlyPolicies = [
    'cms_messages_select',
    'cms_messages_update',
    'cms_messages_delete',
    'cms_invoices_select',
    'cms_invoices_insert',
    'cms_invoices_update',
    'cms_invoices_delete',
    'cms_project_leads_select',
    'cms_project_leads_update',
    'cms_project_leads_delete',
    'cms_company_services_admin_select',
    'cms_company_services_insert',
    'cms_company_services_update',
    'cms_company_services_delete',
    'cms_signing_videos_admin_select',
    'cms_signing_videos_insert',
    'cms_signing_videos_update',
    'cms_signing_videos_delete',
    'cms_storage_admin_select',
    'cms_storage_insert',
    'cms_storage_update',
    'cms_storage_delete',
  ];

  for (const policyName of adminOnlyPolicies) {
    assert.match(
      latestPolicyBody(policyName),
      /public\.is_commergio_admin\(\)/,
      `${policyName} must be constrained to the admin email`,
    );
  }
});

test('public form policies only allow inserts into contact and lead tables', () => {
  const messagesInsert = latestPolicyBody('cms_messages_insert');
  assert.match(messagesInsert, /FOR INSERT[\s\S]*TO anon, authenticated[\s\S]*WITH CHECK \(true\)/);

  const leadsInsert = latestPolicyBody('Anyone can submit a lead');
  assert.match(leadsInsert, /FOR INSERT[\s\S]*TO anon, authenticated[\s\S]*WITH CHECK \(true\)/);

  for (const table of ['messages', 'project_leads', 'invoices']) {
    const tablePolicies = allSql.match(new RegExp(`CREATE POLICY[\\s\\S]*?ON public\\.${table}[\\s\\S]*?;`, 'g')) ?? [];
    for (const policy of tablePolicies) {
      if (/FOR INSERT/.test(policy) && /(messages|project_leads)/.test(policy)) continue;
      assert.doesNotMatch(policy, /TO anon[\s,]/, `${table} exposes a non-insert anon policy:\n${policy}`);
    }
  }
});

test('draft CMS rows are not publicly selectable', () => {
  assert.match(latestPolicyBody('cms_company_services_public_select'), /USING \(is_published = true\)/);
  assert.match(latestPolicyBody('cms_signing_videos_public_select'), /USING \(is_published = true\)/);
});

test('public storage listing excludes signing video buckets and writes require admin', () => {
  const publicStorage = latestPolicyBody('cms_storage_public_select');
  assert.match(publicStorage, /portfolio-images/);
  assert.doesNotMatch(publicStorage, /partnership-videos|partnership-thumbnails/);

  for (const policyName of ['cms_storage_insert', 'cms_storage_update', 'cms_storage_delete']) {
    const body = latestPolicyBody(policyName);
    assert.match(body, /TO authenticated/);
    assert.doesNotMatch(body, /TO anon/);
    assert.match(body, /public\.is_commergio_admin\(\)/);
  }
});
