#!/usr/bin/env node
/**
 * Validate LLM/search publication after sync, before Vite build.
 * Reads local artifacts only; no GitHub, browser, external APIs, network or auth.
 */
import {readFileSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderExportIndex} from './public-export-index.mjs';
import {publicMarkdown,publishedDocuments,corpusPaths,renderFullReference,validateSkillLinks} from './markdown-publication.mjs';
const base=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const required=['llms.txt','llms-full.txt',...corpusPaths];
const site='https://ui.vanya-arc.dev';
const read=(root,path)=>readFileSync(join(root,'public',path),'utf8');
export function validatePublication(root=base){
 const errors=[],warnings=[];
 let llms='',overview='',full='',sitemap='';
 for(const path of required)if(!existsSync(join(root,'public',path)))errors.push('Missing publicly generated file: /'+path);
 try{llms=read(root,'llms.txt')}catch{}
 try{overview=read(root,'index.md')}catch{}
 try{full=read(root,'llms-full.txt')}catch{}
 try{sitemap=read(root,'sitemap.xml')}catch{errors.push('Missing sitemap.xml')}
 const robot=existsSync(join(root,'public/robots.txt'))?read(root,'robots.txt'):'';
 if(!/User-agent:\s*\*/i.test(robot)||!/Allow:\s*\//.test(robot))errors.push('robots.txt does not clearly permit crawling');
 if(!robot.includes(site+'/sitemap.xml'))errors.push('robots.txt does not link sitemap');
 const rootLlms=existsSync(join(root,'llms.txt'))?readFileSync(join(root,'llms.txt'),'utf8'):'';
 if(llms!==rootLlms)errors.push('public/llms.txt is stale compared with canonical llms.txt (run sync)');
 // The public, standalone brand artwork notice must match the pinned dependency exactly.
 const brandTerms=join(root,'node_modules','@vanya','brand','LICENSES','LicenseRef-VanyaArc-Brand.txt');
 const publishedBrand=join(root,'public','reference','brand-artwork-license.txt');
 if(existsSync(brandTerms)&&existsSync(publishedBrand)&&readFileSync(brandTerms,'utf8')!==readFileSync(publishedBrand,'utf8'))
  errors.push('Published brand artwork license differs from pinned package');
 for(const [source,route] of Object.entries(publishedDocuments)){
  const pub=join(root,'public',route),src=join(root,source);
  if(!existsSync(src)){errors.push('Missing canonical source: '+source);continue;}
  if(existsSync(pub)){
   const md=readFileSync(pub,'utf8');
   if(md!==publicMarkdown(source,readFileSync(src,'utf8')))errors.push('Generated reference is stale or has broken links: '+route+' differs from '+source);
   if(/\]\(\.\.?\//.test(md))errors.push('Unresolved relative Markdown link in /'+route);
   if(/<ui-folder>|<project-folder>/.test(md))errors.push('Unsafe angle-bracket command placeholder in /'+route);
  }
 }
 const skillPath=join(root,'skills/vanya-ui/SKILL.md');
 if(existsSync(skillPath))errors.push(...validateSkillLinks(readFileSync(skillPath,'utf8'),source=>{
  const target=join(root,source);
  return existsSync(target)?readFileSync(target,'utf8'):undefined;
 }));
 try{
  const version=JSON.parse(readFileSync(join(root,'package.json'),'utf8')).version;
  const expected=renderFullReference(rootLlms,version,route=>read(root,route));
  if(full!==expected)errors.push('Generated llms-full.txt is stale or incomplete');
 }catch(error){errors.push('Cannot validate extended reference: '+error.message)}
 const docs=[['llms.txt',llms],['index.md',overview],['llms-full.txt',full]];
 for(const [name,body] of docs){
  if(/\\n(?:#{1,6}\s|[-*]\s)/.test(body))errors.push(name+' contains literal escaped newline before Markdown heading/list');
  if(body.length<200)errors.push(name+' unexpectedly short');
 }
 const requiredLinks=['reference/design.md','reference/reading-inspectors.md','reference/contributing.md','reference/identity.md','reference/design-harness-quickstart.md','reference/typography.md','reference/composition.md','reference/publication-safety.md','reference/agent-skill.md','reference/ui-pipeline.md','reference/list-detail.md','reference/versioning.md','reference/interaction-states.md','reference/action-feedback.md','reference/regression-gate.md'];
 for(const path of requiredLinks){
  const url=site+'/'+path;
  if(!llms.includes(url))errors.push('Missing primary llms.txt link: '+url);
  if(!overview.includes(url))errors.push('Missing human/Markdown overview link: '+url);
  if(!full.includes(url))errors.push('Missing extended LLM reference link: '+url);
 }
 if(!existsSync(join(root,'agents','index.html')))errors.push('Missing Agent Mode HTML entry');
 const urls=new Set();
 for(const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))urls.add(match[1]);
 if(!urls.has(site+'/agents/'))errors.push('Missing sitemap URL: '+site+'/agents/');
 for(const path of required){
  const url=site+'/'+path;
  if(!urls.has(url))errors.push('Missing sitemap URL: '+url);
 }
 for(const [name,text] of [...docs,...corpusPaths.filter(p=>p.endsWith('.md')&&existsSync(join(root,'public',p))).map(p=>[p,read(root,p)])]){
  for(const match of text.matchAll(/\]\((https:\/\/ui\.vanya-arc\.dev\/[^)]+)\)/g)){
   const url=match[1].split('#')[0];
   if(!url.startsWith(site+'/'))continue;
   const path=url.slice(site.length+1);
   if(path==='agents/'&&existsSync(join(root,'agents','index.html')))continue;
   if(path==='licenses.txt')continue; // Vite emits bundle licenses at build time
   if(path&& !existsSync(join(root,'public',path)))errors.push(name+' links missing public document: '+path);
  }
 }
 const install=existsSync(join(root,'public/reference/installation.md'))?read(root,'reference/installation.md'):'';
 if(/bun add github:VanDalkvist\/vanya-ui(?:\s|$)/m.test(install))errors.push('Installation doc still recommends unpinned moving branch');
 if(!install.includes('verified-40-char-commit-sha'))errors.push('Installation doc lacks immutable version example');
 const barrel=join(root,'src/index.ts');
 try{
  const expected=renderExportIndex(readFileSync(barrel,'utf8'));
  if(!full.includes(expected)||!read(root,'reference/components.md').includes(expected))errors.push('Public export index differs from source barrel');
 }catch(error){errors.push('Cannot validate public export index: '+error.message)}
 if(!/^# [^\n]+\n\n> [^\n]+/.test(llms))errors.push('llms.txt must start with a title and summary');
 return {ok:errors.length===0,errors,warnings,checked:required.length};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=validatePublication();
 if(process.argv.includes('--json'))console.log(JSON.stringify(result,null,2));
 else{
  console.log('[llm-publication] '+(result.ok?'PASS':'FAIL')+' — '+result.checked+' local references');
  for(const e of result.errors)console.error('ERROR '+e);
 }
 if(!result.ok)process.exitCode=1;
}
