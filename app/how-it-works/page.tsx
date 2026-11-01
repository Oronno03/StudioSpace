import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How booking a studio on StudioSpace works — discover, select hours, book instantly and produce.",
};

const STEPS = [
  {
    n: "01",
    title: "Discover Spaces",
    text: "Browse hundreds of verified creative spaces — photo studios with cyc walls, cinema sound stages, treated podcast lounges, music tracking suites and mess-friendly art workshops. Filter by category, city and hourly rate until the shortlist feels right.",
    tip: "Use category chips on /studios and heart your favorites to build a shortlist.",
  },
  {
    n: "02",
    title: "Select Shoot Hours",
    text: "Every listing shows live hourly pricing, capacity and the gear included. Open the booking dialog, pick your date and drag the start/end times to match your call sheet — the price updates instantly as you adjust.",
    tip: "Book off-peak hours for the lowest rates; many hosts discount mornings.",
  },
  {
    n: "03",
    title: "Book Instantly",
    text: "Confirm and your slot is reserved. Our booking engine checks for time collisions against existing confirmed reservations, so double-booking is impossible. The host is notified right away and confirms from their dashboard.",
    tip: "You'll see a Pending badge until the host confirms — usually within hours.",
  },
  {
    n: "04",
    title: "Create & Produce",
    text: "Show up, plug in and make the work. Every booking includes platform liability protection, and 24/7 host support is one tap away if anything on set needs attention. When you wrap, download your PDF invoice straight from My Bookings.",
    tip: "Leave a review after wrapping — it helps the whole creator community.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="section-kicker">Booking Workflow</span>
        <h1 className="section-title mt-4">How Booking Works</h1>
        <p className="section-sub mx-auto text-center">
          Four steps between an idea and the room that makes it possible.
        </p>
      </div>

      <div className="mt-14 space-y-8">
        {STEPS.map((step, i) => (
          <div
            key={step.n}
            className={`card grid gap-6 p-7 sm:grid-cols-[auto_1fr] ${
              i % 2 === 1 ? "sm:[direction:rtl]" : ""
            }`}
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-2xl font-extrabold text-brand [direction:ltr]">
              {step.n}
            </div>
            <div className="[direction:ltr]">
              <h2 className="text-xl font-bold text-ink">{step.title}</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-2">{step.text}</p>
              <p className="mt-3 inline-flex items-start gap-2 rounded-xl bg-surface-2 px-3 py-2 text-xs font-medium text-ink-2">
                <svg className="mt-0.5 shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                {step.tip}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <p className="text-ink-2">Ready to find your room?</p>
        <Link href="/studios" className="btn-primary mt-4 px-8 py-3 text-base">
          Explore Studios
        </Link>
      </div>
    </div>
  );
}
