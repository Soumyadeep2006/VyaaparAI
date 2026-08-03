import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-1">
      <button
        type="button"
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
        type="button"
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
    </div>
  );
}