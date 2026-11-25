import React from "react";
import { renderToString } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Showcase } from "../src/showcase/Showcase";

const file=resolve(import.meta.dirname,"..","dist","index.html");
const html=readFileSync(file,"utf8");
const marker='<div id="root"></div>';
if(!html.includes(marker))throw new Error("Cannot prerender: Vite HTML root not found");
const markup=renderToString(<Showcase/>);
if(!markup.includes("browser-navigation")||!markup.includes("workspace")||!markup.includes('id="agents"'))throw new Error("Missing longread content");
writeFileSync(file,html.replace(marker,`<div id="root">${markup}</div>`));
console.log(`Prerendered ${markup.length} bytes of public HTML for crawlers`);
