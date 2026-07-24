import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const adminSource = readFileSync(join(root, 'app/admin/page.tsx'), 'utf8');

test('invoices tab refreshes on mount instead of using a no-op handler', () => {
  assert.match(
    adminSource,
    /onRefresh=\{fetchInvoices\}/,
    'InvoicesTab must wire onRefresh to fetchInvoices',
  );
  assert.doesNotMatch(
    adminSource,
    /onRefresh=\{\(\)\s*=>\s*\{\s*\}\}/,
    'onRefresh must not be a no-op stub',
  );
  assert.match(
    adminSource,
    /function InvoicesTab[\s\S]*?useEffect\(\(\)\s*=>\s*\{\s*onRefresh\(\);/,
    'InvoicesTab must call onRefresh when the tab mounts',
  );
});

test('invoice save surfaces errors and normalizes empty due dates', () => {
  assert.match(
    adminSource,
    /due_date:\s*due_date\.trim\(\)\s*\?\s*due_date\s*:\s*null/,
    'empty due_date must be sent as null, not empty string',
  );
  assert.match(
    adminSource,
    /const \{ error \} = await supabase\.from\('invoices'\)\.insert/,
    'invoice insert must capture the error result',
  );
  assert.match(
    adminSource,
    /if \(error\) \{[\s\S]*?setSaveError[\s\S]*?return;[\s\S]*?\}[\s\S]*?onClose\(\)/,
    'invoice modal must not close after a failed save',
  );
});
