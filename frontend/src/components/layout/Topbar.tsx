import {
  Bell,
  Search,
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface px-6 shadow-sm">

      {/* Search */}

      <div className="relative w-full max-w-xl">

        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
        />

        <input
          type="text"
          placeholder="Search products, invoices..."
          className="w-full rounded-xl border border-border bg-surface-2 py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

      </div>

      {/* Right */}

      <div className="ml-6 flex items-center gap-4">

        <ThemeToggle />

        {/* Notification */}

        <button
          type="button"
          className="relative rounded-xl p-2 text-text-primary transition hover:bg-surface-2"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-1 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            2
          </span>
        </button>

        {/* User */}

        <div className="flex items-center gap-3 rounded-xl px-2 py-1">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-white shadow">
            M
          </div>

          <div className="hidden md:block">

            <p className="text-sm font-semibold text-text-primary">
              Mohit Raj
            </p>

            <p className="text-xs text-text-secondary">
              Business Owner
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}