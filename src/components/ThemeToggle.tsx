import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Check initial theme state on client mount
    try {
      const saved = localStorage.getItem("voltgrid-theme");
      const isDark = saved ? saved === "dark" : document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
      if (isDark) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    } catch {
      // Fallback to dark if storage access is blocked
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        localStorage.setItem("voltgrid-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        localStorage.setItem("voltgrid-theme", "light");
      }
    } catch {
      // Handle potential storage errors
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="h-8 px-2.5 gap-1.5 border-border/80 bg-background/80 hover:bg-muted transition-colors cursor-pointer"
      title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-3.5 w-3.5 text-amber-400 transition-transform hover:rotate-45" />
          <span className="text-xs font-medium">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-3.5 w-3.5 text-primary transition-transform hover:-rotate-12" />
          <span className="text-xs font-medium">Dark</span>
        </>
      )}
    </Button>
  );
}
