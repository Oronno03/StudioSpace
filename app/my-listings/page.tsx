"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Protected from "@/components/Protected";
import { RowSkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import { api } from "@/lib/api";
import { Studio } from "@/lib/types";
import { money } from "@/lib/format";
import { PinIcon, StarIcon } from "@/components/icons";

function MyListingsInner() {
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [toDelete, setToDelete] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    api
      .get<{ studios: Studio[] }>("/api/studios/mine")
      .then((data) => setStudios(data.studios))
      .catch((err) => {
        toast.error(err?.message || "Could not load your listings.");
        setStudios([]);
      });
  }, []);

  useEffect(load, [load]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/studios/${toDelete._id}`);
      toast.success(`"${toDelete.title}" has been removed.`);
      setToDelete(null);
      load();
    } catch (err: any) {
      toast.error(err?.message || "Could not delete the studio.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Host Dashboard</span>
          <h1 className="section-title mt-4">My Studio Listings</h1>
          <p className="section-sub">
            Manage the spaces you host — update details or take a listing off
            the marketplace.
          </p>
        </div>
        <Link href="/add-studio" className="btn-primary">
          + Add New Studio
        </Link>
      </div>

      <div className="mt-8 pb-6">
        {studios === null ? (
          <RowSkeleton count={3} />
        ) : studios.length === 0 ? (
          <EmptyState
            title="You haven't listed a studio yet"
            message="Turn your unused studio hours into income — listing takes under ten minutes and you set your own rates."
            actionLabel="List Your First Studio"
            actionHref="/add-studio"
          />
        ) : (
          <div className="space-y-4">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={studio.image}
                  alt={studio.title}
                  className="h-28 w-full rounded-xl object-cover sm:h-20 sm:w-32"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-bold text-ink">{studio.title}</h3>
                    <span className="badge border border-border text-[10px] uppercase tracking-wider text-ink-2">
                      {studio.category}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-3">
                    <PinIcon size={12} /> {studio.location}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
                    <span className="font-extrabold text-ink">
                      {money(studio.hourlyRate)}
                      <span className="font-medium text-ink-3"> / hr</span>
                    </span>
                    <span className="flex items-center gap-1 text-gold">
                      <StarIcon size={11} /> {studio.rating.toFixed(1)}
                    </span>
                    <span className="text-ink-3">
                      {studio.reviews.length} review{studio.reviews.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/studios/edit/${studio._id}`}
                    className="btn-secondary btn-sm"
                  >
                    Update
                  </Link>
                  <button
                    type="button"
                    onClick={() => setToDelete(studio)}
                    className="btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal (no native alert/confirm) */}
      <Modal
        open={!!toDelete}
        onClose={() => !deleting && setToDelete(null)}
        title="Delete this studio?"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-soft text-danger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            </svg>
          </span>
        }
      >
        <p className="text-sm leading-relaxed text-ink-2">
          <strong className="text-ink">{toDelete?.title}</strong> and all of its
          bookings will be permanently removed from StudioSpace. This
          action cannot be undone.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="button"
            onClick={confirmDelete}
            disabled={deleting}
            className="btn-danger flex-1"
          >
            {deleting ? "Deleting…" : "Yes, delete it"}
          </button>
          <button
            type="button"
            onClick={() => setToDelete(null)}
            disabled={deleting}
            className="btn-secondary flex-1"
          >
            Keep listing
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <Protected>
      <MyListingsInner />
    </Protected>
  );
}
