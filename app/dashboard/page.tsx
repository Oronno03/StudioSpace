"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Protected from "@/components/Protected";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Studio, Booking } from "@/lib/types";
import { money, prettyDate, prettyTime, statusClasses } from "@/lib/format";

function DashboardInner() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Studio[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);

  const load = useCallback(() => {
    api.get<{ studios: Studio[] }>("/api/studios/mine")
      .then((d) => setListings(d.studios))
      .catch(() => setListings([]));
    api.get<{ bookings: Booking[] }>("/api/bookings/mine")
      .then((d) => setBookings(d.bookings))
      .catch(() => setBookings([]));
    api.get<{ bookings: Booking[] }>("/api/bookings/host")
      .then((d) => setHostBookings(d.bookings))
      .catch(() => setHostBookings([]));
  }, []);

  useEffect(load, [load]);

  async function setBookingStatus(id: string, status: string) {
    try {
      await api.patch(`/api/bookings/${id}/status`, { status });
      toast.success(`Booking marked as ${status}.`);
      load();
    } catch (err: any) {
      toast.error(err?.message || "Could not update the booking.");
    }
  }

  const pending = bookings.filter((b) => b.status === "Pending").length;
  const upcoming = bookings.filter(
    (b) => b.status === "Confirmed" || b.status === "Pending"
  ).length;
  const earnings = listings.reduce((sum, s) => sum + s.hourlyRate, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="section-kicker">Overview</span>
      <h1 className="section-title mt-4">
        Welcome back, {user?.name.split(" ")[0]}
      </h1>
      <p className="section-sub">
        Your bookings, listings and host activity — all in one place.
      </p>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Upcoming shoots", value: upcoming, accent: "text-brand" },
          { label: "Pending requests", value: pending, accent: "text-warning" },
          { label: "My listings", value: listings.length, accent: "text-info" },
          { label: "Avg. rate", value: listings.length ? money(earnings / listings.length) + "/hr" : "—", accent: "text-success" },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-3">
              {stat.label}
            </p>
            <p className={`mt-2 text-3xl font-extrabold ${stat.accent}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/add-studio" className="btn-primary">+ Add New Studio</Link>
        <Link href="/my-listings" className="btn-secondary">My Listings</Link>
        <Link href="/my-bookings" className="btn-secondary">My Bookings</Link>
        <Link href="/wishlist" className="btn-secondary">Saved Studios</Link>
      </div>

      {/* Host incoming bookings — pending requests surface first */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-ink">
          Booking requests on your studios
        </h2>
        {hostBookings.length === 0 ? (
          <p className="mt-3 text-sm text-ink-3">
            No booking requests yet. Keep your listing photos fresh to attract
            more creators.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {[...hostBookings]
              .sort((a, b) => {
                const rank = (s: string) =>
                  s === "Pending" ? 0 : s === "Confirmed" ? 1 : 2;
                return rank(a.status) - rank(b.status);
              })
              .slice(0, 8)
              .map((b) => (
              <div key={b._id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-bold text-ink">{b.studioTitle}</p>
                    <span className={`badge ${statusClasses(b.status)}`}>{b.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-2">
                    {b.userName} ({b.userEmail}) · {prettyDate(b.date)} ·{" "}
                    {prettyTime(b.startTime)}–{prettyTime(b.endTime)} ·{" "}
                    <strong>{money(b.totalPrice)}</strong>
                  </p>
                </div>
                {b.status === "Pending" && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingStatus(b._id, "Confirmed")}
                      className="btn-primary btn-sm"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingStatus(b._id, "Cancelled")}
                      className="btn-danger btn-sm"
                    >
                      Decline
                    </button>
                  </div>
                )}
                {b.status === "Confirmed" && (
                  <button
                    type="button"
                    onClick={() => setBookingStatus(b._id, "Completed")}
                    className="btn-secondary btn-sm shrink-0"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent guest bookings */}
      <section className="mt-12 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Your recent bookings</h2>
          <Link href="/my-bookings" className="text-sm font-bold text-brand hover:underline">
            View all
          </Link>
        </div>
        {bookings.length === 0 ? (
          <p className="mt-3 text-sm text-ink-3">
            You haven&apos;t booked any studios yet —{" "}
            <Link href="/studios" className="font-bold text-brand hover:underline">
              explore the marketplace
            </Link>
            .
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <div key={b._id} className="card flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{b.studioTitle}</p>
                  <p className="mt-0.5 text-xs text-ink-3">
                    {prettyDate(b.date)} · {money(b.totalPrice)}
                  </p>
                </div>
                <span className={`badge ${statusClasses(b.status)}`}>{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardInner />
    </Protected>
  );
}
