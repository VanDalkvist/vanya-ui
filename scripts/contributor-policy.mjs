// Pure publication checks. Findings deliberately contain no matching text or paths.
import {posix} from 'node:path';
const fold=value=>value.normalize('NFKC').toLowerCase();
export function validatePolicy(value){
 if(!value||value.schemaVersion!==1||Object.keys(value).some(k=>!['schemaVersion','identifiers'].includes(k))||!Array.isArray(value.identifiers)||!value.identifiers.length||value.identifiers.length>2000)throw Error('Invalid private publication policy');
 if(value.identifiers.some(s=>typeof s!=='string'||s.trim()!==s||s.length<3||s.length>2048||/[\r\n\0]/.test(s)))throw Error('Invalid private publication policy');
 return [...new Set(value.identifiers.map(fold))];
}
function portability(path,text){
 if(/(?:^|\/)\.env(?:$|\.)/.test(path))return true;
 if(/(?:^|\/)package\.json$/.test(path)){
  let pkg;try{pkg=JSON.parse(text)}catch{return true}
  for(const key of ['dependencies','devDependencies','peerDependencies','optionalDependencies']){
   if(Object.values(pkg[key]||{}).some(v=>typeof v==='string'&&/^(?:file:|link:|portal:|\/|[A-Za-z]:[\\/])/.test(v)))return true;
  }
 }
 if(!/\.[cm]?[jt]sx?$/.test(path))return false;
 const imports=text.matchAll(/^\s*(?:import\s+(?:[^;\n]*?\s+from\s+)?|export\s+[^;\n]*?\s+from\s+)['"]([^'"\n]+)['"]/gm);
 for(const [,specifier] of imports){
  if(/^(?:file:|\/|[A-Za-z]:[\\/])/.test(specifier))return true;
  if(specifier.startsWith('.')){const dest=posix.normalize(posix.join(posix.dirname(path),specifier));if(dest==='..'||dest.startsWith('../'))return true}
 }
 return false;
}
export function scanEntries(entries,identifiers=[]){
 let text=0,binary=0,privateHits=0,portabilityHits=0;
 for(const entry of entries){
  const name=fold(entry.path),body=entry.text===null?'':fold(entry.text);
  if(entry.text===null)binary++;else text++;
  if(identifiers.some(term=>name.includes(term)||body.includes(term)))privateHits++;
  if(portability(entry.path,entry.text??''))portabilityHits++;
 }
 return {text,binary,privateHits,portabilityHits};
}
