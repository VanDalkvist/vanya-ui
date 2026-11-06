import React from "react";
import { getHarnessType } from "../harness";

export interface SpiderAxis {
  label: string;
  value: number; // 0 to 100
  target?: number; // optional target value 0 to 100
}

export interface SpiderRadarProps {
  axes: SpiderAxis[];
  size?: number;
  labelRadius?: number;
  showTargets?: boolean;
  className?: string;
}

/**
 * Многоосевой полигональный SVG-радар (паутинка) в эстетике Hearth & Wave.
 * Отображает баланс категорий с тончайшими концентрическими осями.
 */
export const SpiderRadar: React.FC<SpiderRadarProps> = ({
  axes,
  size = 240,
  showTargets = true,
  className = "",
}) => {
  const center = size / 2;
  const radius = size * 0.36;
  const count = axes.length;
  if (count < 3) return null;

  const angleStep = (Math.PI * 2) / count;

  // Расчет координат вершины
  const getPoint = (val: number, index: number, maxVal = 100) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (Math.min(100, Math.max(0, val)) / maxVal) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Путь полигона текущих значений
  const currentPoints = axes.map((a, i) => getPoint(a.value, i));
  const currentPath =
    currentPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
    " Z";

  // Путь полигона целевых значений
  const hasTargets = showTargets && axes.some((a) => a.target !== undefined);
  const targetPoints = hasTargets
    ? axes.map((a, i) => getPoint(a.target ?? 50, i))
    : [];
  const targetPath =
    targetPoints.length > 0
      ? targetPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
        " Z"
      : "";

  return (
    <div className={["flex flex-col items-center gap-2", className].join(" ")}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible select-none"
      >
        {/* Концентрические кольца */}
        {[0.25, 0.5, 0.75, 1].map((level) => {
          const r = radius * level;
          const ringPoints = Array.from({ length: count }, (_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(" ");
          return (
            <polygon
              key={level}
              points={ringPoints}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray={level < 1 ? "2 2" : undefined}
            />
          );
        })}

        {/* Радиальные лучи осей */}
        {axes.map((_, i) => {
          const pt = getPoint(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={pt.x}
              y2={pt.y}
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}

        {/* Целевой ориентир (пунктир) */}
        {hasTargets && (
          <path
            d={targetPath}
            fill="none"
            stroke="var(--ink)"
            strokeOpacity="0.25"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
        )}

        {/* Текущее распределение */}
        <path
          d={currentPath}
          fill="var(--accent-soft)"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />

        {/* Вершины */}
        {currentPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="var(--surface)"
            stroke="var(--accent)"
            strokeWidth="1.5"
          />
        ))}

        {/* Подписи осей */}
        {axes.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const textR = radius + 22;
          const tx = center + textR * Math.cos(angle);
          const ty = center + textR * Math.sin(angle);
          const harness = getHarnessType(axis.label);
          const Icon = harness?.icon;
          return (
            <g key={i}>
            {Icon && <Icon x={tx - 6} y={ty - 23} width={12} height={12} style={{ color: harness.textColor }} aria-hidden="true" />}
            <text
              x={tx}
              y={ty}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-ink-soft text-meta font-mono tracking-wider uppercase"
              style={{ fill: harness?.textColor }}
            >
              {axis.label} ({axis.value}%)
            </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
