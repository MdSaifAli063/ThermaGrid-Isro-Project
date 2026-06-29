import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, Bell, FileText, Gauge, LineChart, Palette, Sparkles, Zap } from "lucide-react";

const ITEMS = [
  { to: "/dashboard",   label: "Overview",    icon: Gauge },
  { to: "/materials",   label: "Materials",   icon: Palette },
  { to: "/optimization",label: "Optimize",    icon: Sparkles },
  { to: "/analysis",    label: "Analysis",    icon: BarChart3 },
  { to: "/predictions", label: "Predictions", icon: LineChart },
  { to: "/alerts",      label: "Alerts",      icon: Bell },
  { to: "/reports",     label: "Reports",     icon: FileText },
] as const;

export function DashHeader({ cityId }: { cityId?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const search = cityId ? { city: cityId as never } : undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-primary/12 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-6 py-3">

        {/* Logo + back */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border/60 bg-card/40 text-muted-foreground backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7">
              <div className="absolute inset-0 animate-glow-pulse rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 opacity-80" />
              <div className="absolute inset-[2px] rounded-[5px] bg-background" />
              <div className="absolute inset-[4px] rounded-[3px] bg-gradient-to-br from-cyan-400 to-blue-600" />
            </div>
            <div className="font-mono text-sm font-bold tracking-tight">
              Therma<span className="text-primary">Grid</span>
            </div>
          </div>

          {/* Separator */}
          <div className="h-5 w-px bg-border/50" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Mission Control
          </span>
        </div>

        {/* Nav tabs */}
        <nav className="flex flex-1 flex-wrap items-center gap-1 px-2">
          {ITEMS.map((it) => {
            const active = path === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                search={search}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-all ${
                  active
                    ? "bg-primary/15 text-primary shadow-[0_0_12px_var(--primary)/20] border border-primary/30"
                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground border border-transparent"
                }`}
              >
                <it.icon className="h-3.5 w-3.5" />
                {it.label}
              </Link>
            );
          })}
        </nav>

        {/* Live status pill */}
        <div className="hidden items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-3 py-1.5 sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Live · ISRO Feed
          </span>
        </div>
      </div>
    </header>
  );
}
