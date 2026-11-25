import React from "react";
import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export interface CraftCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  /** With a real onClick, omit or set true to enable the card action; false explicitly disables it. */
  isInteractive?: boolean;
}

/** Nested controls own their events. Use a passive card with explicit native actions for composite content. */
const nestedActionSelector = 'a[href],button,input,select,textarea,label,summary,[contenteditable]:not([contenteditable="false"]),[tabindex],[role="button"],[role="link"],[role="checkbox"],[role="radio"],[role="switch"],[role="slider"],[role="tab"],[role="menuitem"],[role="option"]';

function isNestedAction(event:React.MouseEvent<HTMLDivElement>){
  const target=event.target;
  if(!(target instanceof Element))return false;
  const control=target.closest(nestedActionSelector);
  return !!control&&control!==event.currentTarget&&event.currentTarget.contains(control);
}

/** A visual surface first. When actionable, the div gains real keyboard activation. */
export function CraftCard({
  children,
  className,
  isInteractive,
  onClick,
  onKeyDown,
  tabIndex,
  role,
  ...props
}:CraftCardProps){
  const actionable=isInteractive!==false&&typeof onClick==="function";
  return <div
    {...props}
    role={actionable ? "button" : role}
    tabIndex={actionable ? (tabIndex??0) : tabIndex}
    onClick={actionable ? event=>{
      if(!event.defaultPrevented&&!isNestedAction(event))onClick?.(event);
    } : undefined}
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
      actionable && "ui-feedback-pressable cursor-pointer",
      className
    ))}
  >{children}</div>;
}
