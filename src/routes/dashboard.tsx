import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, Download, Layers, Thermometer, Users, Search,
  Satellite, Radio,
} from "lucide-react";
import { HeatMapCanvas, getWard, type MapLayer } from "@/components/HeatMapCanvas";
import { AIInsightsPanel } from "@/components/AIInsightsPanel";
import { CoolingStrategyChart } from "@/components/CoolingStrategyChart";
import { ScenarioSimulator } from "@/components/ScenarioSimulator";
import { DashHeader } from "@/components/DashHeader";
import { AppBackground } from "@/components/AppBackground";
import { NeighborhoodTable } from "@/components/NeighborhoodTable";
import { MaterialTable } from "@/components/MaterialTable";
import { CitySelector } from "@/components/CitySelector";
import { TimeControls, HorizonControls } from "@/components/TimeHorizonControls";
import { AlertsFeed } from "@/components/AlertsFeed";
import { LSTTrendChart } from "@/components/LSTTrendChart";
import {
  CITIES, getCity, generateAlerts, TOD_OFFSET, HORIZON_DELTA, riskIndex,
  type TimeOfDay, type Horizon,
} from "@/lib/heat-data";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const dashboardSearchSchema = z.object({
  city: fallback(z.string(), "bengaluru").default("bengaluru"),
});


export const Route = createFileRoute("/dashboard")({
  validateSearch: zodValidator(dashboardSearchSchema),
  head: () => ({
    meta: [
      { title: "Mission Control · ThermaGrid Dashboard" },
      { name: "description", content: "Live urban heat island dashboard for major Indian cities — ward-level LST, AI heat drivers, cooling scenarios." },
      { property: "og:title", content: "ThermaGrid · Mission Control" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { city: cityId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const city = getCity(cityId);

  const [selectedId, setSelectedId] = useState<string | null>(city.wards[0].id);
  const [tod, setTod] = useState<TimeOfDay>("noon");
  const [horizon, setHorizon] = useState<Horizon>("now");
  const [filter, setFilter] = useState("");
  const [layer, setLayer] = useState<MapLayer>("LST");

  const todOffset = TOD_OFFSET[tod];
  const horizonDelta = HORIZON_DELTA[horizon];

  // Re-adjust ward list with current time/horizon for child components
  const adjustedWards = useMemo(
    () => city.wards.map((w) => ({ ...w, lst: w.lst + todOffset + horizonDelta })),
    [city.wards, todOffset, horizonDelta]
  );

  const selected = getWard(adjustedWards, selectedId);
  const hottest = [...adjustedWards].sort((a, b) => b.lst - a.lst)[0];
  const meanLST = adjustedWards.reduce((s, w) => s + w.lst, 0) / adjustedWards.length;
  const totalAlerts = adjustedWards.filter((w) => w.lst >= 46).length;
  const totalAtRisk = adjustedWards
    .filter((w) => w.lst >= 45)
    .reduce((s, w) => s + w.populationExposed, 0);

  const alerts = useMemo(
    () => generateAlerts({ ...city, wards: adjustedWards }),
    [city, adjustedWards]
  );

  function changeCity(id: string) {
    const next = getCity(id);
    setSelectedId(next.wards[0].id);
    navigate({ search: { city: id as never } });
  }

  function exportCSV() {
    const header = ["Ward", "LST_C", "NDVI", "Albedo", "ISF", "Population", "Area_km2", "RiskIndex"];
    const rows = adjustedWards.map((w) => [
      w.name, w.lst.toFixed(2), w.ndvi, w.albedo, w.isf, w.populationExposed, w.area, riskIndex(w),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thermagrid-${city.id}-${horizon}-${tod}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppBackground />
      <DashHeader cityId={cityId} />

      {/* ── Sub-header Controls Bar ── */}
      <div className="relative z-40 border-b border-primary/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
          
          {/* Left Group */}
          <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <TimeControls tod={tod} setTod={setTod} />
            <CitySelector cityId={cityId} onChange={changeCity} />
          </div>

          {/* Right Group */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <HorizonControls horizon={horizon} setHorizon={setHorizon} />
            <button
              onClick={exportCSV}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary shadow-lg transition-all hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
          
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">

        {/* ── City Context Bar ── */}
        <div className="space-panel rounded-2xl px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
            <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gradient-space sm:text-2xl">{city.name}</h1>
              <span className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-muted-foreground">
                {city.lat} · {city.lon} · {city.climate} · {(city.populationTotal / 1e6).toFixed(1)}M residents
              </span>
            </div>
            <div className="flex w-full items-start sm:w-auto sm:items-center">
              <div className="flex w-full items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-3 py-2 sm:py-1.5">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-[9px] font-bold uppercase leading-snug tracking-widest text-emerald-400 sm:text-[10px]">
                  {city.satellite} · {city.capturedOn} · {horizon === "now" ? "Today" : `Projection ${horizon}`} · {tod}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI Strip ── */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPI icon={Thermometer} label="Mean LST" value={`${meanLST.toFixed(1)}°C`} delta={horizon === "now" ? "Live observation" : `+${horizonDelta.toFixed(1)}°C climate drift`} tone="warn" />
          <KPI icon={Activity} label="Hottest ward" value={hottest.name} delta={`${hottest.lst.toFixed(1)}°C peak`} tone="hot" />
          <KPI icon={Users} label="Population at risk" value={`${(totalAtRisk / 1e6).toFixed(2)} M`} delta={`${((totalAtRisk / city.populationTotal) * 100).toFixed(1)}% of metro`} tone="muted" />
          <KPI icon={AlertTriangle} label="Active alerts" value={String(totalAlerts)} delta="zones > 46°C" tone="alert" />
        </div>

        {/* ── Map + Insights ── */}
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <div className="space-panel rounded-2xl p-4 sm:p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Thermal map · LST overlay
                  </div>
                  <div className="text-base font-bold">{city.name} thermal stack</div>
                </div>
                <LayerSwitcher value={layer} onChange={setLayer} />
              </div>
              <HeatMapCanvas
                wards={city.wards}
                selectedId={selectedId}
                onSelect={setSelectedId}
                cityLabel={city.name.toUpperCase()}
                satellite={city.satellite.toUpperCase()}
                lat={city.lat}
                lon={city.lon}
                todOffset={todOffset}
                horizonDelta={horizonDelta}
                layer={layer}
              />
            </div>

            {selected && (
              <div className="space-panel rounded-2xl p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Inspecting zone
                    </div>
                    <div className="text-2xl font-bold text-gradient-space">{selected.name}</div>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:gap-6">
                    <Detail label="LST" value={`${selected.lst.toFixed(1)}°C`} />
                    <Detail label="NDVI" value={selected.ndvi.toFixed(2)} />
                    <Detail label="Albedo" value={selected.albedo.toFixed(2)} />
                    <Detail label="ISF" value={selected.isf.toFixed(2)} />
                    <Detail label="Area" value={`${selected.area} km²`} />
                    <Detail label="Risk" value={String(riskIndex(selected))} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <AIInsightsPanel ward={selected} />
        </div>

        {/* ── Scenario Simulator ── */}
        <ScenarioSimulator baselineLST={selected?.lst ?? meanLST} />

        {/* ── Trend + Alerts ── */}
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <LSTTrendChart baseline={meanLST} label={city.name} />
          <AlertsFeed alerts={alerts} onSelectWard={setSelectedId} />
        </div>

        {/* ── Cooling chart + filterable ward table ── */}
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <CoolingStrategyChart />

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter wards…"
                className="w-full rounded-xl border border-primary/15 bg-card/40 py-2.5 pl-10 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground backdrop-blur focus:border-primary/40 focus:outline-none focus:shadow-[0_0_12px_var(--primary)/12]"
              />
            </div>
            <NeighborhoodTable
              wards={adjustedWards}
              selectedId={selectedId}
              onSelect={setSelectedId}
              filter={filter}
            />
          </div>
        </div>

        <MaterialTable />

        {/* ── City Compare ── */}
        <CityCompareStrip />

        <footer className="pt-6 pb-10 text-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-primary/10 bg-card/30 px-6 py-3 backdrop-blur">
            <Satellite className="h-4 w-4 text-primary/60" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Data sources: Landsat-9 · Sentinel-2 · ISRO Bhuvan · MOSDAC · OSM · Census 2021
            </span>
            <Radio className="h-4 w-4 text-primary/60" />
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ─── City Compare Strip ─── */
function CityCompareStrip() {
  return (
    <div className="space-panel rounded-2xl p-5">
      <div className="mb-4">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Cross-city benchmark
        </div>
        <div className="text-base font-bold">Mean LST across Indian metros</div>
      </div>
      <div className="space-y-3">
        {[...CITIES].sort((a, b) => b.meanLST - a.meanLST).map((c) => {
          const pct = Math.min(100, ((c.meanLST - 36) / 16) * 100);
          const color =
            c.meanLST >= 47 ? "var(--heat-extreme)" :
            c.meanLST >= 45 ? "var(--heat-hot)" :
            c.meanLST >= 43 ? "var(--heat-warm)" :
            "var(--heat-mild)";
          return (
            <div key={c.id} className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-all hover:bg-primary/5">
              <div className="w-32 shrink-0 text-sm font-bold group-hover:text-gradient-space transition-all">{c.name}</div>
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}, color-mix(in oklch, ${color} 70%, transparent))`,
                    boxShadow: `0 0 8px ${color}`,
                  }}
                />
              </div>
              <div className="w-16 text-right font-mono text-xs font-bold tabular-nums" style={{ color }}>
                {c.meanLST.toFixed(1)}°C
              </div>
              <div className="hidden w-24 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:block">
                {c.wards.length} wards
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── KPI Card ─── */
function KPI({
  icon: Icon, label, value, delta, tone,
}: {
  icon: typeof Activity; label: string; value: string; delta: string;
  tone: "warn" | "hot" | "muted" | "alert";
}) {
  const toneMap = {
    warn:  { bg: "bg-[var(--heat-warm)]/12", text: "text-[var(--heat-warm)]", glow: "var(--heat-warm)" },
    hot:   { bg: "bg-[var(--heat-hot)]/12",  text: "text-[var(--heat-hot)]",  glow: "var(--heat-hot)" },
    muted: { bg: "bg-primary/12",            text: "text-primary",            glow: "var(--primary)" },
    alert: { bg: "bg-[var(--heat-extreme)]/12", text: "text-[var(--heat-extreme)]", glow: "var(--heat-extreme)" },
  }[tone];

  return (
    <div className="space-panel group flex items-center gap-4 rounded-2xl p-5 transition-all hover:shadow-[0_0_20px_var(--primary)/10]">
      <div className={`rounded-xl p-3 ${toneMap.bg} ${toneMap.text}`} style={{ boxShadow: `0 0 12px color-mix(in oklch, ${toneMap.glow} 20%, transparent)` }}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="truncate text-xl font-bold tracking-tight">{value}</div>
        <div className="font-mono text-[10px] text-muted-foreground/80">{delta}</div>
      </div>
    </div>
  );
}

/* ─── Detail Chip ─── */
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-primary/10 bg-card/30 px-3 py-2 backdrop-blur">
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-bold tabular-nums text-foreground">{value}</div>
    </div>
  );
}

/* ─── Layer Switcher ─── */
function LayerSwitcher({ value, onChange }: { value: MapLayer; onChange: (l: MapLayer) => void }) {
  const layers: MapLayer[] = ["LST", "NDVI", "Albedo", "ISF"];
  return (
    <div className="flex w-full flex-wrap items-center gap-1 rounded-xl border border-primary/15 bg-card/40 p-1.5 backdrop-blur sm:w-auto">
      <Layers className="ml-1 hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
      {layers.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={`min-h-10 flex-1 rounded-lg px-2.5 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-all sm:flex-none sm:py-1.5 ${
            value === l
              ? "bg-primary text-primary-foreground shadow-[0_0_10px_var(--primary)/25]"
              : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
