import React from "react";
import { chapterTitle, type ChapterId } from "./showcase-sections";

/** Documentation-only anatomy; chapter identity and navigation belong to the caller. */
export function ChapterHeader({id,description}:{id:ChapterId;description:string}){
 return <header className="chapter-header">
  <h2 id={id+"-title"} className="catalog-title">{chapterTitle(id)}</h2>
  <p className="catalog-intro">{description}</p>
 </header>;
}
