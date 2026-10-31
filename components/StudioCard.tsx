import Link from "next/link";
import { Studio } from "@/lib/types";
import { money } from "@/lib/format";
import { PinIcon, StarIcon } from "./icons";
import WishlistButton from "./WishlistButton";

/** Category badge color mapping — reused on every listing surface. */
export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="badge border border-border bg-surface/90 text-[10px] uppercase tracking-wider text-ink-2 backdrop-blur">
      {category}
    </span>
  );
}

export default function StudioCard({
  studio,
  saved = false,
}: {
  studio: Studio;
  saved?: boolean;
}) {
  return (
    <article className="card-hover group flex h-full flex-col overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.image}
          alt={studio.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <CategoryBadge category={studio.category} />
          <WishlistButton studioId={studio._id} initialSaved={saved} />
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-bold text-ink backdrop-blur">
          <StarIcon size={12} />
          {studio.rating.toFixed(1)}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-bold text-ink transition-colors group-hover:text-brand">
          {studio.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-3">
          <PinIcon size={13} />
          <span className="line-clamp-1">{studio.location}</span>
        </p>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-2">
          {studio.overview}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <p className="text-lg font-extrabold text-ink">
            {money(studio.hourlyRate)}
            <span className="text-xs font-medium text-ink-3"> / hr</span>
          </p>
          <Link href={`/studios/${studio._id}`} className="btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
