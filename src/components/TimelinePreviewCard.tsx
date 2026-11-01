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
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          "w-[240px] rounded-xs border border-border bg-surface p-3 text-ink transition-all duration-200 select-none",
          onClick && "cursor-pointer hover:bg-surface-raised hover:border-accent/40 hover:shadow-xs",
          className
        )
      )}
    >
      <div className="font-mono text-[9px] tracking-[0.24em] text-ink-faint uppercase">
        {date}
      </div>
      <h4 className="mt-1 font-serif text-[13px] font-medium leading-snug text-ink line-clamp-2">
        {title}
      </h4>
      {imageSrc && (
        <div className="relative mt-2 overflow-hidden rounded-[3px] border border-border bg-ground aspect-[16/9] w-full">
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="eager"
          />
        </div>
      )}
    </div>
  );
}
