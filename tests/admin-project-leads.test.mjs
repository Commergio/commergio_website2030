import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const adminSrc = readFileSync(join(root, 'app/admin/page.tsx'), 'utf8');
const inboxSrc = readFileSync(join(root, 'lib/admin-inbox.ts'), 'utf8');
const modalSrc = readFileSync(join(root, 'components/StartProjectModal.tsx'), 'utf8');
const typesSrc = readFileSync(join(root, 'lib/types.ts'), 'utf8');

function mergeAdminInbox(messages, leads) {
  const items = [
    ...messages.map((data) => ({ kind: 'message', created_at: data.created_at, data })),
    ...leads.map((data) => ({ kind: 'lead', created_at: data.created_at, data })),
  ];
  return items.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

test('Start Project modal writes to project_leads', () => {
  assert.match(modalSrc, /from\('project_leads'\)\.insert/);
});

test('admin Messages inbox fetches project_leads alongside contact messages', () => {
  assert.match(adminSrc, /from\('project_leads'\)\.select\('\*'\)/);
  assert.match(adminSrc, /from\('messages'\)\.select\('\*'\)/);
  assert.match(adminSrc, /mergeAdminInbox\(messages,\s*projectLeads\)/);
  assert.match(adminSrc, /onMarkLeadContacted/);
  assert.match(adminSrc, /update\(\{\s*status:\s*'contacted'\s*\}\)[\s\S]*?from\('project_leads'\)|from\('project_leads'\)[\s\S]*?update\(\{\s*status:\s*'contacted'\s*\}\)/);
});

test('overview message count includes project_leads', () => {
  assert.match(
    adminSrc,
    /messages:\s*\(messagesCount \|\| 0\) \+ \(leadsCount \|\| 0\)/,
  );
});

test('ProjectLead type and mergeAdminInbox helper exist', () => {
  assert.match(typesSrc, /export interface ProjectLead/);
  assert.match(inboxSrc, /export function mergeAdminInbox/);
});

test('mergeAdminInbox interleaves contact messages and project leads by date', () => {
  const merged = mergeAdminInbox(
    [
      {
        id: 'm1',
        name: 'Contact',
        email: 'a@example.com',
        company: '',
        service: '',
        message: 'hi',
        status: 'unread',
        created_at: '2026-08-01T10:00:00.000Z',
      },
    ],
    [
      {
        id: 'l1',
        name: 'Lead',
        company: 'Co',
        email: 'b@example.com',
        phone: '',
        service: 'Web',
        budget_range: '',
        message: 'brief',
        status: 'new',
        source: 'pricing',
        created_at: '2026-08-02T10:00:00.000Z',
      },
    ],
  );
  assert.equal(merged.length, 2);
  assert.equal(merged[0].kind, 'lead');
  assert.equal(merged[0].data.id, 'l1');
  assert.equal(merged[1].kind, 'message');
  assert.equal(merged[1].data.id, 'm1');
});
