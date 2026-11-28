import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepareVisualRun, recordCapture, verifyEnvironment } from './visual-baseline.mjs';

const sha = 'a'.repeat(40);
const envInfo = { browser: 'Chromium test', platform: 'linux', arch: 'x64', fonts: ['Manrope:loaded'] };
// Independent expected coverage: never derive fixture keys from the code under test.
const expected = {
  'light-1440': 'identity typography writing principles catalog workspace setup agents composition-principle compact-filter-toolbar quiet-editor quiet-confirmation categories status desk energy workspace-overview workspace-context-header disclosure composition-reading-inspector inspector-open digest-open hero',
  'light-390': 'typography writing catalog workspace agents compact-filter-toolbar quiet-editor workspace-overview workspace-context-header composition-reading-inspector inspector-open digest-open hero agent-page',
  'dark-1440': 'identity typography catalog quiet-editor categories status inspector-open digest-open agent-page',
  'dark-390': 'compact-filter-toolbar quiet-editor workspace-overview workspace-context-header inspector-open digest-open',
  'light-1024': 'workspace-overview workspace-context-header',
  'dark-320': 'compact-filter-toolbar digest-open',
};
const keys = Object.entries(expected).flatMap(([key, scenes]) => scenes.split(' ').map(scene => `${scene}-${key}.png`)).sort();
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'vui-golden-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const dir = join(root, 'golden');
  const evidence = join(root, 'run');
  const env = { VANYA_UI_VISUAL_MODE: 'baseline', VANYA_UI_VISUAL_BASELINE_DIR: dir,
    VANYA_UI_EVIDENCE_SHA: sha, VANYA_UI_EXPECT_VERSION: '3.0.0' };
  const compare = { ...env, VANYA_UI_VISUAL_MODE: 'compare', VANYA_UI_EVIDENCE_SHA: 'b'.repeat(40),
    VANYA_UI_BASELINE_SHA: sha, VANYA_UI_BASELINE_VERSION: '3.0.0' };
  return { dir, evidence, env, compare };
}
function capture(f, key) {
  for (const scene of expected[key].split(' ')) writeFileSync(join(f.dir, `${scene}-${key}.png`), `${scene}:${key}`);
  const [theme, width] = key.split('-');
  recordCapture(f.env, theme, Number(width), envInfo);
}
function full(f) {
  prepareVisualRun(f.env, f.evidence, 'all');
  for (const key of Object.keys(expected)) capture(f, key);
}

test('ordinary QA is unaffected; visual mode validates explicit policy and disjoint paths', t => {
  const f = fixture(t);
  assert.doesNotThrow(() => prepareVisualRun({}, f.evidence, 'missing'));
  assert.throws(() => prepareVisualRun(f.env, f.evidence, 'none'), /snapshot policy/);
  assert.throws(() => prepareVisualRun(f.env, join(f.dir, 'run'), 'all'), /separate/);
  assert.throws(() => prepareVisualRun(f.env, f.dir, 'all'), /separate/);
});
test('refuses an existing golden and leaves its actual bytes untouched', t => {
  const f = fixture(t); mkdirSync(f.dir);
  const image = join(f.dir, 'existing.png'); writeFileSync(image, 'original');
  assert.throws(() => prepareVisualRun(f.env, f.evidence, 'all'), /empty/);
  assert.equal(readFileSync(image, 'utf8'), 'original');
});
test('partial reservation cannot be recaptured or compared', t => {
  const f = fixture(t); prepareVisualRun(f.env, f.evidence, 'all');
  capture(f, 'light-1440');
  assert.throws(() => prepareVisualRun(f.env, f.evidence, 'all'), /empty/);
  assert.throws(() => prepareVisualRun(f.compare, f.evidence, 'none'), /sealed/);
  assert.throws(() => recordCapture(f.env, 'light', 1440, envInfo), /EEXIST/);
});
test('single 56-image pack seals exact keys and rejects identity/environment mismatch', t => {
  const f = fixture(t); full(f);
  const m = JSON.parse(readFileSync(join(f.dir, 'manifest.json'), 'utf8'));
  assert.equal(keys.length, 56);
  assert.equal(m.schema, 2);
  assert.deepEqual(Object.keys(m.images).sort(), keys);
  assert.deepEqual(Object.keys(m.environments).sort(), Object.keys(expected).sort());
  assert.equal(m.source.sha, sha);
  assert.doesNotThrow(() => prepareVisualRun(f.compare, f.evidence, 'none'));
  assert.doesNotThrow(() => verifyEnvironment(f.compare, 'light', 1440, envInfo));
  assert.throws(() => verifyEnvironment(f.compare, 'light', 1440, { ...envInfo, browser: 'different' }), /environment/);
  assert.throws(() => prepareVisualRun({ ...f.compare, VANYA_UI_BASELINE_SHA: 'c'.repeat(40) }, f.evidence, 'none'), /identity/);
  assert.throws(() => prepareVisualRun(f.env, f.evidence, 'all'), /empty/);
});
test('changed or missing golden bytes block comparison', t => {
  const f = fixture(t); full(f);
  const file = join(f.dir, 'inspector-open-light-1440.png');
  writeFileSync(file, 'tampered');
  assert.throws(() => prepareVisualRun(f.compare, f.evidence, 'none'), /snapshot integrity/);
  rmSync(file);
  assert.throws(() => prepareVisualRun(f.compare, f.evidence, 'none'), /snapshot integrity/);
});
test('extra PNG prevents sealing and old manifest cannot be compared', t => {
  const f = fixture(t); prepareVisualRun(f.env, f.evidence, 'all');
  writeFileSync(join(f.dir, 'extra.png'), 'extra');
  const contexts = Object.keys(expected);
  for (const key of contexts.slice(0,-1)) capture(f, key);
  assert.throws(() => capture(f, contexts.at(-1)), /Unexpected baseline PNG/);
  assert.throws(() => prepareVisualRun(f.compare, f.evidence, 'none'), /sealed/);
  rmSync(join(f.dir, 'extra.png'));
  // An old manifest with the new keys still has incompatible provenance.
  writeFileSync(join(f.dir, 'manifest.json'), JSON.stringify({schema:1,source:{sha,version:'3.0.0'}}));
  assert.throws(() => prepareVisualRun(f.compare, f.evidence, 'none'), /identity/);
});
