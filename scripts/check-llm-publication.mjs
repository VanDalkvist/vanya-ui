#!/usr/bin/env node
/**
 * Validate LLM/search publication after sync, before Vite build.
 * Reads local artifacts only; no GitHub, browser, external APIs, network or auth.
 */
import {readFileSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderExportIndex} from './public-export-index.mjs';
import {publicMarkdown} from './markdown-publication.mjs';
const base=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const required=[
 'llms.txt','llms-full.txt','index.md',
 'reference/identity.md','reference/agent-skill.md','reference/design-harness-quickstart.md','reference/ui-pipeline.md','reference/list-detail.md',
 'reference/versioning.md',
 'reference/interaction-states.md',
 'reference/action-feedback.md',
 'reference/brand-artwork-license.txt',
 'reference/components.md','reference/workspaces.md','reference/installation.md','reference/composition.md','reference/publication-safety.md','reference/tokens.md','reference/typography.md'
];
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
 const canonical=[
  ['reference/identity.md','docs/identity/brand.md'],
  ['reference/agent-skill.md','skills/vanya-ui/SKILL.md'],
  ['reference/ui-pipeline.md','docs/patterns/ui-feature-pipeline.md'],
  ['reference/design-harness-quickstart.md','docs/patterns/design-harness-quickstart.md'],
  ['reference/list-detail.md','docs/patterns/list-detail-composition.md'],
  ['reference/versioning.md','docs/versioning.md'],
  ['reference/interaction-states.md','docs/patterns/interaction-states.md'],
  ['reference/action-feedback.md','docs/patterns/action-feedback.md'],
  ['reference/composition.md','docs/composition/working-surfaces.md'],
  ['reference/typography.md','docs/patterns/typography.md'],
  ['reference/publication-safety.md','docs/patterns/publication-safety.md']
 ];
 for(const [published,source] of canonical){
  const pub=join(root,'public',published),src=join(root,source);
  if(existsSync(pub)&&existsSync(src)&&readFileSync(pub,'utf8')!==publicMarkdown(source,readFileSync(src,'utf8')))
   errors.push('Generated reference is stale or has broken links: '+published+' differs from '+source);
 }
 for(const [path] of canonical){
  const published=join(root,'public',path);
  if(existsSync(published)){
   const md=readFileSync(published,'utf8');
   if(/\]\(\.\.?\//.test(md))errors.push('Unresolved relative Markdown link in /'+path);
   if(/<ui-folder>|<project-folder>/.test(md))errors.push('Unsafe angle-bracket command placeholder in /'+path);
  }
 }
 const docs=[['llms.txt',llms],['index.md',overview],['llms-full.txt',full]];
 for(const [name,body] of docs){
  if(/\\n(?:#{1,6}\s|[-*]\s)/.test(body))errors.push(name+' contains literal escaped newline before Markdown heading/list');
  if(body.length<200)errors.push(name+' unexpectedly short');
 }
 const requiredLinks=['reference/identity.md','reference/design-harness-quickstart.md','reference/typography.md','reference/composition.md','reference/publication-safety.md','reference/agent-skill.md','reference/ui-pipeline.md','reference/list-detail.md','reference/versioning.md','reference/interaction-states.md','reference/action-feedback.md'];
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
 for(const [name,text] of docs){
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
 if(!full.includes('## Agent instructions'))errors.push('Extended reference lacks agent instruction entrypoints');
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
