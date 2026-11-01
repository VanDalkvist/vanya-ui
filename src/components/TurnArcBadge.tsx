import React from "react";

export interface TurnArcBadgeProps {
  label: string;
  tone?: "accent" | "neutral" | "good" | "warn";
  className?: string;
}

/**
 * Капсульный бейдж вехи или сюжетного поворота судьбы (из Синусоиды).
 * Использует моноширинный трекинг и тонкую рамку 10% прозрачности.
 */
export const TurnArcBadge: React.FC<TurnArcBadgeProps> = ({
  label,
  tone = "accent",
  className = "",
}) => {
  const toneClasses = {
    accent: "text-accent bg-accent-soft border-accent/20",
    neutral: "text-ink-soft bg-surface-raised border-border",
    good: "text-[#34d399] bg-[#34d399]/10 border-[#34d399]/20",
    warn: "text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/20",
  }[tone];

  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10.5px] font-mono tracking-[0.2em] uppercase select-none transition-all",
        toneClasses,
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
};
