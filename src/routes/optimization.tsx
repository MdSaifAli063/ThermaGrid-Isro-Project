import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { DashHeader } from "@/components/DashHeader";
import { CoolingStrategyChart } from "@/components/CoolingStrategyChart";
import { ScenarioSimulator } from "@/components/ScenarioSimulator";
import { COOLING_STRATEGIES, getCity, riskIndex } from "@/lib/heat-data";
import { TrendingDown, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground star-bg">
      <DashHeader cityId={cityId} />
      <main className="mx-auto max-w-[1600px] space-y-6 px-6 py-6">
        <div className="space-panel rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-accent/12 p-2.5 text-accent">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gradient-space">{city.name} · Intervention Optimizer</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Multi-objective ranking (cooling × cost × coverage) over the deployable strategy set.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-panel rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/12 p-2.5 text-emerald-400">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Strategy ranking · ROI (°C per ₹k/m²)
                </div>
                <div className="text-sm font-bold">Best bang-for-buck</div>
              </div>
            </div>
            <div className="space-y-3">
              {ranked.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3 rounded-xl border border-primary/10 bg-card/25 p-4 transition-all hover:bg-primary/5">
                  <div className="w-8 font-mono text-xs font-bold text-muted-foreground">#{i + 1}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold">{s.name}</div>
                    <div className="mt-1 font-mono text-[10px] text-muted-foreground/60 leading-relaxed">
                      −{s.reduction.toFixed(1)}°C · ₹{s.cost}/m² · {s.coverage}% deployable
                    </div>
                  </div>
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs font-bold tabular-nums text-emerald-400">
                    ROI {s.roi}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-panel rounded-2xl p-5">
            <div className="mb-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Ward priority queue · top 8
              </div>
              <div className="text-sm font-bold">Deploy here first</div>
            </div>
            <div className="space-y-3">
              {priority.map(({ w, score }, i) => (
                <div key={w.id} className="flex items-center gap-3 rounded-xl border border-primary/10 bg-card/25 p-4 transition-all hover:bg-primary/5">
                  <div className="w-8 font-mono text-xs font-bold text-muted-foreground">#{i + 1}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold">{w.name}</div>
                    <div className="mt-1 font-mono text-[10px] text-muted-foreground/60 leading-relaxed">
                      {w.lst.toFixed(1)}°C · {(w.populationExposed / 1000).toFixed(0)}k residents · ISF {w.isf.toFixed(2)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[var(--heat-hot)]/20 bg-[var(--heat-hot)]/10 px-3 py-1.5 font-mono text-xs font-bold tabular-nums text-[var(--heat-hot)]">
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
