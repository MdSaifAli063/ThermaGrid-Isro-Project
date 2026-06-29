import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { DashHeader } from "@/components/DashHeader";
import { CoolingStrategyChart } from "@/components/CoolingStrategyChart";
import { ScenarioSimulator } from "@/components/ScenarioSimulator";
import { COOLING_STRATEGIES, getCity, riskIndex } from "@/lib/heat-data";
import { TrendingDown } from "lucide-react";

const searchSchema = z.object({
  city: fallback(z.string(), "bengaluru").default("bengaluru"),
});

export const Route = createFileRoute("/optimization")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Optimization · ThermaGrid" },
      { name: "description", content: "Recommend the highest-ROI cooling interventions per ward using multi-objective optimization." },
    ],
  }),
  component: OptimizationPage,
});

function OptimizationPage() {
  const { city: cityId } = Route.useSearch();
  const city = getCity(cityId);
  const priority = [...city.wards]
    .map((w) => ({ w, score: riskIndex(w) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  // Naive ROI: ΔT / (cost in ₹k per m²)
  const ranked = [...COOLING_STRATEGIES]
    .map((s) => ({ ...s, roi: +(s.reduction / (s.cost / 1000)).toFixed(2) }))
    .sort((a, b) => b.roi - a.roi);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashHeader cityId={cityId} />
      <main className="mx-auto max-w-[1600px] space-y-5 px-6 py-6">
        <div>
          <h1 className="text-xl font-semibold">{city.name} · Intervention Optimizer</h1>
          <p className="text-sm text-muted-foreground">
            Multi-objective ranking (cooling × cost × coverage) over the deployable strategy set.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <div className="glass-panel rounded-lg p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-md bg-emerald-500/15 p-1.5 text-emerald-400">
                <TrendingDown className="h-4 w-4" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Strategy ranking · ROI (°C per ₹k/m²)
                </div>
                <div className="text-sm font-semibold">Best bang-for-buck</div>
              </div>
            </div>
            <div className="space-y-2">
              {ranked.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3 rounded-md border border-border/40 bg-card/40 p-3">
                  <div className="w-6 font-mono text-xs text-muted-foreground">#{i + 1}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      −{s.reduction.toFixed(1)}°C · ₹{s.cost}/m² · {s.coverage}% deployable
                    </div>
                  </div>
                  <div className="rounded-md bg-emerald-500/10 px-2 py-1 font-mono text-xs tabular-nums text-emerald-400">
                    ROI {s.roi}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-lg p-4">
            <div className="mb-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Ward priority queue · top 8
              </div>
              <div className="text-sm font-semibold">Deploy here first</div>
            </div>
            <div className="space-y-2">
              {priority.map(({ w, score }, i) => (
                <div key={w.id} className="flex items-center gap-3 rounded-md border border-border/40 bg-card/40 p-3">
                  <div className="w-6 font-mono text-xs text-muted-foreground">#{i + 1}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{w.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {w.lst.toFixed(1)}°C · {(w.populationExposed / 1000).toFixed(0)}k residents · ISF {w.isf.toFixed(2)}
                    </div>
                  </div>
                  <div className="rounded-md bg-[var(--heat-hot)]/10 px-2 py-1 font-mono text-xs tabular-nums text-[var(--heat-hot)]">
                    Risk {score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <CoolingStrategyChart />
        <ScenarioSimulator baselineLST={city.meanLST} />
      </main>
    </div>
  );
}
