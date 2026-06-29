import { heatColor, type Ward } from "@/lib/heat-data";

export type MapLayer = "LST" | "NDVI" | "Albedo" | "ISF";

type Props = {
  wards: Ward[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  cityLabel: string;
  satellite: string;
  lat: string;
  lon: string;
  todOffset?: number;
  horizonDelta?: number;
  layer?: MapLayer;
};

function layerColor(layer: MapLayer, w: Ward): string {
  switch (layer) {
    case "NDVI":
      // higher NDVI = greener (cooler look)
      return w.ndvi > 0.45 ? "var(--heat-cool)" : w.ndvi > 0.3 ? "var(--heat-mild)" : w.ndvi > 0.2 ? "var(--heat-warm)" : "var(--heat-hot)";
    case "Albedo":
      return w.albedo > 0.2 ? "var(--heat-cool)" : w.albedo > 0.16 ? "var(--heat-mild)" : w.albedo > 0.13 ? "var(--heat-warm)" : "var(--heat-hot)";
    case "ISF":
      return w.isf < 0.5 ? "var(--heat-cool)" : w.isf < 0.65 ? "var(--heat-mild)" : w.isf < 0.78 ? "var(--heat-warm)" : "var(--heat-extreme)";
    default:
      return heatColor(w.lst);
  }
}

function layerValue(layer: MapLayer, w: Ward): string {
  switch (layer) {
    case "NDVI":   return w.ndvi.toFixed(2);
    case "Albedo": return w.albedo.toFixed(2);
    case "ISF":    return w.isf.toFixed(2);
    default:       return `${w.lst.toFixed(1)}°`;
  }
}

export function HeatMapCanvas({
  wards,
  selectedId,
  onSelect,
  cityLabel,
  satellite,
  lat,
  lon,
  todOffset = 0,
  horizonDelta = 0,
  layer = "LST",
}: Props) {
  const adjusted = wards.map((w) => ({ ...w, lst: w.lst + todOffset + horizonDelta }));
  const hottest = [...adjusted].sort((a, b) => b.lst - a.lst)[0];

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-[oklch(0.13_0.02_250)] grid-bg">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        {adjusted.map((w) => (
          <div
            key={`glow-${w.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              left: `${w.x * 100}%`,
              top: `${w.y * 100}%`,
              width: `${120 + Math.max(0, w.lst - 33) * 18}px`,
              height: `${120 + Math.max(0, w.lst - 33) * 18}px`,
              background: `radial-gradient(circle, ${layerColor(layer, w)} 0%, transparent 70%)`,
              opacity: 0.55,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 h-px animate-scanline bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

      <div className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {lat} · {lon} · {cityLabel} · {satellite}
      </div>
      <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        LIVE INGEST
      </div>

      {adjusted.map((w) => {
        const isSelected = selectedId === w.id;
        const isHot = w.lst >= 46;
        return (
          <button
            key={w.id}
            onClick={() => onSelect(w.id)}
            className="group absolute -translate-x-1/2 -translate-y-1/2 outline-none"
            style={{ left: `${w.x * 100}%`, top: `${w.y * 100}%` }}
          >
            <div
              className={`relative h-3 w-3 rounded-full ring-2 ring-background transition-all ${
                isSelected ? "scale-150" : "group-hover:scale-125"
              }`}
              style={{ background: layerColor(layer, w) }}
            >
              {isHot && layer === "LST" && (
                <div
                  className="absolute inset-0 animate-pulse-heat rounded-full"
                  style={{ background: layerColor(layer, w), filter: "blur(6px)" }}
                />
              )}
            </div>
            <div
              className={`mt-1.5 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[10px] backdrop-blur transition-all ${
                isSelected
                  ? "border-primary bg-primary/20 text-foreground"
                  : "border-border/60 bg-card/70 text-muted-foreground group-hover:text-foreground"
              }`}
              style={{ marginLeft: "-2px" }}
            >
              <span className="font-medium tracking-wide">{w.name}</span>
              <span style={{ color: layerColor(layer, w) }}>{layerValue(layer, w)}</span>
            </div>
          </button>
        );
      })}

      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
        <div className="glass-panel rounded-md px-3 py-2">
          <div className="mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Land Surface Temp (°C)
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-40 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--heat-cool), var(--heat-mild), var(--heat-warm), var(--heat-hot), var(--heat-extreme))",
              }}
            />
            <div className="flex w-40 justify-between font-mono text-[10px] text-muted-foreground">
              <span>30</span>
              <span>40</span>
              <span>50+</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-md px-3 py-2 text-right">
          <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Hottest zone
          </div>
          <div className="mt-0.5 text-sm">
            <span className="font-medium">{hottest.name}</span>
            <span className="ml-2 font-mono" style={{ color: heatColor(hottest.lst) }}>
              {hottest.lst.toFixed(1)}°C
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function getWard(wards: Ward[], id: string | null): Ward | null {
  if (!id) return null;
  return wards.find((w) => w.id === id) ?? null;
}
