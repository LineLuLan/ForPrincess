"use client";

import { useState } from "react";
import { AddWishForm } from "@/components/AddWishForm";
import { addWish } from "@/app/actions/wish";
import { compressAndUpload, type UploadStage } from "@/lib/image-upload";
import { useWishGrid } from "@/components/WishGrid";
import type { WishFormValues } from "@/lib/wish-schema";
import type { WishItem } from "@/types/wish";

export function AddWishConnected() {
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<UploadStage | null>(null);
  const grid = useWishGrid();

  const onSubmit = async (values: WishFormValues, image: File | null) => {
    setError(null);

    const tempId = `temp-${Date.now()}`;
    const previewUrl = image ? URL.createObjectURL(image) : null;

    const optimisticItem: WishItem = {
      id: tempId,
      title: values.title,
      url: values.url || null,
      image_url: previewUrl,
      price:
        values.price == null || Number.isNaN(values.price) ? null : values.price,
      currency: "VND",
      priority: values.priority,
      note: values.note || null,
      is_secretly_buying: false,
      is_gifted: false,
      gifted_at: null,
      gift_message: null,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    grid.optimisticAdd(optimisticItem);

    try {
      let imageUrl: string | null = null;
      if (image) {
        const upload = await compressAndUpload(image, { onStage: setStage });
        if (!upload.ok) {
          grid.optimisticRemove(tempId);
          setError(upload.message);
          throw new Error(upload.message);
        }
        imageUrl = upload.url;
      }

      const result = await addWish({
        title: values.title,
        url: values.url || undefined,
        price:
          values.price == null || Number.isNaN(values.price) ? null : values.price,
        priority: values.priority,
        note: values.note || undefined,
        imageUrl,
      });

      if (!result.ok) {
        grid.optimisticRemove(tempId);
        setError(result.message);
        throw new Error(result.message);
      }
    } finally {
      setStage(null);
      if (previewUrl) {
        setTimeout(() => URL.revokeObjectURL(previewUrl), 5000);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <AddWishForm onSubmit={onSubmit} stage={stage} />
      {error && (
        <p className="rounded-2xl bg-accent-soft/50 px-3 py-2 text-xs text-accent">{error}</p>
      )}
    </div>
  );
}
