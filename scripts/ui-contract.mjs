export function checkProject(info){
 const problems=[],warnings=[];
 if(info.mode==='none')return {status:'skip',problems,warnings:['No UI surface detected; pass --mode visual/react if this is a new UI feature']};
 if(!info.hasPolicy)problems.push('Create UI_CONTRACT.md referencing the canonical Vanya UI skill (see bootstrap-ui-pipeline.mjs)');
 if(info.mode==='react'){
  if(!info.package)problems.push('React UI needs a selected package.json; use --package');
  if(!info.hasDependency)problems.push('React UI must use a pinned @vanya/ui package dependency');
  else if(!info.pinnedDependency)problems.push('Pin @vanya/ui to a verified immutable version/commit or local file/workspace dependency');
  if(info.hasDependency&&!info.installedVersion)warnings.push('Installed @vanya/ui version not detected; inspect actual installed package before coding');
  if(info.installedVersion&&info.libraryVersion&&info.installedVersion!==info.libraryVersion)warnings.push('Installed @vanya/ui '+info.installedVersion+' differs from local guides '+info.libraryVersion+'; check installed APIs or explicitly upgrade');
  if(!info.hasTokensImport)problems.push('Import @vanya/ui/tokens.css in the global CSS entry or a side-effect JS/TS import (literal source check)');
  if(info.hasTokensImport&&!info.hasTailwindSource)warnings.push('No explicit @source path to @vanya/ui/src detected; confirm Tailwind 4 scans the installed sources or equivalent configuration');
  if(!info.componentUsage?.length)problems.push('Render at least one applicable real @vanya/ui component in authored JSX; token import alone is insufficient');
  if(!info.buildScript)problems.push('Add a reproducible build script to the UI package');
  if(!info.browserScript)problems.push('Add a runnable test:e2e, test:browser or test:ui script');
  if(info.designHarness?.status!=='ready')problems.push(...(info.designHarness?.problems||['Adopt the canonical Vanya UI design harness']));
 }else{
  if(!info.visualFiles)warnings.push('No existing visual source yet; write the UI then rerun');
  if(!info.browserScript)warnings.push('No browser script; visual acceptance must be recorded separately');
 }
 return {status:problems.length?'fail':'pass',problems,warnings};
}
