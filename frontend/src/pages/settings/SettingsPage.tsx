import {
  Bell,
  Check,
  LogOut,
  Moon,
  Palette,
  Settings,
  Sun,
  Monitor,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  useTheme,
  type Theme,
} from "../../context/ThemeContext";

import { useAuth } from "../../context/AuthContext";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const selectTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <div className="flex items-center gap-3">
          <Settings
            className="text-primary"
            size={30}
          />

          <h1 className="text-3xl font-bold text-text-primary">
            Settings
          </h1>
        </div>

        <p className="mt-2 text-text-secondary">
          Manage your VyaparAI preferences and account settings.
        </p>
      </div>

      {/* Appearance */}

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <Palette className="text-primary" />

          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Appearance
            </h2>

            <p className="text-sm text-text-secondary">
              Choose how VyaparAI looks on your device.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {/* Light */}

          <button
            type="button"
            onClick={() => selectTheme("light")}
            className={`relative rounded-2xl border p-5 text-left transition ${
              theme === "light"
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary"
            }`}
          >
            {theme === "light" && (
              <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                <Check size={15} />
              </span>
            )}

            <Sun
              size={28}
              className="mb-4 text-primary"
            />

            <h3 className="font-semibold text-text-primary">
              Light Mode
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              Bright and clean interface.
            </p>
          </button>

          {/* Dark */}

          <button
            type="button"
            onClick={() => selectTheme("dark")}
            className={`relative rounded-2xl border p-5 text-left transition ${
              theme === "dark"
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary"
            }`}
          >
            {theme === "dark" && (
              <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                <Check size={15} />
              </span>
            )}

            <Moon
              size={28}
              className="mb-4 text-primary"
            />

            <h3 className="font-semibold text-text-primary">
              Dark Mode
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              Comfortable dark interface.
            </p>
          </button>

          {/* System */}

          <div className="relative rounded-2xl border border-border p-5 opacity-60">

            <Monitor
              size={28}
              className="mb-4 text-primary"
            />

            <h3 className="font-semibold text-text-primary">
              System Mode
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              Automatic system theme support.
            </p>

            <span className="mt-3 inline-block rounded-full bg-surface-2 px-3 py-1 text-xs text-text-secondary">
              Coming soon
            </span>

          </div>

        </div>
      </section>

      {/* Account */}

<section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">

  <div className="mb-6 flex items-center gap-3">
    <User className="text-primary" />

    <div>
      <h2 className="text-xl font-semibold text-text-primary">
        Account
      </h2>

      <p className="text-sm text-text-secondary">
        Your VyaparAI account information.
      </p>
    </div>
  </div>

  <div className="grid gap-4 md:grid-cols-2">

    {/* Name */}
    <div className="rounded-xl bg-surface-2 p-4">
      <p className="text-sm text-text-secondary">
        Name
      </p>

      <p className="mt-1 font-semibold text-text-primary">
        {user?.name || "User"}
      </p>
    </div>

    {/* Email */}
    <div className="rounded-xl bg-surface-2 p-4">
      <p className="text-sm text-text-secondary">
        Email
      </p>

      <p className="mt-1 font-semibold text-text-primary">
        {user?.email || "Not available"}
      </p>
    </div>

    {/* Role */}
    <div className="rounded-xl bg-surface-2 p-4">
      <p className="text-sm text-text-secondary">
        Role
      </p>

      <p className="mt-1 font-semibold text-text-primary">
        Business Owner
      </p>
    </div>

  </div>

</section>

      {/* Notifications */}

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <Bell className="text-primary" />

          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Notifications
            </h2>

            <p className="text-sm text-text-secondary">
              Manage business notifications.
            </p>
          </div>
        </div>

        <div className="space-y-4">

          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-surface-2 p-4">

            <div>
              <p className="font-medium text-text-primary">
                Low stock alerts
              </p>

              <p className="text-sm text-text-secondary">
                Notify me when products are running low.
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-[#2b6f79]"
            />

          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-surface-2 p-4">

            <div>
              <p className="font-medium text-text-primary">
                Invoice notifications
              </p>

              <p className="text-sm text-text-secondary">
                Notify me about new invoices and payments.
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-[#2b6f79]"
            />

          </label>

        </div>
      </section>

      {/* Account Actions */}

      <section className="rounded-2xl border border-red-200 bg-surface p-6 shadow-sm dark:border-red-900/50">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <LogOut size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Account Actions
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Sign out of your VyaparAI account on this device.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </section>

    </div>
  );
}