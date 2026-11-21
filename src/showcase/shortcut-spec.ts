/** Physical Latin-layout labels. Optional shortcuts never override browser/OS modifiers. */
export const SHOWCASE_SHORTCUTS = [
  { key: "o", code: "KeyO", id: "composition", label: "Первый экран" },
  { key: "i", code: "KeyI", id: "identity", label: "Айдентика" },
  { key: "t", code: "KeyT", id: "typography", label: "Шрифты" },
  { key: "x", code: "KeyX", id: "writing", label: "Тексты" },
  { key: "p", code: "KeyP", id: "principles", label: "Принципы" },
  { key: "c", code: "KeyC", id: "catalog", label: "Компоненты" },
  { key: "w", code: "KeyW", id: "workspace", label: "Рабочие поверхности" },
  { key: "s", code: "KeyS", id: "setup", label: "Подключение" },
] as const;
export type ShowcaseSectionId = typeof SHOWCASE_SHORTCUTS[number]["id"];
export const SHOWCASE_SHORTCUT_STORAGE = "vanya_ui_shortcuts_enabled";
