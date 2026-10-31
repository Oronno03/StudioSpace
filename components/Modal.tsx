"use client";

import { ReactNode, useEffect } from "react";

/**
 * Custom modal dialog (replaces window.confirm / alert per the spec).
 * Used for delete confirmation, bookings, and any other destructive flow.
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  icon,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  width?: string;
}) {
  // Lock scroll + close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative w-full ${width} max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/40`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-lg font-bold text-ink">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
