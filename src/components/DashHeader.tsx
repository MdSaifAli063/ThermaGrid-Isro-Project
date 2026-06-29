import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, Bell, FileText, Gauge, LineChart, Palette, Sparkles } from "lucide-react";

const ITEMS = [
  { to: "/dashboard", label: "Overview", icon: Gauge },
  { to: "/materials", label: "Materials", icon: Palette },
  { to: "/optimization", label: "Optimize", icon: Sparkles },
  { to: "/analysis", label: "Analysis", icon: BarChart3 },
  { to: "/predictions", label: "Predictions", icon: LineChart },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/reports", label: "Reports", icon: FileText },
] as const;

export function DashHeader({ cityId }: { cityId?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const search = cityId ? { city: cityId as never } : undefined;
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6">
              <div className="absolute inset-0 rounded bg-gradient-to-br from-primary to-accent" />
              <div className="absolute inset-[2px] rounded-[3px] bg-background" />
              <div className="absolute inset-[4px] rounded-sm bg-gradient-to-br from-primary to-accent" />
            </div>
            <div className="font-semibold">
              Therma<span className="text-primary">Grid</span>
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-wrap items-center gap-1">
          {ITEMS.map((it) => {
            const active = path === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                search={search}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <it.icon className="h-3.5 w-3.5" />
                {it.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
