import {expect,test} from "@playwright/test";
for(const [route,label] of [["/","Правила навигации"],["/agents/","Quickstart"]] as const){
 test("diagonal link opens a real tab and preserves the original "+route,async({page})=>{
  await page.goto(route);
  const original=page.url();
  const links=page.locator("a[href]").filter({has:page.locator(".lucide-arrow-up-right")});
  const marked=await links.evaluateAll(nodes=>nodes.map(a=>({target:a.getAttribute("target"),rel:a.getAttribute("rel"),href:a.getAttribute("href")})));
  expect(marked.length).toBeGreaterThan(0);
  for(const a of marked){expect(a.target,a.href||"").toBe("_blank");expect(a.rel?.split(/\s+/)).toEqual(expect.arrayContaining(["noopener","noreferrer"]));}
  const link=page.getByRole("link",{name:label,exact:true}).first();
  const destination=await link.evaluate(a=>(a as HTMLAnchorElement).href);
  const [tab]=await Promise.all([page.waitForEvent("popup"),link.click()]);
  try{await expect(tab).toHaveURL(destination);expect(page.url()).toBe(original);}
  finally{await tab.close();}
 });
}
