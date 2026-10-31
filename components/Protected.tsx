"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/**
 * Client-side route guard for private pages.
 *
 * While the session is loading we render a branded spinner (never a redirect),
 * and once loading finishes with no user we send the visitor to /login while
 * remembering where they wanted to go in ?next=... — this is what keeps a
 * logged-in user from being bounced to Login on a page reload.
 */
export default function Protected({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) {
      setAllowed(true);
    } else {
      const next = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      router.replace(`/login?next=${next}`);
    }
  }, [user, loading, router]);

  if (loading || !allowed) {
    return (
      <div className="page-loader" aria-label="Checking your session">
        <div className="aperture-spinner" />
        <p className="text-sm font-medium text-ink-2">Verifying your session…</p>
      </div>
    );
  }

  return <>{children}</>;
}
