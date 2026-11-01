"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Protected from "@/components/Protected";
import StudioForm, {
  StudioFormValues,
  emptyStudioValues,
} from "@/components/StudioForm";
import { api } from "@/lib/api";

function AddStudioInner() {
  const router = useRouter();
  const [values, setValues] = useState<StudioFormValues>(emptyStudioValues);
  const [submitting, setSubmitting] = useState(false);

  async function submit(v: StudioFormValues) {
    setSubmitting(true);
    try {
      const payload = {
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
      };
      await api.post("/api/studios", payload);
      toast.success("Studio listed! It's now live on the marketplace.");
      router.push("/my-listings");
    } catch (err: any) {
      toast.error(err?.message || "Could not save the studio.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="section-kicker">For Hosts</span>
      <h1 className="section-title mt-4">Add New Studio</h1>
      <p className="section-sub">
        Describe your space honestly — clear photos and specific amenity lists
        get booked up to 3× faster.
      </p>

      <div className="card mt-8 p-6 sm:p-8">
        <StudioForm
          values={values}
          onChange={setValues}
          onSubmit={submit}
          submitting={submitting}
          submitLabel="Publish Studio"
        />
      </div>
    </div>
  );
}

export default function AddStudioPage() {
  return (
    <Protected>
      <AddStudioInner />
    </Protected>
  );
}
