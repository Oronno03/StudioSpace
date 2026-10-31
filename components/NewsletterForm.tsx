"use client";

import { useState } from "react";
import { toast } from "sonner";

/** Footer newsletter signup — client island inside the server Footer. */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // No newsletter backend — acknowledge locally with a toast.
    toast.success("You're on the list — watch your inbox for studio drops.");
    setEmail("");
  }

  return (
    <form className="mt-4 flex gap-2" onSubmit={submit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@studio.com"
        aria-label="Email address for newsletter"
        className="input flex-1"
      />
      <button type="submit" className="btn-primary btn-sm shrink-0">
        Join
      </button>
    </form>
  );
}
