"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { HeartIcon } from "./icons";

/**
 * Heart button on studio cards / details — optimistic toggle against
 * the wishlist stored in MongoDB (optional requirement).
 */
export default function WishlistButton({
  studioId,
  initialSaved = false,
  className = "",
}: {
  studioId: string;
  initialSaved?: boolean;
  className?: string;
}) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(initialSaved);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info("Log in to save studios to your wishlist.");
      return;
    }

    const prev = saved;
    setSaved(!prev); // optimistic
    try {
      const data = await api.post<{ saved: boolean; count: number }>(
        `/api/wishlist/${studioId}/toggle`
      );
      setSaved(data.saved);
      toast.success(
        data.saved ? "Added to your saved studios." : "Removed from saved studios."
      );
    } catch (err: any) {
      setSaved(prev);
      toast.error(err?.message || "Could not update your wishlist.");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/90 text-ink-2 backdrop-blur transition-all hover:border-brand hover:text-brand ${className}`}
    >
      <HeartIcon filled={saved} size={16} />
    </button>
  );
}
