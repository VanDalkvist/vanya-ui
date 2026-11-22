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
  text:"px-0 font-sans font-medium tracking-normal text-ink-soft/80 hover:text-accent",
  mono:"px-0 font-mono tracking-[0.16em] uppercase text-ink-soft hover:text-ink",
  accent:"px-0 font-sans font-medium text-accent hover:underline underline-offset-4",
  pill:"rounded-full font-sans text-ink-soft hover:bg-surface-raised hover:text-ink",
 }[variant];
 return <a
  href={href}
  target={target}
  rel={target==="_blank" ? [rel,"noopener","noreferrer"].filter(Boolean).join(" ") : rel}
  data-size={size}
  className={twMerge(clsx("ui-size inline-flex items-center appearance-none border-0 bg-transparent outline-none transition-colors duration-200 cursor-pointer select-none focus-visible:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",variantStyles,className))}
  {...props}
 >{children}</a>;
}
