// Composition adapter: run the canonical frozen toolchain from the actual installed package.
import {existsSync,readFileSync,realpathSync,statSync} from 'node:fs';
import {dirname,join,relative,resolve,isAbsolute,sep} from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {authoredInventory,lintInventory,hashInputs,tokenImports,componentUsage} from './design-source-inventory.mjs';
import {createHash} from 'node:crypto';
import {assertDebtBaseline} from './design-lint-baseline.mjs';

export const CANONICAL_LINT_SCRIPT='vanya-ui-lint';
export const HARNESS_CONFIG='vanya-ui.config.json';
export const HARNESS_BASELINE='vanya-ui.baseline.json';

export function resolveInstalledHarness(project){
 const require=createRequire(join(resolve(project),'package.json'));
 let tokens;
 try{tokens=require.resolve('@vanya/ui/tokens.css')}catch{
  throw Error('Installed @vanya/ui is missing; install a verified pinned package before running lint');
 }
 const library=dirname(dirname(tokens));
 const pkg=JSON.parse(readFileSync(join(library,'package.json'),'utf8'));
 const runner=join(library,'scripts/design-lint-pilot.mjs');
 if(pkg.name!=='@vanya/ui'||!existsSync(runner)||!existsSync(join(library,'design-lint/package-lock.json'))||pkg.bin?.['vanya-ui-lint']!=='./scripts/design-harness-bin.mjs'||!existsSync(join(library,pkg.bin['vanya-ui-lint'])))
  throw Error('Installed @vanya/ui does not provide the frozen design harness; select a verified harness-capable pin');
 return {runner,version:pkg.version,library};
}

export function validateSources(project,sources){
 const root=realpathSync(project);
 if(!Array.isArray(sources)||!sources.length)throw Error('Specify authored source directories with --sources src,app');
 const seen=new Set();
 for(const input of sources){
  if(typeof input!=='string'||!input.trim()||isAbsolute(input)||input.startsWith('-')||input.split(/[\\/]/).some(x=>['..','node_modules','.git','dist','build'].includes(x)))throw Error('Invalid authored source directory: '+input);
  const path=resolve(root,input);
  if(!existsSync(path)||!statSync(path).isDirectory())throw Error('Source directory does not exist: '+input);
  const rel=relative(root,realpathSync(path));
  if(!rel||rel==='..'||rel.startsWith('..'+sep)||isAbsolute(rel))throw Error('Source directory must be inside the selected package: '+input);
  seen.add(rel.split(sep).join('/'));
 }
 return [...seen];
}

export function validateCssOutput(value='dist'){
 if(typeof value!=='string'||!value||isAbsolute(value)||value.includes('\\')||value.split('/').some(s=>!s||s==='.'||s==='..')||!['dist','build','.next','.output','out'].includes(value.split('/')[0]))throw Error('cssOutput must be a relative compiled output path under dist, build, .next, .output or out');
 return value;
}
export function readHarnessConfig(project){
 const path=join(project,HARNESS_CONFIG);
 if(!existsSync(path))throw Error('Missing '+HARNESS_CONFIG+'; run ui-pipeline adopt --project <dir> --sources src');
 const data=JSON.parse(readFileSync(path,'utf8'));
 if(data?.schemaVersion!==1||!['strict','baseline'].includes(data.mode)||Object.keys(data).some(k=>!['schemaVersion','mode','sources','cssOutput'].includes(k)))throw Error('Invalid '+HARNESS_CONFIG+' (expected schemaVersion 1, mode and sources)');
 const config={schemaVersion:1,sources:validateSources(project,data.sources),mode:data.mode,cssOutput:validateCssOutput(data.cssOutput)};
 if(config.mode==='baseline'){
  const baseline=join(project,HARNESS_BASELINE);
  if(!existsSync(baseline))throw Error('Missing '+HARNESS_BASELINE+'; restore the reviewed baseline');
  assertDebtBaseline(JSON.parse(readFileSync(baseline,'utf8')),{sources:config.sources});
 }
 return config;
}

export function inspectHarness(project,scripts={}){
 const problems=[];let config=null,version=null;
 try{config=readHarnessConfig(project);lintInventory(project,config.sources)}catch(e){problems.push(e.message)}
 try{version=resolveInstalledHarness(project).version}catch(e){problems.push(e.message)}
 if(scripts['lint:design']!==CANONICAL_LINT_SCRIPT)problems.push('lint:design must be the canonical '+CANONICAL_LINT_SCRIPT+' script; run adopt');
 return {status:problems.length?'invalid':'ready',problems,config,version};
}

export function runConsumerLint({project,sources,asJson=false,captureFile,migrate=false}){
 const root=resolve(project);
 const {runner,version}=resolveInstalledHarness(root);
 const config=sources?{sources:validateSources(root,sources),mode:'strict'}:readHarnessConfig(root);
 const targets=config.sources;
 lintInventory(root,targets);
 if(captureFile&&(sources||config.mode!==(migrate?'baseline':'strict')))throw Error('Baseline capture requires the adopted configured source scope');
 const policy=captureFile?'--capture-baseline='+captureFile:config.mode==='baseline'?'--baseline='+join(root,HARNESS_BASELINE):'--strict';
 const result=spawnSync(process.execPath,[runner,'--project='+root,policy,...targets],{
  cwd:root,stdio:asJson?['ignore',2,2]:'inherit',shell:false,timeout:480000
 });
 if(result.error)return {script:'lint:design',status:'failed',reason:result.error.message,version,sources:targets};
 return {script:'lint:design',status:result.status===0?'passed':'failed',exitCode:result.status,signal:result.signal||undefined,version,sources:targets};
}

export function verificationFingerprint(project,workspace=project){
 const {library}=resolveInstalledHarness(project);
 const files=authoredInventory(project,{includeTests:true});
 const extra=['package.json','vanya-ui.config.json','vanya-ui.baseline.json','tsconfig.json','package-lock.json','bun.lock','bun.lockb','pnpm-lock.yaml','yarn.lock','AGENTS.md','UI_CONTRACT.md'];
 const hash=createHash('sha256').update(hashInputs(project,files,extra.slice()));
 if(workspace!==project)hash.update(hashInputs(workspace,[],['package.json','package-lock.json','bun.lock','bun.lockb','pnpm-lock.yaml','yarn.lock','AGENTS.md','UI_CONTRACT.md']));
 for(const f of ['package.json','design-lint/package-lock.json','scripts/design-lint-pilot.mjs','scripts/design-lint-baseline.mjs','scripts/design-harness.mjs','scripts/design-source-inventory.mjs','src/tokens.css','src/index.ts'])hash.update(readFileSync(join(library,f)));
 hash.update(readFileSync(createRequire(join(library,'package.json')).resolve('@vanya/brand/tokens.css')));
 return hash.digest('hex');
}
export function runCanonicalCi({project,asJson=false}){
 const pkg=JSON.parse(readFileSync(join(project,'package.json'),'utf8'));
 const binding=inspectHarness(project,pkg.scripts||{});
 if(binding.status!=='ready')throw Error(binding.problems.join('; '));
 const inventory=authoredInventory(project);
 if(!tokenImports(inventory).length||!componentUsage(inventory).length)throw Error('Missing canonical token import or actual shared component JSX');
 return runConsumerLint({project,asJson});
}
