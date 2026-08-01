import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "vyapar_theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (
      (localStorage.getItem(STORAGE_KEY) as Theme) ||
      "system"
    );
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)")
            .matches);

      root.classList.toggle("dark", isDark);
    };

    applyTheme();

    localStorage.setItem(STORAGE_KEY, theme);

    if (theme === "system") {
      const media = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

      const handler = () => applyTheme();

      media.addEventListener("change", handler);

      return () => {
        media.removeEventListener("change", handler);
      };
    }
  }, [theme]);

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-1">
      <button
        onClick={() => setTheme("light")}
        className={`rounded-lg p-2 transition ${
          theme === "light"
            ? "bg-primary text-white"
            : "text-text-secondary hover:bg-surface-2"
        }`}
        title="Light mode"
      >
        <Sun size={18} />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`rounded-lg p-2 transition ${
          theme === "dark"
            ? "bg-primary text-white"
            : "text-text-secondary hover:bg-surface-2"
        }`}
        title="Dark mode"
      >
        <Moon size={18} />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`rounded-lg p-2 transition ${
          theme === "system"
            ? "bg-primary text-white"
            : "text-text-secondary hover:bg-surface-2"
        }`}
        title="System mode"
      >
        <Monitor size={18} />
      </button>
    </div>
  );
}