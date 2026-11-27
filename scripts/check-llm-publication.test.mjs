import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {validatePublication} from './check-llm-publication.mjs';
import {publishedDocuments,corpusPaths,publicMarkdown,renderFullReference} from './markdown-publication.mjs';
const paths=['llms.txt','llms-full.txt',...corpusPaths];
const site='https://ui.vanya-arc.dev/';
function put(root,path,body){
 const dst=join(root,path);mkdirSync(dirname(dst),{recursive:true});writeFileSync(dst,body);
}
test('public agent references must be present and canonical',()=>{
 const root=mkdtempSync(join(tmpdir(),'ui-crawler-'));
 try{
  const links=['reference/design.md','reference/reading-inspectors.md','reference/contributing.md','reference/identity.md','reference/design-harness-quickstart.md','reference/typography.md','reference/composition.md','reference/publication-safety.md','reference/agent-skill.md','reference/ui-pipeline.md','reference/list-detail.md','reference/versioning.md','reference/interaction-states.md','reference/action-feedback.md','reference/regression-gate.md'].map(p=>'- ['+p+']('+site+p+')');
  const body='# Vanya UI agent references\n\n> Public design system.\n\n## Agent instructions\n\n'+links.join('\n')+'\n\nThis is a public document for crawler and LLM discovery.\n';
  for(const p of paths){
   const text=p==='reference/installation.md'?'# Installation\n\nbun add "github:VanDalkvist/vanya-ui#<verified-40-char-commit-sha>"\n':body;
   put(root,'public/'+p,text);
  }
  put(root,'llms.txt',body);
  put(root,'public/robots.txt','User-agent: *\nAllow: /\nSitemap: '+site+'sitemap.xml\n');
  put(root,'agents/index.html','<html></html>');
  put(root,'public/sitemap.xml','<urlset>'+[...paths,'agents/'].map(p=>'<url><loc>'+site+p+'</loc></url>').join('')+'</urlset>');
  for(const [source,route] of Object.entries(publishedDocuments)){
   put(root,source,body);put(root,'public/'+route,publicMarkdown(source,body));
  }
  put(root,'package.json',JSON.stringify({version:'3.0.0'}));
  put(root,'src/index.ts','export {Skeleton, LoadingRegion, type SkeletonProps} from "./components/Skeleton";');
  const exports='- Skeleton (value): ./components/Skeleton\n- LoadingRegion (value): ./components/Skeleton\n- SkeletonProps (type): ./components/Skeleton';
  put(root,'public/reference/components.md',body+exports);
  const aggregate=()=>renderFullReference(body,'3.0.0',route=>readFileSync(join(root,'public',route),'utf8'));
  put(root,'public/llms-full.txt',aggregate());
  let result=validatePublication(root);
  assert.equal(result.ok,true,JSON.stringify(result.errors));
  put(root,'public/llms-full.txt',body);
  assert.ok(validatePublication(root).errors.some(x=>x.includes('llms-full.txt is stale')));
  put(root,'public/llms-full.txt',aggregate());
  rmSync(join(root,'docs/patterns/keyboard-shortcuts.md'));
  assert.ok(validatePublication(root).errors.some(x=>x.includes('Missing canonical source: docs/patterns/keyboard-shortcuts.md')));
  put(root,'docs/patterns/keyboard-shortcuts.md',body);
  put(root,'public/reference/writing.md','stale writing guide');
  assert.ok(validatePublication(root).errors.some(x=>x.includes('reference/writing.md')&&x.includes('stale')));
  put(root,'public/reference/writing.md',body);
  assert.equal(validatePublication(root).ok,true);
  put(root,'public/reference/components.md',body+exports.replace('LoadingRegion (value)','LoadingRegion (type)'));
  assert.ok(validatePublication(root).errors.some(x=>x.includes('Public export index differs')));
  put(root,'public/reference/components.md',body+exports);
  put(root,'public/reference/typography.md','stale font guide');
  assert.ok(validatePublication(root).errors.some(x=>x.includes('reference/typography.md')&&x.includes('stale')));
  put(root,'public/reference/typography.md',body);
  put(root,'public/reference/ui-pipeline.md','stale generated copy');
  result=validatePublication(root);
  assert.ok(result.errors.some(x=>x.includes('Generated reference is stale')));
  put(root,'public/reference/ui-pipeline.md',body);
  put(root,'public/reference/design-harness-quickstart.md','stale quickstart');
  assert.ok(validatePublication(root).errors.some(x=>x.includes('design-harness-quickstart.md')&&x.includes('stale')));
  put(root,'public/reference/design-harness-quickstart.md',body);
  put(root,'public/reference/regression-gate.md','stale regression guide');
  assert.ok(validatePublication(root).errors.some(x=>x.includes('reference/regression-gate.md')&&x.includes('stale')));
  put(root,'public/reference/regression-gate.md',body);
  assert.equal(validatePublication(root).ok,true);
  put(root,'public/llms.txt',body.replace('> Public design system.',''));
  assert.ok(validatePublication(root).errors.some(x=>x.includes('title and summary')));
  put(root,'public/llms.txt',body);
  const bad=body.replace('- [reference/ui-pipeline.md]',String.fromCharCode(92,110)+'- [reference/ui-pipeline.md]');
  put(root,'public/llms.txt',bad);
  result=validatePublication(root);
  assert.ok(result.errors.some(x=>x.includes('escaped newline')));
 }finally{rmSync(root,{recursive:true,force:true})}
});
