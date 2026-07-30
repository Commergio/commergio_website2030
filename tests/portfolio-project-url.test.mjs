import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const require = createRequire(import.meta.url);

// Load the TS helper via a tiny transpile-free mirror of its logic for runtime,
// and also assert the page source wires project_url through it.
const helperSrc = fs.readFileSync(path.join(root, 'lib/portfolioProjectUrl.ts'), 'utf8');
const pageSrc = fs.readFileSync(path.join(root, 'app/portfolio/page.tsx'), 'utf8');

assert.match(helperSrc, /export function portfolioProjectHref/);
assert.match(pageSrc, /portfolioProjectHref\(project\.project_url\)/);
assert.match(pageSrc, /href=\{href\}/);
assert.match(pageSrc, /View Project/);
assert.match(pageSrc, /target="_blank"/);
assert.match(pageSrc, /rel="noopener noreferrer"/);

// Evaluate helper by stripping TypeScript types (none beyond param annotations).
const js = helperSrc
  .replace(/:\s*string\s*\|\s*null\s*\|\s*undefined/g, '')
  .replace(/:\s*string\s*\|\s*null/g, '');

const tmp = path.join(root, 'tests', '.portfolio-url-helper.tmp.mjs');
fs.mkdirSync(path.dirname(tmp), { recursive: true });
fs.writeFileSync(tmp, js);

const { portfolioProjectHref } = await import(pathToFileURL(tmp).href);
fs.unlinkSync(tmp);

assert.equal(portfolioProjectHref(''), null);
assert.equal(portfolioProjectHref('   '), null);
assert.equal(portfolioProjectHref(null), null);
assert.equal(portfolioProjectHref(undefined), null);
assert.equal(portfolioProjectHref('https://example.com/app'), 'https://example.com/app');
assert.equal(portfolioProjectHref('http://example.com'), 'http://example.com');
assert.equal(portfolioProjectHref('example.com'), 'https://example.com');
assert.equal(portfolioProjectHref('//cdn.example.com/x'), 'https://cdn.example.com/x');

console.log('portfolio project_url tests passed');
