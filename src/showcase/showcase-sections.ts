/** Stable public fragments and their visible names. The first screen is a product overview. */
export const longreadSections = [
  ["composition", "Обзор"],
  ["identity", "Айдентика"],
  ["typography", "Типографика"],
  ["writing", "Тексты"],
  ["principles", "Принципы"],
  ["catalog", "Компоненты"],
  ["workspace", "Рабочие поверхности"],
  ["setup", "Подключение"],
  ["agents", "Агентам"],
] as const;
export type ChapterId = Exclude<typeof longreadSections[number][0], "composition">;
export function chapterTitle(id:ChapterId):string {
  return longreadSections.find(([key])=>key===id)![1];
}
