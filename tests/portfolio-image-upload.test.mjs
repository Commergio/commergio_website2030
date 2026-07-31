import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const uploadSrc = readFileSync(join(root, 'components/admin/ImageUpload.tsx'), 'utf8');
const portfolioSrc = readFileSync(join(root, 'components/admin/PortfolioAdminTab.tsx'), 'utf8');

test('MultiImageUpload merges against a previews ref instead of a stale closure', () => {
  assert.match(
    uploadSrc,
    /previewsRef/,
    'MultiImageUpload must keep a previewsRef for async merges',
  );
  assert.match(
    uploadSrc,
    /commitPreviews\(\[\.\.\.previewsRef\.current,\s*\.\.\.newUrls\]\)/,
    'completed uploads must merge against the latest preview list',
  );
  assert.doesNotMatch(
    uploadSrc,
    /const updated = \[\.\.\.previews,\s*\.\.\.newUrls\]/,
    'must not merge with a render-scoped previews snapshot',
  );
});

test('MultiImageUpload blocks overlapping add/remove while uploading', () => {
  assert.match(
    uploadSrc,
    /if \(uploading \|\| files\.length === 0\) return/,
    'must ignore new file batches while an upload is in flight',
  );
  assert.match(
    uploadSrc,
    /const remove = \(idx: number\) => \{\s*if \(uploading\) return/,
    'must ignore removals while an upload is in flight',
  );
  assert.match(
    uploadSrc,
    /disabled=\{uploading\}/,
    'file input must be disabled while uploading',
  );
});

test('portfolio project modal cannot save while images are uploading', () => {
  assert.match(
    portfolioSrc,
    /onUploadingChange=\{setImagesUploading\}/,
    'ProjectModal must track MultiImageUpload uploading state',
  );
  assert.match(
    portfolioSrc,
    /disabled=\{saving \|\| imagesUploading \|\| !form\.title\.trim\(\)\}/,
    'Save must stay disabled while imagesUploading is true',
  );
});
