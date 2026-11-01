"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Modal from "./Modal";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Studio, Booking } from "@/lib/types";
import { money, hoursBetween } from "@/lib/format";
import { PinIcon, StarIcon } from "./icons";

/**
 * Booking dialog — picks date + time window, shows live price math,
 * and posts to /api/bookings (which rejects double-bookings server-side).
 */
export default function BookingModal({
  studio,
  open,
  onClose,
}: {
  studio: Studio;
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("13:00");
  const [busy, setBusy] = useState(false);

  const hours = hoursBetween(startTime, endTime);
  const valid = hours > 0;
  const total = valid ? hours * studio.hourlyRate + studio.securityDeposit : 0;

  async function confirmBooking() {
    if (!user) {
      toast.info("Log in to reserve this studio.");
      onClose();
      router.push(`/login?next=${encodeURIComponent(`/studios/${studio._id}`)}`);
      return;
    }
    if (!valid) {
      toast.error("End time must be after start time.");
      return;
    }

    setBusy(true);
    try {
      const data = await api.post<{ booking: Booking; message: string }>(
        "/api/bookings",
        {
          studioId: studio._id,
          date,
          startTime,
          endTime,
          hours,
          totalPrice: total,
        }
      );
      toast.success(data.message || "Booking request sent!");
      onClose();
      router.push("/my-bookings");
    } catch (err) {
      // Challenge 2 surfaces here: 409 from the overlap check
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Booking failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Book Workspace Now">
      {/* Studio summary */}
      <div className="flex gap-3 rounded-2xl border border-border bg-surface-2 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.image}
          alt={studio.title}
          className="h-20 w-28 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <h4 className="truncate text-sm font-bold text-ink">{studio.title}</h4>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-3">
            <PinIcon size={12} /> {studio.location}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-gold">
            <StarIcon size={11} /> {studio.rating.toFixed(1)} · {money(studio.hourlyRate)}/hr
          </p>
        </div>
      </div>

      {/* Date + time */}
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="booking-date" className="field-label">
            Shoot date
          </label>
          <input
            id="booking-date"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="start" className="field-label">
              Start time
            </label>
            <input
              id="start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="end" className="field-label">
              End time
            </label>
            <input
              id="end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="input"
            />
          </div>
        </div>
        {!valid && (
          <p className="text-xs font-semibold text-danger">
            End time must be after start time.
          </p>
        )}
      </div>

      {/* Price breakdown */}
      <div className="mt-5 space-y-2 rounded-2xl border border-border bg-surface-2 p-4 text-sm">
        <div className="flex justify-between text-ink-2">
          <span>
            {money(studio.hourlyRate)} × {valid ? hours : 0}{" "}
            {hours === 1 ? "hour" : "hours"}
          </span>
          <span>{money(valid ? hours * studio.hourlyRate : 0)}</span>
        </div>
        <div className="flex justify-between text-ink-2">
          <span>Security deposit (refunded)</span>
          <span>{money(studio.securityDeposit)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-extrabold text-ink">
          <span>Total</span>
          <span>{money(total)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
        <button
          type="button"
          onClick={confirmBooking}
          disabled={busy || !valid}
          className="btn-primary flex-1"
        >
          {busy ? "Reserving…" : "Confirm Booking"}
        </button>
        <button type="button" onClick={onClose} className="btn-secondary flex-1">
          Keep Browsing
        </button>
      </div>

      <p className="mt-3 text-center text-[11px] text-ink-3">
        Your booking is saved as <strong>Pending</strong> until the host confirms
        the slot.
      </p>
    </Modal>
  );
}
