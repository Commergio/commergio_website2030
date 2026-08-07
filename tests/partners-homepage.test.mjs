import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

// Lightweight TS strip for the pure helper (no build step required).
function loadOrderPartners() {
  const source = read('lib/partnersHomepage.ts');
  const stripped = source
    .replace(/^import[\s\S]*?;\n/, '')
    .replace(/: Partner\[]/g, '')
    .replace(/: Partner/g, '')
    .replace(/export /g, '');
  const fn = new Function(`${stripped}; return orderPartnersForHomepage;`);
  return fn();
}

test('featuring partners reorders but never drops unfeatured rows', () => {
  const orderPartnersForHomepage = loadOrderPartners();
  const partners = [
    { id: 'a', name: 'Alpha', is_featured: false, display_order: 0 },
    { id: 'b', name: 'Beta', is_featured: true, display_order: 1 },
    { id: 'c', name: 'Gamma', is_featured: false, display_order: 2 },
    { id: 'd', name: 'Delta', is_featured: true, display_order: 3 },
  ];

  const ordered = orderPartnersForHomepage(partners);
  assert.deepEqual(
    ordered.map((p) => p.id),
    ['b', 'd', 'a', 'c'],
  );
  assert.equal(ordered.length, partners.length);
});

test('homepage PartnersSection does not treat a non-empty featured set as exclusive', () => {
  const component = read('components/home/PartnersSection.tsx');

  assert.match(component, /orderPartnersForHomepage/);
  assert.doesNotMatch(component, /\.eq\(\s*['"]is_featured['"]\s*,\s*true\s*\)/);
  assert.doesNotMatch(component, /featured\.length\s*>\s*0/);
});
