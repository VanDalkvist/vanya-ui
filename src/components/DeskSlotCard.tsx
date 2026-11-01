import React from "react";

export interface DeskSlotCardProps {
  title?: string;
  oneLiner?: string;
  category?: string;
  categoryColor?: string;
  status?: string;
  actionsCount?: number;
  isEmpty?: boolean;
  emptyLabel?: string;
  onClick?: () => void;
  onPark?: () => void;
  className?: string;
}

/**
 * Карточка фокуса внимания на рабочем столе и свободный слот квоты (из Фермы).
 * Ограничивает когнитивную нагрузку строгим лимитом активных сущностей.
 */
export const DeskSlotCard: React.FC<DeskSlotCardProps> = ({
  title,
  oneLiner,
  category,
  categoryColor,
  status = "На столе",
  actionsCount,
  isEmpty = false,
  emptyLabel = "+ Свободный слот стола (макс. 3)",
  onClick,
  onPark,
  className = "",
}) => {
  if (isEmpty) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={[
          "flex flex-col items-center justify-center min-h-[100px] w-full p-4 rounded-[4px] border border-dashed border-border bg-surface/40 hover:bg-surface-raised/60 hover:border-accent text-ink-soft hover:text-ink transition-all cursor-pointer",
          className,
        ].join(" ")}
      >
        <span className="font-mono text-xs">{emptyLabel}</span>
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={[
        "flex flex-col justify-between p-3.5 rounded-[4px] border border-border bg-surface hover:bg-surface-raised transition-all cursor-pointer text-ink group",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {category && (
            <span
              className="size-2 rounded-full inline-block shrink-0"
              style={{ backgroundColor: categoryColor || "var(--accent)" }}
            />
          )}
          <h4 className="font-sans font-semibold text-[13.5px] leading-snug group-hover:text-accent transition-colors">
            {title}
          </h4>
        </div>
        {status && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent bg-accent-soft px-1.5 py-0.5 rounded-[2px]">
            {status}
          </span>
        )}
      </div>

      {oneLiner && (
        <p className="text-[12px] text-ink-soft line-clamp-2 mt-2 leading-relaxed">
          {oneLiner}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 pt-3 mt-2 border-t border-border text-[11px] font-mono text-ink-faint">
        {actionsCount !== undefined ? (
          <span>{actionsCount} действий</span>
        ) : (
          <span />
        )}
        {onPark && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPark();
            }}
            className="hover:text-accent transition-colors border-0 bg-transparent p-0 cursor-pointer text-ink-soft"
          >
            запарковать
          </button>
        )}
      </div>
    </div>
  );
};
