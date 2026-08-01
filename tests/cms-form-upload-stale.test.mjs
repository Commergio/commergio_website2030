import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imageUploadSrc = readFileSync(join(root, 'components/admin/ImageUpload.tsx'), 'utf8');
const videoUploadSrc = readFileSync(join(root, 'components/admin/VideoUpload.tsx'), 'utf8');
const partnersSrc = readFileSync(join(root, 'components/admin/PartnersTab.tsx'), 'utf8');
const productsSrc = readFileSync(join(root, 'components/admin/ProductsTab.tsx'), 'utf8');
const videosSrc = readFileSync(join(root, 'components/admin/PartnershipVideosTab.tsx'), 'utf8');
const portfolioSrc = readFileSync(join(root, 'components/admin/PortfolioAdminTab.tsx'), 'utf8');

test('ImageUpload and VideoUpload expose uploading state to parent modals', () => {
  assert.match(
    imageUploadSrc,
    /onUploadingChange\?: \(uploading: boolean\) => void/,
    'ImageUpload must accept onUploadingChange',
  );
  assert.match(
    videoUploadSrc,
    /onUploadingChange\?: \(uploading: boolean\) => void/,
    'VideoUpload must accept onUploadingChange',
  );
  assert.match(
    imageUploadSrc,
    /onUploadingChange\?\.\(uploading\)/,
    'ImageUpload must notify parents when uploading changes',
  );
  assert.match(
    videoUploadSrc,
    /onUploadingChange\?\.\(uploading\)/,
    'VideoUpload must notify parents when uploading changes',
  );
});

for (const [name, src] of [
  ['PartnersTab', partnersSrc],
  ['ProductsTab', productsSrc],
  ['PartnershipVideosTab', videosSrc],
  ['PortfolioAdminTab', portfolioSrc],
]) {
  test(`${name} CMS modal field updates use functional setState`, () => {
    assert.match(
      src,
      /setForm\(\(prev\) => \(\{ \.\.\.prev, \[field\]: value \}\)\)/,
      `${name} must merge field updates against the latest form state`,
    );
    assert.doesNotMatch(
      src,
      /setForm\(\{ \.\.\.form, \[field\]: value \}\)/,
      `${name} must not snapshot form in async upload callbacks`,
    );
  });
}

test('Partners/Products/Signing video Save stays disabled while media uploads', () => {
  assert.match(
    partnersSrc,
    /disabled=\{saving \|\| uploading \|\| !form\.name\.trim\(\)\}/,
    'Partner Save must wait for logo upload',
  );
  assert.match(
    productsSrc,
    /disabled=\{saving \|\| uploading \|\| !form\.product_name\.trim\(\)\}/,
    'Product Save must wait for image upload',
  );
  assert.match(
    videosSrc,
    /disabled=\{saving \|\| uploading \|\| !form\.partner_name\.trim\(\) \|\| !form\.video_url\.trim\(\)\}/,
    'Signing video Save must wait for video/thumbnail upload',
  );
});
