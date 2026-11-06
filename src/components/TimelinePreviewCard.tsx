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
      data-interactive={!!onClick}
      className={twMerge(
        clsx(
          "timeline-preview rounded-sm border border-border p-4 text-left text-ink transition-[background-color,box-shadow,transform] duration-200 select-none",
          onClick && "cursor-pointer",
          className
        )
      )}
    >
      <span className="timeline-preview-date block font-mono text-meta tracking-[0.16em] uppercase">
        {date}
      </span>
      <span className="timeline-preview-title mt-2 block font-sans text-sm leading-snug line-clamp-2">
        {title}
      </span>
      {imageSrc && (
        <span className="relative mt-2 block overflow-hidden rounded-[3px] border border-border bg-ground aspect-[16/9] w-full">
          <img
            src={imageSrc}
            alt={title}
            className={clsx("h-full w-full object-cover", onClick && "transition-transform duration-300 hover:scale-105")}
            loading="eager"
          />
        </span>
      )}
    </Element>
  );
}
