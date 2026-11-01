import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StudioSpace — Book Creative Studios by the Hour",
    template: "%s · StudioSpace",
  },
  description:
    "StudioSpace is a peer-to-peer marketplace where creators rent professional photo studios, sound stages, podcast lounges, music suites and art workshops by the hour.",
};

/** Prevents theme flash: applies saved theme before React hydrates. */
const themeScript = `
(function () {
  try {
    var t = localStorage.getItem('studiospace-theme');
    if (t !== 'light' && t !== 'dark') t = 'dark';
    if (t === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider />
            <div className="flex min-h-screen flex-col">
              {/* Navbar uses usePathname — Suspense lets dynamic routes prerender */}
              <Suspense fallback={<div className="h-[72px] border-b border-border" />}>
                <Navbar />
              </Suspense>
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
