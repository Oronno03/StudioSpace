"use client";

import { useState } from "react";
import { toast } from "sonner";
import { STUDIO_CATEGORIES, Studio } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

const AMENITY_OPTIONS = [
  "Wi-Fi",
  "Parking",
  "Green Room",
  "Makeup Station",
  "Cyc Wall",
  "Blackout Blinds",
  "Profoto Lighting",
  "Loading Dock",
  "Dressing Rooms",
  "3-Phase Power",
  "Acoustic Treatment",
  "Vocal Booth",
  "Kiln",
  "Natural Light",
  "Storage",
  "Coffee Bar",
];

export interface StudioFormValues {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  image: string;
  amenities: string[];
  overview: string;
  hostPhone: string;
}

export const emptyStudioValues: StudioFormValues = {
  title: "",
  category: STUDIO_CATEGORIES[0],
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  image: "",
  amenities: [],
  overview: "",
  hostPhone: "",
};

export function studioToValues(studio: Studio): StudioFormValues {
  return {
    title: studio.title,
    category: studio.category,
    hourlyRate: String(studio.hourlyRate),
    securityDeposit: String(studio.securityDeposit),
    maxCapacity: String(studio.maxCapacity),
    location: studio.location,
    image: studio.image,
    amenities: studio.amenities || [],
    overview: studio.overview,
    hostPhone: studio.hostPhone || "",
  };
}

/**
 * The single studio form used by /add-studio and /studios/edit/[id].
 * Image can be pasted as a URL or uploaded straight to imgbb (needs
 * NEXT_PUBLIC_IMGBB_API_KEY; otherwise upload is disabled with a hint).
 */
export default function StudioForm({
  values,
  onChange,
  onSubmit,
  submitting,
  submitLabel,
}: {
  values: StudioFormValues;
  onChange: (next: StudioFormValues) => void;
  onSubmit: (values: StudioFormValues) => Promise<void>;
  submitting: boolean;
  submitLabel: string;
}) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const set = <K extends keyof StudioFormValues>(key: K, v: StudioFormValues[K]) =>
    onChange({ ...values, [key]: v });

  function toggleAmenity(a: string) {
    set(
      "amenities",
      values.amenities.includes(a)
        ? values.amenities.filter((x) => x !== a)
        : [...values.amenities, a]
    );
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!imgbbKey) {
      toast.error(
        "Image upload needs an imgbb API key (.env.local) — paste an image URL instead."
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        { method: "POST", body }
      );
      const data = await res.json();
      if (!res.ok || !data?.data?.url) {
        throw new Error(data?.error?.message || "Upload failed");
      }
      set("image", data.data.url);
      toast.success("Image uploaded to imgbb.");
    } catch (err: any) {
      toast.error(err?.message || "Could not upload the image.");
    } finally {
      setUploading(false);
    }
  }

  function validate(): string | null {
    if (values.title.trim().length < 4) return "Title must be at least 4 characters.";
    if (!values.category) return "Please choose a category.";
    if (values.hourlyRate === "" || Number(values.hourlyRate) <= 0)
      return "Hourly rate must be a positive number.";
    if (values.maxCapacity === "" || Number(values.maxCapacity) < 1)
      return "Max capacity must be at least 1.";
    if (values.location.trim().length < 3) return "Please add a location.";
    if (!/^https?:\/\//.test(values.image.trim()))
      return "Image must be a valid URL (https://…).";
    if (values.overview.trim().length < 30)
      return "Overview must be at least 30 characters — tell creators about the space.";
    return null;
  }

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const error = validate();
        if (error) {
          toast.error(error);
          return;
        }
        await onSubmit(values);
      }}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="field-label">Studio Title *</label>
            <input
              id="title"
              type="text"
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Lumina Cyc Wall Studio"
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="field-label">Category *</label>
              <select
                id="category"
                value={values.category}
                onChange={(e) => set("category", e.target.value)}
                className="input"
              >
                {STUDIO_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="capacity" className="field-label">Max Capacity *</label>
              <input
                id="capacity"
                type="number"
                min={1}
                value={values.maxCapacity}
                onChange={(e) => set("maxCapacity", e.target.value)}
                placeholder="12"
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="rate" className="field-label">Hourly Rate ($) *</label>
              <input
                id="rate"
                type="number"
                min={1}
                value={values.hourlyRate}
                onChange={(e) => set("hourlyRate", e.target.value)}
                placeholder="65"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="deposit" className="field-label">Security Deposit ($)</label>
              <input
                id="deposit"
                type="number"
                min={0}
                value={values.securityDeposit}
                onChange={(e) => set("securityDeposit", e.target.value)}
                placeholder="100"
                className="input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="field-label">Location / Address *</label>
            <input
              id="location"
              type="text"
              value={values.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Bushwick, Brooklyn, NY"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="hostPhone" className="field-label">Host Contact Phone</label>
            <input
              id="hostPhone"
              type="tel"
              value={values.hostPhone}
              onChange={(e) => set("hostPhone", e.target.value)}
              placeholder="+1 (555) 010-2030"
              className="input"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div>
            <label htmlFor="image" className="field-label">Image URL *</label>
            <input
              id="image"
              type="url"
              value={values.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://images.unsplash.com/…"
              className="input"
            />
            <div className="mt-2 flex items-center gap-3">
              <label className="btn-secondary btn-sm cursor-pointer">
                {uploading ? "Uploading…" : "Or upload an image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
              {imgbbKey ? (
                <span className="text-[11px] text-ink-3">Powered by imgbb</span>
              ) : (
                <span className="text-[11px] text-ink-3">
                  (upload disabled — no imgbb key configured)
                </span>
              )}
            </div>
            {values.image && /^https?:\/\//.test(values.image) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.image}
                alt="Studio preview"
                className="mt-3 aspect-[16/9] w-full rounded-xl border border-border object-cover"
              />
            )}
          </div>

          <div>
            <label className="field-label">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => {
                const active = values.amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    aria-pressed={active}
                    className={`badge border px-3 py-1.5 transition-colors ${
                      active
                        ? "border-brand bg-brand-soft text-brand"
                        : "border-border text-ink-2 hover:border-brand hover:text-brand"
                    }`}
                  >
                    {active && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="overview" className="field-label">Detailed Overview *</label>
            <textarea
              id="overview"
              rows={5}
              value={values.overview}
              onChange={(e) => set("overview", e.target.value)}
              placeholder="Describe the room, the light, the gear included and what kinds of shoots it suits best…"
              className="input resize-y"
            />
            <p className="mt-1 text-[11px] text-ink-3">
              {values.overview.trim().length}/30 characters minimum
            </p>
          </div>
        </div>
      </div>

      {/* Read-only host info (spec requirement) */}
      <div className="grid gap-4 rounded-2xl border border-dashed border-border bg-surface-2 p-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Host Name (read-only)</label>
          <input
            type="text"
            value={user?.name || ""}
            readOnly
            className="input cursor-not-allowed opacity-70"
          />
        </div>
        <div>
          <label className="field-label">Host Email (read-only)</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="input cursor-not-allowed opacity-70"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="submit" disabled={submitting || uploading} className="btn-primary px-8 py-3">
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
