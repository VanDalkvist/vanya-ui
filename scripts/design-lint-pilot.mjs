// Explicit CI diagnostics. Install only isolated, frozen tooling; never skills/hooks.
import {spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,existsSync,rmSync,copyFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,relative,sep} from 'node:path';
import {createRequire} from 'node:module';
import {normalizeWarning,compareBaseline} from './design-lint-baseline.mjs';
import {fileURLToPath} from 'node:url';
const library=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const project=resolve(args.find(a=>a.startsWith('--project='))?.slice(10)||library);
const targets=args.filter(a=>!a.startsWith('--'));
const sourceTargets=targets.length?targets:[project===library?'src/showcase':'src'];
const cssTargets=sourceTargets.map(t=>t.endsWith('.css')?t:t+'/**/*.css');
const isLibrary=project===library;
const tools=join(library,'design-lint');
const dir=mkdtempSync(join(tmpdir(),'vanya-design-lint-'));
const env=Object.fromEntries(Object.entries(process.env).filter(([key])=>['PATH','HOME','TMPDIR','TEMP','TMP','LANG','LC_ALL','CI','SSL_CERT_FILE','SSL_CERT_DIR','NODE_EXTRA_CA_CERTS','SystemRoot','ComSpec'].includes(key)));
const run=(command,argv,cwd=project)=>spawnSync(command,argv,{cwd,env,encoding:'utf8',timeout:180000,maxBuffer:16*1024*1024});
const show=r=>{if(r.stdout)process.stdout.write(r.stdout);if(r.stderr)process.stderr.write(r.stderr);if(r.error)console.error(r.error.message);};
const valid=(r,codes)=>!r.error&&!r.signal&&codes.includes(r.status);
const checked=(name,r,codes)=>{show(r);if(!valid(r,codes))throw Error(name+' execution failed: '+r.status);};
const fixture=(name,r,code,markers=[])=>{
 const output=(r.stdout||'')+'\n'+(r.stderr||'');
 if(!valid(r,[code])||!markers.every(m=>output.includes(m))){show(r);throw Error('Fixture failed: '+name+' exit='+r.status);}
 console.log('[design-lint] FIXTURE PASS '+name);
};
try{
 checked('baseline unit tests',run(process.execPath,['--test',join(library,'scripts/design-lint-baseline.test.mjs')],library),[0]);
 copyFileSync(join(tools,'package.json'),join(dir,'package.json'));
 const lock=join(tools,'package-lock.json');
 if(args.includes('--bootstrap-lock')){
  const install=run('npm',['install','--prefix',dir,'--ignore-scripts','--no-audit','--no-fund'],library);
  checked('lock generation',install,[0]);
  const encoded=Buffer.from(JSON.stringify(JSON.parse(readFileSync(join(dir,'package-lock.json'),'utf8'))),'utf8').toString('hex');
  for(let i=0;i<encoded.length;i+=600)console.log('DESIGN_LOCK_HEX '+String(i/600).padStart(4,'0')+' '+encoded.slice(i,i+600));
  console.log('DESIGN_LOCK_END '+encoded.length);
 }else{
  if(!existsSync(lock))throw Error('Missing committed design-lint/package-lock.json');
  copyFileSync(lock,join(dir,'package-lock.json'));
  checked('npm ci',run('npm',['ci','--prefix',dir,'--ignore-scripts','--no-audit','--no-fund'],library),[0]);
 }
 const bin=name=>join(dir,'node_modules','.bin',name);
 const ox=join(dir,'oxlintrc.json');
 writeFileSync(ox,JSON.stringify({jsPlugins:['@shadcn/lint'],categories:{correctness:'off'},settings:{shadcn:{componentImports:['^@vanya/ui(/|$)'],themeImports:['^@vanya/ui/','^@vanya/brand/'],note:'Use Vanya UI tokens.'}},rules:{'shadcn/no-raw-colors':'error','shadcn/no-arbitrary-values':['error',{allow:['layout']}]}}));
 const style=join(dir,'stylelint.json');
 const rules={
  'no-unknown-custom-properties':true,
  'value-type-custom-property-required-list':[['color','length'],{ignoreValues:['0','transparent','currentcolor','currentColor'],ignoreProperties:{length:['/^(?!(?:font-size|border(?:-(?:top|bottom)-(?:left|right))?-radius)$).+$/']}}],
  'declaration-property-value-disallowed-list':{'font-family':['/^(?!var\\(|inherit$|initial$|unset$|revert(?:-layer)?$).+/']}
 };
 writeFileSync(style,JSON.stringify({referenceFiles:[join(library,'src/tokens.css'),createRequire(join(library,'package.json')).resolve('@vanya/brand/tokens.css')],rules}));
 const f=name=>join(tools,'fixtures',name);
 const jsx=(paths,cwd=project)=>run(bin('oxlint'),['--config',ox,...paths],cwd);
 const css=(paths,cwd=project)=>run(bin('stylelint'),['--config',style,...paths],cwd);
 const imp=(paths,cwd=project)=>run(bin('impeccable'),['detect','--json',...paths],cwd);
 fixture('shadcn good',jsx([f('good.tsx')],library),0);
 fixture('shadcn bad',jsx([f('bad.tsx')],library),1,['no-raw-colors','no-arbitrary-values']);
 fixture('stylelint good (including geometry)',css([f('good.css')],library),0);
 fixture('stylelint bad',css([f('bad.css')],library),2,['no-unknown-custom-properties','value-type-custom-property-required-list','declaration-property-value-disallowed-list','19px','17px','#f123ab']);
 fixture('Impeccable gradient text',imp([f('impeccable.css')],dir),2,['gradient-text']);
 const jsxResult=jsx(sourceTargets);
 checked('shadcn',jsxResult,[0,1]);
 const cssResult=run(bin('stylelint'),['--config',style,'--formatter','json',...cssTargets]);
 checked('Stylelint',cssResult,[0,2]);
 const report=[cssResult.stdout,cssResult.stderr].map(out=>{try{return JSON.parse(out)}catch{return null}}).find(Array.isArray);
 if(!report||!report.length||report.some(f=>!Array.isArray(f.warnings)||f.invalidOptionWarnings?.length||f.parseErrors?.length))throw Error('Stylelint report missing or invalid');
 const warnings=report.flatMap(f=>f.warnings.map(w=>{
  const absolute=resolve(project,f.source);
  return normalizeWarning(relative(project,absolute).split(sep).join('/'),w,readFileSync(absolute,'utf8'));
 }));
 if(cssResult.status===2&&!warnings.length)throw Error('Stylelint reported failure without rule findings');
 const baseline=isLibrary&&!args.includes('--strict')?JSON.parse(readFileSync(join(tools,'showcase-baseline.json'),'utf8')):[];
 const {newFindings,resolved}=compareBaseline(warnings,baseline);
 console.log('[design-lint] Stylelint total='+warnings.length+' existing='+(warnings.length-newFindings.length)+' new='+newFindings.length+' resolved='+resolved.length);
 if(newFindings.length)console.error(JSON.stringify(newFindings,null,2));
 const impResult=imp(sourceTargets);
 checked('Impeccable',impResult,[0,2]);
 console.log('[design-lint] Impeccable '+(impResult.status===0?'CLEAN':'FINDINGS')+' (advisory)');
 if(jsxResult.status!==0||newFindings.length)process.exitCode=1;
}catch(e){console.error('[design-lint] ERROR '+e.message);process.exitCode=1;}
finally{rmSync(dir,{recursive:true,force:true});}
