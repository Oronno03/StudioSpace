"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Protected from "@/components/Protected";
import { RowSkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import { api } from "@/lib/api";
import { Booking, BookingStatus } from "@/lib/types";
import { money, prettyDate, prettyTime, statusClasses } from "@/lib/format";
import { PinIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth-context";

// jsPDF is heavy — only load it when a receipt is actually requested.
const downloadInvoice = (booking: Booking, name: string) =>
  import("@/lib/invoice").then((m) => m.default(booking, name));

const STATUS_FILTERS: Array<{ value: BookingStatus | "All"; label: string }> = [
  { value: "All", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

function MyBookingsInner() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [filter, setFilter] = useState<BookingStatus | "All">("All");
  const [toCancel, setToCancel] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(() => {
    api
      .get<{ bookings: Booking[] }>("/api/bookings/mine")
      .then((data) => setBookings(data.bookings))
      .catch((err) => {
        toast.error(err?.message || "Could not load your bookings.");
        setBookings([]);
      });
  }, []);

  useEffect(load, [load]);

  async function confirmCancel() {
    if (!toCancel) return;
    setCancelling(true);
    try {
      await api.patch(`/api/bookings/${toCancel._id}/status`, {
        status: "Cancelled",
      });
      toast.success("Booking cancelled.");
      setToCancel(null);
      load();
    } catch (err: any) {
      toast.error(err?.message || "Could not cancel the booking.");
    } finally {
      setCancelling(false);
    }
  }

  const visible =
    bookings?.filter((b) => filter === "All" || b.status === filter) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Guest Dashboard</span>
          <h1 className="section-title mt-4">My Bookings</h1>
          <p className="section-sub">
            Every studio you&apos;ve reserved — track host confirmations,
            download invoices, or cancel pending slots.
          </p>
        </div>
        <Link href="/studios" className="btn-secondary">
          Book another studio
        </Link>
      </div>

      {/* Status filter chips */}
      <div className="mt-8 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`badge border px-3.5 py-1.5 transition-colors ${
              filter === f.value
                ? "border-brand bg-brand-soft text-brand"
                : "border-border text-ink-2 hover:border-brand hover:text-brand"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 pb-6">
        {bookings === null ? (
          <RowSkeleton count={3} />
        ) : visible.length === 0 ? (
          <EmptyState
            title={
              bookings.length === 0
                ? "No bookings yet"
                : `No ${filter.toLowerCase()} bookings`
            }
            message={
              bookings.length === 0
                ? "Your first studio is a few clicks away — explore the marketplace and reserve your hours."
                : "Bookings with this status will appear here."
            }
            actionLabel="Explore Studios"
            actionHref="/studios"
          />
        ) : (
          <div className="space-y-4">
            {visible.map((booking) => (
              <div
                key={booking._id}
                className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.studioImage || "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=400&q=80"}
                  alt={booking.studioTitle}
                  className="h-28 w-full rounded-xl object-cover sm:h-20 sm:w-32"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="truncate font-bold text-ink hover:text-brand"
                    >
                      {booking.studioTitle}
                    </Link>
                    <span className={`badge ${statusClasses(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  {booking.studioLocation && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-3">
                      <PinIcon size={12} /> {booking.studioLocation}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-2">
                    <span>📅 {prettyDate(booking.date)}</span>
                    <span>
                      🕐 {prettyTime(booking.startTime)} – {prettyTime(booking.endTime)}
                    </span>
                    <span>{booking.hours} hr</span>
                    <span className="font-extrabold text-ink">
                      {money(booking.totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {(booking.status === "Confirmed" ||
                    booking.status === "Completed") && (
                    <button
                      type="button"
                      onClick={() =>
                        downloadInvoice(booking, user?.name || booking.userName)
                      }
                      className="btn-secondary btn-sm"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      Invoice PDF
                    </button>
                  )}
                  {booking.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => setToCancel(booking)}
                      className="btn-danger btn-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel confirmation modal */}
      <Modal
        open={!!toCancel}
        onClose={() => !cancelling && setToCancel(null)}
        title="Cancel this booking?"
        icon={
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-soft text-danger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </span>
        }
      >
        <p className="text-sm leading-relaxed text-ink-2">
          You&apos;re about to cancel{" "}
          <strong className="text-ink">{toCancel?.studioTitle}</strong> on{" "}
          <strong className="text-ink">
            {toCancel ? prettyDate(toCancel.date) : ""}
          </strong>{" "}
          ({toCancel ? prettyTime(toCancel.startTime) : ""} –{" "}
          {toCancel ? prettyTime(toCancel.endTime) : ""}). The slot will be
          released for other creators.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="button"
            onClick={confirmCancel}
            disabled={cancelling}
            className="btn-danger flex-1"
          >
            {cancelling ? "Cancelling…" : "Yes, cancel booking"}
          </button>
          <button
            type="button"
            onClick={() => setToCancel(null)}
            disabled={cancelling}
            className="btn-secondary flex-1"
          >
            Keep booking
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <Protected>
      <MyBookingsInner />
    </Protected>
  );
}
