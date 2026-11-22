/**
 * Publish source Markdown without broken repository-relative links.
 * Source documents remain usable offline; crawler copies link to public
 * equivalents when available, otherwise canonical GitHub source URLs.
 * No API requests, Git checkout, or network access.
 */
import path from 'node:path';

const site='https://ui.vanya-arc.dev';
const repository='https://github.com/VanDalkvist/vanya-ui/blob/main/';
const published={
 'skills/vanya-ui/SKILL.md':'reference/agent-skill.md',
 'docs/patterns/ui-feature-pipeline.md':'reference/ui-pipeline.md',
 'docs/patterns/list-detail-composition.md':'reference/list-detail.md',
 'docs/patterns/interaction-states.md':'reference/interaction-states.md',
 'docs/versioning.md':'reference/versioning.md',
 'docs/patterns/browser-navigation.md':'reference/navigation.md',
 'docs/patterns/typography.md':'reference/typography.md',
 'docs/research/workspace-scroll-composition-2026-11-21.md':'reference/workspaces.md',
 'docs/composition/working-surfaces.md':'reference/composition.md',
 'docs/patterns/loading-states.md':'reference/loading.md',
 'docs/patterns/writing-and-editorial.md':'reference/writing.md',
 'docs/patterns/publication-safety.md':'reference/publication-safety.md',
 'docs/patterns/sources-and-attribution.md':'reference/sources.md',
 'THIRD_PARTY_NOTICES.md':'reference/third-party.md',
 'LICENSING.md':'reference/licensing.md',
 'BRAND.md':'reference/brand.md',
 'docs/identity/brand.md':'reference/identity.md'
};
export function publicMarkdown(sourceFile,markdown){
 return markdown.replace(/(!?\[[^\]]+\]\()([^\s)]+)(\))/g,(whole,start,href,end)=>{
  if(/^(?:[a-z][\w+.-]*:|\/|#)/i.test(href))return whole;
  const hashIndex=href.indexOf('#');
  const relative=hashIndex<0?href:href.slice(0,hashIndex);
  const anchor=hashIndex<0?'':href.slice(hashIndex);
  if(!relative)return whole;
  const target=path.posix.normalize(path.posix.join(path.posix.dirname(sourceFile),relative));
  if(target.startsWith('../')||target.startsWith('/'))return whole;
  const route=published[target];
  return start+(route?site+'/'+route:repository+target)+anchor+end;
 });
}
