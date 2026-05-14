"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  ExternalLink,
  LogOut,
  Bell,
  PanelsLeftRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AdminTopbarProps = {
  onMenuClick?: () => void;
  onToggleCollapse?: () => void;
  sidebarCollapsed?: boolean;
};

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  time: string;
  unread?: boolean;
};

const demoNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "New Order",
    message: "A new order has been placed.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Low Stock Alert",
    message: "Some products are running low on stock.",
    time: "15 min ago",
    unread: true,
  },
  {
    id: 3,
    title: "Customer Update",
    message: "A customer updated account details.",
    time: "1 hour ago",
    unread: false,
  },
];

export default function AdminTopbar({
  onMenuClick,
  onToggleCollapse,
  sidebarCollapsed,
}: AdminTopbarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(demoNotifications);

  const notificationRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((item) => item.unread).length;

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      router.push("/admin");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  function toggleNotifications() {
    setNotificationsOpen((prev) => !prev);
  }

  function markAllAsRead() {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-amber-100 bg-white/95 backdrop-blur-md">
      <div className="flex min-h-[76px] items-center justify-between gap-3 px-3 sm:px-5 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-slate-800 shadow-sm transition hover:bg-amber-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-slate-800 shadow-sm transition hover:bg-amber-100 lg:inline-flex"
            aria-label="Toggle sidebar"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelsLeftRight size={18} />
          </button>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-600 sm:text-[11px]">
              Admin Workspace
            </p>

            <h1 className="truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
              Manage Store Operations
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 md:inline-flex"
          >
            <ExternalLink size={16} />
            View Site
          </Link>

          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={toggleNotifications}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 sm:h-11 sm:w-11"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 ? (
                <span className="absolute right-2 top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-slate-950">
                  {unreadCount}
                </span>
              ) : null}
            </button>

            {notificationsOpen ? (
              <div className="absolute right-0 mt-3 w-[320px] overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                <div className="flex items-center justify-between border-b border-amber-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Notifications
                    </p>
                    <p className="text-xs text-slate-500">
                      {unreadCount} unread
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-amber-600 transition hover:text-amber-700"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-500">
                      No notifications found.
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`border-b border-slate-100 px-4 py-3 last:border-b-0 ${
                          item.unread ? "bg-amber-50/50" : "bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-600">
                              {item.message}
                            </p>
                            <p className="mt-2 text-[11px] text-slate-400">
                              {item.time}
                            </p>
                          </div>

                          {item.unread ? (
                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-amber-500 px-3 text-sm font-bold text-slate-950 shadow-[0_10px_24px_rgba(245,158,11,0.28)] transition hover:bg-amber-400 disabled:opacity-70 sm:h-11 sm:px-4"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}