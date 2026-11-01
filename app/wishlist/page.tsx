"use client";

import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import StudioCard from "@/components/StudioCard";
import { RowSkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { Studio } from "@/lib/types";

function WishlistInner() {
  const [studios, setStudios] = useState<Studio[] | null>(null);

  useEffect(() => {
    api
      .get<{ studios: Studio[] }>("/api/wishlist")
      .then((data) => setStudios(data.studios))
      .catch(() => setStudios([]));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="section-kicker">Your Shortlist</span>
      <h1 className="section-title mt-4">Saved Studios</h1>
      <p className="section-sub">
        Spaces you&apos;ve hearted — perfect for comparing before you lock in
        your shoot hours.
      </p>

      <div className="mt-8 pb-6">
        {studios === null ? (
          <RowSkeleton count={2} />
        ) : studios.length === 0 ? (
          <EmptyState
            title="Nothing saved yet"
            message="Tap the heart on any studio card to keep it here for later — your shortlist syncs across devices."
            actionLabel="Browse Studios"
            actionHref="/studios"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} saved />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Protected>
      <WishlistInner />
    </Protected>
  );
}
