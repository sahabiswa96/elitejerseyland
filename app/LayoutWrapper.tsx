"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarqueeStrip from "@/components/layout/MarqueeStrip";
import BottomMobileNav from "@/components/layout/BottomMobileNav";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password";

  const isAdminAuthRoute = pathname === "/admin" || pathname === "/admin/login";

  if (isAdminAuthRoute) {
    return <>{children}</>;
  }

  if (isAdminRoute) {
    return <>{children}</>;
  }

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-white">
        <MarqueeStrip />
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-[84px] md:pb-0">{children}</main>

      <MarqueeStrip />
      <Footer />
      <BottomMobileNav />
    </div>
  );
}