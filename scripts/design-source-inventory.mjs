// Shared authored-source inventory. No git or tool-specific ignore rules.
import {readdirSync,readFileSync,existsSync,statSync} from 'node:fs';
import {join,relative,sep} from 'node:path';
import {createHash} from 'node:crypto';
const excluded=new Set(['node_modules','.git','dist','build','coverage','.next','.nuxt','.output','out','vendor','generated','docs','research','tests','test','__tests__','fixtures','playwright-report','test-results']);
const js=/\.(?:[cm]?[jt]s|[jt]sx)$/i;
const css=/\.css$/i;
const unsupported=/\.(?:scss|sass|less|styl|vue|svelte)$/i;
const testFile=/(?:\.(?:test|spec|stories)\.[^.]+|\.d\.[cm]?ts)$/i;
const norm=s=>s.split(sep).join('/');
const inside=(file,root)=>file===root||file.startsWith(root+'/');
export function authoredInventory(root,{includeTests=false}={}){
 const result=[],pending=[root];
 while(pending.length){
  const dir=pending.pop();
  for(const ent of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
   const file=join(dir,ent.name);
   if((excluded.has(ent.name)&&!(includeTests&&['tests','test','__tests__','fixtures'].includes(ent.name)))||ent.name.startsWith('.'))continue;
   if(ent.isSymbolicLink())throw Error('Unsupported authored symlink: '+norm(relative(root,file)));
   if(ent.isDirectory()){if(existsSync(join(file,'package.json')))continue;pending.push(file);continue}
   if(!ent.isFile()||(!includeTests&&testFile.test(ent.name)))continue;
   const name=norm(relative(root,file));
   if(!js.test(name)&&!css.test(name)&&!unsupported.test(name)&&!name.endsWith('.html'))continue;
   const source=readFileSync(file,'utf8');
   result.push({name,source,kind:js.test(name)?'js':css.test(name)?'css':unsupported.test(name)?'unsupported':'html',ui:css.test(name)||unsupported.test(name)||/\.[jt]sx$/i.test(name)||/\bclassName\b|(?:from\s*|import\s*|require\s*\(\s*)['"]@vanya\/ui|(?:React\.)?createElement\s*\(|<[A-Z][A-Za-z0-9]*[\s/>]/.test(source)});
   if(result.length>3500)throw Error('Authored inventory exceeds supported 3500 files; select the UI package explicitly');
  }
 }
 return result.sort((a,b)=>a.name.localeCompare(b.name));
}
export function lintInventory(root,sources,{requireCoverage=true}={}){
 const all=authoredInventory(root);
 const selected=all.filter(f=>sources.some(s=>inside(f.name,s)));
 if(requireCoverage){
  const omitted=all.filter(f=>f.ui&&!selected.includes(f));
  if(omitted.length)throw Error('UI source outside configured lint scope: '+omitted.map(f=>f.name).join(', '));
 }
 const unsupportedFiles=selected.filter(f=>f.kind==='unsupported');
 if(unsupportedFiles.length)throw Error('Unsupported authored style/source format: '+unsupportedFiles.map(f=>f.name).join(', '));
 const files=selected.filter(f=>f.kind==='js'||f.kind==='css');
 for(const f of files)if(/(?:stylelint|oxlint|eslint|shadcn)[-\s](?:disable|ignore)/i.test(f.source))throw Error('Inline lint suppression forbidden: '+f.name);
 return {js:files.filter(f=>f.kind==='js').map(f=>f.name),css:files.filter(f=>f.kind==='css').map(f=>f.name)};
}
export function hashInputs(root,files,extra=[]){
 const hash=createHash('sha256');
 for(const f of files)hash.update(JSON.stringify([f.name,f.source]));
 for(const name of extra.sort()){const path=join(root,name);if(existsSync(path)&&statSync(path).isFile())hash.update(JSON.stringify([name,readFileSync(path).toString('base64')]));}
 return hash.digest('hex');
}
export function componentUsage(files){
 const result=[];
 for(const {name,source,kind} of files){
  if(kind!=='js')continue;
  const clean=source.replace(/\/\*[\s\S]*?\*\//g,'').replace(/^[ \t]*\/\/.*$/gm,'');
  for(const match of clean.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]@vanya\/ui['"]/g)){
   const names=match[1].split(',').map(s=>s.trim()).filter(s=>!s.startsWith('type ')).map(s=>s.split(/\s+as\s+/).pop()).filter(s=>/^[A-Z][\w]*$/.test(s));
   const used=names.filter(n=>new RegExp('<'+n+'(?=[\\s/>])|createElement\\s*\\(\\s*'+n+'\\b').test(clean));
   if(used.length)result.push({file:name,components:used});
  }
  for(const match of clean.matchAll(/import\s*\*\s*as\s*(\w+)\s*from\s*['"]@vanya\/ui['"]/g)){
   const used=[...clean.matchAll(new RegExp('<'+match[1]+'\\.([A-Z]\\w*)(?=[\\s/>])','g'))].map(m=>m[1]);
   if(used.length)result.push({file:name,components:[...new Set(used)]});
  }
 }
 return result;
}

export function tokenImports(files){
 return files.filter(({name,source})=>{
  const clean=source.replace(/\/\*[\s\S]*?\*\//g,'').replace(/^[ \t]*\/\/.*$/gm,'');
  return /\.(css|scss|vue|svelte|html)$/.test(name)&&/(?:^|[;\n])\s*@import\s+(?:url\(\s*)?['"]@vanya\/ui\/tokens\.css['"]/.test(clean)
   ||/\.(tsx|jsx|ts|js|mjs|vue|svelte)$/.test(name)&&/(?:^|[;\n])\s*import\s*['"]@vanya\/ui\/tokens\.css['"]/.test(clean);
 }).map(f=>f.name);
}
