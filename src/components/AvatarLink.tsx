import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface AvatarLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  src: string;
  alt: string;
  size?: "sm" | "md";
}

export function AvatarLink({
  src,
  alt,
  size = "sm",
  className,
  ...props
}: AvatarLinkProps) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      aria-label={alt}
      title={alt}
      className={twMerge(
        clsx(
          "pointer-events-auto inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border transition-all duration-200 select-none",
          "hover:scale-105 hover:border-accent hover:shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer",
          size === "sm" ? "size-5" : "size-7",
          className
        )
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className="size-full object-cover"
        loading="eager"
      />
    </a>
  );
}
