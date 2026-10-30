import React, { useEffect } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InspectDrawerProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function InspectDrawer({
  isOpen,
  title,
  onClose,
  children,
  className,
}: InspectDrawerProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ground/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        data-testid="drawer-backdrop"
      />

      {/* Drawer surface */}
      <div
        className={twMerge(
          clsx(
            "relative z-10 flex h-full w-full max-w-md flex-col border-l border-hairline bg-surface p-6 shadow-2xl transition-transform duration-200 ease-out",
            className
          )
        )}
      >
        <div className="flex items-center justify-between border-b border-hairline pb-4 mb-4">
          <h2 className="font-serif text-lg text-ink font-normal">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть инспектор"
            className="rounded-xs p-1 text-ink-soft hover:bg-surface-raised hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 font-sans text-sm text-ink-soft">
          {children}
        </div>
      </div>
    </div>
  );
}
