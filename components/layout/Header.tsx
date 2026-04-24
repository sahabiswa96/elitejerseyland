"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { catalogSubcategories } from "@/app/data/subcategories";
import {
  Menu,
  Search,
  UserRound,
  ShoppingBag,
  X,
  Clock3,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
  { label: "Track Order", href: "/track-order" },
];

type CurrentUser = {
  id: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  firstName: string;
  lastName: string;
};

type SearchProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  mainImage: string;
  category?: string | null;
  team?: string | null;
};

const RECENT_SEARCHES_KEY = "elite_recent_searches";
const MAX_RECENT_SEARCHES = 6;

const glassCard =
  "border border-white/35 bg-white/45 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)]";
const glassSoft =
  "border border-white/30 bg-white/35 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.05)]";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);

  const [accountOpen, setAccountOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const accountRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function loadCurrentUser() {
    setLoadingUser(true);

    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user || null);
    } catch (error) {
      console.error("HEADER_USER_LOAD_ERROR", error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }

  async function loadCartCount() {
    try {
      const res = await fetch("/api/cart/count", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      setCartCount(data.count || 0);
    } catch (error) {
      console.error("HEADER_CART_COUNT_ERROR", error);
      setCartCount(0);
    }
  }

  function loadRecentSearches() {
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_KEY);

      if (!raw) {
        setRecentSearches([]);
        return;
      }

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.filter((item) => typeof item === "string"));
      } else {
        setRecentSearches([]);
      }
    } catch {
      setRecentSearches([]);
    }
  }

  function saveRecentSearch(term: string) {
    const normalized = term.trim();
    if (!normalized) return;

    setRecentSearches((prev) => {
      const next = [
        normalized,
        ...prev.filter(
          (item) => item.toLowerCase() !== normalized.toLowerCase()
        ),
      ].slice(0, MAX_RECENT_SEARCHES);

      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearRecentSearches() {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      setCartCount(0);
      setAccountOpen(false);
      setMobileOpen(false);
      setMobileAccountOpen(false);

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("HEADER_LOGOUT_ERROR", error);
    } finally {
      setLoggingOut(false);
    }
  }

  function handleSearchToggle() {
    setSearchOpen((prev) => {
      const next = !prev;

      if (!next) {
        setSearchQuery("");
        setSearchResults([]);
      }

      return next;
    });
  }

  function handleSearchSelect(product: SearchProduct) {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }

    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/catalog/${product.slug}`);
  }

  function handleRecentSearchClick(term: string) {
    setSearchOpen(true);
    setSearchQuery(term);
  }

  function handleSearchSubmit(rawQuery?: string) {
    const finalQuery = (rawQuery ?? searchQuery).trim();
    if (!finalQuery) return;

    saveRecentSearch(finalQuery);
    setSearchOpen(false);
    setSearchResults([]);
    router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  useEffect(() => {
    if (!mounted) return;

    loadCurrentUser();
    loadCartCount();
    loadRecentSearches();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (user?.role === "CUSTOMER") {
      loadCartCount();
    } else {
      setCartCount(0);
    }
  }, [user, mounted]);

  useEffect(() => {
    if (!mounted) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    function openMobileMenu() {
      setMobileOpen(true);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    }

    window.addEventListener("elite-open-mobile-menu", openMobileMenu);

    return () => {
      window.removeEventListener("elite-open-mobile-menu", openMobileMenu);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const shouldOpenMenu = sessionStorage.getItem(
      "elite_open_mobile_menu_on_home"
    );

    if (pathname === "/" && shouldOpenMenu === "true") {
      sessionStorage.removeItem("elite_open_mobile_menu_on_home");
      setMobileOpen(true);

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  }, [pathname, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const delay = setTimeout(async () => {
      const q = searchQuery.trim();

      if (!q) {
        setSearchResults([]);
        setLoadingSearch(false);
        return;
      }

      try {
        setLoadingSearch(true);

        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(q)}`,
          {
            cache: "no-store",
          }
        );

        const data = await res.json();
        setSearchResults(data.products || []);
      } catch (error) {
        console.error("HEADER_SEARCH_ERROR", error);
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery, mounted]);

  const customerName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "";

  const showRecentSearches = useMemo(
    () => searchOpen && !searchQuery.trim() && recentSearches.length > 0,
    [searchOpen, searchQuery, recentSearches]
  );

  if (!mounted) return null;

  return (
    <header
      className="sticky top-0 z-[80] w-full border-b border-white/25 bg-white/30 backdrop-blur-2xl shadow-[0_8px_28px_rgba(0,0,0,0.05)]"
      ref={searchRef}
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="hidden h-[88px] items-center justify-between md:flex">
          <Link href="/" className="flex items-center gap-4 mr-auto">
            <img
              src="/logo.jpeg"
              alt="Elite Jersey Land"
              className="h-14 w-14 rounded-full object-cover"
            />
        
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#a87400]">
                Premium Brand
              </p>
              <h1 className="text-sm font-bold uppercase tracking-[0.28em] text-[#2b2112] sm:text-base">
                Elite Jersey Land
              </h1>
            </div>
          </Link>

          <nav className="flex items-center gap-2 rounded-full border border-[#ece6d8] bg-[#f8f6f1] px-2 py-2">
            <Link
              href="/"
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive("/")
                  ? "text-[#a87400]"
                  : "text-[#5f5f66] hover:text-[#a87400]"
              }`}
            >
              Home
            </Link>

            <div className="group relative">
              <Link
                href="/catalog"
                className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition ${
                  pathname.startsWith("/catalog")
                    ? "text-[#a87400]"
                    : "text-[#5f5f66] hover:text-[#a87400]"
                }`}
              >
                Catalog
              </Link>

              <div
                className={`invisible absolute left-0 top-full z-50 mt-3 w-[260px] translate-y-2 rounded-[20px] p-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${glassCard}`}
              >
                <div className="mb-2 px-2 pt-1">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#a87400]">
                    Shop Categories
                  </p>
                </div>

                <div className="space-y-1">
                  {catalogSubcategories.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/catalog/subcategory/${item.slug}`}
                      className="block rounded-xl px-3 py-3 text-sm font-medium text-[#2b2112] transition hover:bg-white/70 hover:text-[#d1a00d]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "text-[#a87400]"
                    : "text-[#5f5f66] hover:text-[#a87400]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 ml-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
              className="flex items-center gap-2 rounded-full border border-[#ece6d8] bg-[#f8f6f1] px-4"
            >
              <button
                type="submit"
                className="shrink-0 text-[#a87400]"
                aria-label="Search"
              >
                <Search size={16} />
              </button>

              <input
                type="text"
                placeholder="Search jerseys, teams, clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[40px] w-[220px] bg-transparent text-sm outline-none placeholder:text-[#8e7d5f]"
              />
            </form>

            {loadingUser ? (
              <div className="rounded-full border border-[#ece6d8] bg-[#f8f6f1] px-5 py-2 text-sm text-[#5f5f66]">
                Loading...
              </div>
            ) : user && user.role === "CUSTOMER" ? (
              // CUSTOMER dropdown menu
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ece6d8] bg-[#f8f6f1] px-4 py-2 text-sm text-[#5f5f66] transition hover:text-[#a87400]"
                >
                  <UserRound size={16} />
                  <span className="max-w-[120px] truncate">
                    {customerName || "Account"}
                  </span>
                </button>

                {accountOpen ? (
                  <div
                    className={`absolute right-0 top-full z-50 mt-3 w-[240px] rounded-[20px] p-3 ${glassCard}`}
                  >
                    <div className="mb-2 rounded-xl bg-white/70 px-3 py-3">
                      <p className="text-sm font-semibold text-[#2b2112]">
                        {customerName || "Customer"}
                      </p>
                      <p className="mt-1 truncate text-xs text-[#7a6641]">
                        {user.email}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/account"
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-xl px-3 py-3 text-sm font-medium text-[#2b2112] transition hover:bg-white/70 hover:text-[#a87400]"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/profile"
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-xl px-3 py-3 text-sm font-medium text-[#2b2112] transition hover:bg-white/70 hover:text-[#a87400]"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-xl px-3 py-3 text-sm font-medium text-[#2b2112] transition hover:bg-white/70 hover:text-[#a87400]"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/track-order"
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-xl px-3 py-3 text-sm font-medium text-[#2b2112] transition hover:bg-white/70 hover:text-[#a87400]"
                      >
                        Track Order
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="block w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50/80 disabled:opacity-70"
                      >
                        {loggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : user && user.role === "ADMIN" ? (
              // ADMIN dropdown - no cart, different options
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ece6d8] bg-[#f8f6f1] px-4 py-2 text-sm text-[#5f5f66] transition hover:text-[#a87400]"
                >
                  <UserRound size={16} />
                  <span className="max-w-[120px] truncate">
                    Admin: {customerName || "Admin"}
                  </span>
                </button>

                {accountOpen ? (
                  <div
                    className={`absolute right-0 top-full z-50 mt-3 w-[240px] rounded-[20px] p-3 ${glassCard}`}
                  >
                    <div className="mb-2 rounded-xl bg-white/70 px-3 py-3">
                      <p className="text-sm font-semibold text-[#2b2112]">
                        {customerName || "Admin"}
                      </p>
                      <p className="mt-1 truncate text-xs text-[#7a6641]">
                        {user.email}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#c99500]">
                        Administrator
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-xl px-3 py-3 text-sm font-medium text-[#2b2112] transition hover:bg-white/70 hover:text-[#a87400]"
                      >
                        Admin Dashboard
                      </Link>
                      <Link
                        href="/admin/products"
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-xl px-3 py-3 text-sm font-medium text-[#2b2112] transition hover:bg-white/70 hover:text-[#a87400]"
                      >
                        Manage Products
                      </Link>
                      <Link
                        href="/admin/orders"
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-xl px-3 py-3 text-sm font-medium text-[#2b2112] transition hover:bg-white/70 hover:text-[#a87400]"
                      >
                        Manage Orders
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="block w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50/80 disabled:opacity-70"
                      >
                        {loggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              // Guest user - Show Login button
              <button
                onClick={() => router.push("/login")}
                className="rounded-full border border-[#ece6d8] bg-[#f8f6f1] px-5 py-2.5 text-sm font-medium text-[#5f5f66] transition hover:text-[#a87400]"
              >
                Login
              </button>
            )}

            {/* Only show cart for CUSTOMER role */}
            {(!user || user.role === "CUSTOMER") && (
              <Link
                href="/cart"
                className="relative rounded-full bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(201,149,0,0.15)] transition hover:opacity-90"
              >
                Cart
                {cartCount > 0 ? (
                  <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full border-2 border-white bg-[#2b2112] px-1 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            )}
          </div>
        </div>

        <div className="flex h-[70px] items-center justify-between gap-2 md:hidden">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#2b2112] transition hover:bg-white/70"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X size={20} strokeWidth={2.2} />
              ) : (
                <Menu size={20} strokeWidth={2.2} />
              )}
            </button>

            <button
              type="button"
              onClick={handleSearchToggle}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#2b2112] transition hover:bg-white/70"
              aria-label="Search products"
            >
              {searchOpen ? (
                <X size={18} strokeWidth={2.2} />
              ) : (
                <Search size={18} strokeWidth={2.2} />
              )}
            </button>
          </div>

            <Link href="/" className="flex flex-col items-center justify-center">
            <img
              src="/Logo.jpeg"
              alt="Elite Jersey Land"
              className="h-9 w-9 rounded-full object-cover"
            />

            <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#2b2112]">
              Elite Jersey Land
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (user?.role === "ADMIN") {
                  router.push("/admin/dashboard");
                } else if (user?.role === "CUSTOMER") {
                  setMobileAccountOpen((prev) => !prev);
                } else {
                  router.push("/login");
                }
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#2b2112] transition hover:bg-white/70"
              aria-label="Profile"
            >
              <UserRound size={18} strokeWidth={2.2} />
            </button>

            {/* Only show cart for CUSTOMER role */}
            {(!user || user.role === "CUSTOMER") && (
              <Link
                href="/cart"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-[#2b2112] transition hover:bg-white/70"
                aria-label="Cart"
              >
                <ShoppingBag size={18} strokeWidth={2.2} />
                {cartCount > 0 ? (
                  <span className="absolute right-[2px] top-[1px] inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#2b2112] px-[4px] text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            )}
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-white/25">
            <div className="mx-auto w-full max-w-[1200px] px-4 py-4 sm:px-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchSubmit();
                }}
                className="flex items-center gap-3 rounded-[18px] border border-[#ece6d8] bg-[#f8f6f1] px-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)] sm:px-5"
              >
                <button
                  type="submit"
                  className="shrink-0 text-[#a87400]"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>

                <input
                  autoFocus
                  type="text"
                  placeholder="Search jerseys, teams, clubs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-[52px] w-full min-w-0 bg-transparent text-[15px] font-medium text-[#2b2112] outline-none placeholder:text-[#8e7d5f]"
                />

                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#7a6641] transition hover:bg-white/70 hover:text-[#a87400]"
                  >
                    <X size={16} />
                  </button>
                ) : null}
              </form>

              {showRecentSearches ? (
                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a87400]">
                      Recent Searches
                    </p>

                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-xs font-medium text-[#7a6641] transition hover:text-[#a87400]"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleRecentSearchClick(term)}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#2b2112] transition hover:bg-white/70 hover:text-[#a87400] ${glassSoft}`}
                      >
                        <Clock3 size={14} />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {searchQuery.trim() ? (
                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a87400]">
                      Search Results
                    </p>

                    {loadingSearch ? (
                      <p className="text-xs text-[#7a6641]">Searching...</p>
                    ) : null}
                  </div>

                  {!loadingSearch && searchResults.length === 0 ? (
                    <div className="rounded-[18px] border border-[#ece6d8] bg-[#f8f6f1] px-4 py-5 text-sm text-[#7a6641]">
                      No matching products found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleSearchSelect(product)}
                          className="flex w-full items-center gap-3 rounded-[18px] border border-[#ece6d8] bg-[#f8f6f1] p-3 text-left transition hover:bg-white"
                        >
                          <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#f3efe6]">
                            <img
                              src={
                                product.mainImage ||
                                "/images/default-product.webp"
                              }
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-[15px] font-semibold text-[#2b2112]">
                              {product.name}
                            </p>
                            <p className="mt-1 line-clamp-1 text-sm text-[#7a6641]">
                              {product.team ||
                                product.category ||
                                "Elite Jersey"}
                            </p>
                          </div>

                          <div className="shrink-0 pl-2 text-right">
                            <p className="text-[15px] font-bold text-[#c99500]">
                              ₹{product.price.toFixed(2)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {mobileAccountOpen && user && user.role === "CUSTOMER" ? (
          <div className="border-t border-white/20 bg-white/20 px-4 py-3 backdrop-blur-2xl md:hidden">
            <div className={`mb-3 rounded-xl px-3 py-3 ${glassSoft}`}>
              <p className="text-sm font-semibold text-[#2b2112]">
                {customerName || "Customer"}
              </p>
              <p className="mt-1 break-all text-xs text-[#7a6641]">
                {user.email}
              </p>
            </div>

            <div className="space-y-2">
              <Link
                href="/account"
                onClick={() => setMobileAccountOpen(false)}
                className={`block rounded-lg px-3 py-3 text-sm font-medium text-[#2b2112] ${glassSoft}`}
              >
                My Account
              </Link>
              <Link
                href="/account/profile"
                onClick={() => setMobileAccountOpen(false)}
                className={`block rounded-lg px-3 py-3 text-sm font-medium text-[#2b2112] ${glassSoft}`}
              >
                My Profile
              </Link>
              <Link
                href="/account/orders"
                onClick={() => setMobileAccountOpen(false)}
                className={`block rounded-lg px-3 py-3 text-sm font-medium text-[#2b2112] ${glassSoft}`}
              >
                My Orders
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileAccountOpen(false)}
                className={`block rounded-lg px-3 py-3 text-sm font-medium text-[#2b2112] ${glassSoft}`}
              >
                Track Order
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="block w-full rounded-lg bg-red-50/85 px-3 py-3 text-left text-sm font-medium text-red-600 disabled:opacity-70"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        ) : null}

        {mobileOpen && (
          <div className="border-t border-white/20 bg-white/20 backdrop-blur-2xl md:hidden">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-4 sm:px-6">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium text-[#2b2112] transition hover:text-[#a87400] ${glassSoft}`}
              >
                Home
              </Link>

              <div className={`rounded-xl ${glassSoft}`}>
                <button
                  type="button"
                  onClick={() => setMobileCatalogOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[#2b2112]"
                >
                  <span>Catalog</span>
                  <span>{mobileCatalogOpen ? "−" : "+"}</span>
                </button>

                {mobileCatalogOpen ? (
                  <div className="border-t border-white/20 px-3 py-3">
                    <div className="space-y-2">
                      <Link
                        href="/catalog"
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg bg-white/70 px-3 py-2.5 text-sm font-medium text-[#2b2112]"
                      >
                        All Products
                      </Link>

                      {catalogSubcategories.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/catalog/subcategory/${item.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-lg bg-white/70 px-3 py-2.5 text-sm font-medium text-[#2b2112] transition hover:text-[#d1a00d]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {navItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium text-[#2b2112] transition hover:text-[#a87400] ${glassSoft}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}