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
  variant?: "text" | "mono" | "accent" | "pill" | "outline";
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
    text:"px-0 font-sans font-medium tracking-normal text-ink-soft/80",
    mono:"px-0 font-mono tracking-[0.16em] uppercase text-ink-soft",
    accent:"px-0 font-sans font-medium text-accent underline-offset-4",
    pill:"rounded-full font-sans text-ink-soft",
    outline:"rounded-sm border border-border bg-surface font-sans font-medium text-ink",
  }[variant];
  return <button
    {...props}
    type={props.type??"button"}
    data-size={size}
    data-variant={variant}
    data-action-state={actionState}
    disabled={disabled}
    aria-disabled={pending || undefined}
    aria-busy={pending || undefined}
    onClick={event=>{
      if(pending){
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
