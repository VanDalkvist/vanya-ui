import React from "react";
import {Check, CircleAlert, LoaderCircle} from "lucide-react";
import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import type {ComponentSize} from "../sizes";

/** UI state reported by the consumer, never inferred from an onClick return value. */
export type ActionButtonState = "idle" | "pending" | "success" | "error";

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: ComponentSize;
  variant?: "text" | "mono" | "accent" | "pill" | "outline" | "prominent";
  className?: string;
  /** Caller-owned execution/result state; pending prevents duplicate activation without losing focus. */
  actionState?: ActionButtonState;
  /** Accessible announcement for pending, success or error. */
  statusLabel?: string;
}

const defaultStatus: Record<Exclude<ActionButtonState,"idle">,string> = {
  pending:"Выполняется",
  success:"Выполнено",
  error:"Действие не удалось",
};

export function ActionButton({
  children,
  size="sm",
  variant="text",
  className,
  disabled,
  actionState="idle",
  statusLabel,
  onClick,
  ...props
}: ActionButtonProps) {
  const pending=actionState==="pending";
  const variantStyles={
    text:"rounded-sm font-sans font-medium tracking-normal text-ink-soft",
    mono:"rounded-sm font-mono tracking-[var(--type-tracking-action-mono)] uppercase text-ink-soft",
    accent:"rounded-sm font-sans font-medium text-accent underline-offset-4",
    pill:"rounded-sm font-sans font-medium text-ink-soft",
    outline:"rounded-sm font-sans font-medium text-ink",
    prominent:"rounded-sm font-sans font-medium",
  }[variant];
  return <button
    {...props}
    type={props.type??"button"}
    data-size={size}
    data-variant={variant}
    data-action-state={actionState}
    disabled={disabled}
    aria-disabled={pending || props["aria-disabled"] || undefined}
    aria-busy={pending || undefined}
    onClick={event=>{
      if(pending || props["aria-disabled"]===true || props["aria-disabled"]==="true"){
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    }}
    className={twMerge(clsx(
      "ui-size ui-action-button ui-feedback-text inline-flex items-center appearance-none border-0 bg-transparent cursor-pointer select-none",
      disabled && "opacity-35 cursor-not-allowed pointer-events-none",
      variantStyles,
      className
    ))}
  >
    {actionState==="pending" && <LoaderCircle className="ui-action-indicator ui-action-indicator-pending" aria-hidden="true"/>}
    {actionState==="success" && <Check className="ui-action-indicator" aria-hidden="true"/>}
    {actionState==="error" && <CircleAlert className="ui-action-indicator" aria-hidden="true"/>}
    {children}
    {actionState!=="idle" && <span className="sr-only" role="status">{statusLabel??defaultStatus[actionState]}</span>}
  </button>;
}
