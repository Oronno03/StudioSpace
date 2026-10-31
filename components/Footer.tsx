import Link from "next/link";
import { Logo, XLogo, InstagramIcon, YoutubeIcon } from "./icons";
import { CATEGORY_CARDS } from "@/lib/types";
import NewsletterForm from "./NewsletterForm";
import CopyrightYear from "./CopyrightYear";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/add-studio", label: "Host Your Space" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + mission */}
          <div className="lg:col-span-1">
            <Link href="/" aria-label="StudioSpace home">
              <Logo />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ink-2">
              StudioSpace connects creators with professional studios — from cyc
              walls to sound stages — booked by the hour, insured by the
              platform, and run by fellow makers.
            </p>
            <div className="mt-5 flex items-center gap-2">
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
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-ink-3">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-2 transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-ink-3">
              Popular Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {CATEGORY_CARDS.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(cat.query)}`}
                    className="text-sm text-ink-2 transition-colors hover:text-brand"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-ink-3">
              Stay in the Loop
            </h3>
            <p className="mt-4 text-sm text-ink-2">
              New studios, lighting tips and host offers — once a month, no spam.
            </p>
            <NewsletterForm />
            <p className="mt-2 text-[11px] text-ink-3">
              By subscribing you agree to our terms & privacy notice.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-ink-3">
            © <CopyrightYear /> StudioSpace. All rights reserved.
          </p>
          <p className="text-xs text-ink-3">
            Terms of Service · Privacy Policy · Host Guarantee
          </p>
        </div>
      </div>
    </footer>
  );
}
