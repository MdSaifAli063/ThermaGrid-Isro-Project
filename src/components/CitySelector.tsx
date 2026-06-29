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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-medium backdrop-blur transition-colors hover:bg-card"
      >
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span>
          {city.name}
          <span className="ml-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {city.state}
          </span>
        </span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="glass-panel animate-fade-up absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-lg p-1.5 shadow-2xl">
          <div className="relative px-1 pb-1.5">
            <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search state or city…"
              className="w-full rounded-md border border-border/60 bg-background/60 py-1.5 pl-8 pr-2 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="max-h-80 overflow-y-auto">
            {filtered.map((g) => (
              <div key={g.state}>
                <div className="sticky top-0 bg-card/95 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground backdrop-blur">
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
                      className={`flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                        active ? "bg-primary/10 text-foreground" : "text-foreground/90 hover:bg-muted/50"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{c.name}</span>
                          {active && <Check className="h-3 w-3 text-primary" />}
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground">
                          {c.wards.length} wards · {(c.populationTotal / 1e6).toFixed(1)}M
                        </div>
                      </div>
                      <div
                        className="font-mono text-xs tabular-nums"
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

