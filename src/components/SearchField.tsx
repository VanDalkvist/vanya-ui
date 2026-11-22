import React from "react";
import {Search,X} from "lucide-react";
import {clsx} from "clsx";

/** A search input, not a faux button. Consumer owns query and filtering. */
export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>,"type"|"value"|"onChange"> {
 value: string;
 onValueChange: (value:string)=>void;
 label: string;
 onClear?: ()=>void;
 /** Compact 40px variant for shared filter rows. */
 density?: "default" | "toolbar";
}
export function SearchField({value,onValueChange,label,onClear,className,id,placeholder="Поиск",density="default",...props}:SearchFieldProps){
 const generated=React.useId();
 return <div className={clsx("ui-search-field",className)} data-density={density} role="search">
  <label className="sr-only" htmlFor={id||generated}>{label}</label>
  <Search aria-hidden="true" className="ui-search-field-icon" size={18}/>
  <input {...props} id={id||generated} type="search" value={value} placeholder={placeholder}
    onChange={e=>onValueChange(e.currentTarget.value)}
    className="ui-search-field-input"/>
  {value&&<button type="button" className="ui-search-field-clear" aria-label="Очистить поиск"
    onClick={()=>{onValueChange("");onClear?.()}}><X size={16} aria-hidden="true"/></button>}
 </div>;
}
