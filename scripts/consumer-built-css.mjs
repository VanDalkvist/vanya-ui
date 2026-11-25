// Consumer compiled CSS gate; artifact path belongs to the selected project.
import {realpathSync,existsSync} from 'node:fs';
import {join,relative,sep,isAbsolute} from 'node:path';
import {readHarnessConfig} from './design-harness.mjs';
import {checkBuiltUi} from './check-built-ui.mjs';
export function verifyConsumerCss(project){
 const {cssOutput}=readHarnessConfig(project);
 const output=join(project,cssOutput);
 if(!existsSync(output))throw Error('Compiled CSS output does not exist: '+cssOutput);
 const rel=relative(realpathSync(project),realpathSync(output));
 if(!rel||rel==='..'||rel.startsWith('..'+sep)||isAbsolute(rel))throw Error('Compiled CSS output escapes selected package');
 const assets=checkBuiltUi(output);
 return {script:'built-css',status:'passed',exitCode:0,assets,output:cssOutput};
}
