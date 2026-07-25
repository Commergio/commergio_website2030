import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const heroSource = readFileSync(join(root, 'components/home/Hero.tsx'), 'utf8');

test('hero primary CTA opens the Start Your Project modal', () => {
  assert.match(
    heroSource,
    /import StartProjectModal from '@\/components\/StartProjectModal'/,
    'Hero must import StartProjectModal',
  );
  assert.match(
    heroSource,
    /onClick=\{\(\)\s*=>\s*setModalOpen\(true\)\}/,
    'primary hero CTA must open the modal on click',
  );
  assert.match(
    heroSource,
    /modalOpen && \(\s*<StartProjectModal[\s\S]*?source="hero"/,
    'Hero must render StartProjectModal with source="hero" when open',
  );
  assert.doesNotMatch(
    heroSource,
    /<button className="bg-\[#F59E0B\][^>]*>\s*\{t\.hero\.cta1\}/,
    'primary CTA must not remain a bare button without an onClick handler',
  );
});
