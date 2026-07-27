import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function read(relPath) {
  return readFileSync(join(root, relPath), 'utf8');
}

test('blog listing, detail, and homepage preview share one catalog module', () => {
  const listing = read('app/blog/page.tsx');
  const detail = read('app/blog/[slug]/page.tsx');
  const preview = read('components/home/BlogPreview.tsx');
  const catalog = read('lib/blog-posts.tsx');

  assert.match(listing, /from ['"]@\/lib\/blog-posts['"]/);
  assert.match(detail, /from ['"]@\/lib\/blog-posts['"]/);
  assert.match(preview, /from ['"]@\/lib\/blog-posts['"]/);
  assert.match(catalog, /export const blogPosts/);
  assert.match(catalog, /export function getBlogPost/);

  // Listing must not keep a divergent inline posts array.
  assert.doesNotMatch(listing, /const posts\s*=\s*\[/);
  // Homepage preview must not keep a divergent inline posts array.
  assert.doesNotMatch(preview, /const posts\s*=\s*\[/);
  // Detail must not keep a divergent inline blogData map.
  assert.doesNotMatch(detail, /const blogData\s*=/);
});

test('every catalog slug is unique and has bilingual article bodies', () => {
  const catalog = read('lib/blog-posts.tsx');
  const slugs = [...catalog.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
  const contentBlocks = [...catalog.matchAll(/^\s*content:\s*\(/gm)];
  const contentArBlocks = [...catalog.matchAll(/^\s*contentAr:\s*\(/gm)];

  assert.ok(slugs.length >= 1, 'expected at least one published blog post');
  assert.equal(new Set(slugs).size, slugs.length, 'blog slugs must be unique');
  assert.equal(contentBlocks.length, slugs.length, 'each post needs an English body');
  assert.equal(contentArBlocks.length, slugs.length, 'each post needs an Arabic body');
});

test('known formerly-orphaned listing slugs are not advertised without bodies', () => {
  const listing = read('app/blog/page.tsx');
  const preview = read('components/home/BlogPreview.tsx');
  const orphaned = [
    'vision-2030-digital-transformation-smes',
    'complete-guide-ecommerce-salla',
    'seo-arabic-content-strategy',
    'building-scalable-saas-nextjs',
    'payment-gateway-integration-saudi',
  ];

  for (const slug of orphaned) {
    assert.doesNotMatch(
      listing,
      new RegExp(slug),
      `${slug} must not appear on the listing page without an article body`,
    );
    assert.doesNotMatch(
      preview,
      new RegExp(slug),
      `${slug} must not appear on the homepage preview without an article body`,
    );
  }
});
