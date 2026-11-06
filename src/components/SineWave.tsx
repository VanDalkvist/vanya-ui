import React from "react";
import { twMerge } from "tailwind-merge";

export type SineWaveProps = React.SVGProps<SVGSVGElement>;

const path = Array.from({ length: 151 }, (_, index) => {
  const x = index * 8;
  const y = 200 + 88 * Math.sin((x / 1200) * Math.PI * 3.2 - Math.PI * 0.4);
  return `${index === 0 ? "M" : "L"}${x} ${y.toFixed(2)}`;
}).join(" ");

/** Quiet, static geometry inspired by the light Синусоида trajectory. */
export function SineWave({ className, ...props }: SineWaveProps) {
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true" focusable="false" className={twMerge("pointer-events-none w-full text-ink", className)} {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d={path} transform="translate(0 -56)" strokeWidth="1" opacity="0.055" vectorEffect="non-scaling-stroke" />
        <path d={path} transform="translate(0 72)" strokeWidth="1" opacity="0.035" vectorEffect="non-scaling-stroke" />
        <path d={path} strokeWidth="1.2" opacity="0.24" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}
