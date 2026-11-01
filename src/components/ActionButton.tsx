import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "text" | "mono" | "accent" | "pill";
  className?: string;
}

export function ActionButton({
  children,
  variant = "text",
  className,
  disabled,
  ...props
}: ActionButtonProps) {
  const variantStyles = {
    // Чистая типографическая кнопка из Синусоиды (без рамок)
    text: "font-sans text-[12.5px] font-medium tracking-normal text-ink-soft/80 hover:text-accent",
    // Моноширинное верхнее действие из Синусоиды
    mono: "font-mono text-[10px] tracking-[0.16em] uppercase text-ink-soft/70 hover:text-ink",
    // Янтарный акцентный линк
    accent: "font-sans text-[12.5px] font-medium text-accent hover:underline underline-offset-4",
    // Мягкая скругленная пилюля без рамок
    pill: "rounded-full px-3 py-1.5 font-sans text-[11px] text-ink-soft hover:bg-surface-raised hover:text-ink",
  }[variant];

  return (
    <button
      type="button"
      disabled={disabled}
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 appearance-none border-0 bg-transparent p-0 outline-none transition-colors duration-200 cursor-pointer select-none",
          "focus-visible:text-accent focus-visible:outline-none",
          disabled && "opacity-35 cursor-not-allowed pointer-events-none",
          variantStyles,
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
}
