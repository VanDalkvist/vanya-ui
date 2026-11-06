import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ComponentSize } from "../sizes";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  isActive?: boolean;
  size?: ComponentSize;
  disabled?: boolean;
  className?: string;
}

export function Tag({ children, isActive, size = "sm", disabled = false, onClick, className, ...props }: TagProps) {
  const Element = onClick ? "button" : "span";
  return (
    <Element
      data-size={size}
      type={onClick ? "button" : undefined}
      disabled={onClick ? disabled : undefined}
      onClick={onClick}
      aria-pressed={onClick ? isActive : undefined}
      className={twMerge(
        clsx(
          "ui-size inline-flex items-center rounded-xs border border-border bg-surface-raised/60 font-mono text-ink-soft select-none transition-colors duration-150",
          isActive && "border-accent/60 bg-accent/10 text-accent font-medium",
          onClick && !disabled ? "cursor-pointer hover:bg-surface-raised hover:text-ink" : "cursor-default",
          onClick && disabled && "opacity-35",
          className
        )
      )}
      {...props}
    >
      {children}
    </Element>
  );
}
