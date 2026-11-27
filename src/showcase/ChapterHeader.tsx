import React from "react";

/** Documentation-only anatomy; chapter identity and navigation belong to the caller. */
export function ChapterHeader({id,title,description}:{id:string;title:string;description:string}){
 return <header className="chapter-header">
  <h2 id={id+"-title"} className="catalog-title">{title}</h2>
  <p className="catalog-intro">{description}</p>
 </header>;
}
