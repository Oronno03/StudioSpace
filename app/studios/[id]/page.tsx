"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Studio } from "@/lib/types";
import { money, prettyDate } from "@/lib/format";
import { DetailsSkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";
import BookingModal from "@/components/BookingModal";
import WishlistButton from "@/components/WishlistButton";
import { CategoryBadge } from "@/components/StudioCard";
import { PinIcon, StarIcon } from "@/components/icons";

function StudioDetails() {
  const { id } = useParams<{ id: string }>();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [failed, setFailed] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    api
      .get<{ studio: Studio }>(`/api/studios/${id}`)
      .then((data) => {
        if (!active) return;
        setStudio(data.studio);
        setActiveImage(0);
      })
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [id]);

  if (failed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="Studio not found"
          message="This listing may have been removed by its host, or the link is incorrect."
          actionLabel="Explore Studios"
          actionHref="/studios"
        />
      </div>
    );
  }

  if (!studio) return <DetailsSkeleton />;

  const images = [studio.image, ...(studio.gallery || [])].filter(Boolean);
  const current = images[Math.min(activeImage, images.length - 1)];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-3" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span>/</span>
        <Link href="/studios" className="hover:text-brand">Studios</Link>
        <span>/</span>
        <span className="truncate text-ink">{studio.title}</span>
      </nav>

      {/* Gallery */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl border border-border lg:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt={`${studio.title} — photo ${activeImage + 1}`}
            className="aspect-[16/9] w-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveImage((i) => (i - 1 + images.length) % images.length)
                }
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-brand"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-brand"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
              <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                {Math.min(activeImage + 1, images.length)} / {images.length}
              </span>
            </>
          )}
        </div>
        <div className="grid grid-cols-4 gap-3 lg:grid-cols-1 lg:grid-rows-4">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActiveImage(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`overflow-hidden rounded-2xl border-2 transition-colors ${
                i === activeImage ? "border-brand" : "border-transparent hover:border-border"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt=""
                className={`h-full w-full object-cover ${i === activeImage ? "opacity-100" : "opacity-80"}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        {/* ---------- Main column ---------- */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={studio.category} />
                <span className="badge bg-warning-soft text-warning">
                  <StarIcon size={11} /> {studio.rating.toFixed(1)} · {studio.reviews.length} review{studio.reviews.length === 1 ? "" : "s"}
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {studio.title}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-2">
                <PinIcon size={15} /> {studio.location}
              </p>
            </div>
            <WishlistButton studioId={studio._id} className="h-11 w-11" />
          </div>

          {/* Overview */}
          <section className="mt-8">
            <h2 className="text-lg font-bold text-ink">About this studio</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink-2">
              {studio.overview}
            </p>
          </section>

          {/* Amenities */}
          <section className="mt-8">
            <h2 className="text-lg font-bold text-ink">Amenities</h2>
            {studio.amenities.length === 0 ? (
              <p className="mt-3 text-sm text-ink-3">No amenities listed.</p>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {studio.amenities.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm font-medium text-ink-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {a}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Reviews */}
          <section className="mt-10">
            <h2 className="text-lg font-bold text-ink">
              Reviews{" "}
              <span className="text-sm font-medium text-ink-3">
                ({studio.reviews.length})
              </span>
            </h2>
            {studio.reviews.length === 0 ? (
              <p className="mt-3 text-sm text-ink-3">
                No reviews yet — be the first to book and leave one.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {studio.reviews.map((review) => (
                  <div key={review._id} className="card p-5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={review.avatar || "https://i.pravatar.cc/80?img=5"}
                        alt={review.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-ink">{review.name}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <StarIcon key={i} size={11} filled={i < review.rating} />
                            ))}
                          </span>
                          <span className="text-[11px] text-ink-3">
                            {prettyDate(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ---------- Booking sidebar ---------- */}
        <aside>
          <div className="card sticky top-24 p-6">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-extrabold text-ink">
                {money(studio.hourlyRate)}
                <span className="text-sm font-medium text-ink-3"> / hour</span>
              </p>
              <span className="badge bg-surface-2 text-ink-2">
                {money(studio.securityDeposit)} deposit
              </span>
            </div>

            <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-3">Max capacity</dt>
                <dd className="font-semibold text-ink">{studio.maxCapacity} people</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-3">Category</dt>
                <dd className="font-semibold text-ink">{studio.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-3">Response time</dt>
                <dd className="font-semibold text-ink">Within a few hours</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="btn-primary mt-6 w-full py-3 text-base"
            >
              Book Workspace Now
            </button>

            {/* Host card */}
            <div className="mt-6 rounded-2xl border border-border bg-surface-2 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3">
                Hosted by
              </p>
              <div className="mt-2.5 flex items-center gap-3">
                <span className="avatar-fallback h-10 w-10 text-sm">
                  {studio.ownerName.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">
                    {studio.ownerName}
                  </p>
                  <p className="truncate text-xs text-ink-3">{studio.ownerEmail}</p>
                </div>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-3">
                Verified StudioSpace host · Bookings protected by the Host
                Guarantee.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <BookingModal
        studio={studio}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}

export default function StudioDetailsPage() {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <StudioDetails />
    </Suspense>
  );
}
