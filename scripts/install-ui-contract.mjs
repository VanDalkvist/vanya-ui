#!/usr/bin/env node
/** OPTIONAL GitHub-only adapter bootstrap. The real UI pipeline is scripts/ui-pipeline.mjs and skills/vanya-ui/SKILL.md. No secrets or remote mutation.
 * Usage: node scripts/install-ui-contract.mjs <project-root> <pinned-vanya-ui-sha>
 */
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
export function install(root,sha){
 if(!/^[a-f0-9]{40}$/i.test(sha))throw Error('Supply a verified immutable 40-character Git SHA');
 const workflow=join(root,'.github/workflows/vanya-ui-contract.yml');
 const policy=join(root,'UI_CONTRACT.md');
 if(existsSync(workflow))throw Error('Workflow exists already. Inspect and update, never overwrite silently');
 const spec=[
  'name: Vanya UI — visual feature contract',
  'on:',
  '  workflow_dispatch:',
  '    inputs:',
  '      mode:',
  '        description: Choose React or visual-only contract',
  '        type: choice',
  '        options: [react, visual, auto]',
  '        default: react',
  'permissions:',
  '  contents: read',
  'jobs:',
  '  ui-contract:',
  '    runs-on: ubuntu-24.04',
  '    steps:',
  '      - uses: actions/checkout@v4',
  '        with:',
  '          fetch-depth: 0',
  '      - uses: VanDalkvist/vanya-ui/.github/actions/ui-contract@'+sha,
  '        with:',
  '          mode: '+String.fromCharCode(36)+'{{ inputs.mode }}',
  ''
 ].join('\n');
 const content='# Vanya Arc / UI — visual contract\n\nRead https://github.com/VanDalkvist/vanya-ui/blob/main/docs/patterns/ui-feature-pipeline.md before each UI feature. React projects must reuse pinned @vanya/ui components and tokens; static visuals should follow its token/pattern design. UI changes require real browser tests; a build is not UI QA. Backend/CLI/data-only changes skip.\n';
 mkdirSync(join(root,'.github/workflows'),{recursive:true});
 writeFileSync(workflow,spec);
 if(!existsSync(policy))writeFileSync(policy,content);
 return {workflow,policy};
}
if(process.argv[1]&&resolve(process.argv[1])===new URL(import.meta.url).pathname){
 try{
  const [root,sha]=process.argv.slice(2);
  if(!root||!sha)throw Error('Usage: node scripts/install-ui-contract.mjs <project-root> <pinned-vanya-ui-sha>');
  const out=install(resolve(root),sha);
  console.log('Installed '+out.workflow+'\nReview '+out.policy+'\nAdd a browser test; GitHub Actions remain workflow_dispatch only.');
 }catch(e){console.error(e.message);process.exitCode=1}
}
