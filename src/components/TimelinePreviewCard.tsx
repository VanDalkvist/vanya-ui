import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface TimelinePreviewCardProps {
  date: string;
  title: string;
  imageSrc?: string;
  onClick?: () => void;
  className?: string;
}

export function TimelinePreviewCard({
  date,
  title,
  imageSrc,
  onClick,
  className,
}: TimelinePreviewCardProps) {
  const Element = onClick ? "button" : "div";
  return (
    <Element
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={twMerge(
        clsx(
          "w-[240px] max-w-full rounded-sm border border-border bg-surface p-4 text-left text-ink transition-[background-color,box-shadow] duration-200 select-none",
          onClick && "cursor-pointer hover:bg-surface-raised hover:shadow-xs",
          className
        )
      )}
    >
      <span className="block font-mono text-meta tracking-[0.16em] text-ink-faint uppercase">
        {date}
      </span>
      <span className="mt-2 block font-sans text-sm font-medium leading-snug text-ink line-clamp-2">
        {title}
      </span>
      {imageSrc && (
        <span className="relative mt-2 block overflow-hidden rounded-[3px] border border-border bg-ground aspect-[16/9] w-full">
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="eager"
          />
        </span>
      )}
    </Element>
  );
}
