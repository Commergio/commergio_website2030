import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const adminEmailCheck = "lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@commergio.com'";

const adminPage = readFileSync(join(root, 'app/admin/page.tsx'), 'utf8');
assert(!/TEMP_BYPASS_ADMIN_AUTH\s*=\s*true/.test(adminPage), 'admin auth bypass must stay disabled');

const migrationFiles = [
  'supabase/migrations/20260421165856_create_project_leads_table.sql',
  'supabase/migrations/20260509180000_cms_rls_and_storage_public_access.sql',
  'supabase/migrations/20260521120000_partnership_signing_videos.sql',
  'supabase/migrations/20260527110500_lock_down_cms_admin_policies.sql',
];

const adminOnlyPolicies = new Set([
  'Admin can view leads',
  'Admin can update leads',
  'Admin can delete leads',
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
  'cms_project_leads_select',
  'cms_project_leads_update',
  'cms_project_leads_delete',
  'cms_signing_videos_insert',
  'cms_signing_videos_update',
  'cms_signing_videos_delete',
  'cms_storage_insert',
  'cms_storage_update',
  'cms_storage_delete',
]);

const seenAdminOnly = new Set();
let sawPublishedSigningVideoRead = false;
let sawPublicMessageInsert = false;
let sawPublicLeadInsert = false;

for (const file of migrationFiles) {
  const sql = readFileSync(join(root, file), 'utf8');
  const policyPattern = /CREATE POLICY "([^"]+)"[\s\S]*?;/g;
  for (const match of sql.matchAll(policyPattern)) {
    const [block, name] = match;

    if (adminOnlyPolicies.has(name)) {
      seenAdminOnly.add(name);
      assert(
        !/\bTO\s+anon\b|\bTO\s+anon\s*,\s*authenticated\b/i.test(block),
        `${file}: ${name} must not grant anon access`
      );
      assert(block.includes(adminEmailCheck), `${file}: ${name} must check the admin email`);
    }

    if (name === 'cms_signing_videos_select') {
      sawPublishedSigningVideoRead = true;
      assert(block.includes('is_published'), `${file}: public signing video reads must be limited to published rows`);
    }

    if (name === 'cms_messages_insert') {
      sawPublicMessageInsert = true;
      assert(/\bTO\s+anon\s*,\s*authenticated\b/i.test(block), `${file}: public contact form inserts must remain allowed`);
      assert(/WITH CHECK\s*\(\s*true\s*\)/i.test(block), `${file}: contact form insert should accept public submissions`);
    }

    if (name === 'Anyone can submit a lead') {
      sawPublicLeadInsert = true;
      assert(/\bTO\s+anon\s*,\s*authenticated\b/i.test(block), `${file}: public lead form inserts must remain allowed`);
      assert(/WITH CHECK\s*\(\s*true\s*\)/i.test(block), `${file}: lead form insert should accept public submissions`);
    }
  }
}

for (const policy of adminOnlyPolicies) {
  assert(seenAdminOnly.has(policy), `expected admin-only policy "${policy}" to be present`);
}

assert(sawPublishedSigningVideoRead, 'expected a public published-only signing video read policy');
assert(sawPublicMessageInsert, 'expected public contact form insert policy');
assert(sawPublicLeadInsert, 'expected public project lead insert policy');
