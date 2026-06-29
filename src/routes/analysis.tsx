import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { DashHeader } from "@/components/DashHeader";
import { AIInsightsPanel } from "@/components/AIInsightsPanel";
import { AI_DRIVERS, getCity, riskIndex } from "@/lib/heat-data";

const searchSchema = z.object({
  city: fallback(z.string(), "bengaluru").default("bengaluru"),
});

export const Route = createFileRoute("/analysis")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Analysis · ThermaGrid" },
      { name: "description", content: "SHAP-driven attribution of urban heat drivers for the selected city." },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const { city: cityId } = Route.useSearch();
  const city = getCity(cityId);
  const hottest = [...city.wards].sort((a, b) => b.lst - a.lst)[0];
  const coolest = [...city.wards].sort((a, b) => a.lst - b.lst)[0];
  const meanRisk = Math.round(city.wards.reduce((s, w) => s + riskIndex(w), 0) / city.wards.length);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashHeader cityId={cityId} />
      <main className="mx-auto max-w-[1600px] space-y-5 px-6 py-6">
        <div>
          <h1 className="text-xl font-semibold">{city.name} · Driver Analysis</h1>
          <p className="text-sm text-muted-foreground">
            Gradient-boosted attribution + SHAP values across ward-level surface features.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Tile label="Mean risk index" value={`${meanRisk}/100`} delta="composite weighting" />
          <Tile label="Hottest ward" value={hottest.name} delta={`${hottest.lst.toFixed(1)}°C`} />
          <Tile label="Coolest ward" value={coolest.name} delta={`${coolest.lst.toFixed(1)}°C`} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="glass-panel rounded-lg p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Global feature importance · SHAP
            </div>
            <div className="text-sm font-semibold">What's driving the heat city-wide?</div>
            <div className="mt-4 space-y-3">
              {AI_DRIVERS.map((d) => (
                <div key={d.feature}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{d.feature}</span>
                    <span className="font-mono tabular-nums text-primary">+{(d.impact * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${d.impact * 250}%` }} />
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Confidence {d.confidence}% · {d.direction}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AIInsightsPanel ward={hottest} />
        </div>
      </main>
    </div>
  );
}

function Tile({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-lg font-semibold">{value}</div>
      <div className="font-mono text-[10px] text-accent">{delta}</div>
    </div>
  );
}
