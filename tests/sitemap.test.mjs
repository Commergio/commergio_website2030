import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function read(relPath) {
  return readFileSync(join(root, relPath), 'utf8');
}

function collectAppPageDirs(dir, prefix = '') {
  const entries = readdirSync(dir);
  const pages = [];

  if (existsSync(join(dir, 'page.tsx')) || existsSync(join(dir, 'page.ts')) || existsSync(join(dir, 'page.jsx'))) {
    pages.push(prefix || '/');
  }

  for (const entry of entries) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    if (entry.startsWith('[') && entry.endsWith(']')) continue; // dynamic segments covered separately
    const nextPrefix = prefix === '' ? `/${entry}` : `${prefix}/${entry}`;
    pages.push(...collectAppPageDirs(full, nextPrefix));
  }

  return pages;
}

test('sitemap does not advertise /services/<slug> detail URLs', () => {
  const sitemap = read('app/sitemap.ts');

  assert.doesNotMatch(
    sitemap,
    /serviceSlugs|servicePages|\/services\/\$\{/,
    'sitemap must not build /services/<slug> entries that have no matching route',
  );
  assert.match(sitemap, /\$\{base\}\/services`/, 'sitemap should still list the real /services index');
});

test('no app/services/[slug] route exists for the removed sitemap entries', () => {
  assert.equal(
    existsSync(join(root, 'app/services/[slug]')),
    false,
    'app/services/[slug] must not exist; sitemap must not invent those URLs',
  );
  assert.equal(
    existsSync(join(root, 'app/services/page.tsx')),
    true,
    'the /services index page must continue to exist',
  );
});

test('sitemap static page paths resolve to real app routes', () => {
  const sitemap = read('app/sitemap.ts');
  const urls = [...sitemap.matchAll(/url:\s*(?:base|`\$\{base\}([^`]*)`)/g)].map((m) => m[1] || '/');
  const pageDirs = new Set(collectAppPageDirs(join(root, 'app')));

  assert.ok(urls.includes('/'), 'homepage must be listed');
  assert.ok(urls.includes('/services'), '/services must be listed');

  for (const path of urls) {
    assert.ok(
      pageDirs.has(path),
      `sitemap path ${path} has no matching app/**/page.tsx`,
    );
  }
});
