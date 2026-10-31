"use client";

import dynamic from "next/dynamic";

// Swiper's autoplay evaluates Date() during SSR/prerender, which conflicts
// with Next 16 cache components — so the slider mounts client-side only.
const HeroSlider = dynamic(() => import("./HeroSlider"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] w-full items-center justify-center bg-surface-2 sm:h-[620px]">
      <div className="aperture-spinner" />
    </div>
  ),
});

export default function HeroSliderLazy() {
  return <HeroSlider />;
}
