import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  FileText,
  Gauge,
  LineChart,
  Menu,
  Palette,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ITEMS = [
  { to: "/dashboard", label: "Overview", icon: Gauge },
  { to: "/materials", label: "Materials", icon: Palette },
  { to: "/optimization", label: "Optimize", icon: Sparkles },
  { to: "/analysis", label: "Analysis", icon: BarChart3 },
  { to: "/predictions", label: "Predictions", icon: LineChart },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/reports", label: "Reports", icon: FileText },
] as const;

function LogoMark() {
  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
      <div className="absolute inset-0 rounded-[10px] border border-cyan-500/80 bg-background/20 shadow-[0_0_8px_rgba(34,211,238,0.25)]" />
      <div className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-gradient-to-b from-[#0a1e36] to-[#030914] shadow-[0_0_8px_rgba(34,211,238,0.5)]">
        <div className="absolute left-1/2 top-0 h-full w-[0.5px] bg-cyan-400/20" />
        <div className="absolute left-0 top-1/2 h-[0.5px] w-full bg-cyan-400/20" />
        <div className="absolute left-[30%] top-[25%] h-1 w-1 animate-pulse rounded-full bg-[#ff0055] shadow-[0_0_3px_#ff0055]" />
        <div className="absolute left-[65%] top-[60%] h-1 w-1 rounded-full bg-[#ff0055] shadow-[0_0_3px_#ff0055]" />
        <div className="absolute left-[60%] top-[35%] h-1 w-1 rounded-full bg-orange-400 shadow-[0_0_3px_#fb923c]" />
        <div className="absolute left-[30%] top-[65%] h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_3px_#34d399]" />
      </div>
    </div>
  );
}

function NavLink({
  to,
  label,
  icon: Icon,
  active,
  search,
  onNavigate,
  className = "",
  compact = false,
}: {
  to: string;
  label: string;
  icon: typeof Gauge;
  active: boolean;
  search?: { city: never };
  onNavigate?: () => void;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      to={to}
      search={search}
      onClick={onNavigate}
      title={compact ? label : undefined}
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-xl font-mono font-bold uppercase tracking-wider transition-all ${className} ${
        compact
          ? "min-h-9 gap-1 px-2.5 py-1.5 text-[10px]"
          : "min-h-11 gap-2 px-4 py-2.5 text-[11px]"
      } ${
        active
          ? "border border-primary/30 bg-primary/15 text-primary shadow-[0_0_12px_var(--primary)/20]"
          : "border border-transparent text-muted-foreground hover:bg-card/50 hover:text-foreground"
      }`}
    >
      <Icon className={`shrink-0 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
      {label}
    </Link>
  );
}

export function DashHeader({ cityId }: { cityId?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const search = cityId ? { city: cityId as never } : undefined;
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/12 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-nowrap items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
        {/* Logo + back */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card/40 text-muted-foreground backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <LogoMark />
          <div className="hidden font-mono text-sm font-bold tracking-tight sm:block">
            Therma<span className="text-primary">Grid</span>
          </div>

          <div className="hidden h-5 w-px bg-border/50 2xl:block" />
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground 2xl:inline">
            Mission Control
          </span>
        </div>

        {/* Desktop nav — single row, no wrap */}
        <nav className="hidden min-w-0 flex-1 flex-nowrap items-center justify-center gap-0.5 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden">
          {ITEMS.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              label={it.label}
              icon={it.icon}
              active={path === it.to}
              search={search}
              compact
            />
          ))}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-3 py-1.5 xl:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Live · ISRO Feed
            </span>
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card/40 text-muted-foreground backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary sm:h-10 sm:w-10 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw-2rem,20rem)] overflow-y-auto p-0">
              <SheetHeader className="border-b border-primary/10 px-5 py-4 text-left">
                <SheetTitle className="flex items-center gap-2 font-mono text-sm">
                  <LogoMark />
                  Therma<span className="text-primary">Grid</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-3">
                {ITEMS.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    label={it.label}
                    icon={it.icon}
                    active={path === it.to}
                    search={search}
                    onNavigate={() => setOpen(false)}
                    className="w-full"
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
