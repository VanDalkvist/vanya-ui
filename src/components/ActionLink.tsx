import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ComponentSize } from "../sizes";

export interface ActionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  size?: ComponentSize;
  variant?: "text" | "mono" | "accent" | "pill";
}
/** Real browser link matching ActionButton; supports open-in-new-tab, copy address, history, keyboard. */
export function ActionLink({href,children,size="sm",variant="text",className,target,rel,...props}:ActionLinkProps) {
 const variantStyles={
  text:"px-0 font-sans font-medium tracking-normal text-ink-soft/80",
  mono:"px-0 font-mono tracking-[var(--type-tracking-action-mono)] uppercase text-ink-soft",
  accent:"px-0 font-sans font-medium text-accent underline-offset-4",
  pill:"rounded-full font-sans text-ink-soft",
 }[variant];
 return <a
  href={href}
  target={target}
  rel={target==="_blank" ? [rel,"noopener","noreferrer"].filter(Boolean).join(" ") : rel}
  data-size={size}
  data-variant={variant}
  className={twMerge(clsx("ui-size ui-action-link ui-feedback-text inline-flex items-center appearance-none border-0 bg-transparent cursor-pointer select-none",variantStyles,className))}
  {...props}
 >{children}</a>;
}
