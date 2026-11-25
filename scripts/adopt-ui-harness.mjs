// Explicit command boundary: persist only the canonical consumer wiring.
import {existsSync,readFileSync,writeFileSync,lstatSync,mkdtempSync,renameSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {CANONICAL_LINT_SCRIPT,HARNESS_CONFIG,resolveInstalledHarness,validateSources,readHarnessConfig} from './design-harness.mjs';

const start='<!-- vanya-ui:harness:start -->',end='<!-- vanya-ui:harness:end -->';
const block=[
 start,'## Vanya UI design-system harness',
 'Read the installed canonical skill before every UI task. From this package directory resolve it with:',
 '    node -p "require(\'node:path\').resolve(require.resolve(\'@vanya/ui/tokens.css\'), \'../../skills/vanya-ui/SKILL.md\')"',
 'Use real @vanya/ui components and tokens. Run the canonical lint:design package script locally. In existing CI before deploy invoke the installed package directly: node --input-type=module -e "import \'@vanya/ui/lint\'".',
 'Source scope is declared in vanya-ui.config.json. Use the installed UI pipeline check/verify and retain actual browser acceptance evidence.',
 end
].join('\n');

function readable(path){
 if(!existsSync(path))return null;
 if(!lstatSync(path).isFile())throw Error('Refusing to replace a non-regular file: '+path);
 return readFileSync(path,'utf8');
}
export function adoptConsumer({project,sources}){
 const root=resolve(project);
 const {version}=resolveInstalledHarness(root);
 let config={schemaVersion:1,sources:validateSources(root,sources),mode:'strict'};
 const pkgPath=join(root,'package.json'),configPath=join(root,HARNESS_CONFIG),agentsPath=join(root,'AGENTS.md');
 const pkgText=readable(pkgPath);if(pkgText===null)throw Error('Missing package.json');
 const pkg=JSON.parse(pkgText),scripts=pkg.scripts||{};
 if(scripts['lint:design']!==undefined&&scripts['lint:design']!==CANONICAL_LINT_SCRIPT)throw Error('Conflicting lint:design script; review it before adopting Vanya UI');
 const existing=readable(configPath);
 if(existing!==null){
  const current=readHarnessConfig(root);
  if(JSON.stringify(current.sources)!==JSON.stringify(config.sources))throw Error('Existing harness source configuration differs; review it explicitly');
  config=current;
 }
 const agents=readable(agentsPath)||'';
 if((agents.includes(start)||agents.includes(end))&&!agents.includes(block))throw Error('Existing Vanya UI AGENTS.md managed block differs; review it explicitly');
 const writes=[];
 if(scripts['lint:design']!==CANONICAL_LINT_SCRIPT)writes.push([pkgPath,JSON.stringify({...pkg,scripts:{...scripts,'lint:design':CANONICAL_LINT_SCRIPT}},null,2)+'\n']);
 if(existing===null)writes.push([configPath,JSON.stringify(config,null,2)+'\n']);
 if(!agents.includes(block))writes.push([agentsPath,agents+(agents?'\n':'')+block+'\n']);
 const temp=mkdtempSync(join(root,'.vanya-ui-adopt-'));
 try{
  for(let i=0;i<writes.length;i++)writeFileSync(join(temp,String(i)),writes[i][1],{flag:'wx'});
  for(let i=0;i<writes.length;i++)renameSync(join(temp,String(i)),writes[i][0]);
 }finally{rmSync(temp,{recursive:true,force:true})}
 return {status:'adopted',project:root,version,config,changed:writes.map(([path])=>path)};
}
