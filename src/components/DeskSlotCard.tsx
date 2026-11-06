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

/** Карточка проекта на рабочем столе. Поддерживает пустое состояние. */
export const DeskSlotCard: React.FC<DeskSlotCardProps> = ({
  title,
  oneLiner,
  category,
  categoryColor,
  status = "На столе",
  actionsCount,
  isEmpty = false,
  emptyLabel = "Выбрать проект",
  onClick,
  onPark,
  className = "",
}) => {
  if (isEmpty) {
    const Element = onClick ? "button" : "div";
    return (
      <Element
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className={[
          "flex flex-col items-center justify-center min-h-[100px] w-full p-4 rounded-[4px] border border-dashed border-border bg-surface/40 text-ink-soft transition-all",
          onClick ? "cursor-pointer hover:bg-surface-raised/60 hover:text-ink hover:shadow-xs" : "cursor-default",
          className,
        ].join(" ")}
      >
        <span className="font-mono text-xs">{emptyLabel}</span>
      </Element>
    );
  }

  return (
    <div
      onClick={onClick}
      className={[
        "flex flex-col justify-between p-3.5 rounded-[4px] border border-border bg-surface transition-all text-ink group",
        onClick ? "cursor-pointer hover:bg-surface-raised" : "cursor-default",
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
          <h4 className={["font-sans font-semibold text-[13.5px] leading-snug transition-colors", onClick && "group-hover:text-accent"].filter(Boolean).join(" ")}>
            {onClick ? <button type="button" onClick={(event) => { event.stopPropagation(); onClick(); }} className="border-0 bg-transparent p-0 text-left cursor-pointer">{title}</button> : title}
          </h4>
        </div>
        {status && (
          <span className="font-mono text-meta uppercase tracking-wider text-accent bg-accent-soft px-1.5 py-0.5 rounded-[2px]">
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
