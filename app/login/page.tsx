"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { isValidEmail } from "@/lib/format";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Logo } from "@/components/icons";

function safeNext(raw: string | null): string {
  if (!raw) return "/";
  try {
    // Only allow same-origin relative paths — blocks open redirects.
    const url = new URL(raw, "http://placeholder.local");
    return url.origin === "http://placeholder.local" ? raw : "/";
  } catch {
    return "/";
  }
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const next = safeNext(searchParams.get("next"));

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setBusy(true);
    try {
      const user = await login(email.trim(), password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      router.push(next);
    } catch (err: any) {
      toast.error(err?.message || "Login failed. Check your credentials.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-md flex-col justify-center px-4 py-14">
      <div className="card p-8">
        <div className="mb-7 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Sign in to manage your studios and bookings.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "Password recovery is disabled for this build — contact support to reset your password."
                  )
                }
                className="text-xs font-semibold text-brand hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Signing in…" : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">
            or
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleLoginButton onSuccess={() => router.push(next)} />

        <p className="mt-7 text-center text-sm text-ink-2">
          New to StudioSpace?{" "}
          <Link
            href={`/register${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-bold text-brand hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="page-loader"><div className="aperture-spinner" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
