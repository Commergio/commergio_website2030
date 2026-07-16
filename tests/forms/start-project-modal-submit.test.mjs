import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const modalSource = readFileSync(join(root, 'components/StartProjectModal.tsx'), 'utf8');
const i18nSource = readFileSync(join(root, 'lib/i18n.ts'), 'utf8');

const submitBlock = modalSource.match(/const handleSubmit = async \(\) => \{[\s\S]*?\n  \};/);

assert.ok(submitBlock, 'StartProjectModal should define handleSubmit');
assert.match(
  submitBlock[0],
  /const \{ error \} = await supabase\.from\('project_leads'\)\.insert/,
  'project lead insert should capture the Supabase error result',
);
assert.match(
  submitBlock[0],
  /if \(error\) throw error;/,
  'project lead insert errors should be thrown into the failure path',
);
assert.match(
  submitBlock[0],
  /catch \(error\) \{[\s\S]*setFormError\(m\.errSubmit\);[\s\S]*\}/,
  'failed project lead inserts should show an error instead of success',
);
assert.match(
  submitBlock[0],
  /try \{[\s\S]*setDone\(true\);[\s\S]*\} catch/,
  'success state should only be set inside the successful insert path',
);
assert.doesNotMatch(
  submitBlock[0].match(/catch \(error\) \{[\s\S]*?\} finally/)?.[0] ?? '',
  /setDone\(true\)/,
  'failed project lead inserts must not show the success state',
);

const submitErrorCopies = i18nSource.match(/errSubmit:/g) ?? [];
assert.equal(submitErrorCopies.length, 2, 'both English and Arabic submit error copy should be present');
