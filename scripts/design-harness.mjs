// Composition adapter: run the canonical frozen toolchain from the actual installed package.
import {existsSync,readFileSync,realpathSync,statSync} from 'node:fs';
import {dirname,join,relative,resolve,isAbsolute,sep} from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';

export function resolveInstalledHarness(project){
 const require=createRequire(join(resolve(project),'package.json'));
 let tokens;
 try{tokens=require.resolve('@vanya/ui/tokens.css')}catch{
  throw Error('Installed @vanya/ui is missing; install a verified pinned package before running lint');
 }
 const library=dirname(dirname(tokens));
 const pkg=JSON.parse(readFileSync(join(library,'package.json'),'utf8'));
 const runner=join(library,'scripts/design-lint-pilot.mjs');
 if(pkg.name!=='@vanya/ui'||!existsSync(runner)||!existsSync(join(library,'design-lint/package-lock.json')))
  throw Error('Installed @vanya/ui does not provide the frozen design harness; select a verified harness-capable pin');
 return {runner,version:pkg.version};
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

export function runConsumerLint({project,sources,asJson=false}){
 const root=resolve(project);
 const {runner,version}=resolveInstalledHarness(root);
 const targets=validateSources(root,sources);
 const result=spawnSync(process.execPath,[runner,'--project='+root,'--strict',...targets],{
  cwd:root,stdio:asJson?['ignore',2,2]:'inherit',shell:false,timeout:480000
 });
 if(result.error)return {script:'lint:design',status:'failed',reason:result.error.message,version,sources:targets};
 return {script:'lint:design',status:result.status===0?'passed':'failed',exitCode:result.status,signal:result.signal||undefined,version,sources:targets};
}
