// Explicit networked CI diagnostic. No skill installs, hooks, browser or autofix.
// Keep the production/consumer package and its frozen lockfile untouched.
import {spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

const root=resolve(process.cwd());
const dir=mkdtempSync(join(tmpdir(),'vanya-design-lint-'));
const versions=['impeccable@4.11.0','@shadcn/lint@0.2.5','oxlint@1.95.0','stylelint@18.1.0'];
// Do not pass project secrets or cloud credentials to third-party tools.
const env=Object.fromEntries(Object.entries(process.env).filter(([key])=>['PATH','HOME','TMPDIR','TEMP','TMP','LANG','LC_ALL','CI','SSL_CERT_FILE','SSL_CERT_DIR','NODE_EXTRA_CA_CERTS','SystemRoot','ComSpec'].includes(key)));
const run=(command,args,cwd=root)=>spawnSync(command,args,{cwd,env,stdio:'inherit',timeout:180000});
const record=(name,result,findings)=>{
 const status=result.error||result.signal||result.status===null?'ERROR':result.status===0?'COMPLETED':findings.includes(result.status)?'FINDINGS':'ERROR';
 console.log('[design-lint-pilot] '+name+' '+status+' exit='+result.status+(result.error?' '+result.error.message:''));
 return status;
};
try{
 writeFileSync(join(dir,'package.json'),JSON.stringify({name:'vanya-design-lint-pilot',private:true}));
 const install=run('npm',['install','--prefix',dir,'--no-save','--package-lock=false','--ignore-scripts','--no-audit','--no-fund',...versions]);
 if(install.status!==0||install.error)console.error('[design-lint-pilot] BLOCKED: external packages could not be installed; no scan result');
 else{
  const bin=name=>join(dir,'node_modules','.bin',name);
  const config=join(dir,'oxlintrc.json');
  writeFileSync(config,JSON.stringify({jsPlugins:['@shadcn/lint'],settings:{shadcn:{componentImports:['^@vanya/ui(/|$)'],themeImports:['^@vanya/ui/'],note:'Read Vanya UI DESIGN.md and installed tokens.'}},rules:{'shadcn/no-raw-colors':'warn','shadcn/no-arbitrary-values':['warn',{allow:['layout']}]}}));
  const styleConfig=join(dir,'stylelint.json');
  writeFileSync(styleConfig,JSON.stringify({referenceFiles:[join(root,'src/tokens.css'),join(root,'node_modules/@vanya/brand/src/tokens.css')],rules:{'no-unknown-custom-properties':[true,{severity:'warning'}],'value-type-custom-property-required-list':[['color','length'],{ignoreValues:['0','transparent','currentcolor'],severity:'warning'}]}}));
  record('Impeccable source',run(bin('impeccable'),['detect','--json','src/']),[2]);
  record('shadcn token/size',run(bin('oxlint'),['--config',config,'src/showcase']),[1]);
  record('Stylelint CSS',run(bin('stylelint'),['--config',styleConfig,'src/showcase/showcase.css']),[2]);
 }
}finally{rmSync(dir,{recursive:true,force:true})}
// Pilot only: reports findings/operational errors explicitly. Promote individual
// verified rules after baselining. Never turn a scan failure into a PASS claim.
