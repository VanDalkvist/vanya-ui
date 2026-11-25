#!/usr/bin/env node
/** Vanya Arc / UI portable CLI. Node >=20; no Git or new application dependencies. */
import {readFileSync,existsSync,statSync,realpathSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {checkProject} from './ui-contract.mjs';
import {runConsumerLint} from './design-harness.mjs';
import {adoptConsumer} from './adopt-ui-harness.mjs';
import {captureConsumerBaseline} from './capture-ui-baseline.mjs';
import {createAcceptancePlan,reviewAcceptance} from './ui-acceptance.mjs';
import {inspectProject,json} from './ui-project-inspection.mjs';
import {verifyProject,verifyContribution} from './ui-verification.mjs';
export {inspectProject,checkProject,verifyProject};
const libraryRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const modes=['auto','react','visual','none'];
// Each usage string is the single source of supported command options.
function parseArgs(argv){
 const [command,...tail]=argv;
 if(!Object.hasOwn(commandHelp,command))throw Error('Unknown command '+command+'; run vui --help');
 const allowed=new Set([...commandHelp[command].matchAll(/--([\w-]+)/g)].map(m=>m[1]));
 const options={};
 const boolean=new Set(['json','dry-run','migrate']);
 for(let i=0;i<tail.length;i++){
  const arg=tail[i];
  if(!arg.startsWith('--'))throw Error('Unexpected argument '+arg+'; run vui '+command+' --help');
  const key=arg.slice(2);
  if(!allowed.has(key))throw Error('Unsupported option --'+key+' for '+command+'; run vui '+command+' --help');
  if(Object.hasOwn(options,key))throw Error('Duplicate option --'+key+'; specify it once');
  if(boolean.has(key)){options[key]=true;continue}
  const value=tail[++i];
  if(!value||value.startsWith('--'))throw Error('Missing value for --'+key);
  options[key]=value;
 }
 return {command,options};
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
const commandHelp={
 inspect:'inspect --project <dir> [--package app] [--mode auto|react|visual|none] [--json]',
 check:'check --project <dir> [--package app] [--mode auto|react|visual|none] [--json]',
 verify:'verify --project <dir> [--package app] [--mode auto|react|visual|none] [--manager npm|pnpm|yarn|bun] [--build-script build] [--browser-script test:e2e] [--unit-script test:unit] [--dry-run] [--json]',
 adopt:'adopt --project <dir> --sources src,app [--css-output dist] [--package app] [--mode auto|react] [--json]',
 baseline:'baseline --project <dir> [--package app] [--mode auto|react] [--migrate] [--json]',
 lint:'lint --project <dir> [--sources src,app] [--package app] [--mode auto|react] [--json]',
 plan:'plan --project <dir> --task <description> --target <route/component> [--package app] [--mode auto|react|visual] [--scope new|feature|screen|migration] [--json]',
 review:'review --receipt receipt.json [--verification verify.json] [--project <dir>] [--package app] [--mode auto|react|visual] [--json]',
 contribute:'contribute --project <library> [--manager npm|pnpm|yarn|bun] [--dry-run] [--json]'
};
function printHelp(command){
 if(command){
  if(!Object.hasOwn(commandHelp,command))throw Error('Unknown command '+command);
  console.log('Usage: vui '+commandHelp[command]);
  if(command==='contribute')console.log('Verify library contributions: test, typecheck, build, lint:design:pilot. Visual acceptance is separate.\nContributor guide: '+join(libraryRoot,'docs/patterns/contributing.md'));
  return;
 }
 console.log('Vanya Arc / UI — vanya-arc-ui (vui)\nNode >=20; portable source-tree entrypoint: node scripts/ui-pipeline.mjs\n\nConsumer commands:');
 for(const name of ['inspect','adopt','plan','check','verify','review','lint','baseline'])console.log('  vui '+commandHelp[name]);
 console.log('\nContributor command:\n  vui '+commandHelp.contribute+'\n\nOptions: --help, --version. Use vui <command> --help for details.');
 console.log('Consumer workflow: inspect → plan → implement → verify → review');
 console.log('Contributor workflow: read guide → prepare contribution → contribute --project <library> → review evidence');
 console.log('Skill: '+join(libraryRoot,'skills/vanya-ui/SKILL.md'));
 console.log('Design rules: '+join(libraryRoot,'DESIGN.md'));
 console.log('Contributor guide: '+join(libraryRoot,'docs/patterns/contributing.md'));
 console.log('Prefer the pinned local executable ./node_modules/.bin/vui; source folder fallback: node '+join(libraryRoot,'scripts/ui-pipeline.mjs'));
}
export function runCli(argv){
 if(argv.length===1&&['--version','-v'].includes(argv[0])){
  console.log(json(join(libraryRoot,'package.json'))?.version||'unknown');return 0;
 }
 if(!argv.length||['help','--help','-h'].includes(argv[0])){
  if(argv.length>2)throw Error('Usage: vui help [command]');
  printHelp(argv[1]);return 0;
 }
 if(argv.slice(1).some(x=>x==='--help'||x==='-h')){
  printHelp(argv[0]);return 0;
 }
 const {command,options}=parseArgs(argv);
 if(command==='contribute'){
  const outcome=verifyContribution(options);
  output(outcome,options.json);return ['passed','planned'].includes(outcome.status)?0:1;
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
if(process.argv[1]&&existsSync(process.argv[1])&&realpathSync(process.argv[1])===realpathSync(fileURLToPath(import.meta.url))){
 try{process.exitCode=runCli(process.argv.slice(2))}
 catch(e){console.error('[ui-pipeline] ERROR: '+e.message);process.exitCode=1}
}
