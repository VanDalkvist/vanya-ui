import React from "react";
import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export interface CraftCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  /** Opt into an actionable card only when a real onClick handler is present. */
  isInteractive?: boolean;
}

/** A visual surface first. When actionable, the div gains real keyboard activation. */
export function CraftCard({
  children,
  className,
  isInteractive=false,
  onClick,
  onKeyDown,
  tabIndex,
  role,
  ...props
}:CraftCardProps){
  const actionable=typeof onClick==="function";
  return <div
    {...props}
    role={actionable ? "button" : role}
    tabIndex={actionable ? (tabIndex??0) : tabIndex}
    onClick={onClick}
    onKeyDown={event=>{
      onKeyDown?.(event);
      if(event.defaultPrevented||!actionable||event.target!==event.currentTarget||event.repeat)return;
      if(event.key==="Enter"||event.key===" "){
        event.preventDefault();
        event.currentTarget.click();
      }
    }}
    className={twMerge(clsx(
      "rounded-sm border border-border bg-surface p-5 text-ink",
      actionable && isInteractive && "ui-feedback-pressable cursor-pointer",
      className
    ))}
  >{children}</div>;
}
