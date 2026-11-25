// Explicit existing-product migration command; no automatic recapture.
import {existsSync,readFileSync,writeFileSync,mkdtempSync,renameSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {readHarnessConfig,HARNESS_CONFIG,HARNESS_BASELINE,runConsumerLint} from './design-harness.mjs';
import {assertDebtBaseline,compareBaseline} from './design-lint-baseline.mjs';

export function captureConsumerBaseline({project,asJson=false,migrate=false},executeLint=runConsumerLint){
 const root=resolve(project),configPath=join(root,HARNESS_CONFIG),baselinePath=join(root,HARNESS_BASELINE);
 const config=readHarnessConfig(root);
 if(migrate?config.mode!=='baseline':config.mode!=='strict'||existsSync(baselinePath))throw Error('Design baseline already exists; automatic recapture is forbidden. Use explicit --migrate only for reviewed non-growing debt.');
 const oldText=migrate?readFileSync(baselinePath,'utf8'):null;
 const old=migrate?assertDebtBaseline(JSON.parse(oldText),{sources:config.sources}):null;
 const before=readFileSync(configPath,'utf8');
 const temp=mkdtempSync(join(root,'.vanya-ui-baseline-'));
 try{
  const captured=join(temp,'capture.json');
  const result=executeLint({project:root,asJson,captureFile:captured,migrate});
  if(result.status!=='passed'||result.exitCode!==0||!existsSync(captured))throw Error('Baseline capture failed; resolve lint execution errors before migration');
  const data=assertDebtBaseline(JSON.parse(readFileSync(captured,'utf8')),{sources:config.sources});
  if(readFileSync(configPath,'utf8')!==before)throw Error('Harness configuration changed during capture');
  if(migrate){
   if(readFileSync(baselinePath,'utf8')!==oldText)throw Error('Baseline changed during migration');
   const {newFindings,resolved}=compareBaseline(data.entries,old.entries);
   if(newFindings.length)throw Error('Baseline migration would grow or change debt; fix new findings first: '+JSON.stringify(newFindings));
   const next=join(temp,'baseline.json');writeFileSync(next,JSON.stringify(data,null,2)+'\n',{flag:'wx'});renameSync(next,baselinePath);
   return {status:'migrated',project:root,entries:data.entries.length,resolved:resolved.length,changed:[baselinePath]};
  }
  const next=join(temp,'config.json');
  writeFileSync(next,JSON.stringify({...config,mode:'baseline'},null,2)+'\n',{flag:'wx'});
  writeFileSync(baselinePath,JSON.stringify(data,null,2)+'\n',{flag:'wx'});
  try{renameSync(next,configPath)}catch(e){rmSync(baselinePath);throw e}
  return {status:'baselined',project:root,entries:data.entries.length,changed:[baselinePath,configPath]};
 }finally{rmSync(temp,{recursive:true,force:true})}
}
