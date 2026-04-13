// elite-jersey-land/components/AddToCartButton.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
  stock: string;
};

export default function AddToCartButton({ slug, stock }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    if (stock === "Out of Stock") {
      alert("This product is out of stock");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/cart/add-by-slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slug }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);

      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || stock === "Out of Stock"}
      className="w-full rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-2.5 text-center text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50 sm:text-sm"
    >
      {added
        ? "✓ Added"
        : loading
          ? "Adding..."
          : stock === "Out of Stock"
            ? "Out of Stock"
            : "Add to Cart"}
    </button>
  );
}