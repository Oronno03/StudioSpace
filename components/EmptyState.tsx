import Link from "next/link";
import { ReactNode } from "react";

/**
 * Friendly empty state with an illustration + CTA — used when searches
 * return nothing, or booking/listing lists are empty.
 */
export default function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
  onAction,
  children,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="card mx-auto flex max-w-xl flex-col items-center px-6 py-14 text-center">
      {/* Empty cyc-wall illustration */}
      <svg
        width="140"
        height="110"
        viewBox="0 0 140 110"
        fill="none"
        aria-hidden="true"
        className="mb-5"
      >
        <rect x="8" y="10" width="124" height="76" rx="10" fill="var(--surface-2)" />
        <path d="M8 62c22-14 44-14 62 0s40 14 62 0v24a10 10 0 0 1-10 10H18a10 10 0 0 1-10-10V62z" fill="var(--border)" />
        <circle cx="70" cy="40" r="14" stroke="var(--brand)" strokeWidth="3" fill="none" />
        <path d="M70 26v-8M84 40h8M56 40h-8M80 30l6-6M60 30l-6-6" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="46" cy="46" r="5" fill="var(--gold)" opacity="0.7" />
        <circle cx="96" cy="46" r="5" fill="var(--gold)" opacity="0.45" />
        <rect x="30" y="94" width="80" height="8" rx="4" fill="var(--surface-2)" />
      </svg>

      <h3 className="text-xl font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-2">{message}</p>

      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button type="button" onClick={onAction} className="btn-primary mt-6">
          {actionLabel}
        </button>
      )}
      {children}
    </div>
  );
}
