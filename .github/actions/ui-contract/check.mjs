#!/usr/bin/env node
/** Optional GitHub composite-action adapter to the portable local CLI.
 * The CLI itself does not depend on CI, Git or GitHub.
 */
import {runCli} from '../../../scripts/ui-pipeline.mjs';
const args=['check','--project',process.env.GITHUB_WORKSPACE||process.cwd(),'--mode',process.env.VANYA_UI_MODE||'auto'];
try{process.exitCode=runCli(args)}catch(e){console.error('[ui-contract adapter] '+e.message);process.exitCode=1}
