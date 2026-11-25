import {readFileSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';

export function assertBuiltUi(css){
 const required=[['brand ground','--ground:'],['brand accent','--accent:'],['type roles','--type-body-size:'],['shared size','.ui-size'],['action button','.ui-action-button'],['generated Tailwind utility','.rounded-sm']];
 const missing=required.filter(([,literal])=>!css.includes(literal)).map(([name])=>name);
 if(missing.length)throw Error('Missing compiled UI CSS: '+missing.join(', '));
}
export function checkBuiltUi(dir){
 const walk=path=>readdirSync(path,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(path,entry.name)):entry.isFile()&&entry.name.endsWith('.css')?[join(path,entry.name)]:[]);
 const files=walk(dir);
 if(!files.length)throw Error('No compiled CSS found in '+dir);
 assertBuiltUi(files.map(path=>readFileSync(path,'utf8')).join('\n'));
 return files.length;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{console.log('[built-ui] PASS — '+checkBuiltUi(resolve(process.argv[2]||'dist/assets'))+' CSS asset(s), shared tokens, component CSS and generated utility')}
 catch(error){console.error('[built-ui] FAIL — '+error.message);process.exitCode=1}
}
