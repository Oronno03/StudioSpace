"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { isValidEmail, passwordError } from "@/lib/format";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Logo } from "@/components/icons";

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirm: "",
  });
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const pwError = form.password ? passwordError(form.password) : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (form.name.trim().length < 2) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (form.photoURL && !/^https?:\/\//.test(form.photoURL)) {
      toast.error("Photo URL must start with http:// or https://");
      return;
    }
    if (pwError) {
      toast.error(pwError);
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        photoURL: form.photoURL.trim(),
      });
      toast.success("Account created! Sign in to continue.");
      router.push(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
    } catch (err: any) {
      toast.error(err?.message || "Registration failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // Live password criteria checklist (spec requirements)
  const rules = [
    { label: "Uppercase letter", ok: /[A-Z]/.test(form.password) },
    { label: "Lowercase letter", ok: /[a-z]/.test(form.password) },
    { label: "6+ characters", ok: form.password.length >= 6 },
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-md flex-col justify-center px-4 py-14">
      <div className="card p-8">
        <div className="mb-7 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-ink">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Join thousands of creators booking studios by the hour.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="field-label">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={set("name")}
              placeholder="Alex Rivera"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@studio.com"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="photo" className="field-label">
              Photo URL
            </label>
            <input
              id="photo"
              type="url"
              value={form.photoURL}
              onChange={set("photoURL")}
              placeholder="https://i.pravatar.cc/160?img=12"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
              className="input"
            />
            {/* Live criteria checklist */}
            <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
              {rules.map((rule) => (
                <li
                  key={rule.label}
                  className={`flex items-center gap-1.5 text-[11px] font-medium ${
                    rule.ok ? "text-success" : "text-ink-3"
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    {rule.ok ? <path d="M20 6L9 17l-5-5" /> : <circle cx="12" cy="12" r="9" />}
                  </svg>
                  {rule.label}
                </li>
              ))}
            </ul>
            {/* Inline error state (spec: show password error in the form) */}
            {pwError && (
              <p role="alert" className="mt-2 text-xs font-semibold text-danger">
                {pwError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirm" className="field-label">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={set("confirm")}
              placeholder="••••••••"
              className="input"
            />
          </div>

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Creating account…" : "Register"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">
            or
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleLoginButton label="Sign up with Google" onSuccess={() => router.push("/")} />

        <p className="mt-7 text-center text-sm text-ink-2">
          Already have an account?{" "}
          <Link
            href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-bold text-brand hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="page-loader"><div className="aperture-spinner" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
