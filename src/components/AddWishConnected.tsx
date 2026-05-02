"use client";

import { useState } from "react";
import { AddWishForm } from "@/components/AddWishForm";
import { addWish } from "@/app/actions/wish";
import type { WishFormValues } from "@/lib/wish-schema";

export function AddWishConnected() {
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: WishFormValues, _image: File | null) => {
    setError(null);

    const result = await addWish({
      title: values.title,
      url: values.url || undefined,
      price:
        values.price == null || Number.isNaN(values.price) ? null : values.price,
      priority: values.priority,
      note: values.note || undefined,
      imageUrl: null,
    });

    if (!result.ok) {
      setError(result.message);
      throw new Error(result.message);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <AddWishForm onSubmit={onSubmit} />
      {error && (
        <p className="rounded-2xl bg-accent-soft/50 px-3 py-2 text-xs text-accent">{error}</p>
      )}
    </div>
  );
}
