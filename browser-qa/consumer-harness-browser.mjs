// Actual compiled consumer workspace. Uses existing pinned browser-qa toolchain.
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,resolve,relative,sep,extname} from 'node:path';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
export async function reviewConsumerWorkspace(project){
 const dist=resolve(project,'dist'),artifacts=join(project,'browser-artifacts');
 mkdirSync(artifacts,{recursive:true});
 const server=createServer((req,res)=>{
  try{
   const pathname=new URL(req.url,'http://127.0.0.1').pathname;
   const file=resolve(dist,'.'+(pathname==='/'?'/index.html':pathname)),rel=relative(dist,file);
   if(rel.startsWith('..'+sep)||rel==='..')throw Error('Outside dist');
   res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(readFileSync(file));
  }catch{res.writeHead(404);res.end()}
 });
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 let browser;
 try{
  browser=await chromium.launch({channel:'chromium',headless:true});
  const origin='http://127.0.0.1:'+server.address().port,results=[];
  for(const theme of ['light','dark'])for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:900},colorScheme:theme});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   try{
    await page.goto(origin);
    await page.waitForFunction(theme=>document.documentElement.dataset.theme===theme,theme);
    const layout=()=>page.evaluate(()=>{
     const rect=s=>{const {x,y,width,height,bottom}=document.querySelector(s).getBoundingClientRect();return {x,y,width,height,bottom}};
     return {viewport:innerWidth,scroll:document.documentElement.scrollWidth,workspace:rect('[data-testid=workspace]'),nav:rect('.ui-workspace-split-navigation'),detail:rect('.ui-workspace-split-content'),font:parseFloat(getComputedStyle(document.querySelector('[data-testid=body-copy]')).fontSize),ground:getComputedStyle(document.documentElement).getPropertyValue('--ground').trim()};
    });
    const check=m=>{
     assert.ok(m.scroll<=m.viewport+1,'horizontal overflow');
     assert.ok(m.workspace.width>=m.viewport*.95,'workspace must use available width');
     assert.ok(m.font>=16,'body typography must remain readable');
     assert.ok(m.ground,'canonical theme token missing');
     if(width>850){assert.ok(m.detail.width>m.nav.width);assert.ok(Math.abs(m.detail.y-m.nav.y)<=1)}
     else assert.ok(m.detail.y>=m.nav.bottom-1,'mobile detail must stack');
    };
    const initial=await layout();check(initial);
    const second=page.getByRole('button',{name:'Second',exact:true});
    await second.click();assert.equal(await second.getAttribute('aria-pressed'),'true');
    assert.equal(await page.getByTestId('filter-result').textContent(),'Second project');
    const action=page.getByRole('button',{name:'Consumer action'});
    await action.focus();await page.keyboard.press('Space');
    await page.waitForFunction(()=>document.querySelector('[data-testid=result]').textContent==='Updates: 1');
    assert.equal(await action.getAttribute('data-action-state'),'success');
    assert.equal(await action.evaluate(e=>e.classList.contains('ui-action-button')),true);
    check(await layout());assert.deepEqual(errors,[]);
    if(width===1440){
     await page.getByTestId('workspace').evaluate(e=>e.style.maxWidth='600px');
     assert.throws(()=>check({ ...initial,workspace:{...initial.workspace,width:600}}),/available width/);
     const constrained=await layout();assert.throws(()=>check(constrained),/available width/);
     await page.getByTestId('workspace').evaluate(e=>e.style.removeProperty('max-width'));check(await layout());
    }
    await page.screenshot({path:join(artifacts,theme+'-'+width+'.png'),fullPage:true});
    results.push({theme,width,initial,filter:'PASS',action:'PASS',layout:'PASS',negativeWidth:width===1440?'PASS':'N/A'});
   }finally{await page.close()}
  }
  assert.notEqual(results.find(x=>x.theme==='light').initial.ground,results.find(x=>x.theme==='dark').initial.ground);
  const receipt={browserVersion:browser.version(),results,screenshots:'local browser-artifacts; visual inspection separately required'};
  writeFileSync(join(artifacts,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');return receipt;
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
}
