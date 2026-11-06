import React from "react";

export function CatalogSection({ id, title, description, children }: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="catalog-section" aria-labelledby={`${id}-title`}>
      <header><h3 id={`${id}-title`}>{title}</h3><p>{description}</p></header>
      <div className="catalog-examples">{children}</div>
    </section>
  );
}
