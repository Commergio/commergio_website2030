import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

function fallbackServices() {
  const source = read('lib/services-fallback.ts');
  const marker = 'export const FALLBACK_COMPANY_SERVICES: CompanyService[] = ';
  const start = source.indexOf(marker);
  const literalStart = start + marker.length;
  const literalEnd = source.indexOf('\n];', literalStart);

  assert.notEqual(start, -1, 'fallback service array must exist');
  assert.notEqual(literalEnd, -1, 'fallback service array must have a closing bracket');
  return Function(`return (${source.slice(literalStart, literalEnd + 2)})`)();
}

test('the seed migration contains every fallback service without overwriting CMS edits', () => {
  const migration = read('supabase/migrations/20260601120500_seed_company_services.sql');
  const expectedSlugs = fallbackServices().map(({ slug }) => slug).sort();
  const seededSlugs = Array.from(
    migration.matchAll(/\n   '([a-z0-9-]+)',\n   '[A-Za-z]+',\n   '#[a-f0-9]+',/g),
    (match) => match[1],
  ).sort();

  assert.deepEqual(seededSlugs, expectedSlugs);
  assert.match(migration, /ON CONFLICT \(slug\) DO NOTHING;/);
});

test('a successful empty CMS response remains authoritative', () => {
  const hook = read('hooks/useCompanyServices.ts');

  assert.match(hook, /if \(!error && data\) \{/);
  assert.doesNotMatch(hook, /data\.length\s*>\s*0/);
});
