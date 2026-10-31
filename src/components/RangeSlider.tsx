import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export function RangeSlider({
  label,
  className,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  ...props
}: RangeSliderProps) {
  return (
    <div className={twMerge(clsx("flex items-center gap-3", className))}>
      {label && (
        <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint shrink-0">
          {label}
        </span>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="h-px w-full appearance-none bg-hairline-active accent-amber outline-none cursor-pointer focus-visible:ring-1 focus-visible:ring-amber"
        {...props}
      />
    </div>
  );
}
