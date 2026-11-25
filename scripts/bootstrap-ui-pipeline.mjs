#!/usr/bin/env node
/** Install agent discovery files without Git, GitHub, network or overwrites.
 * Node >=20. Usage: node bootstrap-ui-pipeline.mjs --project <path>
 */
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,relative,join,dirname,sep,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';

const defaultLibrary=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const pathFrom=(base,target)=>{const p=relative(base,target).split(sep).join('/');return isAbsolute(p)||p.startsWith('.')?p:'./'+p};
export function bootstrap(project,library=defaultLibrary){
 const root=resolve(project),ui=resolve(library);
 if(!existsSync(join(ui,'skills/vanya-ui/SKILL.md')))throw Error('Canonical skill missing: '+ui);
 if(!existsSync(root))throw Error('Project directory missing: '+root);
 const link=pathFrom(root,ui);
 const cli=JSON.stringify(link+'/scripts/ui-pipeline.mjs');
 const policyPath=join(root,'UI_CONTRACT.md');
 const agentPath=join(root,'.agents/skills/vanya-ui/SKILL.md');
 const policy=[
  '# Vanya Arc / UI — portable project contract','',
  'For UI and visual features read the canonical local skill:',link+'/skills/vanya-ui/SKILL.md','',
  'Portable commands (Node >=20; no Git or remote CI):','',
  '    node '+cli+' inspect --project .',
  '    node '+cli+' plan --task "Describe one requested UI change" --target "/affected-route" > ui-receipt.json',
  '    node '+cli+' check --project .',
  '    node '+cli+' verify --project .',
  '    node '+cli+' review --receipt ui-receipt.json','',
  'Actual browser/visual acceptance remains required; machine checks alone are not proof.',
  'If the library moves, rerun bootstrap from the new local path or update this pointer.',
  'GitHub Actions are NOT required, and must stay manual-only if used.',''
 ].join('\n');
 const agent=[
  '---','name: vanya-ui',
  'description: Portable local Vanya Arc / UI workflow for interface features.',
  '---','','# Vanya UI — agent entrypoint','',
  'Read the canonical skill: '+link+'/skills/vanya-ui/SKILL.md',
  'The local library is at '+link+' relative to this project root.',
  'Run: node '+cli+' inspect --project .',
  'Then follow the canonical skill: scope the task with plan, implement, check/verify locally, observe UI and complete/review the receipt.',
  'No Git or GitHub dependency. Never equate successful build with successful UI QA.',''
 ].join('\n');
 const created=[];
 if(!existsSync(policyPath)){writeFileSync(policyPath,policy);created.push(policyPath)}
 if(!existsSync(agentPath)){mkdirSync(dirname(agentPath),{recursive:true});writeFileSync(agentPath,agent);created.push(agentPath)}
 return {project:root,library:ui,created,skipped:[policyPath,agentPath].filter(p=>!created.includes(p))};
}
export function runBootstrap(argv){
 let project='.',library=defaultLibrary;
 for(let i=0;i<argv.length;i++){
  if(argv[i]==='--project')project=argv[++i];
  else if(argv[i]==='--library')library=argv[++i];
  else if(argv[i]==='--help'){console.log('node bootstrap-ui-pipeline.mjs --project <folder> [--library <folder>]\nNo GitHub or CI changes.');return 0}
  else throw Error('Unknown option '+argv[i]);
  if(!project||!library)throw Error('Missing path');
 }
 const outcome=bootstrap(project,library);
 console.log('[vanya-ui] Portable agent entrypoints for '+outcome.project);
 for(const path of outcome.created)console.log('  created '+path);
 for(const path of outcome.skipped)console.log('  preserved '+path);
 return 0;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{process.exitCode=runBootstrap(process.argv.slice(2))}catch(e){console.error(e.message);process.exitCode=1}
}
