#!/usr/bin/env node
/** Optional GitHub composite-action adapter to the portable local CLI.
 * The CLI itself does not depend on CI, Git or GitHub.
 */
import {runCli} from '../../../scripts/ui-pipeline.mjs';
import {resolve} from 'node:path';
const root=resolve(process.env.GITHUB_WORKSPACE||process.cwd(),process.env.VANYA_UI_ROOT||'.');
const args=['check','--project',root,'--mode',process.env.VANYA_UI_MODE||'auto'];
try{process.exitCode=runCli(args)}catch(e){console.error('[ui-contract adapter] '+e.message);process.exitCode=1}
