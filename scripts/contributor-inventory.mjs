// Explicit local filesystem and Git adapters. Never print source contents.
import {execFileSync} from 'node:child_process';
import {lstatSync,readFileSync,readdirSync,realpathSync} from 'node:fs';
import {join,relative,resolve,isAbsolute,sep} from 'node:path';
const LIMIT=32*1024*1024,MAX=12000;
const binary=/\.(?:png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|pdf|zip|gz|mp4|webm|wasm)$/i;
const decoder=new TextDecoder('utf-8',{fatal:true});
const split=b=>b.toString('utf8').split('\0').filter(Boolean);
const safePath=p=>p&&!isAbsolute(p)&&!p.split('/').some(s=>s==='..'||s==='.git')&&!p.includes('\\');
function checkedEntry(path,bytes){
 if(!safePath(path)||bytes.length>LIMIT)throw Error('Unsupported publication inventory entry');
 if(binary.test(path))return {path,text:null};
 if(bytes.includes(0))throw Error('Unclassified binary publication entry');
 return {path,text:decoder.decode(bytes)};
}
function git(root,args){
 try{return execFileSync('git',['--no-replace-objects','-C',root,...args],{stdio:['ignore','pipe','pipe'],maxBuffer:LIMIT,env:{...process.env,GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0'}})}
 catch{throw Error('Local Git inventory unavailable')}
}
export function resolveRoot(project){
 const root=realpathSync(resolve(project));
 if(!lstatSync(root).isDirectory())throw Error('Invalid project directory');
 return root;
}
function under(root,path){const rel=relative(root,path);return rel!==''&&!rel.startsWith('..'+sep)&&rel!=='..'&&!isAbsolute(rel)}
export function readPrivatePolicy(root,path){
 const file=realpathSync(resolve(path));
 if(file===root||under(root,file)||!lstatSync(file).isFile()||lstatSync(file).size>LIMIT)throw Error('Policy must be a private file outside the project');
 return JSON.parse(decoder.decode(readFileSync(file)));
}
function fileEntry(root,path){
 if(!safePath(path))throw Error('Unsupported publication path');
 const file=join(root,path),st=lstatSync(file);
 if(st.isSymbolicLink()||!st.isFile()||st.size>LIMIT||!under(root,realpathSync(file))||realpathSync(file)!==file)throw Error('Unsupported publication file');
 return checkedEntry(path,readFileSync(file));
}
function assertRoot(root){
 if(realpathSync(git(root,['rev-parse','--show-toplevel']).toString().trim())!==root)throw Error('Select the Git repository root');
}
function bounded(paths){if(paths.length>MAX)throw Error('Publication inventory exceeds limit');return paths}
export function sourceEntries(root,{includeUntracked=false}={}){
 assertRoot(root);
 const args=['ls-files','-z','--cached',...(includeUntracked?['--others','--exclude-standard']:[])];
 const paths=bounded([...new Set(split(git(root,args)))]);
 if(!paths.length)throw Error('Empty source inventory');
 return paths.map(path=>fileEntry(root,path));
}
function treeRecords(root,commit){
 return split(git(root,['ls-tree','-r','-z',commit])).map(row=>{
  const tab=row.indexOf('\t'),[mode,type,sha]=row.slice(0,tab).split(' ');
  if(type!=='blob'||!['100644','100755'].includes(mode))throw Error('Unsupported Git tree entry');
  return {path:row.slice(tab+1),sha};
 });
}
function indexRecords(root){
 return split(git(root,['ls-files','--stage','-z'])).map(row=>{
  const tab=row.indexOf('\t'),[mode,sha,stage]=row.slice(0,tab).split(' ');
  if(stage!=='0'||!['100644','100755'].includes(mode))throw Error('Unsupported Git index entry');
  return {path:row.slice(tab+1),sha};
 });
}
export function outgoingEntries(root,base){
 assertRoot(root);
 if(typeof base!=='string'||!base||base.startsWith('-'))throw Error('Explicit local base required');
 const baseSha=git(root,['rev-parse','--verify',base+'^{commit}']).toString().trim();
 const head=git(root,['rev-parse','--verify','HEAD^{commit}']).toString().trim();
 git(root,['merge-base','--is-ancestor',baseSha,head]);
 const commits=git(root,['rev-list',baseSha+'..'+head]).toString().trim().split('\n').filter(Boolean);
 if(commits.length>50)throw Error('Outgoing commit range exceeds limit');
 const staged=git(root,['diff','--cached','--name-only','-z']);
 if(!commits.length&&!staged.length)throw Error('No outgoing commits or staged changes');
 const seen=new Set(),entries=[];
 for(const commit of commits){
  entries.push(checkedEntry('commit-message.txt',git(root,['show','-s','--format=%B',commit])));
  for(const entry of treeRecords(root,commit))add(entry);
 }
 for(const entry of indexRecords(root))add(entry);
 function add({path,sha}){
  const key=path+'\0'+sha;if(seen.has(key))return;seen.add(key);
  if(seen.size>MAX)throw Error('Outgoing snapshot exceeds limit');
  entries.push(checkedEntry(path,git(root,['cat-file','blob',sha])));
 }
 return {entries,commits:commits.length,head};
}
export function builtEntries(root){
 const start=join(root,'dist');
 if(realpathSync(start)!==start||!lstatSync(start).isDirectory())throw Error('Missing or unsupported compiled dist');
 const paths=[],pending=[start];
 while(pending.length){
  for(const e of readdirSync(pending.pop(),{withFileTypes:true})){
   // Use the directory from the traversal, not a reconstructed parent.
   const parent=e.parentPath??e.path;
   if(!parent)throw Error('Unsupported directory entry');
   const file=join(parent,e.name);
   if(e.isSymbolicLink())throw Error('Unsupported built symlink');
   if(e.isDirectory())pending.push(file);
   else if(e.isFile()){paths.push(relative(root,file).split(sep).join('/'));bounded(paths)}
   else throw Error('Unsupported built entry');
  }
 }
 if(!paths.length)throw Error('Empty compiled dist');
 return paths.map(path=>fileEntry(root,path));
}
