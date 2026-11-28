import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

// One canonical visual pack. Each context has only its risk-relevant scenes.
export const visualContexts = [
  { theme: 'light', width: 1440, scenes: ['identity','typography','writing','principles','catalog','workspace','setup','agents','composition-principle','compact-filter-toolbar','quiet-editor','quiet-confirmation','categories','status','desk','energy','workspace-overview','workspace-context-header','disclosure','composition-reading-inspector','inspector-open','digest-open','hero'] },
  { theme: 'light', width: 390, scenes: ['typography','writing','catalog','workspace','agents','compact-filter-toolbar','quiet-editor','workspace-overview','workspace-context-header','composition-reading-inspector','inspector-open','digest-open','hero','agent-page'] },
  { theme: 'dark', width: 1440, scenes: ['identity','typography','catalog','quiet-editor','categories','status','inspector-open','digest-open','agent-page'] },
  { theme: 'dark', width: 390, scenes: ['compact-filter-toolbar','quiet-editor','workspace-overview','workspace-context-header','inspector-open','digest-open'] },
  { theme: 'light', width: 1024, scenes: ['workspace-overview','workspace-context-header'] },
  { theme: 'dark', width: 320, scenes: ['compact-filter-toolbar','digest-open'] },
];
const contextKey = c => `${c.theme}-${c.width}`;
const contexts = visualContexts.map(contextKey);
const imageNames = key => visualContexts.find(c => contextKey(c) === key).scenes.map(scene => `${scene}-${key}.png`);
const names = contexts.flatMap(imageNames);
function assertPngInventory(dir) {
  const actual = readdirSync(dir).filter(name => name.endsWith('.png'));
  if (actual.some(name => !names.includes(name))) throw Error('Unexpected baseline PNG');
}
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const identity = env => ({ sha: env.VANYA_UI_EVIDENCE_SHA, version: env.VANYA_UI_EXPECT_VERSION, url: env.VANYA_UI_QA_URL || 'local-build' });
const isSha = value => /^[a-f0-9]{40}$/.test(value || '');
function canonical(path) {
  const absolute = resolve(path);
  return existsSync(absolute) ? realpathSync(absolute) : join(canonical(dirname(absolute)), absolute.split(sep).at(-1));
}
function contains(parent, child) {
  const rel = relative(parent, child);
  return rel === '' || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + sep));
}
export function validateVisualRun(env, evidenceDir, policy) {
  const mode = env.VANYA_UI_VISUAL_MODE;
  if (!mode) return;
  if (!['baseline','compare'].includes(mode)) throw Error('Invalid visual mode');
  const dir = env.VANYA_UI_VISUAL_BASELINE_DIR;
  if (!dir || !isAbsolute(dir)) throw Error('Set an absolute visual baseline directory');
  if (contains(canonical(dir), canonical(evidenceDir)) || contains(canonical(evidenceDir), canonical(dir))) throw Error('Baseline and evidence directories must be separate');
  if (policy !== undefined && policy !== (mode === 'baseline' ? 'all' : 'none')) throw Error('Invalid explicit snapshot policy');
  if (!isSha(env.VANYA_UI_EVIDENCE_SHA) || !env.VANYA_UI_EXPECT_VERSION) throw Error('Missing source identity (SHA and version)');
  if (mode === 'compare' && (!isSha(env.VANYA_UI_BASELINE_SHA) || !env.VANYA_UI_BASELINE_VERSION)) throw Error('Missing baseline identity (SHA and version)');
}
function manifest(env) {
  const path = join(env.VANYA_UI_VISUAL_BASELINE_DIR, 'manifest.json');
  if (!existsSync(path)) throw Error('Baseline is not sealed; capture a complete matrix in a fresh directory');
  return read(path);
}
export function prepareVisualRun(env, evidenceDir, policy) {
  validateVisualRun(env, evidenceDir, policy);
  const mode = env.VANYA_UI_VISUAL_MODE;
  if (!mode) return;
  const dir = env.VANYA_UI_VISUAL_BASELINE_DIR;
  if (mode === 'baseline') {
    mkdirSync(dir, { recursive: true });
    if (readdirSync(dir).length) throw Error('Baseline directory must be empty; existing evidence is immutable');
    write(join(dir, 'reservation.json'), identity(env));
    return;
  }
  const m = manifest(env);
  if (m.schema !== 2 || m.source?.sha !== env.VANYA_UI_BASELINE_SHA || m.source?.version !== env.VANYA_UI_BASELINE_VERSION) throw Error('Baseline identity mismatch');
  assertPngInventory(dir);
  if (Object.keys(m.images || {}).length !== names.length || Object.keys(m.environments || {}).length !== contexts.length) throw Error('Incomplete sealed baseline matrix');
  for (const key of contexts) if (!m.environments[key]) throw Error('Incomplete sealed baseline environment');
  for (const name of names) {
    const path = join(dir, name);
    if (!existsSync(path) || digest(path) !== m.images[name]) throw Error('Baseline snapshot integrity failure: ' + name);
  }
}
export function recordCapture(env, theme, width, environment) {
  if (env.VANYA_UI_VISUAL_MODE !== 'baseline') throw Error('Only a baseline capture can record evidence');
  const dir = env.VANYA_UI_VISUAL_BASELINE_DIR;
  const source = read(join(dir, 'reservation.json'));
  if (JSON.stringify(source) !== JSON.stringify(identity(env))) throw Error('Capture source identity mismatch');
  const key = `${theme}-${width}`;
  if (!contexts.includes(key)) throw Error('Unknown baseline context');
  const images = Object.fromEntries(imageNames(key).map(name => [name, digest(join(dir, name))]));
  write(join(dir, `capture-${key}.json`), { environment, images });
  if (!contexts.every(k => existsSync(join(dir, `capture-${k}.json`)))) return;
  assertPngInventory(dir);
  const captures = contexts.map(k => read(join(dir, `capture-${k}.json`)));
  const allImages = Object.assign({}, ...captures.map(c => c.images));
  for (const name of contexts.flatMap(imageNames)) if (digest(join(dir, name)) !== allImages[name]) throw Error('Baseline snapshot integrity failure: ' + name);
  write(join(dir, 'manifest.json'), { schema: 2, source, images: allImages, environments: Object.fromEntries(contexts.map((k,i) => [k,captures[i].environment])) });
}
export function verifyEnvironment(env, theme, width, environment) {
  if (env.VANYA_UI_VISUAL_MODE !== 'compare') return;
  const expected = manifest(env).environments[`${theme}-${width}`];
  if (JSON.stringify(expected) !== JSON.stringify(environment)) throw Error('Baseline browser/font environment mismatch');
}
export default function globalSetup(config) {
  prepareVisualRun(process.env, process.env.VANYA_UI_EVIDENCE_DIR || resolve(import.meta.dirname, 'artifacts'), config.updateSnapshots);
}
