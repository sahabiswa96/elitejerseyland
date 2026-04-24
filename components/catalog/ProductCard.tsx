"use client";

import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  category: string;
  subcategory?: string | null;
  team?: string | null;
  mainImage: string;
  stock: number;
  createdAt: string;
};

type ProductCardProps = {
  product: CatalogProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white shadow-[0_12px_30px_rgba(201,149,0,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(201,149,0,0.28)]">
      
      {/* Image Wrapper - Clickable on all devices */}
      <Link href={`/catalog/${product.slug}`} className="block overflow-hidden">
        <div className="relative overflow-hidden bg-[#fffaf0]">
          <img
            src={product.mainImage || "/images/default-product.webp"}
            alt={product.name}
            className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(43,33,18,0.20)] via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9b8b6f]">
          {product.team || product.category}
        </p>

        <h3 className="mt-2 line-clamp-2 min-h-[48px] text-[15px] font-semibold leading-6 text-[#2b2112]">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-base font-bold text-[#2b2112]">
            ₹{product.price.toFixed(2)}
          </span>

          {product.oldPrice ? (
            <span className="text-sm text-[#9b8b6f] line-through">
              ₹{product.oldPrice.toFixed(2)}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={`/catalog/${product.slug}`}
            className="w-full rounded-full border border-[rgba(201,149,0,0.16)] bg-white px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#2b2112] transition hover:border-[#c99500] hover:text-[#a87400]"
          >
            View
          </Link>

          <AddToCartButton
            slug={product.slug}
            stock={product.stock > 0 ? "In Stock" : "Out of Stock"}
          />
        </div>
      </div>
    </article>
  );
}