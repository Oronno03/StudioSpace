"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Studio, STUDIO_CATEGORIES } from "@/lib/types";
import StudioCard from "@/components/StudioCard";
import { StudioGridSkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low → high" },
  { value: "price-desc", label: "Price: high → low" },
];

function StudiosExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [failed, setFailed] = useState(false);

  // Filter state mirrors the URL so category deep links (?category=…) work
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [minRate, setMinRate] = useState(searchParams.get("minRate") || "");
  const [maxRate, setMaxRate] = useState(searchParams.get("maxRate") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  // Keep URL in sync with filters (shareable links + back/forward)
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncUrl = useCallback(
    (next: Record<string, string>) => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
      syncTimer.current = setTimeout(() => {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(next)) {
          if (v && v !== "All" && !(k === "sort" && v === "newest")) params.set(k, v);
        }
        const qs = params.toString();
        router.replace(qs ? `/studios?${qs}` : "/studios", { scroll: false });
      }, 350);
    },
    [router]
  );

  useEffect(() => {
    let active = true;
    setStudios(null);

    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category !== "All") params.set("category", category);
    if (minRate) params.set("minRate", minRate);
    if (maxRate) params.set("maxRate", maxRate);
    if (sort) params.set("sort", sort);

    api
      .get<{ studios: Studio[] }>(`/api/studios?${params.toString()}`)
      .then((data) => active && setStudios(data.studios))
      .catch(() => {
        if (active) {
          setStudios([]);
          setFailed(true);
        }
      });

    syncUrl({ search, category, minRate, maxRate, sort });

    return () => {
      active = false;
    };
  }, [search, category, minRate, maxRate, sort, syncUrl]);

  // Load wishlist ids so hearts start in the right state
  useEffect(() => {
    api
      .get<{ studios: Studio[] }>("/api/wishlist")
      .then((data) =>
        setWishlistIds(new Set(data.studios.map((s) => s._id)))
      )
      .catch(() => undefined);
  }, []);

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setMinRate("");
    setMaxRate("");
    setSort("newest");
  }

  const hasFilters =
    search || category !== "All" || minRate || maxRate || sort !== "newest";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page head */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">The Marketplace</span>
          <h1 className="section-title mt-4">Explore Studios</h1>
          <p className="section-sub">
            Search every listed creative workspace — filter by craft, budget and
            location until it fits your shoot.
          </p>
        </div>
        {studios !== null && (
          <p className="text-sm font-semibold text-ink-2">
            {studios.length} {studios.length === 1 ? "studio" : "studios"} found
          </p>
        )}
      </div>

      {/* Filter bar */}
      <div className="card mt-8 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label htmlFor="search" className="field-label">
              Search
            </label>
            <input
              id="search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cyc wall, Brooklyn, Neve console…"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="category" className="field-label">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option value="All">All categories</option>
              {STUDIO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="min" className="field-label">
                Min $/hr
              </label>
              <input
                id="min"
                type="number"
                min={0}
                value={minRate}
                onChange={(e) => setMinRate(e.target.value)}
                placeholder="0"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="max" className="field-label">
                Max $/hr
              </label>
              <input
                id="max"
                type="number"
                min={0}
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
                placeholder="200"
                className="input"
              />
            </div>
          </div>
          <div>
            <label htmlFor="sort" className="field-label">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick category chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategory("All")}
            className={`badge border px-3 py-1.5 transition-colors ${
              category === "All"
                ? "border-brand bg-brand-soft text-brand"
                : "border-border text-ink-2 hover:border-brand hover:text-brand"
            }`}
          >
            All
          </button>
          {STUDIO_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`badge border px-3 py-1.5 transition-colors ${
                category === c
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-border text-ink-2 hover:border-brand hover:text-brand"
              }`}
            >
              {c}
            </button>
          ))}
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto text-xs font-bold text-danger hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 pb-6">
        {studios === null ? (
          <StudioGridSkeleton count={6} />
        ) : studios.length === 0 ? (
          <EmptyState
            title={failed ? "Marketplace unreachable" : "No studios match your filters"}
            message={
              failed
                ? "We couldn't reach the StudioSpace API. Start the backend server and refresh the page."
                : "Try widening your price range or clearing the category filter — new studios drop every week."
            }
            actionLabel={failed ? undefined : "Clear filters"}
            onAction={failed ? undefined : resetFilters}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard
                key={studio._id}
                studio={studio}
                saved={wishlistIds.has(studio._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <StudioGridSkeleton count={6} />
        </div>
      }
    >
      <StudiosExplorer />
    </Suspense>
  );
}
