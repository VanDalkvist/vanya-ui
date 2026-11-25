import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {validatePublication} from './check-llm-publication.mjs';
const paths=[
 'llms.txt','llms-full.txt','index.md','reference/identity.md','reference/agent-skill.md',
 'reference/ui-pipeline.md','reference/design-harness-quickstart.md','reference/list-detail.md','reference/versioning.md','reference/interaction-states.md','reference/action-feedback.md','reference/components.md',
 'reference/workspaces.md','reference/installation.md',
 'reference/brand-artwork-license.txt','reference/composition.md','reference/publication-safety.md','reference/tokens.md','reference/typography.md'
];
const site='https://ui.vanya-arc.dev/';
function put(root,path,body){
 const dst=join(root,path);mkdirSync(dirname(dst),{recursive:true});writeFileSync(dst,body);
}
test('public agent references must be present and canonical',()=>{
 const root=mkdtempSync(join(tmpdir(),'ui-crawler-'));
 try{
  const links=['reference/identity.md','reference/design-harness-quickstart.md','reference/typography.md','reference/composition.md','reference/publication-safety.md','reference/agent-skill.md','reference/ui-pipeline.md','reference/list-detail.md','reference/versioning.md','reference/interaction-states.md','reference/action-feedback.md'].map(p=>'- ['+p+']('+site+p+')');
  const body='# Vanya UI agent references\n\n'+links.join('\n')+'\n\nThis is a public document for crawler and LLM discovery.\n';
  for(const p of paths){
   const text=p==='reference/installation.md'?'# Installation\n\nbun add "github:VanDalkvist/vanya-ui#<verified-40-char-commit-sha>"\n':body;
   put(root,'public/'+p,text);
  }
  put(root,'llms.txt',body);
  put(root,'public/robots.txt','User-agent: *\nAllow: /\nSitemap: '+site+'sitemap.xml\n');
  put(root,'agents/index.html','<html></html>');
  put(root,'public/sitemap.xml','<urlset>'+[...paths,'agents/'].map(p=>'<url><loc>'+site+p+'</loc></url>').join('')+'</urlset>');
  put(root,'skills/vanya-ui/SKILL.md',body);
  put(root,'docs/identity/brand.md',body);
  put(root,'docs/patterns/ui-feature-pipeline.md',body);
  put(root,'docs/patterns/design-harness-quickstart.md',body);
  put(root,'docs/patterns/list-detail-composition.md',body);
  put(root,'docs/versioning.md',body);
  put(root,'docs/patterns/interaction-states.md',body);
  put(root,'docs/patterns/action-feedback.md',body);
  put(root,'docs/composition/working-surfaces.md',body);
  put(root,'docs/patterns/typography.md',body);
  put(root,'docs/patterns/publication-safety.md',body);
  put(root,'src/index.ts','export {Skeleton, LoadingRegion, type SkeletonProps} from "./components/Skeleton";');
  const exports='- Skeleton (value): ./components/Skeleton\n- LoadingRegion (value): ./components/Skeleton\n- SkeletonProps (type): ./components/Skeleton';
  put(root,'public/reference/components.md',body+exports);
  put(root,'public/llms-full.txt','## Agent instructions'+String.fromCharCode(10,10)+body+exports);
  let result=validatePublication(root);
  assert.equal(result.ok,true,JSON.stringify(result.errors));
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
  const bad=body.replace('- [reference/ui-pipeline.md]',String.fromCharCode(92,110)+'- [reference/ui-pipeline.md]');
  put(root,'public/llms.txt',bad);
  result=validatePublication(root);
  assert.ok(result.errors.some(x=>x.includes('escaped newline')));
 }finally{rmSync(root,{recursive:true,force:true})}
});
