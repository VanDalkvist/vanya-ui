import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ComponentSize } from "../sizes";

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: ComponentSize;
  variant?: "text" | "mono" | "accent" | "pill" | "outline";
  className?: string;
}

export function ActionButton({
  children,
  size = "sm",
  variant = "text",
  className,
  disabled,
  ...props
}: ActionButtonProps) {
  const variantStyles = {
    // Чистая типографическая кнопка из Синусоиды (без рамок)
    text: "px-0 font-sans font-medium tracking-normal text-ink-soft/80",
    // Моноширинное верхнее действие из Синусоиды
    mono: "px-0 font-mono tracking-[0.16em] uppercase text-ink-soft",
    // Янтарный акцентный линк
    accent: "px-0 font-sans font-medium text-accent underline-offset-4",
    // Мягкая скругленная пилюля без рамок
    pill: "rounded-full font-sans text-ink-soft",
    outline: "rounded-sm border border-border bg-surface font-sans font-medium text-ink",
  }[variant];

  return (
    <button
      data-size={size}
      data-variant={variant}
      type="button"
      disabled={disabled}
      className={twMerge(
        clsx(
          "ui-size ui-action-button ui-feedback-text inline-flex items-center appearance-none border-0 bg-transparent cursor-pointer select-none",
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
