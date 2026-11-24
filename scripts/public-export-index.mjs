// The source barrel uses explicit named re-exports. Fail on unsupported syntax rather than
// advertising a guessed API. Distinguish runtime imports and type-only imports.
export function readNamedExports(source) {
  const rows=[];
  const declarations=source.matchAll(/export\s+(type\s+)?\{([^}]+)\}\s+from\s+["']([^"']+)["']\s*;?/g);
  for(const [,typeOnly,names,module] of declarations) for(const entry of names.split(",")){
    const text=entry.trim(); if(!text)continue;
    const match=text.match(/^(type\s+)?([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/);
    if(!match)throw new Error("Unsupported public export: "+text);
    rows.push({name:match[3]??match[2],kind:typeOnly||match[1]?"type":"value",module});
  }
  const remainder=source.replace(/export\s+(?:type\s+)?\{[^}]+\}\s+from\s+["'][^"']+["']\s*;?/g,"").replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g,"").trim();
  if(remainder||!rows.length||new Set(rows.map(x=>x.name)).size!==rows.length)throw new Error("Unsupported or duplicate public exports in src/index.ts");
  return rows;
}
export function renderExportIndex(source) {
  return readNamedExports(source).map(({name,kind,module})=>"- "+name+" ("+kind+"): "+module).join("\n");
}
