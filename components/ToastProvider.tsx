"use client";

import { Toaster } from "sonner";

/** Global toast host — Sonner handles every success/error/info message. */
export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "var(--surface)",
          color: "var(--ink)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
        },
      }}
    />
  );
}
