import React from "react";
import { CraftCard } from "./CraftCard";
import { ActionButton } from "./ActionButton";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface OfferCardProps {
  title: string;
  description: string;
  autonomy: string;
  competence: string;
  relatedness?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  isActive?: boolean;
}

export function OfferCard({
  title,
  description,
  autonomy,
  competence,
  relatedness,
  actionLabel = "Взять на стол",
  onAction,
  className,
  isActive = false,
}: OfferCardProps) {
  return (
    <CraftCard
      className={twMerge(
        clsx(
          "flex flex-col justify-between gap-4 p-4 transition-all duration-150",
          isActive && "border-hairline-amber bg-surface-raised",
          className
        )
      )}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-sans text-sm font-semibold text-ink leading-snug">
            {title}
          </h4>
          {isActive && (
            <span className="font-mono text-[10px] text-amber lowercase bg-amber/10 border border-amber/30 px-1.5 py-0.5 rounded-xs">
              на столе
            </span>
          )}
        </div>
        <p className="font-sans text-xs text-ink-soft leading-relaxed">
          {description}
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-hairline/60">
        {/* SDT Motivation tags */}
        <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-ink-faint">
          <span className="rounded-xs bg-surface-inset px-2 py-0.5">
            Автономия: <span className="text-ink-soft">{autonomy}</span>
          </span>
          <span className="rounded-xs bg-surface-inset px-2 py-0.5">
            Мастерство: <span className="text-ink-soft">{competence}</span>
          </span>
          {relatedness && (
            <span className="rounded-xs bg-surface-inset px-2 py-0.5">
              Связь: <span className="text-ink-soft">{relatedness}</span>
            </span>
          )}
        </div>

        {onAction && (
          <div className="flex justify-end">
            <ActionButton
              variant={isActive ? "accent" : "text"}
              onClick={onAction}
            >
              {isActive ? "Уже в работе" : actionLabel}
            </ActionButton>
          </div>
        )}
      </div>
    </CraftCard>
  );
}
