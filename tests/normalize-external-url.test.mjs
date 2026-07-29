import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const helperPath = join(root, 'lib', 'normalizeExternalUrl.ts');

function loadHelper() {
  // Node 22+: strip TypeScript types when loading the helper directly.
  const result = spawnSync(
    process.execPath,
    ['--experimental-strip-types', '--input-type=module', '-e', `
      import { normalizeExternalUrl, isValidExternalUrl } from ${JSON.stringify(pathToFileURL(helperPath).href)};
      console.log(JSON.stringify({
        empty: normalizeExternalUrl(''),
        spaced: normalizeExternalUrl('  '),
        bare: normalizeExternalUrl('example.com'),
        bareWww: normalizeExternalUrl('www.partner.com/path'),
        https: normalizeExternalUrl('https://example.com/a'),
        http: normalizeExternalUrl('http://example.com'),
        leadingSlash: normalizeExternalUrl('/example.com'),
        mixedCase: normalizeExternalUrl('HTTPS://Example.COM'),
        trimmed: normalizeExternalUrl('  partner.com/x  '),
        validEmpty: isValidExternalUrl(''),
        validBare: isValidExternalUrl('example.com'),
        validHttps: isValidExternalUrl('https://ok.com'),
        invalid: isValidExternalUrl('not a url'),
        invalidSpaces: isValidExternalUrl('has spaces.com/no'),
      }));
    `],
    { encoding: 'utf8' }
  );
  if (result.status !== 0) {
    throw new Error(`Failed to load helper:\n${result.stderr || result.stdout}`);
  }
  return JSON.parse(result.stdout.trim());
}

const samples = loadHelper();

assert.equal(samples.empty, '');
assert.equal(samples.spaced, '');
assert.equal(samples.bare, 'https://example.com');
assert.equal(samples.bareWww, 'https://www.partner.com/path');
assert.equal(samples.https, 'https://example.com/a');
assert.equal(samples.http, 'http://example.com');
assert.equal(samples.leadingSlash, 'https://example.com');
assert.equal(samples.mixedCase, 'HTTPS://Example.COM');
assert.equal(samples.trimmed, 'https://partner.com/x');
assert.equal(samples.validEmpty, true);
assert.equal(samples.validBare, true);
assert.equal(samples.validHttps, true);
assert.equal(samples.invalid, false);

// Source wiring: admin save paths and public hrefs must use the shared helper.
const sourceFiles = [
  'components/admin/PartnersTab.tsx',
  'components/admin/ProductsTab.tsx',
  'components/admin/PortfolioAdminTab.tsx',
  'components/home/PartnersSection.tsx',
  'components/home/FeaturedProducts.tsx',
  'components/home/PortfolioHighlights.tsx',
  'app/products/[id]/page.tsx',
];

for (const rel of sourceFiles) {
  const src = readFileSync(join(root, rel), 'utf8');
  assert.match(
    src,
    /normalizeExternalUrl/,
    `${rel} must import/use normalizeExternalUrl so scheme-less URLs cannot become site-relative`
  );
  assert.doesNotMatch(
    src,
    /const normalizeExternalUrl = /,
    `${rel} must use the shared helper, not a local copy`
  );
}

// Partners/Products admin save must normalize before insert/update.
for (const rel of ['components/admin/PartnersTab.tsx', 'components/admin/ProductsTab.tsx']) {
  const src = readFileSync(join(root, rel), 'utf8');
  assert.match(src, /website_url: normalizeExternalUrl|product_url: normalizeExternalUrl/);
  assert.match(src, /isValidExternalUrl/);
}

console.log('normalize-external-url tests passed');
