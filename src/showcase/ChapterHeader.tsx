import React from "react";

/** Documentation-only anatomy; chapter identity and navigation belong to the caller. */
export function ChapterHeader({id,title,description,index}:{id:string;title:string;description:string;index?:string}){
 return <header className="chapter-header">
  {index&&<p className="guide-eyebrow">{index}</p>}
  <h2 id={id+"-title"} className="catalog-title">{title}</h2>
  <p className="catalog-intro">{description}</p>
 </header>;
}
