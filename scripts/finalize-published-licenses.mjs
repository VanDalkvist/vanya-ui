#!/usr/bin/env node
/**
 * Complement Vite's bundle-code license inventory with separately licensed
 * official artwork from the exact installed @vanya/brand package.
 * Local-only, no network or GitHub.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(p,'utf8');
const licenseName='LicenseRef-VanyaArc-Brand';
const marker='## Additional @vanya/brand artwork terms ('+licenseName+')';

export function finalizePublishedLicenses(root=projectRoot){
 const pkg=JSON.parse(read(join(root,'package.json')));
 const pinned=pkg.dependencies?.['@vanya/brand']||'';
 const sha=/^github:VanDalkvist\/vanya-arc-brand#([a-f0-9]{40})$/i.exec(pinned)?.[1];
 if(!sha)throw Error('@vanya/brand must be pinned to a 40-character Git SHA');
 const brandBase=join(root,'node_modules','@vanya','brand');
 const brandPkg=JSON.parse(read(join(brandBase,'package.json')));
 if(brandPkg.license!=='SEE LICENSE IN LICENSING.md')
  throw Error('Unexpected brand package license metadata: review before publishing');
 const terms=read(join(brandBase,'LICENSES',licenseName+'.txt')).trim();
 if(!terms.includes('not granted under MIT')||!terms.includes('historically distributed'))
  throw Error('Missing or changed brand artwork license terms');
 const published=read(join(root,'dist','reference','brand-artwork-license.txt')).trim();
 if(published!==terms)throw Error('Published brand artwork license missing or stale');
 const file=join(root,'dist','licenses.txt');
 const inventory=read(file);
 if(!inventory.startsWith('# Licenses')||!inventory.includes('## @vanya/brand'))
  throw Error('Vite license inventory absent or missing @vanya/brand');
 if(!inventory.includes('ISC License')||!inventory.includes('Cole Bemis'))
  throw Error('Bundled Lucide ISC / Feather MIT rights notice missing');
 const sourceUrl='https://github.com/VanDalkvist/vanya-arc-brand/blob/'+sha+'/LICENSES/'+licenseName+'.txt';
 const disclosure='\n> **Important:** The auto-generated dependency inventory below includes the MIT license for @vanya/brand renderer code. The official Vanya Arc mark is NOT licensed under MIT. Its separately applicable terms are reproduced below. See https://ui.vanya-arc.dev/reference/licensing.md for the full mixed-license map.\n';
 if(inventory.includes(marker)){
  if(!inventory.includes(terms)||!inventory.includes(sourceUrl))throw Error('Existing brand artwork notice is stale');
  return {status:'verified',file,sourceUrl};
 }
 const supplement=['',marker,'',
  'Exact pinned source: '+sourceUrl,
  'Public copy: https://ui.vanya-arc.dev/reference/brand-artwork-license.txt',
  '',terms,''].join('\n');
 writeFileSync(file,inventory.replace(/^# Licenses([^\n]*)\n/,'# Licenses$1\n'+disclosure)+supplement);
 const updated=read(file);
 if(!updated.includes(terms)||!updated.includes(sourceUrl))
  throw Error('Brand artwork terms not preserved in bundle inventory');
 return {status:'written',file,sourceUrl};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const r=finalizePublishedLicenses();console.log('[license-publication] '+r.status.toUpperCase()+' — bundled notices and protected artwork terms')}
 catch(e){console.error('[license-publication] FAIL: '+e.message);process.exitCode=1}
}
