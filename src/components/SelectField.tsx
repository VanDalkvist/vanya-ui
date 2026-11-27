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
  <label htmlFor={controlId} data-density={density} className={twMerge(clsx("ui-select-field min-w-0",className))}>
   <span className="ui-select-field-label">{label}{density==="toolbar"&&<span aria-hidden="true">:</span>}</span>
   <select id={controlId} {...props} className={clsx("ui-select-field-select min-w-0",props.disabled&&"opacity-45")}>
    {allowEmpty&&<option value="">{emptyLabel}</option>}
    {options.map(option=><option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
   </select>
  </label>
 );
}
