import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme, type Theme } from "../hooks/useTheme";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ThemeToggleProps {
  className?: string;
  variant?: "segmented" | "icon";
}

const THEME_OPTIONS: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Светлая", icon: Sun },
  { id: "dark", label: "Тёмная", icon: Moon },
  { id: "system", label: "Системная", icon: Laptop },
];

export function ThemeToggle({
  className,
  variant = "segmented",
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  if (variant === "icon") {
    const nextTheme: Theme = resolvedTheme === "dark" ? "light" : "dark";
    const ActiveIcon = resolvedTheme === "dark" ? Moon : Sun;
    return (
      <button
        type="button"
        onClick={() => setTheme(nextTheme)}
        aria-label={`Тема оформления: ${resolvedTheme === "dark" ? "тёмная" : "светлая"}. Нажмите для смены.`}
        className={twMerge(
          clsx(
            "pointer-events-auto inline-flex size-5 items-center justify-center appearance-none border-0 bg-transparent p-0 outline-none text-ink-soft/50 transition-colors duration-200 hover:text-ink cursor-pointer focus-visible:text-accent",
            className
          )
        )}
      >
        <ActiveIcon className="size-3.5 transition-transform duration-200" />
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Переключение темы оформления"
      className={twMerge(
        clsx(
          "pointer-events-auto inline-flex items-center rounded-full border border-border bg-surface-raised/60 p-0.5 backdrop-blur-xs transition-colors",
          className
        )
      )}
    >
      {THEME_OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isSelected = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            aria-label={opt.label}
            aria-pressed={isSelected}
            title={opt.label}
            className={clsx(
              "grid size-6 place-items-center rounded-full border-0 bg-transparent transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
              isSelected
                ? "bg-surface text-accent shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
                : "text-ink-soft/70 hover:text-ink"
            )}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
