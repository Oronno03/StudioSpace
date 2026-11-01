import Link from "next/link";
import { Logo } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      {/* Creative studio illustration — dark room with a stray spotlight */}
      <svg
        width="260"
        height="190"
        viewBox="0 0 260 190"
        fill="none"
        aria-hidden="true"
        className="mb-8"
      >
        {/* Backdrop wall */}
        <rect x="10" y="10" width="240" height="140" rx="14" fill="var(--surface-2)" />
        {/* Spotlight cone */}
        <path d="M130 0 L200 150 L60 150 Z" fill="var(--brand)" opacity="0.14" />
        {/* Spotlight head */}
        <g>
          <rect x="112" y="4" width="36" height="22" rx="7" fill="var(--ink)" />
          <rect x="120" y="24" width="20" height="6" rx="3" fill="var(--ink-2)" />
          <circle cx="130" cy="30" r="9" fill="var(--brand)" />
        </g>
        {/* Cyc wall floor curve */}
        <path
          d="M10 110c50-22 90-22 120 0s90 22 120 0v30a14 14 0 0 1-14 14H24a14 14 0 0 1-14-14v-30z"
          fill="var(--border)"
        />
        {/* Camera on tripod inside the beam */}
        <g stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="116" y="86" width="34" height="24" rx="5" fill="var(--surface)" />
          <path d="M150 92l14-7v26l-14-7" fill="var(--surface)" />
          <path d="M133 110v22M123 142l10-16 10 16" />
        </g>
        {/* 404 clapper accent */}
        <g>
          <rect x="36" y="128" width="46" height="30" rx="5" fill="var(--ink)" />
          <path d="M36 138h46" stroke="var(--background)" strokeWidth="2.5" />
          <path d="M40 128l6-9M52 128l6-9M64 128l6-9" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* Light stand */}
        <circle cx="216" cy="150" r="5" fill="var(--gold)" />
        <path d="M216 150v22M206 178l10-6 10 6" stroke="var(--ink-2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand">
        Error 404 — Take not rolling
      </p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        This set is empty
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-ink-2">
        The page you&apos;re looking for was struck from the call sheet — it may
        have been renamed, moved, or never existed in this cut.
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary px-7 py-3 text-base">
          Return to Home
        </Link>
        <Link href="/studios" className="btn-secondary px-7 py-3 text-base">
          Explore Studios
        </Link>
      </div>

      <div className="mt-12 opacity-60">
        <Logo />
      </div>
    </div>
  );
}
