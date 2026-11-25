// Explicit existing-product migration command; no automatic recapture.
import {existsSync,readFileSync,writeFileSync,mkdtempSync,renameSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {readHarnessConfig,HARNESS_CONFIG,HARNESS_BASELINE,runConsumerLint} from './design-harness.mjs';
import {assertDebtBaseline} from './design-lint-baseline.mjs';

export function captureConsumerBaseline({project,asJson=false},executeLint=runConsumerLint){
 const root=resolve(project),configPath=join(root,HARNESS_CONFIG),baselinePath=join(root,HARNESS_BASELINE);
 const config=readHarnessConfig(root);
 if(config.mode!=='strict'||existsSync(baselinePath))throw Error('Design baseline already exists; automatic recapture is forbidden');
 const before=readFileSync(configPath,'utf8');
 const temp=mkdtempSync(join(root,'.vanya-ui-baseline-'));
 try{
  const captured=join(temp,'capture.json');
  const result=executeLint({project:root,asJson,captureFile:captured});
  if(result.status!=='passed'||result.exitCode!==0||!existsSync(captured))throw Error('Baseline capture failed; resolve lint execution errors before migration');
  const data=assertDebtBaseline(JSON.parse(readFileSync(captured,'utf8')),{sources:config.sources});
  if(readFileSync(configPath,'utf8')!==before)throw Error('Harness configuration changed during capture');
  const next=join(temp,'config.json');
  writeFileSync(next,JSON.stringify({...config,mode:'baseline'},null,2)+'\n',{flag:'wx'});
  writeFileSync(baselinePath,JSON.stringify(data,null,2)+'\n',{flag:'wx'});
  try{renameSync(next,configPath)}catch(e){rmSync(baselinePath);throw e}
  return {status:'baselined',project:root,entries:data.entries.length,changed:[baselinePath,configPath]};
 }finally{rmSync(temp,{recursive:true,force:true})}
}
