import fs from "node:fs";
import path from "node:path";

interface ExtractedPattern {
  tag: string;
  className: string;
  count: number;
  files: string[];
}

function scanDirectory(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith(".") && entry.name !== "node_modules" && entry.name !== "dist") {
        scanDirectory(fullPath, fileList);
      }
    } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".jsx"))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export function extractControlsFromRepo(targetDir: string) {
  const files = scanDirectory(targetDir);
  console.log(`\n=== Сканирование репозитория: ${targetDir} (${files.length} JSX/TSX файлов) ===\n`);

  const patterns = new Map<string, ExtractedPattern>();

  // Regex matches for common interactive tags
  const tagRegex = /<(button|kbd|summary|input|nav)\s+([^>]*?)>/gs;
  const classRegex = /className=(?:["'`]([^"'`]+)["'`]|{\s*\[([^\]]+)\]\.join\([^)]+\)\s*})/s;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const relFile = path.relative(targetDir, file);
    let match: RegExpExecArray | null;

    while ((match = tagRegex.exec(content)) !== null) {
      const tag = match[1];
      const attrs = match[2];
      const classMatch = classRegex.exec(attrs);
      if (classMatch) {
        const cls = (classMatch[1] || classMatch[2] || "").replace(/\s+/g, " ").trim();
        if (cls.length > 5) {
          const key = `${tag}::${cls}`;
          const existing = patterns.get(key);
          if (existing) {
            existing.count++;
            if (!existing.files.includes(relFile)) existing.files.push(relFile);
          } else {
            patterns.set(key, { tag, className: cls, count: 1, files: [relFile] });
          }
        }
      }
    }
  }

  // Sort by tag and frequency
  const sorted = Array.from(patterns.values()).sort((a, b) => b.count - a.count);

  console.log(`Обнаружено ${sorted.length} уникальных паттернов интерактивных контролов:\n`);

  const byTag: Record<string, ExtractedPattern[]> = {};
  for (const item of sorted) {
    if (!byTag[item.tag]) byTag[item.tag] = [];
    byTag[item.tag].push(item);
  }

  for (const [tag, items] of Object.entries(byTag)) {
    console.log(`--- [${tag.toUpperCase()}] (${items.length} уникальных стилей) ---`);
    for (const item of items.slice(0, 5)) {
      console.log(` • (${item.count}x) ${item.className.slice(0, 90)}... [в ${item.files[0]}]`);
    }
    console.log("");
  }

  return sorted;
}

// Run CLI if called directly
const target = process.argv[2] || path.resolve(__dirname, "../../life-wave-narrative/src");
extractControlsFromRepo(target);
