import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

function fallbackProducts() {
  const source = read('lib/products-fallback.ts');
  const marker = 'export const FALLBACK_PRODUCTS: Product[] = ';
  const start = source.indexOf(marker);
  const literalStart = start + marker.length;
  const literalEnd = source.indexOf('\n];', literalStart);

  assert.notEqual(start, -1, 'fallback product array must exist');
  assert.notEqual(literalEnd, -1, 'fallback product array must have a closing bracket');
  return Function(`return (${source.slice(literalStart, literalEnd + 2)})`)();
}

test('the seed migration contains every fallback product without overwriting CMS edits', () => {
  const migration = read('supabase/migrations/20260610120000_seed_featured_products.sql');
  const expectedNames = fallbackProducts().map(({ product_name }) => product_name).sort();
  const seededNames = Array.from(
    migration.matchAll(/SELECT\n  '([^']+)',/g),
    (match) => match[1],
  ).sort();

  assert.deepEqual(seededNames, expectedNames);
  assert.match(migration, /WHERE NOT EXISTS \(/);
  assert.match(migration, /product_name = 'Commergio CRM Suite'/);
});

test('a successful empty featured CMS response remains authoritative', () => {
  const component = read('components/home/FeaturedProducts.tsx');

  assert.match(component, /if \(!error && featured\) \{/);
  assert.doesNotMatch(component, /featured\.length\s*>\s*0/);
  assert.doesNotMatch(component, /anyProducts/);
});

test('product detail pages resolve static fallback ids', () => {
  const page = read('app/products/[id]/page.tsx');
  const fallback = read('lib/products-fallback.ts');

  assert.match(page, /getFallbackProduct/);
  assert.match(fallback, /export function getFallbackProduct/);
  assert.equal(fallbackProducts().length, 3);
});
