import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepareVisualRun, recordCapture, verifyEnvironment, snapshotScenes, themes, widths } from './visual-baseline.mjs';

const sha = 'a'.repeat(40);
const envInfo = { browser: 'Chromium test', platform: 'linux', arch: 'x64', fonts: ['Manrope:loaded'] };
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'vui-golden-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const dir = join(root, 'golden');
  const evidence = join(root, 'run');
  const env = { VANYA_UI_VISUAL_MODE: 'baseline', VANYA_UI_VISUAL_BASELINE_DIR: dir,
    VANYA_UI_EVIDENCE_SHA: sha, VANYA_UI_EXPECT_VERSION: '2.0.0' };
  const compare = { ...env, VANYA_UI_VISUAL_MODE: 'compare', VANYA_UI_EVIDENCE_SHA: 'b'.repeat(40),
    VANYA_UI_BASELINE_SHA: sha, VANYA_UI_BASELINE_VERSION: '2.0.0' };
  return { dir, evidence, env, compare };
}
function capture(f, theme, width) {
  for (const anchor of snapshotScenes) writeFileSync(join(f.dir, `${anchor}-${theme}-${width}.png`), `${anchor}:${theme}:${width}`);
  recordCapture(f.env, theme, width, envInfo);
}
function full(f) {
  prepareVisualRun(f.env, f.evidence, 'all');
  for (const theme of themes) for (const width of widths) capture(f, theme, width);
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
  capture(f, 'light', 1440);
  assert.throws(() => prepareVisualRun(f.env, f.evidence, 'all'), /empty/);
  assert.throws(() => prepareVisualRun(f.compare, f.evidence, 'none'), /sealed/);
});
test('complete 176-image matrix seals, compares and rejects identity/environment mismatch', t => {
  const f = fixture(t); full(f);
  const m = JSON.parse(readFileSync(join(f.dir, 'manifest.json'), 'utf8'));
  assert.equal(Object.keys(m.images).length, 176);
  assert.ok(m.images["inspector-open-light-1440.png"]);
  assert.ok(m.images["digest-open-dark-320.png"]);
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
