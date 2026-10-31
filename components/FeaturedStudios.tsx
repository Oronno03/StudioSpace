"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Studio } from "@/lib/types";
import StudioCard from "./StudioCard";
import { StudioGridSkeleton } from "./Skeletons";
import EmptyState from "./EmptyState";

/**
 * Featured studios — fetched from MongoDB via /api/studios/featured
 * (server applies .limit(6), sorted by rating then recency).
 */
export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get<{ studios: Studio[] }>("/api/studios/featured")
      .then((data) => active && setStudios(data.studios))
      .catch(() => {
        if (active) {
          setStudios([]);
          setFailed(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (studios === null) return <StudioGridSkeleton count={6} />;

  if (studios.length === 0) {
    return (
      <EmptyState
        title={failed ? "Studio feed unavailable" : "No studios listed yet"}
        message={
          failed
            ? "We couldn't reach the StudioSpace API. Start the backend (see README) and refresh to see live listings."
            : "Be the first host on StudioSpace — list your studio and it will appear here for thousands of creators to discover."
        }
        actionLabel="Host Your Space"
        actionHref="/add-studio"
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {studios.map((studio) => (
        <StudioCard key={studio._id} studio={studio} />
      ))}
      <div className="sm:col-span-2 lg:col-span-3 flex justify-center pt-2">
        <Link href="/studios" className="btn-secondary">
          Browse all studios
        </Link>
      </div>
    </div>
  );
}
