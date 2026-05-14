"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
  { label: "Track Order", href: "/track-order" },
];

const catalogSubmenu = [
  { label: "All Products", href: "/catalog" },
  { label: "National Teams", href: "/catalog/category/National Teams" },
  { label: "Clubs", href: "/catalog/category/Clubs" },
  { label: "Special Edition", href: "/catalog/category/Special Edition" },
  { label: "Kids", href: "/catalog/category/Kids" },
  { label: "Full Sleeve", href: "/catalog/subcategory/Full Sleeve" },
  { label: "Half Sleeve", href: "/catalog/subcategory/Half Sleeve" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

  const isCatalogActive =
    pathname === "/catalog" || pathname.startsWith("/catalog/");

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(201,149,0,0.12)] bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(201,149,0,0.22)] bg-white/80 text-[#c99500] shadow-[0_0_20px_rgba(201,149,0,0.08)]">
            <span className="text-lg font-bold">E</span>
          </div>

          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#a87400]">
              Premium Brand
            </p>
            <h1 className="text-sm font-bold uppercase tracking-[0.28em] text-[#2b2112] sm:text-base">
              Elite Jersey Land
            </h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-[rgba(201,149,0,0.14)] bg-white/75 px-2 py-2 md:flex">
          <Link
            href="/"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              pathname === "/"
                ? "bg-[#fff6df] text-[#a87400]"
                : "text-[#5f5f66] hover:bg-[#fff6df] hover:text-[#a87400]"
            }`}
          >
            Home
          </Link>

          <div className="group relative">
            <Link
              href="/catalog"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                isCatalogActive
                  ? "bg-[#fff6df] text-[#a87400]"
                  : "text-[#5f5f66] hover:bg-[#fff6df] hover:text-[#a87400]"
              }`}
            >
              Catalog
              <span className="text-xs">▾</span>
            </Link>

            <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="min-w-[240px] overflow-hidden rounded-[20px] border border-[rgba(201,149,0,0.14)] bg-white/95 p-2 shadow-[0_18px_50px_rgba(201,149,0,0.12)] backdrop-blur-xl">
                {catalogSubmenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-[#2b2112] transition hover:bg-[#fff6df] hover:text-[#a87400]"
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
                pathname === item.href
                  ? "bg-[#fff6df] text-[#a87400]"
                  : "text-[#5f5f66] hover:bg-[#fff6df] hover:text-[#a87400]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full border border-[rgba(201,149,0,0.14)] bg-white/75 px-5 py-2.5 text-sm font-medium text-[#5f5f66] transition hover:border-[rgba(201,149,0,0.3)] hover:text-[#a87400]"
          >
            Login
          </Link>

          <Link
            href="/cart"
            className="rounded-full bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(201,149,0,0.15)] transition hover:opacity-90"
          >
            Cart
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(201,149,0,0.14)] bg-white/80 text-[#2b2112] md:hidden"
          aria-label="Toggle menu"
        >
          <span className="text-xl">{mobileOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[rgba(201,149,0,0.12)] bg-white/95 md:hidden">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-4 sm:px-6">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl border border-[rgba(201,149,0,0.12)] bg-white px-4 py-3 text-sm font-medium text-[#2b2112] transition hover:border-[rgba(201,149,0,0.25)] hover:text-[#a87400]"
            >
              Home
            </Link>

            <div className="rounded-xl border border-[rgba(201,149,0,0.12)] bg-white">
              <button
                type="button"
                onClick={() => setMobileCatalogOpen((prev) => !prev)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[#2b2112]"
              >
                <span>Catalog</span>
                <span className="text-xs">{mobileCatalogOpen ? "▴" : "▾"}</span>
              </button>

              {mobileCatalogOpen && (
                <div className="border-t border-[rgba(201,149,0,0.10)] px-2 pb-2">
                  {catalogSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileCatalogOpen(false);
                      }}
                      className="block rounded-lg px-3 py-2.5 text-sm text-[#5f5f66] transition hover:bg-[#fff6df] hover:text-[#a87400]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-[rgba(201,149,0,0.12)] bg-white px-4 py-3 text-sm font-medium text-[#2b2112] transition hover:border-[rgba(201,149,0,0.25)] hover:text-[#a87400]"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-[rgba(201,149,0,0.12)] bg-white px-4 py-3 text-center text-sm font-medium text-[#2b2112]"
              >
                Login
              </Link>

              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}