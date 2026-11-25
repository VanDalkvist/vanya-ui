// Project discovery and read-only source inspection.
import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {resolve,relative,join,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {authoredInventory,componentUsage,tokenImports} from './design-source-inventory.mjs';
import {inspectHarness,verificationFingerprint} from './design-harness.mjs';
import {criteria} from './ui-acceptance.mjs';
const libraryRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const sourceExtensions=new Set(['.tsx','.jsx','.ts','.js','.mjs','.css','.scss','.html','.svg','.vue','.svelte']);
const excluded=new Set(['node_modules','.git','dist','build','coverage','.next','.nuxt','.output','out','vendor','generated','docs','research','tests','test','__tests__','fixtures','playwright-report']);
const policyFiles=['AGENTS.md','UI_CONTRACT.md','.agents/skills/design/vanya-ui/SKILL.md','.agents/skills/vanya-ui/SKILL.md'];
const browserNames=['test:e2e','test:browser','test:ui'];
const modes=['auto','react','visual','none'];

function read(path){try{return readFileSync(path,'utf8')}catch{return ''}}
export function json(path){try{return JSON.parse(readFileSync(path,'utf8'))}catch{return null}}
function contained(root,path){const r=relative(root,path);return r===''||r!=='..'&&!r.startsWith('..'+sep)&&!r.startsWith('/')}
function packageLocations(root){
 const roots=['.','app','web','frontend','client'];
 for(const group of ['apps','packages']){
  const dir=join(root,group);
  if(existsSync(dir))for(const item of readdirSync(dir,{withFileTypes:true})){
   if(item.isDirectory()&&!item.name.startsWith('.'))roots.push(group+'/'+item.name);
  }
 }
 return roots.filter((p,i)=>roots.indexOf(p)===i).map(p=>({id:p,dir:resolve(root,p),data:json(join(root,p,'package.json'))})).filter(x=>x.data);
}
function scanSources(root,maxFiles=3500){
 const found=[];const queue=[{dir:root,depth:0}];
 while(queue.length&&found.length<maxFiles){
  const {dir,depth}=queue.shift();
  let items=[];try{items=readdirSync(dir,{withFileTypes:true})}catch{continue}
  for(const item of items){
   if(item.isSymbolicLink())continue;
   const path=join(dir,item.name);
   if(item.isDirectory()){
    if(depth<7&&!excluded.has(item.name)&&!item.name.startsWith('.'))queue.push({dir:path,depth:depth+1});
   }else if(item.isFile()&&sourceExtensions.has(extname(item.name).toLowerCase())){
    found.push(path);if(found.length>=maxFiles)break;
   }
  }
 }
 return found;
}
function hasReact(pkg){return Boolean(pkg.dependencies?.react||pkg.devDependencies?.react||pkg.peerDependencies?.react)}
function vanyaSpec(pkg){return pkg.dependencies?.['@vanya/ui']||pkg.devDependencies?.['@vanya/ui']||pkg.peerDependencies?.['@vanya/ui']||null}
function hasVanya(pkg){return Boolean(vanyaSpec(pkg))}
function pinned(spec){
 if(typeof spec!=='string')return false;
 return /^(file:|link:|workspace:)/.test(spec)
  || /(?:#|\/)[0-9a-f]{40}(?:\.tar\.gz)?$/i.test(spec)
  || /^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(spec);
}
export function detectManager(dir,root){
 for(const home of [dir,root]){
  if(existsSync(join(home,'bun.lock'))||existsSync(join(home,'bun.lockb')))return 'bun';
  if(existsSync(join(home,'pnpm-lock.yaml')))return 'pnpm';
  if(existsSync(join(home,'yarn.lock')))return 'yarn';
 }
 return 'npm';
}
function selectPackage(root,packages,requested,mode){
 if(requested){
  const dir=resolve(root,requested);
  if(!contained(root,dir))throw Error('--package must be inside --project');
  const match=packages.find(p=>p.dir===dir)||(()=>{const data=json(join(dir,'package.json'));return data?{id:relative(root,dir)||'.',dir,data}:null})();
  if(!match)throw Error('package.json not found in --package '+requested);
  return match;
 }
 const options=mode==='react'||mode==='auto'?packages.filter(x=>hasReact(x.data)):packages;
 if(options.length>1)throw Error('Multiple UI packages found: '+options.map(x=>x.id).join(', ')+'. Select one using --package <relative path>');
 return options[0]||null;
}
export function inspectProject({project='.',mode='auto',packageDir}={}){
 if(!modes.includes(mode))throw Error('Unsupported mode '+mode);
 const root=resolve(project);
 if(!existsSync(root)||!statSync(root).isDirectory())throw Error('Project directory does not exist: '+root);
 const packages=packageLocations(root);
 const chosen=selectPackage(root,packages,packageDir,mode);
 const effectiveMode=mode==='auto'?(chosen&&hasReact(chosen.data)?'react':'visual'):mode;
 const scanRoot=chosen?chosen.dir:root;
 const files=scanSources(scanRoot);
 const visualFiles=files.filter(f=>['.tsx','.jsx','.vue','.svelte','.html','.css','.scss','.svg'].includes(extname(f).toLowerCase()));
 const finalMode=mode==='auto'&&effectiveMode==='visual'&&!visualFiles.length?'none':effectiveMode;
 const contracts=[root,...(chosen&&chosen.dir!==root?[chosen.dir]:[])].flatMap(dir=>policyFiles.map(name=>join(dir,name)));
 const policy=contracts.filter(existsSync).map(path=>read(path)).join('\n');
 const scanned=files.filter(f=>/\.(tsx|jsx|ts|js|mjs|css|scss|vue|svelte|html)$/.test(f)).slice(0,1200).map(path=>({path,source:read(path).slice(0,120000)}));
 const relevantSources=scanned.map(f=>f.source).join('\n');
 // A deliberately bounded literal import check; this is not a module graph or CSS parser.
 const authored=finalMode==='react'&&chosen?authoredInventory(scanRoot):scanned.map(({path,source})=>({name:relative(scanRoot,path),source}));
 const tokenImportFiles=tokenImports(authored);
 const hasTailwindSource=scanned.some(({path,source})=>/\.(css|scss)$/.test(path)&&/@source\s+['"][^'"]*@vanya\/ui\/src\/?['"]/.test(source.replace(/\/\*[\s\S]*?\*\//g,'')));
 const scripts=chosen?.data.scripts||{};
 const libraryVersion=json(join(libraryRoot,'package.json'))?.version||null;
 const designHarness=finalMode==='react'&&chosen?inspectHarness(scanRoot,scripts):null;
 const usage=finalMode==='react'&&chosen?componentUsage(authored):[];
 let fingerprint=null;
 if(designHarness?.status==='ready')try{fingerprint=verificationFingerprint(scanRoot,root)}catch(e){designHarness.status='invalid';designHarness.problems.push(e.message)}
 const installed=chosen?[chosen.dir,root].map(dir=>json(join(dir,'node_modules','@vanya','ui','package.json'))).find(p=>p?.name==='@vanya/ui'):null;
 return {
  project:root,package:chosen?.id||null,packageRoot:scanRoot,
  mode:finalMode,sourceFiles:files.length,visualFiles:visualFiles.length,
  library:libraryRoot,libraryVersion,dependencySpec:chosen?vanyaSpec(chosen.data):null,installedVersion:installed?.version||null,
  hasPolicy:/\bvanya\s*(?:[-/]\s*)?(?:arc\s*)?(?:[-/]\s*)?ui\b|@vanya\/ui/i.test(policy),
  hasDependency:chosen?hasVanya(chosen.data):false,
  pinnedDependency:chosen?pinned(vanyaSpec(chosen.data)):false,
  hasImport:/(?:from\s*['"]@vanya\/ui(?:\/[^'"]*)?['"]|import\s*['"]@vanya\/ui(?:\/[^'"]*)?['"]|@import\s*['"]@vanya\/ui(?:\/[^'"]*)?['"])/.test(relevantSources),
  hasTokensImport:tokenImportFiles.length>0,tokenImportFiles,hasTailwindSource,
  browserScript:browserNames.find(name=>Boolean(scripts[name]))||null,
  buildScript:Boolean(scripts.build),
  scripts,manager:chosen?detectManager(chosen.dir,root):null,
  designHarness,componentUsage:usage,verificationFingerprint:fingerprint,
  documents:['skills/vanya-ui/SKILL.md','DESIGN.md','src/index.ts','src/tokens.css',
   'docs/patterns/list-detail-composition.md','docs/research/workspace-scroll-composition-2026-11-21.md',
   'docs/patterns/browser-navigation.md',...criteria.map(c=>c.canonical)].filter((name,i,all)=>all.indexOf(name)===i).map(name=>join(libraryRoot,name))
 };
}
