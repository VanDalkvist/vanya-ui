/** Render actual CSS declarations, never a second hand-maintained palette. */
export function renderTokenReference(css: string): string {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks = [
    ["Shared roles", /@theme\s+inline\s*\{([^}]+)\}/],
    ["Light", /:root\s*\{([^}]+)\}/],
    ["Dark", /\.dark\s*\{([^}]+)\}/],
  ] as const;
  return blocks.map(([name, expression]) => {
    const body = clean.match(expression)?.[1];
    if (!body) throw new Error(`Missing theme declarations: ${name}`);
    const declarations = [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)]
      .map(([, token, value]) => `${token}: ${value.trim()};`);
    return `### ${name}\n\n\`\`\`css\n${declarations.join("\n")}\n\`\`\``;
  }).join("\n\n");
}
