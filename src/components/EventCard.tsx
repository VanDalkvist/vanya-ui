import React from "react";
import { LinkChip } from "./LinkChip";
import { Tag } from "./Tag";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface EventLink {
  url: string;
  label?: string;
}

export interface EventCardProps {
  date: string;
  title: string;
  description?: string;
  imageSrc?: string;
  links?: EventLink[];
  tags?: string[];
  onClose?: () => void;
  className?: string;
}

export function EventCard({
  date,
  title,
  description,
  imageSrc,
  links = [],
  tags = [],
  onClose,
  className,
}: EventCardProps) {
  return (
    <article
      className={twMerge(
        clsx(
          "relative flex w-full max-w-xl flex-col rounded-sm border border-border bg-surface p-6 sm:p-8 text-ink transition-colors",
          className
        )
      )}
    >
      {/* Header: Date + Close */}
      <div className="flex items-start justify-between gap-4">
        <div className="font-mono text-[10px] tracking-[0.32em] text-ink-soft uppercase">
          {date}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="-mt-1 min-h-9 appearance-none border-0 bg-transparent px-1 font-sans text-[11px] tracking-[0.24em] text-ink-soft uppercase transition-colors hover:text-accent cursor-pointer"
          >
            Закрыть
          </button>
        )}
      </div>

      {/* Main Title */}
      <h3 className="mt-4 font-sans text-2xl sm:text-3xl font-medium leading-tight text-ink tracking-tight">
        {title}
      </h3>

      {/* Narrative Description */}
      {description && (
        <p className="mt-3 font-sans text-sm text-ink-soft leading-relaxed">
          {description}
        </p>
      )}

      {/* Media Image */}
      {imageSrc && (
        <div className="relative mt-5 overflow-hidden rounded-[6px] border border-border bg-ground aspect-[16/9] w-full">
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* Link chips */}
      {links.length > 0 && (
        <div className="mt-5 flex flex-col gap-2 pt-4 border-t border-border">
          {links.map((item, idx) => (
            <LinkChip key={idx} url={item.url} label={item.label} />
          ))}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-border">
          {tags.map((t, idx) => (
            <Tag key={idx}>{t}</Tag>
          ))}
        </div>
      )}
    </article>
  );
}
