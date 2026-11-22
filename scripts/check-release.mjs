#!/usr/bin/env node
/** Read-only SemVer/changelog check. No Git, Actions, filesystem writes or network. */
import {readFileSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const base=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const semver=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
export function validateReleaseVersion(dir=base){
 const errors=[];
 let packageJson=null,changelog='';
 try{packageJson=JSON.parse(readFileSync(join(dir,'package.json'),'utf8'))}catch{errors.push('Cannot read package.json')}
 try{changelog=readFileSync(join(dir,'CHANGELOG.md'),'utf8')}catch{errors.push('Cannot read CHANGELOG.md')}
 if(packageJson?.name!=='@vanya/ui')errors.push('Expected package name @vanya/ui');
 const version=packageJson?.version;
 if(typeof version!=='string'||!semver.test(version))errors.push('Expected exact SemVer in package.json.version');
 if(!/^## \[Unreleased\]$/m.test(changelog))errors.push('CHANGELOG.md must contain [Unreleased]');
 const entries=[...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/gm)]
  .map(m=>({version:m[1],date:m[2]}));
 if(entries.length===0)errors.push('CHANGELOG.md must have dated version entries');
 if(entries.length&&entries[0].version!==version)errors.push('Latest changelog version does not match package.json.version');
 if(entries.some((e,i)=>entries.findIndex(other=>other.version===e.version)!==i))errors.push('Duplicate changelog versions');
 if(entries.some(e=>!semver.test(e.version)||Number.isNaN(Date.parse(e.date+'T00:00:00Z'))))errors.push('Invalid changelog version/date');
 return {ok:errors.length===0,packageVersion:version??null,errors};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=validateReleaseVersion();
 if(process.argv.includes('--json'))console.log(JSON.stringify(result,null,2));
 else{console.log('[release-version] '+(result.ok?'PASS':'FAIL')+' '+(result.packageVersion??'unknown'));for(const e of result.errors)console.error('ERROR '+e)}
 if(!result.ok)process.exitCode=1;
}
