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
          "ui-tag inline-flex items-center gap-1 font-mono text-meta text-ink-soft",
          isActive && "text-accent",
          onClick ? "ui-size ui-feedback-segment rounded-sm border-0 bg-transparent select-none" : "cursor-default",
          onClick && !disabled && "cursor-pointer",
          onClick && disabled && "opacity-35 cursor-default",
          className
        )
      )}
      {...props}
    >
      {!onClick&&<span aria-hidden="true" className="ui-tag-marker">#</span>}
      {children}
    </Element>
  );
}
