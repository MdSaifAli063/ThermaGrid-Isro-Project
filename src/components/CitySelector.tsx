import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, MapPin, Check, Search } from "lucide-react";
import { CITIES, STATES, type City } from "@/lib/heat-data";

export function CitySelector({
  cityId,
  onChange,
}: {
  cityId: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const city: City = CITIES.find((c) => c.id === cityId) ?? CITIES[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return STATES;
    return STATES
      .map((g) => ({
        state: g.state,
        cities: g.cities.filter(
          (c) =>
            c.name.toLowerCase().includes(needle) ||
            c.state.toLowerCase().includes(needle),
        ),
      }))
      .filter((g) => g.cities.length > 0);
  }, [q]);

  return (
    <div ref={ref} className="relative z-40 w-full min-w-0 sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex min-h-11 w-full max-w-full items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-3 py-2 font-mono text-xs font-bold backdrop-blur-md shadow-lg transition-all hover:border-primary/40 hover:bg-primary/10 sm:w-auto sm:px-4 sm:py-2.5"
      >
        <MapPin className="h-4 w-4 shrink-0 text-primary" />
        <span className="min-w-0 truncate text-left text-foreground">
          {city.name}
          <span className="ml-2 hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
            {city.state}
          </span>
        </span>
        <ChevronDown className={`h-3 w-3 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-panel animate-fade-up absolute left-0 right-0 z-50 mt-2 w-auto overflow-hidden rounded-3xl p-2 shadow-2xl sm:left-auto sm:right-0 sm:w-80">
          <div className="relative px-1 pb-2">
            <Search className="absolute left-3.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search state or city…"
              className="w-full rounded-xl border border-primary/15 bg-background/50 py-2 pl-9 pr-3 font-mono text-xs placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
            />
          </div>
          <div className="max-h-80 overflow-y-auto">
            {filtered.map((g) => (
              <div key={g.state}>
                <div className="sticky top-0 bg-card/95 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-primary/60 backdrop-blur">
                  {g.state}
                </div>
                {g.cities.map((c) => {
                  const active = c.id === cityId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        onChange(c.id);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                        active ? "bg-primary/10 text-foreground border border-primary/20" : "text-foreground/90 hover:bg-primary/5 border border-transparent"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{c.name}</span>
                          {active && <Check className="h-3 w-3 text-primary" />}
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground">
                          {c.wards.length} wards · {(c.populationTotal / 1e6).toFixed(1)}M
                        </div>
                      </div>
                      <div
                        className="font-mono text-xs font-bold tabular-nums"
                        style={{
                          color:
                            c.meanLST >= 46
                              ? "var(--heat-hot)"
                              : c.meanLST >= 44
                                ? "var(--heat-warm)"
                                : c.meanLST >= 38
                                  ? "var(--heat-mild)"
                                  : "var(--heat-cool)",
                        }}
                      >
                        {c.meanLST.toFixed(1)}°
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                No matches.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
