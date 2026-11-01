"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { GoogleIcon } from "./icons";

declare global {
  interface Window {
    google?: any;
  }
}

const GSI_SRC = "https://accounts.google.com/gsi/client";

// Google Identity Services should only be initialised once per page load.
let gsiInitialized = false;
let gsiCredentialHandler: ((credential: string) => void) | null = null;

/**
 * Google sign-in button using Google Identity Services.
 * Sends the ID token to the backend which verifies it (when GOOGLE_CLIENT_ID
 * is configured) and sets the StudioSpace JWT HTTPOnly cookie.
 */
export default function GoogleLoginButton({
  label = "Continue with Google",
  onSuccess,
}: {
  label?: string;
  onSuccess?: () => void;
}) {
  const { googleLogin, refresh } = useAuth();
  const [busy, setBusy] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const onSuccessRef = useRef(onSuccess);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Keep the latest callback without re-initialising Google each render.
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    if (!clientId) return; // renders fallback button below

    function init() {
      if (!window.google || !buttonRef.current) return;

      gsiCredentialHandler = async (credential: string) => {
        setBusy(true);
        try {
          await googleLogin(credential);
          toast.success("Signed in with Google.");
          onSuccessRef.current?.();
        } catch (err: any) {
          toast.error(err?.message || "Google sign-in failed.");
        } finally {
          setBusy(false);
        }
      };

      if (!gsiInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) =>
            gsiCredentialHandler?.(response.credential),
        });
        gsiInitialized = true;
      }

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
      });
    }

    if (window.google) {
      init();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", init);
      return () => existing.removeEventListener("load", init);
    }

    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.onload = init;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [clientId, googleLogin]);

  if (!clientId) {
    // No OAuth client configured yet (development) — offer a demo quick sign-in.
    return (
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await api.post("/api/auth/google", { demo: true });
            await refresh();
            toast.success("Signed in with Google (demo mode).");
            onSuccess?.();
          } catch (err: any) {
            toast.error(err?.message || "Google sign-in failed.");
          } finally {
            setBusy(false);
          }
        }}
        className="btn-secondary w-full"
      >
        <GoogleIcon />
        {label} (demo)
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={buttonRef} />
      {busy && <p className="text-xs text-ink-3">Signing you in…</p>}
    </div>
  );
}
