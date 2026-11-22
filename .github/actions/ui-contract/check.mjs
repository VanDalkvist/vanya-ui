#!/usr/bin/env node
// Vanya UI contract for changed visual files, with no secrets or dependencies.
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {join,resolve,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const extensions=new Set(['.tsx','.jsx','.vue','.svelte','.html','.css','.scss','.svg']);
const excluded=/(^|\/)(docs|tests?|__tests__|fixtures|dist|node_modules|coverage|build|\.github)\//;
export const visualFiles=files=>files.filter(f=>extensions.has(extname(f))&&!excluded.test(f)&&(/(^|\/)(src|app|web|pages|public|frontend|client|components|styles|ui)\//.test(f)||/^(index\.html|[^/]+\.css|[^/]+\.svg)$/.test(f)));
export function verify({changed,packages,policy='',sources='',mode='auto'}){
 const files=visualFiles(changed),problems=[];
 if(mode==='off'||(!files.length&&mode==='auto'))return {status:'skip',files,problems};
 const has=name=>packages.some(p=>p.name===name||Boolean(p.dependencies?.[name]||p.devDependencies?.[name]||p.peerDependencies?.[name]));
 const react=mode==='react'||mode==='auto'&&has('react');
 if(!/vanya[-/ ](?:arc[-/ ])?ui|@vanya\/ui/i.test(policy))problems.push('AGENTS.md or UI_CONTRACT.md must link canonical Vanya UI');
 if(react){
  if(!has('@vanya/ui'))problems.push('React UI changes must depend on @vanya/ui');
  if(!sources.includes('@vanya/ui'))problems.push('React sources must consume actual @vanya/ui exports/tokens');
  if(!packages.some(p=>Object.keys(p.scripts||{}).some(x=>/^(test:e2e|test:browser|test:ui)$/.test(x))))problems.push('React UI changes require a browser test script');
 }
 return {status:problems.length?'fail':'pass',files,problems,mode:react?'react':'visual'};
}
const read=p=>{try{return readFileSync(p,'utf8')}catch{return ''}};
function git(root,args){try{return execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim()}catch{return ''}}
function packagesUnder(root){
 const dirs=['.','app','web','frontend','client'];
 for(const parent of ['apps','packages'])if(existsSync(join(root,parent)))for(const e of readdirSync(join(root,parent),{withFileTypes:true}))if(e.isDirectory())dirs.push(parent+'/'+e.name);
 return dirs.flatMap(d=>{try{return [JSON.parse(read(join(root,d,'package.json')))]}catch{return []}});
}
function main(){
 const root=resolve(process.env.GITHUB_WORKSPACE||process.cwd(),process.env.VANYA_UI_ROOT||'.');
 const base=process.env.VANYA_UI_BASE||'';
 const changed=git(root,['diff','--name-only',...(base?[base,'HEAD']:['HEAD^','HEAD'])]).split('\n').filter(Boolean);
 const packages=packagesUnder(root);
 const policy=read(join(root,'AGENTS.md'))+read(join(root,'UI_CONTRACT.md'))+read(join(root,'.agents/skills/design/vanya-ui/SKILL.md'));
 const tracked=git(root,['ls-files','-z']).split('\0').filter(Boolean);
 const sources=tracked.filter(f=>/\.(tsx?|jsx?|css|html|vue|svelte)$/.test(f)&&!excluded.test(f)).slice(0,900).map(f=>read(join(root,f)).slice(0,90000)).join('\n');
 const result=verify({changed,packages,policy,sources,mode:packages.some(p=>p.name==='@vanya/ui')?'off':process.env.VANYA_UI_MODE||'auto'});
 console.log('[Vanya UI] '+result.status.toUpperCase()+' '+result.files.length+' visual changes');
 result.files.slice(0,30).forEach(f=>console.log('  '+f));
 result.problems.forEach(p=>console.error('ERROR '+p));
 if(result.status==='fail')process.exitCode=1;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
