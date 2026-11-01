import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme, type Theme } from "../hooks/useTheme";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ThemeToggleProps {
  className?: string;
  variant?: "dropdown" | "segmented";
}

const THEME_OPTIONS: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Светлая", icon: Sun },
  { id: "dark", label: "Тёмная", icon: Moon },
  { id: "system", label: "Системная", icon: Laptop },
];

export function ThemeToggle({
  className,
  variant = "dropdown",
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Всегда показываем иконку разрешенного состояния
  const ActiveIcon = resolvedTheme === "dark" ? Moon : Sun;

  const currentLabel =
    theme === "system"
      ? `Системная (${resolvedTheme === "dark" ? "тёмная" : "светлая"})`
      : theme === "dark"
        ? "Тёмная"
        : "Светлая";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (variant === "segmented") {
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

  return (
    <div ref={containerRef} className={twMerge("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Тема оформления: ${currentLabel}. Нажмите для смены.`}
        title={`Тема оформления: ${currentLabel}`}
        aria-expanded={isOpen}
        className="pointer-events-auto inline-flex size-6 items-center justify-center appearance-none border-0 bg-transparent p-0 outline-none text-ink-soft/60 transition-colors duration-200 hover:text-ink cursor-pointer focus-visible:text-accent"
      >
        <ActiveIcon className="size-4 transition-transform duration-200" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1.5 z-50 min-w-[140px] rounded-[4px] border border-border bg-surface-raised p-1 text-ink shadow-[0_4px_16px_rgba(0,0,0,0.18)] backdrop-blur-md"
        >
          {THEME_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                role="menuitem"
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={clsx(
                  "flex w-full cursor-pointer select-none items-center justify-between rounded-[2px] px-2.5 py-1.5 font-sans text-[12px] border-0 outline-none transition-colors",
                  isSelected
                    ? "bg-surface font-medium text-accent"
                    : "bg-transparent text-ink-soft hover:bg-surface/50 hover:text-ink"
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-3.5 shrink-0 opacity-80" />
                  <span>{opt.label}</span>
                </span>
                {isSelected && <Check className="size-3.5 text-accent shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
