import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { DashHeader } from "@/components/DashHeader";
import { AppBackground } from "@/components/AppBackground";
import { AIInsightsPanel } from "@/components/AIInsightsPanel";
import { AI_DRIVERS, getCity, riskIndex } from "@/lib/heat-data";
import { Activity, Brain } from "lucide-react";

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
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppBackground />
      <DashHeader cityId={cityId} />
      <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">
        <div className="space-panel rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/12 p-2.5 text-primary">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gradient-space">{city.name} · Driver Analysis</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Gradient-boosted attribution + SHAP values across ward-level surface features.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Tile label="Mean risk index" value={`${meanRisk}/100`} delta="composite weighting" tone="warn" />
          <Tile label="Hottest ward" value={hottest.name} delta={`${hottest.lst.toFixed(1)}°C`} tone="hot" />
          <Tile label="Coolest ward" value={coolest.name} delta={`${coolest.lst.toFixed(1)}°C`} tone="cool" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="space-panel rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-primary/12 p-2.5 text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Global feature importance · SHAP
                </div>
                <div className="text-sm font-bold">What's driving the heat city-wide?</div>
              </div>
            </div>
            <div className="space-y-4">
              {AI_DRIVERS.map((d) => (
                <div key={d.feature} className="rounded-xl border border-primary/8 bg-card/20 p-4 transition-all hover:border-primary/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold">{d.feature}</span>
                    <span className="font-mono font-bold text-primary">+{(d.impact * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-muted/30">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${d.impact * 250}%`, boxShadow: "0 0 8px var(--primary)" }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                    <span>Confidence {d.confidence}%</span>
                    <span>{d.direction}</span>
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

function Tile({
  label, value, delta, tone
}: {
  label: string; value: string; delta: string;
  tone: "warn" | "hot" | "cool";
}) {
  const colorMap = {
    warn: "text-[var(--heat-warm)] bg-[var(--heat-warm)]/12",
    hot: "text-[var(--heat-hot)] bg-[var(--heat-hot)]/12",
    cool: "text-[var(--heat-cool)] bg-[var(--heat-cool)]/12",
  }[tone];

  return (
    <div className="space-panel group rounded-2xl p-5 transition-all hover:shadow-[0_0_15px_var(--primary)/10]">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 truncate text-lg font-bold">{value}</div>
      <div className={`mt-2 inline-flex items-center gap-1.5 rounded-lg border border-primary/10 bg-primary/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${colorMap.split(" ")[0]}`}>
        {delta}
      </div>
    </div>
  );
}
