"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminTopbar from "@/app/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isAdminLoginPage =
    pathname === "/admin" || pathname === "/admin/login";

  if (isAdminLoginPage) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,149,0,0.08),transparent_24%),linear-gradient(to_bottom,#fffdf7,#fff8e8_45%,#fffdf7)]">
        {children}
      </main>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,149,0,0.08),transparent_24%),linear-gradient(to_bottom,#fffdf7,#fff8e8_45%,#fffdf7)]">
      <div className="flex h-full">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminTopbar
            onMenuClick={() => setSidebarOpen(true)}
            sidebarCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          />

          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}