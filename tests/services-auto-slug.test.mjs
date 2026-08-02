import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fallbackSrc = readFileSync(join(root, 'lib/services-fallback.ts'), 'utf8');
const servicesTabSrc = readFileSync(join(root, 'components/admin/ServicesTab.tsx'), 'utf8');

function slugifyTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function nextAutoSlug(previousTitle, previousSlug, nextTitle) {
  const previousAuto = slugifyTitle(previousTitle);
  const customized = previousSlug !== '' && previousSlug !== previousAuto;
  return customized ? previousSlug : slugifyTitle(nextTitle);
}

function typeTitle(chars) {
  let title = '';
  let slug = '';
  for (const ch of chars) {
    const next = title + ch;
    slug = nextAutoSlug(title, slug, next);
    title = next;
  }
  return { title, slug };
}

test('nextAutoSlug keeps regenerating while the admin types a full title', () => {
  assert.equal(typeTitle('Business Development').slug, 'business-development');
  assert.equal(typeTitle('AI Chatbot').slug, 'ai-chatbot');
});

test('nextAutoSlug stops following the title after a manual slug edit', () => {
  let title = 'Business';
  let slug = 'business';
  slug = 'custom-slug';
  title = 'Business Development';
  assert.equal(nextAutoSlug('Business', 'custom-slug', title), 'custom-slug');
});

test('services-fallback exports nextAutoSlug with follow-until-customized logic', () => {
  assert.match(fallbackSrc, /export function nextAutoSlug\(/);
  assert.match(fallbackSrc, /previousSlug !== '' && previousSlug !== previousAuto/);
  assert.match(fallbackSrc, /customized \? previousSlug : slugifyTitle\(nextTitle\)/);
});

test('ServicesTab uses nextAutoSlug on add and does not freeze after the first character', () => {
  assert.match(servicesTabSrc, /nextAutoSlug/);
  assert.match(
    servicesTabSrc,
    /slug:\s*nextAutoSlug\(prev\.title,\s*prev\.slug,\s*title\)/,
  );
  assert.doesNotMatch(
    servicesTabSrc,
    /slug:\s*form\.slug\s*\|\|\s*slugifyTitle\(title\)/,
    'must not freeze the slug once the first character makes form.slug truthy',
  );
  assert.match(
    servicesTabSrc,
    /if \(isEdit\) return \{ \.\.\.prev, title \}/,
    'edit mode must keep existing slugs stable',
  );
});
