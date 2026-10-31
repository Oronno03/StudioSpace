"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1920&q=80",
    kicker: "Cinema Sound Stages",
    headline: "Roll camera on stages built for big ideas",
    subtext:
      "Grid-rigged sound stages, drive-in loading docks and 3-phase power — booked by the hour, insured by the platform.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1920&q=80",
    kicker: "Photo Studios",
    headline: "Chase perfect light, not expensive day rates",
    subtext:
      "Infinity cyc walls, daylight lofts and strobe packages from verified hosts in your city. Pay only for the hours you shoot.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1920&q=80",
    kicker: "Podcast & Music Rooms",
    headline: "Hit record in rooms that actually sound good",
    subtext:
      "Acoustically treated podcast lounges and tracking suites with broadcast mics and consoles, ready the moment you walk in.",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-[560px] w-full sm:h-[620px]"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.headline}>
            <div
              className="relative flex h-full w-full items-end bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Scrim for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />

              <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {slide.kicker}
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {slide.headline}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                  {slide.subtext}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/studios" className="btn-primary px-7 py-3 text-base">
                    Explore Studios
                  </Link>
                  <Link
                    href="/add-studio"
                    className="btn border border-white/35 bg-white/10 px-7 py-3 text-base text-white backdrop-blur hover:bg-white/20"
                  >
                    Host Your Space
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom fade into page background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
