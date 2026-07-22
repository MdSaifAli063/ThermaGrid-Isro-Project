import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { DashHeader } from "@/components/DashHeader";
import { AppBackground } from "@/components/AppBackground";
import { LSTTrendChart } from "@/components/LSTTrendChart";
import { ScenarioSimulator } from "@/components/ScenarioSimulator";
import { getCity, HORIZON_DELTA } from "@/lib/heat-data";
import { LineChart, Calendar } from "lucide-react";

const searchSchema = z.object({
  city: fallback(z.string(), "bengaluru").default("bengaluru"),
});

export const Route = createFileRoute("/predictions")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Predictions · ThermaGrid" },
      { name: "description", content: "Climate horizon projections (2030 / 2050) and scenario counterfactuals for Indian cities." },
    ],
  }),
  component: PredictionsPage,
});

function PredictionsPage() {
  const { city: cityId } = Route.useSearch();
  const city = getCity(cityId);
  const proj2030 = city.meanLST + HORIZON_DELTA["2030"];
  const proj2050 = city.meanLST + HORIZON_DELTA["2050"];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppBackground />
      <DashHeader cityId={cityId} />
      <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">
        <div className="space-panel rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/12 p-2.5 text-primary">
              <LineChart className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gradient-space">{city.name} · Climate Projections</h1>
              <p className="text-xs text-muted-foreground mt-1">
                CMIP6 SSP2-4.5 downscaled to ward grid · WRF-Urban canopy parameterization.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Horizon label="Today" value={city.meanLST} delta="Baseline observation" tone="cool" />
          <Horizon label="2030" value={proj2030} delta={`+${HORIZON_DELTA["2030"].toFixed(1)}°C`} tone="warn" />
          <Horizon label="2050" value={proj2050} delta={`+${HORIZON_DELTA["2050"].toFixed(1)}°C`} tone="hot" />
        </div>

        <LSTTrendChart baseline={city.meanLST} label={city.name} />
        <ScenarioSimulator baselineLST={city.meanLST} />
      </main>
    </div>
  );
}

function Horizon({
  label, value, delta, tone
}: {
  label: string; value: number; delta: string;
  tone: "cool" | "warn" | "hot";
}) {
  const colorMap = {
    cool: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    warn: "text-[var(--heat-warm)] border-[var(--heat-warm)]/20 bg-[var(--heat-warm)]/10",
    hot: "text-[var(--heat-hot)] border-[var(--heat-hot)]/20 bg-[var(--heat-hot)]/10",
  }[tone];

  return (
    <div className="space-panel group rounded-2xl p-5 transition-all hover:shadow-[0_0_15px_var(--primary)/10]">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-bold tabular-nums tracking-tight">
        {value.toFixed(1)}<span className="text-base font-medium text-muted-foreground">°C</span>
      </div>
      <div className={`mt-2 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider font-bold ${colorMap}`}>
        <Calendar className="h-3 w-3" />
        {delta}
      </div>
    </div>
  );
}
