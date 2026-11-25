// Explicit CI diagnostics. Install only isolated, frozen tooling; never skills/hooks.
import {spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,existsSync,rmSync,copyFileSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,relative,sep} from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {normalizeWarning,compareBaseline,assertDebtBaseline,isCssRule,isJsxRule} from './design-lint-baseline.mjs';
import {fileURLToPath} from 'node:url';
import {lintInventory} from './design-source-inventory.mjs';
const library=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const project=resolve(args.find(a=>a.startsWith('--project='))?.slice(10)||library);
const targets=args.filter(a=>!a.startsWith('--'));
// The library owns token definitions; inspect all authored component and showcase files.
const librarySources=['src/showcase','src/components'];
const sourceTargets=targets.length?targets:project===library?librarySources:['src'];

const isLibrary=project===library;
const debtPath=args.find(a=>a.startsWith('--baseline='))?.slice(11);
const capturePath=args.find(a=>a.startsWith('--capture-baseline='))?.slice(19);
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
 if((debtPath&&capturePath)||((debtPath||capturePath)&&(isLibrary||args.includes('--strict')||args.includes('--bootstrap-lock'))))throw Error('Invalid baseline operation');
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
 const oxRules={jsPlugins:['@shadcn/lint'],categories:{correctness:'off'},settings:{shadcn:{componentImports:['^@vanya/ui(/|$)'],themeImports:['^@vanya/ui/','^@vanya/brand/'],note:'Use Vanya UI tokens.'}},rules:{'shadcn/no-raw-colors':'error','shadcn/no-arbitrary-values':['error',{allow:['layout']}]}};
 writeFileSync(ox,JSON.stringify(oxRules));
 const style=join(dir,'stylelint.json');
 const rules={
  'no-unknown-custom-properties':true,
  'value-type-custom-property-required-list':[['color','length'],{ignoreValues:['0','transparent','currentcolor','currentColor'],ignoreProperties:{length:['/^(?!(?:font-size|border(?:-(?:top|bottom)-(?:left|right))?-radius)$).+$/']}}],
  'declaration-property-value-disallowed-list':{'font-family':['/^(?!var\\(|inherit$|initial$|unset$|revert(?:-layer)?$).+/']}
 };
 const references=[join(library,'src/tokens.css'),createRequire(join(library,'package.json')).resolve('@vanya/brand/tokens.css')];
 writeFileSync(style,JSON.stringify({referenceFiles:references,rules}));
 const policyFingerprint=createHash('sha256').update(JSON.stringify([readFileSync(lock,'utf8'),'design-policy-v2',oxRules,rules,readFileSync(join(library,'scripts/design-lint-baseline.mjs'),'utf8'),readFileSync(join(library,'scripts/design-source-inventory.mjs'),'utf8'),...references.map(path=>readFileSync(path,'utf8'))])).digest('hex');
 const debt=debtPath?assertDebtBaseline(JSON.parse(readFileSync(debtPath,'utf8')),{sources:sourceTargets,policyFingerprint}):null;
 const f=name=>join(tools,'fixtures',name);
 const jsx=(paths,cwd=project)=>run(bin('oxlint'),['--config',ox,...paths],cwd);
 const css=(paths,cwd=project)=>run(bin('stylelint'),['--config',style,...paths],cwd);
 const imp=(paths,cwd=project)=>run(bin('impeccable'),['detect','--json',...paths],cwd);
 fixture('shadcn good',jsx([f('good.tsx')],library),0);
 fixture('shadcn bad',jsx([f('bad.tsx')],library),1,['no-raw-colors','no-arbitrary-values']);
 fixture('stylelint good (including geometry)',css([f('good.css')],library),0);
 fixture('stylelint bad',css([f('bad.css')],library),2,['no-unknown-custom-properties','value-type-custom-property-required-list','declaration-property-value-disallowed-list','19px','17px','#f123ab']);
 fixture('Impeccable gradient text',imp([f('impeccable.css')],dir),2,['gradient-text']);
 // Exercise the actual default library scope and both frozen tools on a component-path negative fixture.
 if(isLibrary&&!targets.length){
  const probe=join(dir,'component-scope-probe');
  const componentDir=join(probe,'src/components');
  mkdirSync(componentDir,{recursive:true});
  copyFileSync(f('bad.tsx'),join(componentDir,'bad.tsx'));
  copyFileSync(f('bad.css'),join(componentDir,'bad.css'));
  const selected=lintInventory(probe,sourceTargets,{requireCoverage:false});
  if(selected.js.length!==1||selected.css.length!==1)throw Error('Component lint scope omits negative fixture');
  fixture('shared component JSX',jsx(selected.js,probe),1,['no-raw-colors','no-arbitrary-values']);
  fixture('shared component CSS',css(selected.css,probe),2,['value-type-custom-property-required-list','#f123ab']);
 }
 const inventory=lintInventory(project,sourceTargets,{requireCoverage:!isLibrary});
 console.log('[design-lint] scope='+sourceTargets.join(',')+' js='+inventory.js.length+' css='+inventory.css.length);
 if(!inventory.js.length||!inventory.css.length)throw Error('Expected authored JS/TS and CSS in lint scope');
 const jsxResult=run(bin('oxlint'),['--config',ox,'--format','json',...inventory.js]);
 if(!valid(jsxResult,[0,1])){show(jsxResult);throw Error('shadcn execution failed: '+jsxResult.status)}
 const jsxReport=[jsxResult.stdout,jsxResult.stderr].map(out=>{try{return JSON.parse(out)}catch{return null}}).find(v=>Array.isArray(v?.diagnostics));
 if(!jsxReport||!Number.isInteger(jsxReport.number_of_files)||jsxReport.number_of_files!==inventory.js.length||jsxReport.number_of_rules<2)throw Error('Invalid or empty shadcn report');
 const jsxWarnings=jsxReport.diagnostics.map(d=>{
  if(!isJsxRule(d.code)||typeof d.filename!=='string'||typeof d.message!=='string'||!Number.isInteger(d.labels?.[0]?.span?.line))throw Error('Unexpected shadcn diagnostic: '+String(d.code));
  const absolute=resolve(project,d.filename);
  return normalizeWarning(relative(project,absolute).split(sep).join('/'),{rule:d.code,text:d.message,line:d.labels[0].span.line},readFileSync(absolute,'utf8'));
 });
 if(jsxResult.status!==0&&!jsxWarnings.length)throw Error('shadcn failed without rule findings');
 const cssResult=run(bin('stylelint'),['--config',style,'--formatter','json',...inventory.css]);
 if(!valid(cssResult,[0,2])){show(cssResult);throw Error('Stylelint execution failed: '+cssResult.status)}
 const report=[cssResult.stdout,cssResult.stderr].map(out=>{try{return JSON.parse(out)}catch{return null}}).find(Array.isArray);
 if(!report||report.length!==inventory.css.length||report.some(f=>!Array.isArray(f.warnings)||f.ignored||f.invalidOptionWarnings?.length||f.parseErrors?.length)||JSON.stringify(report.map(f=>relative(project,resolve(project,f.source)).split(sep).join('/')).sort())!==JSON.stringify(inventory.css.slice().sort()))throw Error('Stylelint report missing, ignored or incomplete');
 const warnings=report.flatMap(f=>f.warnings.map(w=>{
  if(!isCssRule(w.rule))throw Error('Unexpected Stylelint diagnostic: '+w.rule);
  const absolute=resolve(project,f.source);
  return normalizeWarning(relative(project,absolute).split(sep).join('/'),w,readFileSync(absolute,'utf8'));
 }));
 if(cssResult.status===2&&!warnings.length)throw Error('Stylelint reported failure without rule findings');
 const baseline=debt?.entries||(isLibrary&&!args.includes('--strict')?JSON.parse(readFileSync(join(tools,'showcase-baseline.json'),'utf8')):[]);
 const compare=(name,items,filter)=>{
  const {newFindings,resolved}=compareBaseline(items,baseline.filter(e=>filter(e.rule)));
  console.log('[design-lint] '+name+' total='+items.length+' existing='+(items.length-newFindings.length)+' new='+newFindings.length+' resolved='+resolved.length);
  if(newFindings.length&&!capturePath)console.error(JSON.stringify(newFindings,null,2));
  return newFindings.length;
 };
 const jsNew=compare('shadcn',jsxWarnings,isJsxRule);
 const cssNew=compare('Stylelint',warnings,isCssRule);
 const impResult=imp(sourceTargets);
 checked('Impeccable',impResult,[0,2]);
 console.log('[design-lint] Impeccable '+(impResult.status===0?'CLEAN':'FINDINGS')+' (advisory)');
 if(capturePath){
  const report=assertDebtBaseline({schemaVersion:1,policyFingerprint,sources:sourceTargets,entries:[...jsxWarnings,...warnings]},{sources:sourceTargets,policyFingerprint});
  writeFileSync(capturePath,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
  console.log('[design-lint] captured '+report.entries.length+' existing findings');
 }else if(jsNew||cssNew)process.exitCode=1;
}catch(e){console.error('[design-lint] ERROR '+e.message);process.exitCode=1;}
finally{rmSync(dir,{recursive:true,force:true});}
