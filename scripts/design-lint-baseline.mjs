export function normalizeWarning(file,w,source){
 const suffix=' ('+w.rule+')';
 const line=source.split(/\r?\n/)[w.line-1]?.trim();
 if(!line)throw Error('Missing source line '+file+':'+w.line);
 return {file,rule:w.rule,message:w.text.endsWith(suffix)?w.text.slice(0,-suffix.length):w.text,source:line};
}
export function compareBaseline(warnings,baseline){
 const key=w=>JSON.stringify([w.file,w.rule,w.message,w.source]);
 const remaining=baseline.slice();
 const newFindings=warnings.filter(w=>{const i=remaining.findIndex(e=>key(e)===key(w));if(i<0)return true;remaining.splice(i,1);return false;});
 return {newFindings,resolved:remaining};
}
