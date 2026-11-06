import React from "react";

export interface EnergyDistributionItem {
  id: string;
  label: string;
  count: number;
  percentage: number;
  color?: string; // hex or oklch or tailwind class
}

export interface EnergyRadarProps {
  title?: string;
  items: EnergyDistributionItem[];
  horizons?: Array<{ id: string; label: string }>;
  activeHorizon?: string;
  onHorizonChange?: (horizonId: string) => void;
  totalCount?: number;
  totalLabel?: string;
  className?: string;
}

/**
 * Обобщенный радар распределения энергии/внимания (из Фермы).
 * Лишен специфичной проектной терминологии, принимает произвольные категории и метрики.
 */
export const EnergyRadar: React.FC<EnergyRadarProps> = ({
  title = "Радар распределения",
  items,
  horizons,
  activeHorizon,
  onHorizonChange,
  totalCount,
  totalLabel = "всего",
  className = "",
}) => {
  return (
    <div
      className={[
        "flex flex-col gap-2.5 p-3 rounded-[4px] bg-paper-raised border border-border text-xs text-ink",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
          {title}
        </span>

        {horizons && horizons.length > 0 && (
          <div
            role="radiogroup"
            aria-label="Временной горизонт"
            className="flex items-center gap-0.5 p-0.5 rounded-[2px] bg-paper border border-border text-[11px] font-mono"
          >
            {horizons.map((h) => {
              const isSelected = activeHorizon === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onHorizonChange?.(h.id)}
                  className={[
                    "px-2 py-0.5 rounded-[2px] transition-all cursor-pointer border-0",
                    isSelected
                      ? "bg-accent-soft text-ink font-medium"
                      : "bg-transparent text-ink-soft hover:text-ink",
                  ].join(" ")}
                >
                  {h.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Многосегментный прогресс-бар */}
      <div className="h-2 w-full rounded-full bg-surface-inset overflow-hidden flex border border-border">
        {items.map((it) => {
          if (it.percentage <= 0) return null;
          return (
            <div
              key={it.id}
              style={{
                width: `${it.percentage}%`,
                backgroundColor: it.color || "var(--accent)",
              }}
              title={`${it.label}: ${it.percentage}% (${it.count})`}
              className="h-full transition-all hover:opacity-80 cursor-pointer"
            />
          );
        })}
      </div>

      {/* Легенда */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px]">
        <div className="flex items-center gap-3.5 flex-wrap">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-1.5 font-sans">
              <span
                className="size-2 rounded-full inline-block shrink-0"
                style={{ backgroundColor: it.color || "var(--accent)" }}
              />
              <span className="text-ink-soft">{it.label}:</span>
              <span className="font-mono font-medium text-ink">
                {it.percentage}%
              </span>
              <span className="font-mono text-meta text-ink-faint">
                ({it.count})
              </span>
            </div>
          ))}
        </div>

        {totalCount !== undefined && (
          <div className="font-mono text-[11px] text-ink-soft">
            <span className="text-ink font-semibold">{totalCount}</span>{" "}
            <span className="text-ink-faint">{totalLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
