import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, Download, Layers, Thermometer, Users, Search,
} from "lucide-react";
import { HeatMapCanvas, getWard, type MapLayer } from "@/components/HeatMapCanvas";
import { AIInsightsPanel } from "@/components/AIInsightsPanel";
import { CoolingStrategyChart } from "@/components/CoolingStrategyChart";
import { ScenarioSimulator } from "@/components/ScenarioSimulator";
import { DashHeader } from "@/components/DashHeader";
import { NeighborhoodTable } from "@/components/NeighborhoodTable";
import { MaterialTable } from "@/components/MaterialTable";
import { CitySelector } from "@/components/CitySelector";
import { TimeHorizonControls } from "@/components/TimeHorizonControls";
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
    <div className="min-h-screen bg-background text-foreground">
      <DashHeader cityId={cityId} />
      <div className="border-b border-border/60 bg-background/60">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-end gap-2 px-6 py-2">
          <CitySelector cityId={cityId} onChange={changeCity} />
          <TimeHorizonControls tod={tod} setTod={setTod} horizon={horizon} setHorizon={setHorizon} />
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] space-y-5 px-6 py-6">
        {/* City context bar */}
        <div className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-semibold">{city.name}</h1>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {city.lat} · {city.lon} · {city.climate} · {(city.populationTotal / 1e6).toFixed(1)}M residents
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {city.satellite} · {city.capturedOn} · {horizon === "now" ? "Today" : `Projection ${horizon}`} · {tod}
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPI icon={Thermometer} label="Mean LST" value={`${meanLST.toFixed(1)}°C`} delta={horizon === "now" ? "Live observation" : `+${horizonDelta.toFixed(1)}°C climate drift`} tone="warn" />
          <KPI icon={Activity} label="Hottest ward" value={hottest.name} delta={`${hottest.lst.toFixed(1)}°C peak`} tone="hot" />
          <KPI icon={Users} label="Population at risk" value={`${(totalAtRisk / 1e6).toFixed(2)} M`} delta={`${((totalAtRisk / city.populationTotal) * 100).toFixed(1)}% of metro`} tone="muted" />
          <KPI icon={AlertTriangle} label="Active alerts" value={String(totalAlerts)} delta="zones > 46°C" tone="alert" />
        </div>

        {/* Map + Insights */}
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <div className="glass-panel rounded-lg p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Thermal map · LST overlay
                  </div>
                  <div className="text-sm font-semibold">{city.name} thermal stack</div>
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
              <div className="glass-panel rounded-lg p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Inspecting zone
                    </div>
                    <div className="text-2xl font-semibold">{selected.name}</div>
                  </div>
                  <div className="flex flex-wrap gap-6 font-mono text-xs text-muted-foreground">
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

        {/* Scenario simulator */}
        <ScenarioSimulator baselineLST={selected?.lst ?? meanLST} />

        {/* Trend + Alerts */}
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <LSTTrendChart baseline={meanLST} label={city.name} />
          <AlertsFeed alerts={alerts} onSelectWard={setSelectedId} />
        </div>

        {/* Cooling chart + filterable ward table */}
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <CoolingStrategyChart />

          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter wards…"
                className="w-full rounded-md border border-border bg-card/60 py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
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

        {/* City compare */}
        <CityCompareStrip />

        <footer className="pt-4 pb-8 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Data sources: Landsat-9 · Sentinel-2 · ISRO Bhuvan · MOSDAC · OSM · Census 2021
        </footer>
      </main>
    </div>
  );
}

function CityCompareStrip() {
  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="mb-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Cross-city benchmark
        </div>
        <div className="text-sm font-semibold">Mean LST across Indian metros</div>
      </div>
      <div className="space-y-2.5">
        {[...CITIES].sort((a, b) => b.meanLST - a.meanLST).map((c) => {
          const pct = Math.min(100, ((c.meanLST - 36) / 16) * 100);
          const color =
            c.meanLST >= 47 ? "var(--heat-extreme)" :
            c.meanLST >= 45 ? "var(--heat-hot)" :
            c.meanLST >= 43 ? "var(--heat-warm)" :
            "var(--heat-mild)";
          return (
            <div key={c.id} className="flex items-center gap-3">
              <div className="w-28 shrink-0 text-sm font-medium">{c.name}</div>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className="w-16 text-right font-mono text-xs tabular-nums" style={{ color }}>
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

function KPI({
  icon: Icon, label, value, delta, tone,
}: {
  icon: typeof Activity; label: string; value: string; delta: string;
  tone: "warn" | "hot" | "muted" | "alert";
}) {
  const toneClass = {
    warn:  "text-[var(--heat-warm)] bg-[var(--heat-warm)]/10",
    hot:   "text-[var(--heat-hot)] bg-[var(--heat-hot)]/10",
    muted: "text-accent bg-accent/10",
    alert: "text-[var(--heat-extreme)] bg-[var(--heat-extreme)]/10",
  }[tone];
  return (
    <div className="glass-panel flex items-center gap-4 rounded-lg p-4">
      <div className={`rounded-md p-2.5 ${toneClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="truncate text-lg font-semibold">{value}</div>
        <div className="font-mono text-[10px] text-muted-foreground">{delta}</div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-widest">{label}</div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  );
}

function LayerSwitcher({ value, onChange }: { value: MapLayer; onChange: (l: MapLayer) => void }) {
  const layers: MapLayer[] = ["LST", "NDVI", "Albedo", "ISF"];
  return (
    <div className="flex items-center gap-1 rounded-md border border-border/60 bg-card/60 p-1">
      <Layers className="ml-1 h-3 w-3 text-muted-foreground" />
      {layers.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
            value === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
