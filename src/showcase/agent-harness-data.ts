// Snapshot of a public source revision verified by the complete Cloudflare CI.
export const verifiedHarness = {
  version: "0.5.0",
  sha: "3d344042218c6a5323e2c51da0e7582bdca1d30a",
  date: "2026-11-25",
  release: "UNTAGGED",
  tests: [
    {name:"Vitest", result:"125/125", description:"Компоненты и взаимодействия"},
    {name:"Node tests", result:"37/37", description:"Контракт инструментов"},
    {name:"Harness E2E", result:"3/3", description:"Интеграционные сценарии"},
    {name:"Consumer smoke", result:"2/2", description:"npm / React 18 · Bun / React 19"},
  ],
} as const;
export const agentPrompts = {
  new: "Создай продукт на Vanya UI. Найди или получи локальную копию репозитория https://github.com/VanDalkvist/vanya-ui. Прочитай skills/vanya-ui/SKILL.md и docs/patterns/design-harness-quickstart.md. Выбери проверенный совместимый SHA с учётом статуса релиза, используй scope new, подключи харнесс в strict mode, настрой CI и пройди приёмку моей задачи.",
  existing: "Подключи Vanya UI к существующему продукту. Прочитай skills/vanya-ui/SKILL.md и docs/patterns/design-harness-quickstart.md в https://github.com/VanDalkvist/vanya-ui. Проверь текущий пакет, исходники, CSS и CI. Используй scope migration в согласованных границах. Сохрани существующие инструкции и скрипты, подключи канонические проверки. Зафиксируй baseline только при явном согласовании существующего долга.",
} as const;
export const harnessTools = [
  {name:"shadcn/lint · Oxlint",mode:"Blocking",description:"Цвета и произвольные значения в JSX"},
  {name:"Stylelint",mode:"Blocking",description:"CSS, токены, размеры шрифта и радиусы"},
  {name:"Impeccable",mode:"Advisory",description:"Дизайн-антипаттерны; диагностический вывод"},
  {name:"TypeScript · Vitest",mode:"Vanya UI CI",description:"Типы, компоненты и поведение"},
  {name:"Compiled CSS",mode:"Blocking",description:"Фактические токены и стили в сборке"},
] as const;
