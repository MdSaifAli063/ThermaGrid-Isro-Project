import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { getStoredTheme, resolveTheme, setTheme, type Theme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    setResolved(resolveTheme(stored));

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = getStoredTheme();
      setThemeState(current);
      setResolved(resolveTheme(current));
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = resolved === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
    setResolved(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={resolved === "dark" ? "Light mode" : "Dark mode"}
      className={`inline-flex h-10 w-10 min-h-10 min-w-10 items-center justify-center rounded-xl border border-border/60 bg-card/40 text-muted-foreground backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary ${className}`}
    >
      {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">{theme === "system" ? "System theme" : `${resolved} mode`}</span>
    </button>
  );
}
