/**
 * Publish source Markdown without broken repository-relative links.
 * Source documents remain usable offline; crawler copies link to public
 * equivalents when available, otherwise canonical GitHub source URLs.
 * No API requests, Git checkout, or network access.
 */
import path from 'node:path';

const site='https://ui.vanya-arc.dev';
const repository='https://github.com/VanDalkvist/vanya-ui/blob/main/';
export const publishedDocuments=Object.freeze({
 'docs/site-overview.md':'index.md',
 'DESIGN.md':'reference/design.md',
 'docs/composition/reading-inspectors.md':'reference/reading-inspectors.md',
 'skills/vanya-ui/SKILL.md':'reference/agent-skill.md',
 'docs/patterns/ui-feature-pipeline.md':'reference/ui-pipeline.md',
 'docs/patterns/design-harness-quickstart.md':'reference/design-harness-quickstart.md',
 'docs/patterns/list-detail-composition.md':'reference/list-detail.md',
 'docs/patterns/interaction-states.md':'reference/interaction-states.md',
 'docs/patterns/action-feedback.md':'reference/action-feedback.md',
 'docs/versioning.md':'reference/versioning.md',
 'docs/patterns/browser-navigation.md':'reference/navigation.md',
 'docs/patterns/typography.md':'reference/typography.md',
 'docs/research/workspace-scroll-composition-2026-11-21.md':'reference/workspaces.md',
 'docs/composition/working-surfaces.md':'reference/composition.md',
 'docs/patterns/loading-states.md':'reference/loading.md',
 'docs/patterns/writing-and-editorial.md':'reference/writing.md',
 'docs/patterns/publication-safety.md':'reference/publication-safety.md',
 'docs/patterns/contributing.md':'reference/contributing.md',
 'docs/patterns/keyboard-shortcuts.md':'reference/keyboard-shortcuts.md',
 'docs/deployment.md':'reference/deployment.md',
 'docs/patterns/regression-gate.md':'reference/regression-gate.md',
 'docs/patterns/sources-and-attribution.md':'reference/sources.md',
 'THIRD_PARTY_NOTICES.md':'reference/third-party.md',
 'LICENSING.md':'reference/licensing.md',
 'BRAND.md':'reference/brand.md',
 'docs/identity/brand.md':'reference/identity.md'
});
export const generatedReferencePaths=Object.freeze(['reference/components.md','reference/tokens.md','reference/installation.md','reference/brand-artwork-license.txt','LICENSE.txt']);
export const corpusPaths=Object.freeze([...Object.values(publishedDocuments),...generatedReferencePaths]);
export function publicMarkdown(sourceFile,markdown){
 return markdown.replace(/(!?\[[^\]]+\]\()([^\s)]+)(\))/g,(whole,start,href,end)=>{
  if(/^(?:[a-z][\w+.-]*:|\/|#)/i.test(href))return whole;
  const hashIndex=href.indexOf('#');
  const relative=hashIndex<0?href:href.slice(0,hashIndex);
  const anchor=hashIndex<0?'':href.slice(hashIndex);
  if(!relative)return whole;
  const target=path.posix.normalize(path.posix.join(path.posix.dirname(sourceFile),relative));
  if(target.startsWith('../')||target.startsWith('/'))return whole;
  const route=publishedDocuments[target];
  return start+(route?site+'/'+route:repository+target)+anchor+end;
 });
}

/** Aggregate exactly the published, allowlisted documents. No directory crawl or authored summary. */
export function renderFullReference(index,version,read){
 return index.trimEnd()+'\n\n## Document corpus\n\nSource package version: '+version+'. Online documentation follows its deployed build; for implementation inspect the actual immutable installed source.\n'+corpusPaths.map(route=>'\n---\n\nSource: '+site+'/'+route+'\n\n'+read(route).trimEnd()+'\n').join('');
}

/** Direct Markdown reference checks for the local skill; read returns undefined for missing paths. */
export function validateSkillLinks(markdown,read){
 const errors=[];
 const anchors=text=>new Set(text.split('\n').filter(line=>/^#{1,6} /.test(line)).map(line=>line.replace(/^#{1,6} /,'').trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/\s/g,'-')));
 for(const match of markdown.matchAll(/\]\((\.\.?\/[^\s)]+)\)/g)){
  const [relative,fragment]=match[1].split('#');
  const target=path.posix.normalize(path.posix.join('skills/vanya-ui',relative));
  if(target.startsWith('../')||target.startsWith('/')){errors.push('Skill reference escapes source tree: '+match[1]);continue;}
  const body=read(target);
  if(typeof body!=='string'||!body.trim()){errors.push('Missing skill reference: '+target);continue;}
  if(fragment&&!anchors(body).has(decodeURIComponent(fragment)))errors.push('Missing skill heading: '+target+'#'+fragment);
 }
 return errors;
}
