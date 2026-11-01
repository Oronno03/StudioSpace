"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Protected from "@/components/Protected";
import StudioForm, {
  StudioFormValues,
  studioToValues,
} from "@/components/StudioForm";
import { DetailsSkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Studio } from "@/lib/types";

function EditStudioInner() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [values, setValues] = useState<StudioFormValues | null>(null);
  const [failed, setFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    api
      .get<{ studio: Studio }>(`/api/studios/${id}`)
      .then((data) => {
        if (!active) return;
        // Ownership guard — only the host may edit their listing
        if (
          user &&
          data.studio.ownerEmail.toLowerCase() !== user.email.toLowerCase()
        ) {
          setFailed(true);
          return;
        }
        setStudio(data.studio);
        setValues(studioToValues(data.studio));
      })
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [id, user]);

  async function submit(v: StudioFormValues) {
    setSubmitting(true);
    try {
      await api.patch(`/api/studios/${id}`, {
        title: v.title.trim(),
        category: v.category,
        hourlyRate: Number(v.hourlyRate),
        securityDeposit: Number(v.securityDeposit || 0),
        maxCapacity: Number(v.maxCapacity),
        location: v.location.trim(),
        image: v.image.trim(),
        amenities: v.amenities,
        overview: v.overview.trim(),
        hostPhone: v.hostPhone.trim(),
      });
      toast.success("Studio updated successfully.");
      router.push("/my-listings");
    } catch (err: any) {
      toast.error(err?.message || "Could not update the studio.");
    } finally {
      setSubmitting(false);
    }
  }

  if (failed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="You can't edit this studio"
          message="This listing belongs to another host, or it no longer exists."
          actionLabel="Back to My Listings"
          actionHref="/my-listings"
        />
      </div>
    );
  }

  if (!values || !studio) return <DetailsSkeleton />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="section-kicker">Edit Listing</span>
      <h1 className="section-title mt-4">{studio.title}</h1>
      <p className="section-sub">
        Update your studio&apos;s details — changes go live on the marketplace
        immediately.
      </p>

      <div className="card mt-8 p-6 sm:p-8">
        <StudioForm
          values={values}
          onChange={setValues}
          onSubmit={submit}
          submitting={submitting}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <Protected>
      <EditStudioInner />
    </Protected>
  );
}
