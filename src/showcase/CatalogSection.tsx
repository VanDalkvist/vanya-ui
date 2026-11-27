import React from "react";

/** Private documentation row. Wide is reserved for specimens that need the full reading width. */
export function CatalogSection({ id, title, description, children, layout="split", titleId=id+"-title" }: {
  id: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  layout?: "split" | "wide";
  titleId?: string;
}) {
  return (
    <section id={id} className="catalog-section" data-layout={layout} aria-labelledby={titleId}>
      <header><h3 id={titleId}>{title}</h3>{description&&<p>{description}</p>}</header>
      <div className="catalog-examples">{children}</div>
    </section>
  );
}
