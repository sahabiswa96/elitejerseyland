// elite-jersey-land/components/home/HomeProductShowcase.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  mainImage: string;
  stock: number;
  category: string;
  team?: string | null;
};

const INITIAL_VISIBLE = 10;

export default function HomeProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("HOME_PRODUCTS_ERROR", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const gridProducts = products.slice(0, INITIAL_VISIBLE);
  const marqueeProducts = [...gridProducts, ...gridProducts];

  if (loading) {
    return (
      <section className="container py-8 md:py-12">
        <div className="rounded-2xl border border-[rgba(201,149,0,0.14)] bg-white p-10 text-center text-[#7a6641]">
          Loading products...
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="container py-8 md:py-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
            Featured Products
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#2b2112] md:text-3xl">
            Premium Jersey Collection
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7a6641]">
            A premium moving showcase followed by a clean product grid for a better
            home browsing experience.
          </p>
        </div>

        <Link
          href="/catalog"
          className="hidden rounded-full border border-[rgba(201,149,0,0.14)] bg-white px-4 py-2 text-sm font-semibold text-[#a87400] transition hover:border-[rgba(201,149,0,0.3)] md:inline-flex"
        >
          View All
        </Link>
      </div>

      {/* CAROUSEL */}
      {marqueeProducts.length > 0 && (
        <div className="overflow-hidden rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white shadow-[0_16px_40px_rgba(201,149,0,0.06)] py-5">
          <div className="home-product-marquee">
            <div className="home-product-track">
              {marqueeProducts.map((product, index) => (
                <Link
                  key={`${product.id}-${index}`}
                  href={`/catalog/${product.slug}`}
                  className="group mx-2 w-[220px] shrink-0 overflow-hidden rounded-[22px] border border-[rgba(201,149,0,0.14)] bg-white transition duration-300 hover:-translate-y-1 hover:border-[rgba(201,149,0,0.32)] hover:shadow-[0_18px_40px_rgba(201,149,0,0.08)] sm:mx-3 sm:w-[230px]"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.mainImage || "/images/default-product.webp"}
                      alt={product.name}
                      className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold ${
                        product.stock > 0
                          ? "bg-[#fff6df] text-[#a87400]"
                          : "bg-[#fee2e2] text-[#dc2626]"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#9b8b6f] sm:text-[11px]">
                      {product.team || product.category}
                    </p>
                    <h3 className="mt-2 line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-[#2b2112] sm:text-base">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-base font-bold text-[#c99500] sm:text-lg">
                      ₹{product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NORMAL GRID */}
      {gridProducts.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {gridProducts.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-[22px] border border-[rgba(201,149,0,0.14)] bg-white shadow-[0_10px_30px_rgba(201,149,0,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(201,149,0,0.32)] hover:shadow-[0_20px_45px_rgba(201,149,0,0.1)]"
            >
              <div
                onClick={() => {
                  if (window.innerWidth < 1280) {
                    window.location.href = `/catalog/${product.slug}`;
                  }
                }}
                className="relative overflow-hidden cursor-pointer xl:cursor-default"
              >
                <img
                  src={product.mainImage || "/images/default-product.webp"}
                  alt={product.name}
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold ${
                    product.stock > 0
                      ? "bg-[#fff6df] text-[#a87400]"
                      : "bg-[#fee2e2] text-[#dc2626]"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9b8b6f] sm:text-[11px]">
                  {product.team || product.category}
                </p>
                <h3 className="mt-2 line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-[#2b2112] sm:text-base">
                  {product.name}
                </h3>
                <p className="mt-3 text-base font-bold text-[#c99500] sm:text-lg">
                  ₹{product.price.toFixed(2)}
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href={`/catalog/${product.slug}`}
                    className="w-full rounded-xl border border-[rgba(201,149,0,0.16)] bg-[#fffdf7] px-4 py-2.5 text-center text-xs font-semibold text-[#2b2112] transition hover:border-[rgba(201,149,0,0.32)] hover:text-[#a87400] sm:text-sm"
                  >
                    View
                  </Link>

                  <AddToCartButton
                    slug={product.slug}
                    stock={product.stock > 0 ? "In Stock" : "Out of Stock"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length > INITIAL_VISIBLE && (
        <div className="mt-8 flex justify-center">
          <Link href="/catalog" className="load-more-btn">
            View All Products
          </Link>
        </div>
      )}
    </section>
  );
}