import Link from "next/link";
import HeroSliderLazy from "@/components/HeroSliderLazy";
import FeaturedStudios from "@/components/FeaturedStudios";
import { CATEGORY_CARDS } from "@/lib/types";
import { StarIcon, PinIcon } from "@/components/icons";

const STEPS = [
  {
    n: "01",
    title: "Discover Spaces",
    text: "Filter verified photo studios, sound stages and podcast rooms by category, location and hourly rate.",
  },
  {
    n: "02",
    title: "Select Shoot Hours",
    text: "Check live availability down to the hour — see exactly which slots are open before you commit.",
  },
  {
    n: "03",
    title: "Book Instantly",
    text: "Reserve in one tap with transparent pricing. Your host confirms, and the slot is locked for you.",
  },
  {
    n: "04",
    title: "Create & Produce",
    text: "Show up, plug in and make the work. Liability protection and 24/7 support have your back.",
  },
];

const GUARANTEES = [
  {
    title: "Liability Protection",
    text: "Every booking includes platform liability coverage up to $25,000 for equipment and property damage.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Verified Profiles",
    text: "Hosts and guests verify government ID and payment details, so everyone in the room is who they say they are.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: "Equipment Safety",
    text: "Deposit-backed bookings and verified gear lists keep consoles, lighting and lenses exactly as you found them.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
    ),
  },
  {
    title: "24/7 Host Support",
    text: "Real humans on call around the clock — from first inquiry to wrap, wherever you're shooting.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSliderLazy />

      {/* ---------- Featured Studios ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-kicker">
              <StarIcon size={11} /> Top Rated & Newest
            </span>
            <h2 className="section-title mt-4">Featured Studios</h2>
            <p className="section-sub">
              Hand-picked spaces from verified hosts — the six highest rated and
              most recently listed studios on StudioSpace.
            </p>
          </div>
          <Link href="/studios" className="btn-secondary">
            View All Studios
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="mt-10">
          <FeaturedStudios />
        </div>
      </section>

      {/* ---------- Browse by Category ---------- */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="section-kicker">Find Your Room</span>
          <h2 className="section-title mt-4">Browse by Studio Category</h2>
          <p className="section-sub">
            Every discipline needs the right room. Pick a category and we&apos;ll
            filter the marketplace for you.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.name}
                href={`/studios?category=${encodeURIComponent(cat.query)}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-base font-bold text-white">{cat.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/75">
                    {cat.blurb}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    Explore
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How Booking Works ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <span className="section-kicker">The Workflow</span>
        <h2 className="section-title mt-4">How Booking Works</h2>
        <p className="section-sub">
          From first search to final cut — four steps between you and the
          perfect room.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.n} className="card relative p-6">
              <span className="text-4xl font-extrabold text-brand-soft">
                {step.n}
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{step.text}</p>
              {i < STEPS.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-ink-3 lg:flex">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Host Guarantee & Creator Support ---------- */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <span className="section-kicker">Peace of Mind</span>
              <h2 className="section-title mt-4">
                Host Guarantee &amp; Creator Support
              </h2>
              <p className="section-sub">
                Renting out your gear-filled space — or walking into someone
                else&apos;s — shouldn&apos;t feel like a gamble. StudioSpace backs
                every booking with real protection and real people.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {GUARANTEES.map((g) => (
                  <div key={g.title} className="rounded-2xl border border-border bg-background p-5">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                      {g.icon}
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-ink">{g.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
                      {g.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual + stat strip */}
            <div className="relative overflow-hidden rounded-3xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
                alt="Creators collaborating in a professional studio"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 divide-x divide-white/15 bg-black/70 backdrop-blur">
                {[
                  { value: "$25K", label: "Liability cover" },
                  { value: "24/7", label: "Host support" },
                  { value: "100%", label: "Verified profiles" },
                ].map((stat) => (
                  <div key={stat.label} className="px-4 py-5 text-center">
                    <p className="text-xl font-extrabold text-white sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/70">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA banner ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand to-[#b45309] px-8 py-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your empty studio is someone&apos;s dream set
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85">
            List your space in under ten minutes and start earning from the
            hours you&apos;re not shooting.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/add-studio"
              className="btn border border-white/30 bg-white px-7 py-3 text-base font-bold text-brand-strong hover:bg-white/90"
            >
              Become a Host
            </Link>
            <Link
              href="/studios"
              className="btn border border-white/40 px-7 py-3 text-base text-white hover:bg-white/10"
            >
              <PinIcon size={15} /> Browse Studios
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
