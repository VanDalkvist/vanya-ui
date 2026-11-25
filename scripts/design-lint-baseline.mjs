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

export const isJsxRule=rule=>typeof rule==='string'&&rule.includes('shadcn')&&/(?:no-raw-colors|no-arbitrary-values)\)?$/.test(rule);
export const isCssRule=rule=>['no-unknown-custom-properties','value-type-custom-property-required-list','declaration-property-value-disallowed-list'].includes(rule);
export function assertDebtBaseline(data,{sources,policyFingerprint}={}){
 if(data?.schemaVersion!==1||!/^[0-9a-f]{64}$/.test(data.policyFingerprint)||!Array.isArray(data.sources)||!Array.isArray(data.entries))throw Error('Invalid design baseline schema');
 if(JSON.stringify(data.sources)!==JSON.stringify(sources))throw Error('Design baseline source scope changed; explicit review required');
 if(policyFingerprint&&data.policyFingerprint!==policyFingerprint)throw Error('Design baseline policy changed; explicit review required');
 for(const e of data.entries){
  if(!e||!['file','rule','message','source'].every(k=>typeof e[k]==='string'&&e[k].trim())||Object.keys(e).length!==4||e.file.split('/').includes('..')||!sources.some(root=>e.file.startsWith(root+'/'))||!(isCssRule(e.rule)||isJsxRule(e.rule)))throw Error('Invalid design baseline entry');
 }
 return data;
}
