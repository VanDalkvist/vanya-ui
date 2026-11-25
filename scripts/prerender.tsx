import React from "react";
import { renderToString } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Showcase } from "../src/showcase/Showcase";
import { AgentPage } from "../src/showcase/AgentPage";

const file=resolve(import.meta.dirname,"..","dist","index.html");
const html=readFileSync(file,"utf8");
const marker='<div id="root"></div>';
if(!html.includes(marker))throw new Error("Cannot prerender: Vite HTML root not found");
const markup=renderToString(<Showcase/>);
if(!markup.includes("browser-navigation")||!markup.includes("workspace")||!markup.includes('id="agents"'))throw new Error("Missing longread content");
writeFileSync(file,html.replace(marker,`<div id="root">${markup}</div>`));
console.log(`Prerendered ${markup.length} bytes of public HTML for crawlers`);

const agentFile=resolve(import.meta.dirname,"..","dist","agents","index.html");
const agentHtml=readFileSync(agentFile,"utf8");
const agentMarkup=renderToString(<AgentPage/>);
if(!agentHtml.includes(marker)||!agentMarkup.includes('id="agent-start"')||!agentMarkup.includes('/reference/design-harness-quickstart.md'))throw new Error("Agent page missing entrypoint or quickstart");
writeFileSync(agentFile,agentHtml.replace(marker,`<div id="root">${agentMarkup}</div>`));
console.log("Prerendered agent page");
