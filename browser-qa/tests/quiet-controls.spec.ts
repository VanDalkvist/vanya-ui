import {expect,test} from "@playwright/test";
import {readFileSync} from "node:fs";
const version=JSON.parse(readFileSync(new URL("../../package.json",import.meta.url),"utf8")).version;

test("quiet catalogue facets change actual rows",async({page})=>{
 await page.goto("/#compact-filter-toolbar");
 const section=page.locator("#compact-filter-toolbar"),rows=section.getByRole("list",{name:"Результаты поиска"}).getByRole("listitem");
 await section.getByRole("button",{name:"Мои",exact:true}).click();
 await expect(rows).toHaveText(["Тихий берег","Следы в лесу"]);
 await section.getByRole("button",{name:"Жанр Все"}).click();
 await page.getByRole("option",{name:"Фантастика"}).click();
 await expect(rows).toHaveText(["Следы в лесу"]);
 await section.getByRole("button",{name:"Жанр Фантастика"}).click();
 await page.getByRole("searchbox",{name:"Поиск по вариантам: Жанр"}).press("Escape");
 await expect(section.getByRole("button",{name:"Жанр Фантастика"})).toBeFocused();
});
test("quiet document validation, save and cancel have visible outcomes",async({page})=>{
 await page.goto("/#quiet-editor");
 const section=page.locator("#quiet-editor"),title=section.getByLabel("Название");
 await title.fill(" ");
 await section.getByRole("button",{name:"Сохранить"}).click();
 await expect(title).toHaveAttribute("aria-invalid","true");
 await expect(section.getByText("Введите название",{exact:true})).toBeVisible();
 await title.fill("Новый документ");
 await section.getByRole("combobox",{name:"Жанр"}).selectOption("fantasy");
 await section.getByRole("button",{name:"Сохранить"}).click();
 await expect(section.locator("output")).toHaveText("Сохранено: Новый документ · Фантастика");
 await title.fill("Несохранённое");
 await section.getByRole("button",{name:"Отменить",exact:true}).click();
 await expect(title).toHaveValue("Новый документ");
 await section.getByRole("button",{name:"Подтвердить",exact:true}).click();
 await expect(section.getByText("Пример подтверждён")).toBeVisible();
});
test("ordinary action and persistent toggle report actual state",async({page})=>{
 await page.goto("/#quiet-actions");
 const section=page.locator("#quiet-actions"),toggle=section.getByRole("button",{name:"Автообновление"});
 await section.getByRole("button",{name:"Обновить",exact:true}).click();
 await expect(section.getByRole("status")).toHaveText("Обновлений: 1");
 await toggle.click();
 await expect(toggle).toHaveAttribute("aria-pressed","false");
 await expect(toggle).toContainText("Выкл");
});
for(const width of [1440,1024,390,320]) for(const theme of ["light","dark"] as const){
 test("header package version stays visible "+width+" "+theme,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.addInitScript(mode=>localStorage.setItem("vanya_theme",mode),theme);
  await page.goto("/");
  const header=page.locator(".showcase-header"),label=header.locator("[data-ui-version]");
  await expect(label).toHaveText("v"+version);
  await expect(label).toBeVisible();
  const b=await label.boundingBox();expect(b).not.toBeNull();expect(b!.x).toBeGreaterThanOrEqual(0);expect(b!.x+b!.width).toBeLessThanOrEqual(width);
  expect(await label.evaluate(el=>el.tabIndex)).toBe(-1);
 });
}
