import React from "react";
import type { LucideIcon } from "lucide-react";
import { getHarnessType } from "../harness";

export interface EnergyDistributionItem {
  id: string;
  label: string;
  count: number;
  percentage: number;
  color?: string; // CSS color; overrides the harness default
  textColor?: string;
  icon?: LucideIcon;
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
  const resolvedItems = items.map((item) => {
    const harness = getHarnessType(item.id) ?? getHarnessType(item.label);
    return { ...item, color: item.color ?? harness?.color ?? "var(--accent)", textColor: item.textColor ?? harness?.textColor, icon: item.icon ?? harness?.icon };
  });
  return (
    <div
      className={[
        "flex w-full min-w-0 flex-col gap-3 p-4 rounded-[4px] bg-paper-raised border border-border text-xs text-ink",
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
        {resolvedItems.map((it) => {
          if (it.percentage <= 0) return null;
          return (
            <div
              key={it.id}
              style={{
                width: `${it.percentage}%`,
                backgroundColor: it.color || "var(--accent)",
              }}
              title={`${it.label}: ${it.percentage}% (${it.count})`}
              className="h-full cursor-help"
            />
          );
        })}
      </div>

      {/* Легенда */}
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 pt-1 text-[11px]">
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
          {resolvedItems.map((it) => (
            <div key={it.id} className="flex items-center gap-1.5 whitespace-nowrap font-sans">
              {it.icon ? <it.icon className="size-3 shrink-0" style={{ color: it.textColor }} aria-hidden="true" /> : <span className="size-2 rounded-full inline-block shrink-0" style={{ backgroundColor: it.color }} />}
              <span className="text-ink-soft" style={{ color: it.textColor }}>{it.label}:</span>
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
          <div className="ml-auto shrink-0 whitespace-nowrap font-mono text-[11px] text-ink-soft">
            <span className="text-ink font-semibold">{totalCount}</span>{" "}
            <span className="text-ink-faint">{totalLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
