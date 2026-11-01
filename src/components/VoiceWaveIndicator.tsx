import React from "react";

export interface VoiceWaveIndicatorProps {
  isSpeaking?: boolean;
  level?: number; // 0 to 1
  label?: string;
  className?: string;
}

/**
 * Индикатор живого дыхания / речевого потока (0.11 Гц) из Салона Присутствия.
 * Мягко разгорается при наличии голоса и мерцает теплым тлением в паузах тишины.
 */
export const VoiceWaveIndicator: React.FC<VoiceWaveIndicatorProps> = ({
  isSpeaking = false,
  level = 0.4,
  label = isSpeaking ? "голос звучит" : "тишина круга",
  className = "",
}) => {
  const bars = [0.3, 0.6, 0.9, 0.7, 0.4, 0.8, 1.0, 0.5, 0.3];

  return (
    <div
      className={[
        "inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-border bg-surface text-xs text-ink select-none",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-0.5 h-3">
        {bars.map((h, i) => {
          const height = isSpeaking ? Math.max(2, h * level * 12) : 2;
          return (
            <span
              key={i}
              style={{ height: `${height}px` }}
              className={[
                "w-0.5 rounded-full transition-all duration-150",
                isSpeaking ? "bg-accent" : "bg-ink-soft/40",
              ].join(" ")}
            />
          );
        })}
      </div>
      <span className="font-mono text-[11px] text-ink-soft">{label}</span>
    </div>
  );
};
