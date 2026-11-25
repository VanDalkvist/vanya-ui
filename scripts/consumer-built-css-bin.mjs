import {verifyConsumerCss} from './consumer-built-css.mjs';
try{const result=verifyConsumerCss(process.cwd());console.log('[built-ui] PASS '+result.assets+' CSS asset(s) in '+result.output)}
catch(e){console.error('[built-ui] FAIL '+e.message);process.exitCode=1}
