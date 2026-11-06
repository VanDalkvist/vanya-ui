import { Sparkles, HeartHandshake, Briefcase, Cpu } from "lucide-react";

/** Visual contract from ferma/src/lib/harness-colors.ts and ferma/src/styles.css. */
export const HARNESS_TYPES = [
  { id: "creative_harness", name: "creative", label: "Creative", icon: Sparkles },
  { id: "life_harness", name: "life", label: "Life", icon: HeartHandshake },
  { id: "product_harness", name: "product", label: "Product", icon: Briefcase },
  { id: "infra_harness", name: "infra", label: "Infra", icon: Cpu },
].map((item) => ({
  ...item,
  color: `var(--harness-${item.name})`,
  textColor: `var(--harness-${item.name}-fg)`,
  backgroundColor: `var(--harness-${item.name}-bg)`,
}));

export function getHarnessType(category: string) {
  const normalized = category.toLowerCase();
  return HARNESS_TYPES.find((item) => item.id === normalized || item.name === normalized);
}
