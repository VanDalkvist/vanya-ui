import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "subtle" | "amber";
  className?: string;
}

export function ActionButton({
  children,
  variant = "default",
  className,
  disabled,
  ...props
}: ActionButtonProps) {
  const variantStyles = {
    default:
      "bg-surface border-hairline text-ink hover:border-hairline-active hover:bg-surface-raised",
    subtle:
      "bg-transparent border-transparent text-ink-soft hover:bg-surface hover:text-ink",
    amber:
      "bg-amber-soft border-hairline-amber text-amber hover:bg-amber/20 hover:border-amber",
  }[variant];

  return (
    <button
      type="button"
      disabled={disabled}
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center gap-1.5 rounded-xs border px-3 py-1.5 text-xs font-sans font-medium transition-all duration-150 cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber",
          "active:scale-[0.99]",
          disabled && "opacity-40 cursor-not-allowed pointer-events-none",
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
