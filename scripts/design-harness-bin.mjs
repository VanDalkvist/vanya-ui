#!/usr/bin/env node
import {runConsumerLint} from './design-harness.mjs';
try{
 if(process.argv.length!==2)throw Error('vanya-ui-lint uses vanya-ui.config.json; run ui-pipeline lint for explicit diagnostic scope');
 const result=runConsumerLint({project:process.cwd()});
 if(result.reason)console.error('[vanya-ui-lint] '+result.reason);
 process.exitCode=result.status==='passed'?0:1;
}catch(e){console.error('[vanya-ui-lint] ERROR '+e.message);process.exitCode=1}
