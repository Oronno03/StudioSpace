import Link from "next/link";
import type { Metadata } from "next";
import { XLogo, InstagramIcon, YoutubeIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "StudioSpace is a peer-to-peer marketplace where creators rent professional creative studios by the hour.",
};

const VALUES = [
  {
    title: "Rooms over rigs",
    text: "Most creators don't need to own a sound stage — they need affordable access to one. We built the access layer for the creative industry.",
  },
  {
    title: "Hosts are creators too",
    text: "Every host on StudioSpace is a working creative renting out idle hours. The platform fees stay small because the community runs on goodwill and clear rules.",
  },
  {
    title: "Transparent by default",
    text: "No surprise cleaning fees or hidden service charges. The price you see in the booking dialog — hourly rate plus refundable deposit — is the price you pay.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="section-kicker">Our Story</span>
        <h1 className="section-title mt-4">
          Built by creators who were tired of
          <br className="hidden sm:block" /> booking conference rooms to edit in
        </h1>
        <p className="section-sub mx-auto text-center">
          StudioSpace is a peer-to-peer marketplace for professional creative
          space — the studio-sharing network for filmmakers, photographers,
          podcasters, musicians and makers.
        </p>
      </div>

      {/* Hero image */}
      <div className="mt-12 overflow-hidden rounded-3xl border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80"
          alt="A creative team collaborating in a production studio"
          className="aspect-[21/9] w-full object-cover"
        />
      </div>

      {/* Story */}
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-ink">The problem we saw</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            Between us, our founding team booked more than 400 hours of studio
            time — and watched half of it evaporate into booking emails,
            mysterious cleaning fees and spaces that looked nothing like their
            photos. Meanwhile, studios sat empty between productions, quietly
            costing their owners thousands every month.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            StudioSpace connects those two problems directly. Hosts list idle
            studio hours with honest photos and amenity lists; creators discover
            them, check live availability and reserve by the hour — with
            liability protection, verified profiles and 24/7 support wrapping
            the whole exchange.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-ink">What we believe</h2>
          <div className="mt-4 space-y-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="text-sm font-bold text-ink">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats band */}
      <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { value: "5", label: "studio categories" },
          { value: "24/7", label: "host support" },
          { value: "$25K", label: "liability cover" },
          { value: "0%", label: "hidden fees" },
        ].map((stat) => (
          <div key={stat.label} className="card p-6 text-center">
            <p className="text-3xl font-extrabold text-brand">{stat.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-3">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 text-center">
        <p className="text-ink-2">
          Whether you&apos;re shooting a lookbook or launching a podcast, there
         &apos;s a room waiting for you.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/studios" className="btn-primary px-7 py-3">
            Explore Studios
          </Link>
          <Link href="/add-studio" className="btn-secondary px-7 py-3">
            Host Your Space
          </Link>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          {[
            { label: "StudioSpace on X", href: "https://x.com", Icon: XLogo },
            { label: "StudioSpace on Instagram", href: "https://instagram.com", Icon: InstagramIcon },
            { label: "StudioSpace on YouTube", href: "https://youtube.com", Icon: YoutubeIcon },
          ].map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-brand hover:text-brand"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
