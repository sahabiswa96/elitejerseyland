"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

type SearchProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  mainImage: string;
  category?: string | null;
  team?: string | null;
};

type Props = {
  initialQuery: string;
};

export default function SearchResultsClient({ initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    setQuery(initialQuery);
    setSubmittedQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    async function loadProducts() {
      if (!submittedQuery.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(submittedQuery)}`,
          {
            cache: "no-store",
          }
        );

        const data = await res.json();
        const items: SearchProduct[] = data.products || [];

        setProducts(items);
      } catch (error) {
        console.error("SEARCH_PAGE_LOAD_ERROR", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [submittedQuery]);

  const sortedProducts = useMemo(() => {
    const copied = [...products];

    if (sortBy === "price-low-high") {
      copied.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      copied.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-a-z") {
      copied.sort((a, b) => a.name.localeCompare(b.name));
    }

    return copied;
  }, [products, sortBy]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmittedQuery(query.trim());

    const url = new URL(window.location.href);
    if (query.trim()) {
      url.searchParams.set("q", query.trim());
    } else {
      url.searchParams.delete("q");
    }

    window.history.replaceState({}, "", url.toString());
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[28px] border border-[#ece6d8] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a87400]">
            Product Search
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#2b2112] sm:text-3xl">
            Search Results
          </h1>

          <p className="mt-2 text-sm text-[#7a6641]">
            Find jerseys, clubs, teams and more.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="flex flex-1 items-center gap-3 rounded-full border border-[#ece6d8] bg-[#f8f6f1] px-4">
              <Search size={18} className="shrink-0 text-[#a87400]" />
              <input
                type="text"
                placeholder="Search jerseys, teams, clubs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-[52px] w-full bg-transparent text-[15px] text-[#2b2112] outline-none placeholder:text-[#8e7d5f]"
              />
              <button
                type="submit"
                className="rounded-full bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Search
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#ece6d8] bg-[#f8f6f1] px-4">
              <SlidersHorizontal size={16} className="text-[#a87400]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-[52px] bg-transparent pr-2 text-sm text-[#2b2112] outline-none"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
              </select>
            </div>
          </form>
        </div>

        <div className="mt-6">
          {submittedQuery ? (
            <p className="text-sm text-[#6f6250]">
              Results for:
              <span className="ml-2 font-semibold text-[#2b2112]">
                {submittedQuery}
              </span>
            </p>
          ) : (
            <p className="text-sm text-[#6f6250]">
              Enter something to search products.
            </p>
          )}
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[24px] border border-[#ece6d8] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
              >
                <div className="aspect-[4/4.2] animate-pulse rounded-[18px] bg-[#efe9dc]" />
                <div className="mt-4 h-4 animate-pulse rounded bg-[#efe9dc]" />
                <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-[#efe9dc]" />
                <div className="mt-4 h-5 w-24 animate-pulse rounded bg-[#efe9dc]" />
              </div>
            ))}
          </div>
        ) : !submittedQuery ? (
          <div className="mt-6 rounded-[24px] border border-[#ece6d8] bg-white px-6 py-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
            <p className="text-lg font-semibold text-[#2b2112]">
              Start your search
            </p>
            <p className="mt-2 text-sm text-[#7a6641]">
              Search by team name, club, category, or jersey title.
            </p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-[#ece6d8] bg-white px-6 py-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
            <p className="text-lg font-semibold text-[#2b2112]">
              No products found
            </p>
            <p className="mt-2 text-sm text-[#7a6641]">
              Try a different keyword or browse the catalog.
            </p>

            <Link
              href="/catalog"
              className="mt-5 inline-flex rounded-full bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-[#6f6250]">
                <span className="font-semibold text-[#2b2112]">
                  {sortedProducts.length}
                </span>{" "}
                product{sortedProducts.length > 1 ? "s" : ""} found
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {sortedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/catalog/${product.slug}`}
                  className="group overflow-hidden rounded-[24px] border border-[#ece6d8] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(0,0,0,0.08)]"
                >
                  <div className="overflow-hidden rounded-[18px] bg-[#f3efe6]">
                    <img
                      src={product.mainImage || "/images/default-product.webp"}
                      alt={product.name}
                      className="aspect-[4/4.2] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="pt-4">
                    <p className="line-clamp-1 text-base font-semibold text-[#2b2112]">
                      {product.name}
                    </p>

                    <p className="mt-1 line-clamp-1 text-sm text-[#7a6641]">
                      {product.team || product.category || "Elite Jersey"}
                    </p>

                    <p className="mt-3 text-lg font-bold text-[#c99500]">
                      ₹{product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}