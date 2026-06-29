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
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-primary/20 space-panel grid-bg shadow-[0_0_30px_rgba(34,211,238,0.05)]">
      {/* Heat glow layer */}
      <div className="pointer-events-none absolute inset-0 opacity-75">
        {adjusted.map((w) => (
          <div
            key={`glow-${w.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl mix-blend-screen"
            style={{
              left: `${w.x * 100}%`,
              top: `${w.y * 100}%`,
              width: `${140 + Math.max(0, w.lst - 33) * 20}px`,
              height: `${140 + Math.max(0, w.lst - 33) * 20}px`,
              background: `radial-gradient(circle, ${layerColor(layer, w)} 0%, transparent 70%)`,
              opacity: 0.65,
            }}
          />
        ))}
      </div>

      {/* Scanline */}
      <div className="pointer-events-none absolute inset-x-0 h-[2px] animate-scanline bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-60 mix-blend-screen shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

      {/* Top-left metadata */}
      <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-primary/20 bg-background/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary/80 backdrop-blur-md shadow-lg">
        {lat} · {lon} · {cityLabel} · {satellite}
      </div>

      {/* Live ingest badge */}
      <div className="pointer-events-none absolute right-4 top-4">
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            LIVE INGEST
          </span>
        </div>
      </div>

      {/* Ward dots */}
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
              className={`relative h-3.5 w-3.5 rounded-full ring-2 transition-all duration-300 ${
                isSelected ? "scale-[1.8] ring-primary" : "ring-background/50 group-hover:scale-125 group-hover:ring-primary/50"
              }`}
              style={{
                background: layerColor(layer, w),
                boxShadow: isSelected ? `0 0 20px ${layerColor(layer, w)}` : `0 0 8px ${layerColor(layer, w)}`,
              }}
            >
              {isHot && layer === "LST" && (
                <div
                  className="absolute inset-0 animate-pulse-heat rounded-full mix-blend-screen"
                  style={{ background: layerColor(layer, w), filter: "blur(4px)" }}
                />
              )}
            </div>
            <div
              className={`mt-2.5 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-xl border px-2.5 py-1 font-mono text-[10px] backdrop-blur-md transition-all duration-300 ${
                isSelected
                  ? "border-primary/50 bg-primary/20 text-foreground shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  : "border-primary/15 bg-card/60 text-muted-foreground group-hover:text-foreground group-hover:border-primary/30 group-hover:bg-primary/10"
              }`}
              style={{ marginLeft: "-2px" }}
            >
              <span className="font-bold tracking-wide">{w.name}</span>
              <span className="font-bold" style={{ color: layerColor(layer, w) }}>{layerValue(layer, w)}</span>
            </div>
          </button>
        );
      })}

      {/* Bottom bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 pointer-events-none">
        <div className="rounded-xl border border-primary/20 bg-background/60 px-4 py-2.5 backdrop-blur-md shadow-lg">
          <div className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-primary/60">
            Land Surface Temp (°C)
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-40 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--heat-cool), var(--heat-mild), var(--heat-warm), var(--heat-hot), var(--heat-extreme))",
                boxShadow: "0 0 10px color-mix(in oklch, var(--heat-warm) 40%, transparent)",
              }}
            />
            <div className="flex w-40 justify-between font-mono text-[10px] font-bold text-muted-foreground">
              <span>30</span>
              <span>40</span>
              <span>50+</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-background/60 px-4 py-2.5 text-right backdrop-blur-md shadow-lg">
          <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-primary/60">
            Hottest zone
          </div>
          <div className="mt-1 text-sm">
            <span className="font-bold text-foreground">{hottest.name}</span>
            <span className="ml-2 font-mono font-bold" style={{ color: heatColor(hottest.lst), textShadow: `0 0 10px ${heatColor(hottest.lst)}` }}>
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
