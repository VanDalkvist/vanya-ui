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
      className={twMerge("inspect-sheet fixed inset-y-0 right-0 left-auto m-0 ml-auto h-dvh max-h-none w-full max-w-[560px] overflow-y-auto border-0 border-l border-border bg-surface px-7 py-10 text-ink sm:px-12 sm:py-12", className)}
    >
      <header className="flex items-start justify-between gap-6">
        <h2 id={titleId} className="font-sans text-3xl font-medium leading-tight tracking-tight sm:text-4xl">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Закрыть инспектор" className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-xs bg-transparent text-ink-soft transition-colors hover:bg-surface-raised">
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>
      <div className="mt-8 space-y-5 font-sans text-sm leading-relaxed text-ink-soft">{children}</div>
    </dialog>
  );
}
