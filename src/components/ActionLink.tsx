import React from "react";
import {ArrowUpRight} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ComponentSize } from "../sizes";

export interface ActionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  size?: ComponentSize;
  variant?: "text" | "accent" | "prose";
}
/** Real browser link matching ActionButton; supports open-in-new-tab, copy address, history, keyboard. */
export function ActionLink({href,children,size="sm",variant="text",className,target,rel,...props}:ActionLinkProps) {
 const variantStyles={
  text:"px-0 font-sans font-medium tracking-normal text-ink-soft/80",
  accent:"px-0 font-sans font-medium text-accent underline-offset-4",
  prose:"",
 }[variant];
 const marker=target==="_blank"?<ArrowUpRight className="ui-new-tab-marker" aria-hidden="true"/>:null;
 const inlineTail=variant==="prose"&&marker&&typeof children==="string"?children.match(/^(.*?)(\S+)$/s):null;
 return <a
  href={href}
  target={target}
  rel={target==="_blank" ? [rel,"noopener","noreferrer"].filter(Boolean).join(" ") : rel}
  data-size={size}
  data-variant={variant}
  className={twMerge(clsx("ui-action-link ui-feedback-text",variant!=="prose"&&"ui-size inline-flex items-center appearance-none border-0 bg-transparent cursor-pointer select-none",variantStyles,className))}
  {...props}
 >{inlineTail?<>{inlineTail[1]}<span className="ui-link-tail">{inlineTail[2]}{marker}</span></>:<>{children}{marker}</>}</a>;
}
