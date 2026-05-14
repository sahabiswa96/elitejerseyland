"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarqueeStrip from "@/components/layout/MarqueeStrip";
import BottomMobileNav from "@/components/layout/BottomMobileNav";

type Props = {
  children: React.ReactNode;
};

export default function SiteChrome({ children }: Props) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password";

  const isAdminAuthPage = pathname === "/admin" || pathname === "/admin/login";

  const showPublicLayout = !isAdminRoute && !isAuthPage;
  const showBottomMobileNav = showPublicLayout;

  if (isAuthPage) {
    return (
      <div className="flex min-h-screen flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden">{children}</main>
        <MarqueeStrip />
      </div>
    );
  }

  if (isAdminAuthPage) {
    return <>{children}</>;
  }

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {showPublicLayout && <Header />}

      <div className={showBottomMobileNav ? "pb-[84px] md:pb-0" : ""}>
        {children}
      </div>

      {showPublicLayout && <MarqueeStrip />}
      {showPublicLayout && <Footer />}
      {showBottomMobileNav && <BottomMobileNav />}
    </>
  );
}