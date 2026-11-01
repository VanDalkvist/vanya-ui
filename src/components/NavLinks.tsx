import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface NavLinksProps {
  items: NavItem[];
  onSelect?: (id: string) => void;
  nowLabel?: string;
  onNowClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function NavLinks({
  items,
  onSelect,
  nowLabel = "Сейчас",
  onNowClick,
  className,
  children,
}: NavLinksProps) {
  return (
    <nav
      className={twMerge(
        clsx(
          "inline-flex flex-wrap items-center gap-x-4 gap-y-2 select-none",
          className
        )
      )}
      aria-label="Навигация"
    >
      {/* Нарративные разделы */}
      <div className="flex items-center gap-x-3.5 sm:gap-x-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect?.(item.id)}
            aria-pressed={item.isActive}
            className={clsx(
              "appearance-none border-0 bg-transparent p-0 font-sans text-[12px] sm:text-[12.5px] tracking-normal transition-colors duration-200 cursor-pointer focus-visible:text-accent focus-visible:outline-none",
              item.isActive
                ? "text-accent font-semibold"
                : "text-ink-soft/80 font-medium hover:text-accent"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Разделитель и кнопка «Сейчас» */}
      {onNowClick && (
        <>
          <span className="h-3 w-px bg-ink/15 inline-block" aria-hidden="true" />
          <button
            type="button"
            onClick={onNowClick}
            className="appearance-none border-0 bg-transparent p-0 font-sans text-[12.5px] font-medium tracking-normal text-ink-soft/75 transition-colors duration-200 hover:text-accent focus-visible:text-accent focus-visible:outline-none cursor-pointer"
          >
            {nowLabel}
          </button>
        </>
      )}

      {/* Опциональные иконки профилей или переключатель темы */}
      {children && (
        <>
          <span className="h-3 w-px bg-ink/15 inline-block" aria-hidden="true" />
          <div className="flex items-center gap-2">{children}</div>
        </>
      )}
    </nav>
  );
}
