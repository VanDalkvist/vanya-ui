import React from "react";
import {clsx} from "clsx";

/** Labeled text entry; consumer owns value, validation and mutations. */
export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>,"children"> {
 label: string;
 hint?: string;
 error?: string;
}
export function TextField({label,hint,error,id,className,...props}:TextFieldProps){
 const generated=React.useId(),fieldId=id||generated;
 const noteId=hint||error?fieldId+"-note":undefined;
 const describedBy=[props["aria-describedby"],noteId].filter(Boolean).join(" ")||undefined;
 return <div className={clsx("ui-text-field",className)}>
  <label htmlFor={fieldId} className="ui-text-field-label">{label}</label>
  <input {...props} placeholder={props.placeholder||" "} id={fieldId} aria-invalid={error?true:props["aria-invalid"]}
   aria-describedby={describedBy} className="ui-text-field-input"/>
  {(error||hint)&&<p className={clsx("ui-text-field-note",error&&"ui-text-field-error")} id={noteId}>{error||hint}</p>}
 </div>;
}
