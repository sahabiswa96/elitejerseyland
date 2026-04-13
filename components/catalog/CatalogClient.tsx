"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard, { type CatalogProduct } from "@/components/catalog/ProductCard";

const INITIAL_VISIBLE = 10;
const LOAD_MORE_COUNT = 5;

type CatalogClientProps = {
  heading?: string;
  subheading?: string;
  lockedCategory?: string;
  lockedSubcategory?: string;
};

export default function CatalogClient({
  heading = "A premium catalog curated for modern football culture.",
  subheading = "Explore elevated jersey collections with a sober luxury feel. Carefully organized, visually refined, and designed to keep the focus on the product.",
  lockedCategory,
  lockedSubcategory,
}: CatalogClientProps) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (lockedCategory) params.set("category", lockedCategory);
        if (lockedSubcategory) params.set("subcategory", lockedSubcategory);

        const res = await fetch(`/api/products?${params.toString()}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (isMounted) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("CATALOG_LOAD_ERROR", error);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [lockedCategory, lockedSubcategory]);

  const teams = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((p) => p.team).filter(Boolean))
    ) as string[];

    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          (product.team || "").toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          (product.subcategory || "").toLowerCase().includes(q)
      );
    }

    if (teamFilter !== "All") {
      list = list.filter((product) => product.team === teamFilter);
    }

    if (priceFilter === "under-900") {
      list = list.filter((product) => product.price < 900);
    } else if (priceFilter === "900-1100") {
      list = list.filter(
        (product) => product.price >= 900 && product.price <= 1100
      );
    } else if (priceFilter === "1100-plus") {
      list = list.filter((product) => product.price > 1100);
    }

    if (sortBy === "low-high") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-low") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return list;
  }, [products, search, teamFilter, priceFilter, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  };

  const handleResetFilters = () => {
    setSearch("");
    setTeamFilter("All");
    setPriceFilter("All");
    setSortBy("default");
    setVisibleCount(INITIAL_VISIBLE);
  };

  return (
    <section className="pb-16">
      <div className="relative mb-10 overflow-hidden rounded-[32px] border border-[rgba(201,149,0,0.14)] bg-white/80 shadow-[0_20px_60px_rgba(201,149,0,0.08)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,149,0,0.12),transparent_28%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,149,0,0.05),transparent_22%)]" />

        <div className="relative grid gap-8 px-5 py-6 sm:px-6 md:px-10 md:py-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-start 2xl:px-12">
          <div className="xl:pr-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a87400]">
              Elite Jersey Land
            </p>

            <h1 className="max-w-3xl text-3xl font-bold leading-[1.12] text-[#2b2112] md:text-5xl">
              {heading}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#7a6641] md:text-base">
              {subheading}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-[rgba(201,149,0,0.18)] bg-[#fff6df] px-4 py-2 text-sm font-medium text-[#a87400]">
                {loading ? "Loading..." : `${filteredProducts.length} Products`}
              </div>

              <div className="rounded-full border border-[rgba(201,149,0,0.14)] bg-white px-4 py-2 text-sm text-[#7a6641]">
                Search, filter, sort & discover
              </div>
            </div>

            <div className="mt-6 xl:hidden">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-[20px] border border-[rgba(201,149,0,0.14)] bg-[#fffdfa] px-4 py-3 text-left shadow-[0_10px_24px_rgba(201,149,0,0.04)]"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#9b8b6f]">
                    Smart Catalog Tools
                  </p>
                  <p className="mt-1 text-base font-semibold text-[#2b2112]">
                    Search, Filter & Sort
                  </p>
                </div>

                <span className="ml-4 text-lg text-[#a87400]">
                  {mobileFiltersOpen ? "−" : "+"}
                </span>
              </button>
            </div>
          </div>

          <div className="hidden xl:block xl:pl-2">
            <div className="mx-auto w-full max-w-[640px] rounded-[26px] border border-[rgba(201,149,0,0.12)] bg-[#fffdfa] p-5 shadow-[0_12px_30px_rgba(201,149,0,0.05)] md:p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#9b8b6f]">
                    Smart Catalog Tools
                  </p>
                  <h2 className="mt-1 text-[24px] font-semibold leading-none text-[#2b2112]">
                    Search, Filter & Sort
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="shrink-0 rounded-full border border-[rgba(201,149,0,0.16)] bg-white px-4 py-2 text-sm font-medium text-[#9b7d3a] transition hover:border-[rgba(201,149,0,0.3)] hover:text-[#a87400]"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-3.5">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setVisibleCount(INITIAL_VISIBLE);
                  }}
                  placeholder="Search jerseys, teams, category..."
                  className="h-11 w-full rounded-[18px] border border-[rgba(201,149,0,0.14)] bg-white px-4 text-[15px] text-[#2b2112] outline-none transition placeholder:text-[#aa956c] focus:border-[#c99500]"
                />

                <div className="grid gap-3 md:grid-cols-2">
                  <select
                    value={teamFilter}
                    onChange={(e) => {
                      setTeamFilter(e.target.value);
                      setVisibleCount(INITIAL_VISIBLE);
                    }}
                    className="h-11 w-full rounded-[18px] border border-[rgba(201,149,0,0.14)] bg-white px-4 text-[15px] text-[#2b2112] outline-none transition focus:border-[#c99500]"
                  >
                    {teams.map((team) => (
                      <option key={team} value={team}>
                        Team: {team}
                      </option>
                    ))}
                  </select>

                  <select
                    value={priceFilter}
                    onChange={(e) => {
                      setPriceFilter(e.target.value);
                      setVisibleCount(INITIAL_VISIBLE);
                    }}
                    className="h-11 w-full rounded-[18px] border border-[rgba(201,149,0,0.14)] bg-white px-4 text-[15px] text-[#2b2112] outline-none transition focus:border-[#c99500]"
                  >
                    <option value="All">Price: All</option>
                    <option value="under-900">Under ₹900</option>
                    <option value="900-1100">₹900 - ₹1100</option>
                    <option value="1100-plus">Above ₹1100</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setVisibleCount(INITIAL_VISIBLE);
                    }}
                    className="h-11 w-full rounded-[18px] border border-[rgba(201,149,0,0.14)] bg-white px-4 text-[15px] text-[#2b2112] outline-none transition focus:border-[#c99500] md:col-span-2"
                  >
                    <option value="default">Sort: Default</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {mobileFiltersOpen && (
          <div className="relative px-5 pb-6 sm:px-6 xl:hidden">
            <div className="rounded-[24px] border border-[rgba(201,149,0,0.12)] bg-[#fffdfa] p-4 shadow-[0_10px_24px_rgba(201,149,0,0.04)]">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                    Smart Catalog Tools
                  </p>
                  <h2 className="mt-1 text-[22px] font-semibold leading-[1.05] text-[#2b2112]">
                    Search, Filter & Sort
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="shrink-0 rounded-full border border-[rgba(201,149,0,0.16)] bg-white px-4 py-2 text-sm font-medium text-[#9b7d3a]"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setVisibleCount(INITIAL_VISIBLE);
                  }}
                  placeholder="Search jerseys, teams, category..."
                  className="h-11 w-full rounded-[16px] border border-[rgba(201,149,0,0.14)] bg-white px-4 text-[15px] text-[#2b2112] outline-none placeholder:text-[#aa956c] focus:border-[#c99500]"
                />

                <select
                  value={teamFilter}
                  onChange={(e) => {
                    setTeamFilter(e.target.value);
                    setVisibleCount(INITIAL_VISIBLE);
                  }}
                  className="h-11 w-full rounded-[16px] border border-[rgba(201,149,0,0.14)] bg-white px-4 text-[15px] text-[#2b2112] outline-none focus:border-[#c99500]"
                >
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      Team: {team}
                    </option>
                  ))}
                </select>

                <select
                  value={priceFilter}
                  onChange={(e) => {
                    setPriceFilter(e.target.value);
                    setVisibleCount(INITIAL_VISIBLE);
                  }}
                  className="h-11 w-full rounded-[16px] border border-[rgba(201,149,0,0.14)] bg-white px-4 text-[15px] text-[#2b2112] outline-none focus:border-[#c99500]"
                >
                  <option value="All">Price: All</option>
                  <option value="under-900">Under ₹900</option>
                  <option value="900-1100">₹900 - ₹1100</option>
                  <option value="1100-plus">Above ₹1100</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setVisibleCount(INITIAL_VISIBLE);
                  }}
                  className="h-11 w-full rounded-[16px] border border-[rgba(201,149,0,0.14)] bg-white px-4 text-[15px] text-[#2b2112] outline-none focus:border-[#c99500]"
                >
                  <option value="default">Sort: Default</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[rgba(201,149,0,0.14)] bg-white p-10 text-center text-[#7a6641]">
          Loading products...
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(201,149,0,0.14)] bg-white p-10 text-center text-[#7a6641]">
          No products found with the selected filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                className="load-more-btn"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}