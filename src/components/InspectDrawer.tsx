import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface InspectDrawerProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * A modal inspector with two deliberately separate areas:
 * - persistent, compact heading and close action
 * - a single keyboard-scrollable detail area
 * In short viewports the whole sheet becomes the scroll owner instead.
 */
export function InspectDrawer({ isOpen, title, onClose, children, className }: InspectDrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!isOpen || !dialog) return;
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    dialog.querySelector<HTMLButtonElement>("button")?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-modal="true"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key === "Escape") { event.preventDefault(); onClose(); }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}
      className={twMerge("inspect-sheet fixed inset-y-0 right-0 left-auto m-0 ml-auto h-dvh max-h-none w-full max-w-[560px] border-0 border-l border-border bg-surface p-0 text-ink", className)}
    >
      <header className="inspect-sheet__header flex shrink-0 items-start justify-between gap-6 border-b border-border px-7 pb-5 pt-8 sm:px-12 sm:pt-10">
        <h2 id={titleId} className="min-w-0 font-sans text-2xl font-medium leading-tight tracking-tight sm:text-3xl">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Закрыть инспектор" className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-xs bg-transparent text-ink-soft transition-colors hover:bg-surface-raised">
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>
      <div role="region" aria-label={title + " — содержимое"} tabIndex={0}
        className="inspect-sheet__body min-h-0 flex-1 overscroll-contain px-7 pb-9 pt-6 font-sans text-sm leading-relaxed text-ink-soft sm:px-12">
        <div className="space-y-5">{children}</div>
      </div>
    </dialog>
  );
}
