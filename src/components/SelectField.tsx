import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SelectFieldOption { value: string; label: string; disabled?: boolean }
export interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: string;
  options: SelectFieldOption[];
  emptyLabel?: string;
  allowEmpty?: boolean;
  className?: string;
}
/** Compact, accessible native select in Vanya UI tokens. Use for faceted filters, not main navigation. */
export function SelectField({label,options,emptyLabel="Все",allowEmpty=true,className,id,...props}: SelectFieldProps) {
 const internalId=React.useId();
 const controlId=id||internalId;
 return (
  <label htmlFor={controlId} className={twMerge(clsx("flex min-w-0 flex-col gap-1.5",className))}>
   <span className="font-mono text-meta uppercase tracking-wider text-ink-faint">{label}</span>
   <select id={controlId} {...props} className={clsx("h-9 min-w-0 rounded-xs border border-border bg-surface-inset px-2.5 font-sans text-xs text-ink outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent",props.disabled&&"opacity-45")}>
    {allowEmpty&&<option value="">{emptyLabel}</option>}
    {options.map(option=><option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
   </select>
  </label>
 );
}
