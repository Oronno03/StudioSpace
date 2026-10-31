"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { Logo, MoonIcon, SunIcon, HeartIcon } from "./icons";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-brand hover:text-brand"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the profile dropdown on outside click / route change
  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    try {
      await logout();
      toast.success("Signed out — see you soon!");
      router.push("/");
    } catch {
      toast.error("Could not sign out. Please try again.");
    }
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group" aria-label="StudioSpace home">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-brand"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-4 -bottom-[1px] h-[2px] rounded-full bg-brand" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {loading ? (
            <div className="skeleton h-9 w-24 rounded-full" aria-label="Loading account" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/wishlist"
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-brand hover:text-brand sm:flex"
                aria-label="Saved studios"
              >
                <HeartIcon size={16} />
              </Link>

              {/* Profile dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 transition-colors hover:border-brand"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.photoURL || "https://i.pravatar.cc/80?img=15"}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden max-w-[110px] truncate text-sm font-semibold text-ink md:block">
                    {user.name.split(" ")[0]}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={`text-ink-3 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/20"
                  >
                    <div className="border-b border-border px-4 py-3">
                      <p className="truncate text-sm font-bold text-ink">{user.name}</p>
                      <p className="truncate text-xs text-ink-3">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      {[
                        { href: "/dashboard", label: "Dashboard" },
                        { href: "/add-studio", label: "Add New Studio" },
                        { href: "/my-listings", label: "My Studio Listings" },
                        { href: "/my-bookings", label: "My Bookings" },
                        { href: "/wishlist", label: "Saved Studios" },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          className="block rounded-xl px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        type="button"
                        onClick={handleLogout}
                        role="menuitem"
                        className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-danger transition-colors hover:bg-danger-soft"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <nav
          className="border-t border-border bg-surface px-4 py-3 lg:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  isActive(link.href) ? "bg-brand-soft text-brand" : "text-ink-2"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            {user ? (
              <>
                <Link href="/dashboard" className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2">Dashboard</Link>
                <Link href="/add-studio" className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2">Add New Studio</Link>
                <Link href="/my-listings" className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2">My Studio Listings</Link>
                <Link href="/my-bookings" className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2">My Bookings</Link>
                <Link href="/wishlist" className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2">Saved Studios</Link>
                <button
                  onClick={handleLogout}
                  className="mt-1 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-danger"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-1 pt-1">
                <Link href="/login" className="btn-secondary flex-1">Login</Link>
                <Link href="/register" className="btn-primary flex-1">Register</Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
