import React from "react";
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
        aria-label={`Тема: ${resolvedTheme === "dark" ? "тёмная" : "светлая"}. Нажмите для смены.`}
        className={twMerge(
          clsx(
            "inline-flex size-7 items-center justify-center rounded-xs border border-hairline bg-surface text-ink-soft hover:bg-surface-raised hover:text-ink transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber",
            className
          )
        )}
      >
        <ActiveIcon className="size-3.5" />
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Переключение темы оформления"
      className={twMerge(
        clsx(
          "inline-flex items-center gap-0.5 rounded-xs border border-hairline bg-surface p-0.5 text-xs font-mono",
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
              "flex size-6 items-center justify-center rounded-xs transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber",
              isSelected
                ? "bg-surface-raised text-amber font-medium shadow-xs"
                : "text-ink-soft hover:text-ink hover:bg-surface-raised/50"
            )}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
