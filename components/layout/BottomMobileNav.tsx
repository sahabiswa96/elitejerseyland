"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  House,
  Menu,
  Store,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

type CurrentUser = {
  id: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  firstName: string;
  lastName: string;
};

const navItems = [
  { label: "Home", href: "/", icon: House },
  { label: "Menu", href: "#menu", icon: Menu, isMenuTrigger: true },
  { label: "Shop", href: "/catalog", icon: Store },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Account", href: "/account", icon: UserRound },
];

const glassWrap =
  "border-t border-white/25 bg-white/30 shadow-[0_-10px_28px_rgba(0,0,0,0.06)] backdrop-blur-2xl";
const glassActive =
  "border border-white/35 bg-white/55 text-[#c99500] shadow-[0_8px_20px_rgba(201,149,0,0.10)] backdrop-blur-xl";
const glassIdle =
  "border border-transparent bg-transparent text-[#2b2112]";

export default function BottomMobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [cartCount, setCartCount] = useState(0);

  async function loadCurrentUser() {
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
    } catch {
      setUser(null);
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
    } catch {
      setCartCount(0);
    }
  }

  useEffect(() => {
    loadCurrentUser();
    loadCartCount();
  }, [pathname]);

  function getAccountHref() {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin/dashboard";
    return "/account";
  }

  function isActive(href: string, label: string) {
    if (label === "Home") return pathname === "/";
    if (label === "Menu") return false;
    if (label === "Shop") return pathname.startsWith("/catalog");
    if (label === "Cart") return pathname === "/cart";
    if (label === "Account") {
      return (
        pathname.startsWith("/account") ||
        pathname === "/login" ||
        pathname === "/signup"
      );
    }
    return pathname === href;
  }

  function handleMenuOpen() {
    if (pathname !== "/") {
      sessionStorage.setItem("elite_open_mobile_menu_on_home", "true");
      router.push("/");
      return;
    }

    window.dispatchEvent(new Event("elite-open-mobile-menu"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[60] md:hidden ${glassWrap}`}>
      <div className="mx-auto grid h-[62px] max-w-[600px] grid-cols-5 px-2">
        {navItems.map((item) => {
          const href = item.label === "Account" ? getAccountHref() : item.href;
          const active = isActive(href, item.label);
          const Icon = item.icon;

          if (item.isMenuTrigger) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={handleMenuOpen}
                className="relative flex flex-col items-center justify-center gap-1"
              >
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-xl transition ${
                    active ? glassActive : glassIdle
                  }`}
                >
                  <Icon size={17} strokeWidth={2.2} />
                </span>

                <span
                  className={`text-[10px] font-semibold leading-none ${
                    active ? "text-[#c99500]" : "text-[#2b2112]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={href}
              className="relative flex flex-col items-center justify-center gap-1"
            >
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-xl transition ${
                  active ? glassActive : glassIdle
                }`}
              >
                <Icon size={17} strokeWidth={2.2} />
              </span>

              {item.label === "Cart" && cartCount > 0 ? (
                <span className="absolute right-[16px] top-[6px] inline-flex h-4 min-w-[16px] items-center justify-center rounded-full border border-white bg-[#2b2112] px-[4px] text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}

              <span
                className={`text-[10px] font-semibold leading-none ${
                  active ? "text-[#c99500]" : "text-[#2b2112]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}