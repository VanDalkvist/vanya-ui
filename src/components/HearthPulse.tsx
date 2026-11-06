import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface HearthPulseProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  className?: string;
}

export function HearthPulse({
  label = "активен",
  className,
  ...props
}: HearthPulseProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 font-mono text-[11px] text-amber select-none lowercase",
          className
        )
      )}
      {...props}
    >
      <span className="relative flex size-2 items-center justify-center">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber opacity-40" />
        <span className="relative inline-flex size-1.5 rounded-full bg-amber" />
      </span>
      {label && <span>{label}</span>}
    </span>
  );
}
