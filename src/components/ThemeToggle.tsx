import { useState, useRef, useEffect, useId, type KeyboardEvent } from "react";
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const initialFocus = useRef<"selected" | "first" | "last">("selected");

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

  useEffect(() => {
    if (!isOpen) return;
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') || []);
    const first = items[0];
    const last = items[items.length - 1];
    const selected = items.find((item) => item.getAttribute("aria-checked") === "true");
    (initialFocus.current === "first" ? first
      : initialFocus.current === "last" ? last : selected || first)?.focus();
    initialFocus.current = "selected";
  }, [isOpen]);

  function handleMenuKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Tab") {
      // Re-anchor sequential focus at the trigger. Leave Tab's default
      // action to the browser, including hidden ancestors and focus scopes.
      triggerRef.current?.focus();
      setIsOpen(false);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') || []);
    if (!items.length) return;
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 :
      event.key === "ArrowDown" ? (current + 1) % items.length : (current + items.length - 1) % items.length;
    items[next]?.focus();
  }

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
                "ui-feedback-segment grid size-6 place-items-center rounded-full border-0 bg-transparent cursor-pointer",
                isSelected
                  ? "bg-surface text-accent shadow-control-selected"
                  : "text-ink-soft/70"
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
    <div ref={containerRef} onBlurCapture={(event) => {
      if (!containerRef.current?.contains(event.relatedTarget as Node | null)) setIsOpen(false);
    }} className={twMerge("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => { initialFocus.current = "selected"; setIsOpen((prev) => !prev); }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          initialFocus.current = event.key === "ArrowDown" ? "first" : "last";
          setIsOpen(true);
        }}
        aria-label={`Тема оформления: ${currentLabel}`}
        title={`Тема оформления: ${currentLabel}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? menuId : undefined}
        className="ui-feedback-icon pointer-events-auto inline-flex size-8 items-center justify-center appearance-none rounded-full border-0 p-0 cursor-pointer"
      >
        <ActiveIcon className="size-3.5" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Тема оформления"
          onKeyDown={handleMenuKeys}
          className="absolute right-0 top-full mt-1.5 z-50 min-w-[140px] rounded-sm border border-border bg-surface-raised p-1 text-ink shadow-control-menu backdrop-blur-md"
        >
          {THEME_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                role="menuitemradio"
                aria-checked={isSelected}
                tabIndex={-1}
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className={clsx(
                  "ui-feedback-row flex w-full cursor-pointer select-none items-center justify-between rounded-xs px-2.5 py-1.5 font-sans text-xs border-0",
                  isSelected
                    ? "font-medium text-accent"
                    : "text-ink-soft"
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
