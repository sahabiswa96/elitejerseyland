"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  PlusSquare,
  ReceiptText,
  BadgePercent,
  Users,
  Settings,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type AdminSidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarCollapsed: boolean;
};

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    label: "Add Product",
    href: "/admin/products/add",
    icon: PlusSquare,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ReceiptText,
  },
  {
    label: "Banners",
    href: "/admin/banners",
    icon: ImageIcon,
  },
  {
    label: "Offers",
    href: "/admin/offers",
    icon: BadgePercent,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setSidebarOpen(false);
      router.push("/admin");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition lg:hidden ${
          sidebarOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[rgba(201,149,0,0.14)] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition-all duration-300 lg:static lg:z-20 lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarCollapsed ? "lg:w-[92px]" : "lg:w-[270px]"} w-[280px]`}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[rgba(201,149,0,0.12)] px-5">
          <div className="min-w-0">
            {!sidebarCollapsed ? (
              <>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#a87400]">
                  Admin Panel
                </p>
                <h2 className="mt-1 text-lg font-bold text-[#2b2112]">
                  Elite Jersey Land
                </h2>
              </>
            ) : (
              <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,149,0,0.18)] bg-[#fff6df] text-base font-bold text-[#c99500] lg:flex">
                E
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,149,0,0.14)] bg-white text-[#2b2112] lg:hidden"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-hidden p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[linear-gradient(135deg,#c99500,#e0b22c)] text-white shadow-[0_10px_24px_rgba(201,149,0,0.16)]"
                      : "bg-[#fffdf7] text-[#2b2112] hover:bg-[#fff6df] hover:text-[#a87400]"
                  } ${sidebarCollapsed ? "lg:justify-center lg:px-2" : "gap-3"}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className={sidebarCollapsed ? "lg:hidden" : ""}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="shrink-0 border-t border-[rgba(201,149,0,0.12)] p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={`flex w-full rounded-xl border border-[rgba(201,149,0,0.14)] bg-white px-4 py-3 text-sm font-semibold text-[#2b2112] transition hover:border-[rgba(201,149,0,0.28)] hover:text-[#a87400] disabled:opacity-70 ${
              sidebarCollapsed ? "lg:justify-center lg:px-2" : "gap-3"
            }`}
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={sidebarCollapsed ? "lg:hidden" : ""}>
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}