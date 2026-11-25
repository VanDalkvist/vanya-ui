// Execute the existing library or consumer checks and record actual outcomes.
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {verifyConsumerCss} from './consumer-built-css.mjs';
import {checkProject} from './ui-contract.mjs';
import {runConsumerLint,verificationFingerprint} from './design-harness.mjs';
import {json,detectManager} from './ui-project-inspection.mjs';
const libraryRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const managers=['npm','pnpm','yarn','bun'];
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
// Maintainer verification uses the same runner as the consumer pipeline.
export function verifyContribution(options){
 const root=resolve(options.project||libraryRoot);
 const result={project:root,mode:'contributor',status:'blocked',checks:[],visualReview:'NOT_VERIFIED'};
 const pkg=json(join(root,'package.json'));
 const tasks=['test','typecheck','build','lint:design:pilot'];
 if(pkg?.name!=='@vanya/ui'){
  result.issues=['Select the Vanya UI library root with --project'];return result;
 }
 const missing=tasks.filter(name=>typeof pkg.scripts?.[name]!=='string'||!pkg.scripts[name].trim());
 if(missing.length){result.issues=missing.map(name=>'Missing library script: '+name);return result}
 const manager=options.manager||detectManager(root,root);
 if(!managers.includes(manager)){result.issues=['Unsupported package manager'];return result}
 if(options['dry-run']){
  result.status='planned';result.checks=tasks.map(script=>({script,status:'NOT_RUN'}));return result;
 }
 for(const name of tasks){
  const item=runScript({packageRoot:root},manager,name,Boolean(options.json));
  result.checks.push(item);
  if(item.status!=='passed'){result.status='failed';return result}
 }
 result.status='passed';return result;
}
