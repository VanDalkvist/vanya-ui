import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SelectFieldOption { value: string; label: string; disabled?: boolean }
export interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: string;
  options: SelectFieldOption[];
  emptyLabel?: string;
  allowEmpty?: boolean;
  /** Use toolbar for a one-line labeled native select in compact filter bars. */
  density?: "default" | "toolbar";
  className?: string;
}
/** Compact, accessible native select in Vanya UI tokens. Use for faceted filters, not main navigation. */
export function SelectField({label,options,emptyLabel="Все",allowEmpty=true,density="default",className,id,...props}: SelectFieldProps) {
 const internalId=React.useId();
 const controlId=id||internalId;
 return (
  <label htmlFor={controlId} data-density={density} className={twMerge(clsx("ui-select-field flex min-w-0",density==="toolbar"?"flex-row items-center gap-0":"flex-col gap-1.5",className))}>
   <span className="ui-select-field-label ui-type-caption font-sans text-ink-soft">{label}</span>
   <select id={controlId} {...props} className={clsx("ui-select-field-select min-w-0 font-sans text-control text-ink outline-none",density==="toolbar"?"h-full rounded-none border-0 bg-transparent pl-1 pr-5 focus-visible:outline-none":"h-10 rounded-sm border border-border bg-surface px-3 focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent",props.disabled&&"opacity-45")}>
    {allowEmpty&&<option value="">{emptyLabel}</option>}
    {options.map(option=><option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
   </select>
  </label>
 );
}
