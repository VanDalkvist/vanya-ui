#!/usr/bin/env node
/**
 * Vanya Arc / UI — portable agent pipeline.
 * Zero runtime dependencies. Works with a copied folder/zip or local checkout;
 * no Git, GitHub, network access, repository secrets or fixed home directory.
 * Node.js >=20. It NEVER installs dependencies or pushes/deploys code.
 */
import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {resolve,relative,join,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {verifyConsumerCss} from './consumer-built-css.mjs';
import {authoredInventory,componentUsage,tokenImports} from './design-source-inventory.mjs';
import {checkProject} from './ui-contract.mjs';
import {runConsumerLint,inspectHarness,verificationFingerprint} from './design-harness.mjs';
import {adoptConsumer} from './adopt-ui-harness.mjs';
import {captureConsumerBaseline} from './capture-ui-baseline.mjs';
import {createAcceptancePlan,reviewAcceptance,criteria} from './ui-acceptance.mjs';

const libraryRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const sourceExtensions=new Set(['.tsx','.jsx','.ts','.js','.mjs','.css','.scss','.html','.svg','.vue','.svelte']);
const excluded=new Set(['node_modules','.git','dist','build','coverage','.next','.nuxt','.output','out','vendor','generated','docs','research','tests','test','__tests__','fixtures','playwright-report']);
const policyFiles=['AGENTS.md','UI_CONTRACT.md','.agents/skills/design/vanya-ui/SKILL.md','.agents/skills/vanya-ui/SKILL.md'];
const browserNames=['test:e2e','test:browser','test:ui'];
const modes=['auto','react','visual','none'];
const managers=['npm','pnpm','yarn','bun'];

function read(path){try{return readFileSync(path,'utf8')}catch{return ''}}
function json(path){try{return JSON.parse(readFileSync(path,'utf8'))}catch{return null}}
function contained(root,path){const r=relative(root,path);return r===''||r!=='..'&&!r.startsWith('..'+sep)&&!r.startsWith('/')}
function packageLocations(root){
 const roots=['.','app','web','frontend','client'];
 for(const group of ['apps','packages']){
  const dir=join(root,group);
  if(existsSync(dir))for(const item of readdirSync(dir,{withFileTypes:true})){
   if(item.isDirectory()&&!item.name.startsWith('.'))roots.push(group+'/'+item.name);
  }
 }
 return roots.filter((p,i)=>roots.indexOf(p)===i).map(p=>({id:p,dir:resolve(root,p),data:json(join(root,p,'package.json'))})).filter(x=>x.data);
}
function scanSources(root,maxFiles=3500){
 const found=[];const queue=[{dir:root,depth:0}];
 while(queue.length&&found.length<maxFiles){
  const {dir,depth}=queue.shift();
  let items=[];try{items=readdirSync(dir,{withFileTypes:true})}catch{continue}
  for(const item of items){
   if(item.isSymbolicLink())continue;
   const path=join(dir,item.name);
   if(item.isDirectory()){
    if(depth<7&&!excluded.has(item.name)&&!item.name.startsWith('.'))queue.push({dir:path,depth:depth+1});
   }else if(item.isFile()&&sourceExtensions.has(extname(item.name).toLowerCase())){
    found.push(path);if(found.length>=maxFiles)break;
   }
  }
 }
 return found;
}
function hasReact(pkg){return Boolean(pkg.dependencies?.react||pkg.devDependencies?.react||pkg.peerDependencies?.react)}
function vanyaSpec(pkg){return pkg.dependencies?.['@vanya/ui']||pkg.devDependencies?.['@vanya/ui']||pkg.peerDependencies?.['@vanya/ui']||null}
function hasVanya(pkg){return Boolean(vanyaSpec(pkg))}
function pinned(spec){
 if(typeof spec!=='string')return false;
 return /^(file:|link:|workspace:)/.test(spec)
  || /(?:#|\/)[0-9a-f]{40}(?:\.tar\.gz)?$/i.test(spec)
  || /^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(spec);
}
function detectManager(dir,root){
 for(const home of [dir,root]){
  if(existsSync(join(home,'bun.lock'))||existsSync(join(home,'bun.lockb')))return 'bun';
  if(existsSync(join(home,'pnpm-lock.yaml')))return 'pnpm';
  if(existsSync(join(home,'yarn.lock')))return 'yarn';
 }
 return 'npm';
}
function selectPackage(root,packages,requested,mode){
 if(requested){
  const dir=resolve(root,requested);
  if(!contained(root,dir))throw Error('--package must be inside --project');
  const match=packages.find(p=>p.dir===dir)||(()=>{const data=json(join(dir,'package.json'));return data?{id:relative(root,dir)||'.',dir,data}:null})();
  if(!match)throw Error('package.json not found in --package '+requested);
  return match;
 }
 const options=mode==='react'||mode==='auto'?packages.filter(x=>hasReact(x.data)):packages;
 if(options.length>1)throw Error('Multiple UI packages found: '+options.map(x=>x.id).join(', ')+'. Select one using --package <relative path>');
 return options[0]||null;
}
export function inspectProject({project='.',mode='auto',packageDir}={}){
 if(!modes.includes(mode))throw Error('Unsupported mode '+mode);
 const root=resolve(project);
 if(!existsSync(root)||!statSync(root).isDirectory())throw Error('Project directory does not exist: '+root);
 const packages=packageLocations(root);
 const chosen=selectPackage(root,packages,packageDir,mode);
 const effectiveMode=mode==='auto'?(chosen&&hasReact(chosen.data)?'react':'visual'):mode;
 const scanRoot=chosen?chosen.dir:root;
 const files=scanSources(scanRoot);
 const visualFiles=files.filter(f=>['.tsx','.jsx','.vue','.svelte','.html','.css','.scss','.svg'].includes(extname(f).toLowerCase()));
 const finalMode=mode==='auto'&&effectiveMode==='visual'&&!visualFiles.length?'none':effectiveMode;
 const contracts=[root,...(chosen&&chosen.dir!==root?[chosen.dir]:[])].flatMap(dir=>policyFiles.map(name=>join(dir,name)));
 const policy=contracts.filter(existsSync).map(path=>read(path)).join('\n');
 const scanned=files.filter(f=>/\.(tsx|jsx|ts|js|mjs|css|scss|vue|svelte|html)$/.test(f)).slice(0,1200).map(path=>({path,source:read(path).slice(0,120000)}));
 const relevantSources=scanned.map(f=>f.source).join('\n');
 // A deliberately bounded literal import check; this is not a module graph or CSS parser.
 const authored=finalMode==='react'&&chosen?authoredInventory(scanRoot):scanned.map(({path,source})=>({name:relative(scanRoot,path),source}));
 const tokenImportFiles=tokenImports(authored);
 const hasTailwindSource=scanned.some(({path,source})=>/\.(css|scss)$/.test(path)&&/@source\s+['"][^'"]*@vanya\/ui\/src\/?['"]/.test(source.replace(/\/\*[\s\S]*?\*\//g,'')));
 const scripts=chosen?.data.scripts||{};
 const libraryVersion=json(join(libraryRoot,'package.json'))?.version||null;
 const designHarness=finalMode==='react'&&chosen?inspectHarness(scanRoot,scripts):null;
 const usage=finalMode==='react'&&chosen?componentUsage(authored):[];
 let fingerprint=null;
 if(designHarness?.status==='ready')try{fingerprint=verificationFingerprint(scanRoot,root)}catch(e){designHarness.status='invalid';designHarness.problems.push(e.message)}
 const installed=chosen?[chosen.dir,root].map(dir=>json(join(dir,'node_modules','@vanya','ui','package.json'))).find(p=>p?.name==='@vanya/ui'):null;
 return {
  project:root,package:chosen?.id||null,packageRoot:scanRoot,
  mode:finalMode,sourceFiles:files.length,visualFiles:visualFiles.length,
  library:libraryRoot,libraryVersion,dependencySpec:chosen?vanyaSpec(chosen.data):null,installedVersion:installed?.version||null,
  hasPolicy:/\bvanya\s*(?:[-/]\s*)?(?:arc\s*)?(?:[-/]\s*)?ui\b|@vanya\/ui/i.test(policy),
  hasDependency:chosen?hasVanya(chosen.data):false,
  pinnedDependency:chosen?pinned(vanyaSpec(chosen.data)):false,
  hasImport:/(?:from\s*['"]@vanya\/ui(?:\/[^'"]*)?['"]|import\s*['"]@vanya\/ui(?:\/[^'"]*)?['"]|@import\s*['"]@vanya\/ui(?:\/[^'"]*)?['"])/.test(relevantSources),
  hasTokensImport:tokenImportFiles.length>0,tokenImportFiles,hasTailwindSource,
  browserScript:browserNames.find(name=>Boolean(scripts[name]))||null,
  buildScript:Boolean(scripts.build),
  scripts,manager:chosen?detectManager(chosen.dir,root):null,
  designHarness,componentUsage:usage,verificationFingerprint:fingerprint,
  documents:['skills/vanya-ui/SKILL.md','DESIGN.md','src/index.ts','src/tokens.css',
   'docs/patterns/list-detail-composition.md','docs/research/workspace-scroll-composition-2026-11-21.md',
   'docs/patterns/browser-navigation.md',...criteria.map(c=>c.canonical)].filter((name,i,all)=>all.indexOf(name)===i).map(name=>join(libraryRoot,name))
 };
}
export {checkProject};
function runScript(info,manager,name,asJson=false){
 const dir=info.packageRoot;
 const args=manager==='yarn'?[name]:['run',name];
 (asJson?process.stderr:process.stdout).write('\n[ui-pipeline] '+manager+' '+args.join(' ')+' @ '+dir+'\n');
 // Keep machine-readable JSON on stdout, send child logs to stderr.
 const call=spawnSync(manager,args,{cwd:dir,stdio:asJson?['inherit',2,2]:'inherit',shell:false,env:process.env});
 if(call.error)return {script:name,status:'failed',reason:call.error.message};
 return {script:name,status:call.status===0?'passed':'failed',exitCode:call.status,signal:call.signal||undefined};
}
export function verifyProject(info,{manager,buildScript,browserScript,unitScript,dryRun=false,asJson=false}={},executeLint=runConsumerLint){
 const checked=checkProject(info);
 const result={project:info.project,package:info.package,mode:info.mode,contract:checked.status,checks:[],visualReview:'NOT_VERIFIED',status:'blocked',verificationFingerprint:info.verificationFingerprint};
 if(checked.status==='skip'){result.status='skipped';return result}
 if(checked.status==='fail'){result.issues=checked.problems;return result}
 if(!info.package){result.issues=['No executable package.json. Visual review required; cannot certify automatically'];return result}
 const runtime=manager||info.manager||'npm';
 if(!managers.includes(runtime))throw Error('Unknown package manager '+runtime);
 const build=buildScript||'build',browser=browserScript||info.browserScript;
 result.buildScript=build;result.browserScript=browser||null;
 if(!info.scripts[build]){result.issues=['Missing build script '+build];return result}
 if(info.mode==='react'&&!browser){result.issues=['No browser-test script'];return result}
 const tasks=[...(unitScript?[unitScript]:[]),build,...(browser?[browser]:[])];
 const requiresLint=info.mode==='react';
 if(requiresLint){
  result.lintScript='lint:design';
  if(build!=='build'||browser!==info.browserScript){result.issues=['React verification must run canonical build and selected browser script'];return result}
 }
 for(const name of tasks)if(!info.scripts[name]){result.issues=['Missing script '+name];return result}
 if(dryRun){result.status='planned';result.checks=[...(requiresLint?['lint:design']:[]),...tasks.flatMap(t=>requiresLint&&t===build?[t,'built-css']:[t])].map(script=>({script,status:'NOT_RUN'}));return result}
 if(requiresLint){
  let item;
  try{item=executeLint({project:info.packageRoot,asJson})}
  catch(e){item={script:'lint:design',status:'failed',reason:e.message}}
  result.checks.push(item);
  if(item.status!=='passed'||item.exitCode!==0){result.status='failed';return result}
 }
 for(const name of tasks){
  const item=runScript(info,runtime,name,asJson);
  result.checks.push(item);
  if(item.status!=='passed'){result.status='failed';return result}
  if(requiresLint&&name===build){
   try{result.checks.push(verifyConsumerCss(info.packageRoot))}catch(e){result.checks.push({script:'built-css',status:'failed',reason:e.message});result.status='failed';return result}
  }
 }
 if(requiresLint&&verificationFingerprint(info.packageRoot,info.project)!==info.verificationFingerprint){result.status='failed';result.issues=['Source or design policy changed during verification; rerun after final edits'];return result}
 result.status='passed';
 // Browser tests have executed, but real visual exploration, keyboard and theme
 // evidence must be collected by the agent. Never declare these verified by build.
 return result;
}
function parseArgs(argv){
 const [command,...tail]=argv;
 if(!['inspect','check','verify','plan','review','lint','adopt','baseline','help'].includes(command||'help'))throw Error('Unknown command '+command);
 const options={};
 const boolean=new Set(['json','dry-run','migrate']);
 for(let i=0;i<tail.length;i++){
  const arg=tail[i];if(!arg.startsWith('--'))throw Error('Unexpected argument '+arg);
  const key=arg.slice(2);
  if(boolean.has(key)){options[key]=true;continue}
  if(!['project','package','mode','manager','build-script','browser-script','unit-script','task','target','scope','receipt','verification','sources','css-output'].includes(key))throw Error('Unknown option --'+key);
  const value=tail[++i];
  if(!value||value.startsWith('--'))throw Error('Missing value for --'+key);
  options[key]=value;
 }
 return {command:command||'help',options};
}
function output(obj,asJson){
 if(asJson)console.log(JSON.stringify(obj,null,2));
 else{
  console.log('[ui-pipeline] '+(obj.status||'INSPECT').toUpperCase());
  if(obj.project)console.log('Project: '+obj.project);
  if(obj.mode)console.log('Surface: '+obj.mode);
  if(obj.package)console.log('Package: '+obj.package);
  if(obj.documents)for(const path of obj.documents)console.log('  Read: '+path);
  if(obj.status==='fail'||obj.status==='blocked')for(const x of obj.problems||obj.issues||[])console.error('  ERROR: '+x);
  if(obj.warnings)for(const x of obj.warnings)console.log('  WARN: '+x);
  if(obj.checks)for(const x of obj.checks)console.log('  '+x.status+': '+x.script);
  if(obj.visualReview)console.log('Visual/interaction review: '+obj.visualReview+' (agent must verify independently)');
  if(obj.changed)for(const path of obj.changed)console.log('  wrote '+path);
  if(obj.designHarness)console.log('Design harness: '+obj.designHarness.status);
  if(obj.hasPolicy!==undefined)console.log('Canonical policy: '+(obj.hasPolicy?'found':'missing'));
  if(obj.browserScript)console.log('Browser test: '+obj.browserScript);
  if(obj.libraryVersion)console.log('Local guide version: '+obj.libraryVersion);
  if(obj.dependencySpec)console.log('Declared dependency: '+obj.dependencySpec+' / installed: '+(obj.installedVersion||'unknown'));
 }
}
export function runCli(argv){
 const {command,options}=parseArgs(argv);
 if(command==='help'){
  console.log('Vanya UI portable agent pipeline (Node >=20; offline; no GitHub)\n'
   +'Usage: node <vanya-ui>/scripts/ui-pipeline.mjs inspect|check|verify --project <dir> [--package app] [--mode auto|react|visual|none]\n'
   +'Optional: --json --manager npm|pnpm|yarn|bun --build-script build --browser-script test:e2e --unit-script test:unit --dry-run\n'
   +'Adopt: adopt --project <dir> --sources src,app [--css-output dist] [--package app] (explicit persistent setup)\n'
   +'Baseline: baseline --project <dir> [--package app] [--migrate] (explicit debt capture or non-growing migration)\n'
   +'Lint: lint --project <dir> [--sources src,app] [--package app] (requires installed @vanya/ui and frozen tools)\n'
   +'Plan: plan --project <dir> --task <description> --target <route/component> [--scope new|feature|screen|migration] > receipt.json\n'
   +'Review: review --receipt receipt.json [--verification verify.json] (checks recorded evidence and supplied machine results)\n'
   +'For repeatable agent steps read <vanya-ui>/skills/vanya-ui/SKILL.md.');
  return 0;
 }
 if(command==='plan'){
  const scope=options.scope||'feature';
  const mode=options.mode||(scope==='new'?'react':'auto');
  if(!modes.includes(mode)||mode==='none')throw Error('plan needs a UI mode');
  if(scope==='new'&&!options.project)throw Error('new scope requires --project');
  const targetProject=options.project?{project:resolve(options.project),package:options.package||null,mode}:null;
  if(targetProject&&(!existsSync(targetProject.project)||!statSync(targetProject.project).isDirectory()))throw Error('Create target directory before planning');
  console.log(JSON.stringify(createAcceptancePlan({task:options.task,target:options.target,scope,libraryVersion:json(join(libraryRoot,'package.json'))?.version||null,targetProject}),null,2));return 0;
 }
 if(command==='review'){
  if(!options.receipt)throw Error('review requires --receipt <path>');
  const receipt=JSON.parse(readFileSync(resolve(options.receipt),'utf8'));
  const binding=receipt?.targetProject;
  const project=options.project||binding?.project;
  const projectInfo=project?inspectProject({project,mode:options.mode||binding?.mode||'auto',packageDir:options.package||binding?.package||undefined}):undefined;
  const verification=options.verification?JSON.parse(readFileSync(resolve(options.verification),'utf8')):undefined;
  const review=reviewAcceptance(receipt,{projectInfo,verification});
  console.log(JSON.stringify(review,null,2));return review.status==='recorded'?0:1;
 }
 const info=inspectProject({project:options.project||'.',mode:options.mode||'auto',packageDir:options.package});
 if(command==='adopt'){
  if(info.mode!=='react'||!info.package||!info.pinnedDependency)throw Error('adopt requires a selected React package with a pinned @vanya/ui dependency');
  const outcome=adoptConsumer({project:info.packageRoot,sources:options.sources?.split(','),cssOutput:options['css-output']});
  output(outcome,options.json);return 0;
 }
 if(command==='baseline'){
  if(info.mode!=='react'||!info.package||!info.pinnedDependency||info.designHarness?.status!=='ready'||options.sources)throw Error('baseline requires an adopted React package and uses its exact configured source scope');
  const outcome=captureConsumerBaseline({project:info.packageRoot,asJson:Boolean(options.json),migrate:Boolean(options.migrate)});
  output(outcome,options.json);return 0;
 }
 if(command==='lint'){
  if(info.mode!=='react'||!info.package)throw Error('lint requires a React package; select it with --package');
  const item=runConsumerLint({project:info.packageRoot,sources:options.sources?.split(','),asJson:Boolean(options.json)});
  output({status:item.status,checks:[item],project:info.project,package:info.package},options.json);
  return item.status==='passed'?0:1;
 }
 if(command==='inspect'){output(info,options.json);return 0}
 if(command==='check'){
  const checked=checkProject(info);
  output({...checked,project:info.project,package:info.package,mode:info.mode},options.json);
  return checked.status==='fail'?1:0;
 }
 const result=verifyProject(info,{
  manager:options.manager,buildScript:options['build-script'],browserScript:options['browser-script'],
  unitScript:options['unit-script'],dryRun:Boolean(options['dry-run']),asJson:Boolean(options.json)
 });
 output(result,options.json);
 return result.status==='passed'||result.status==='skipped'||result.status==='planned'?0:1;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{process.exitCode=runCli(process.argv.slice(2))}
 catch(e){console.error('[ui-pipeline] ERROR: '+e.message);process.exitCode=1}
}
