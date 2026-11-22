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
        {items.map((item) => {
          const classes = clsx(
            "ui-feedback-nav appearance-none border-0 bg-transparent p-0 font-sans text-[13px] sm:text-[13px] tracking-normal cursor-pointer",
            item.isActive
              ? "text-accent font-semibold"
              : "text-ink-soft/80 font-medium"
          );
          // URL navigation is native. onSelect handles only non-URL, local UI buttons.
          if (item.href) {
            return <a
              key={item.id}
              href={item.href}
              aria-current={item.isActive ? (item.href.startsWith("#") ? "location" : "page") : undefined}
              className={classes}
            >{item.label}</a>;
          }
          return <button
            key={item.id}
            type="button"
            onClick={() => onSelect?.(item.id)}
            aria-pressed={item.isActive}
            className={classes}
          >{item.label}</button>;
        })}
      </div>

      {/* Разделитель и кнопка «Сейчас» */}
      {onNowClick && (
        <>
          <span className="h-3 w-px bg-ink/15 inline-block" aria-hidden="true" />
          <button
            type="button"
            onClick={onNowClick}
            className="ui-feedback-nav appearance-none border-0 bg-transparent p-0 font-sans text-[12.5px] font-medium tracking-normal text-ink-soft/75 cursor-pointer"
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
