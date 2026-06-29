import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { DashHeader } from "@/components/DashHeader";
import { LSTTrendChart } from "@/components/LSTTrendChart";
import { ScenarioSimulator } from "@/components/ScenarioSimulator";
import { getCity, HORIZON_DELTA } from "@/lib/heat-data";

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
    <div className="min-h-screen bg-background text-foreground">
      <DashHeader cityId={cityId} />
      <main className="mx-auto max-w-[1600px] space-y-5 px-6 py-6">
        <div>
          <h1 className="text-xl font-semibold">{city.name} · Climate Projections</h1>
          <p className="text-sm text-muted-foreground">
            CMIP6 SSP2-4.5 downscaled to ward grid · WRF-Urban canopy parameterization.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Horizon label="Today" value={city.meanLST} delta="Baseline observation" />
          <Horizon label="2030" value={proj2030} delta={`+${HORIZON_DELTA["2030"].toFixed(1)}°C`} />
          <Horizon label="2050" value={proj2050} delta={`+${HORIZON_DELTA["2050"].toFixed(1)}°C`} />
        </div>
        <LSTTrendChart baseline={city.meanLST} label={city.name} />
        <ScenarioSimulator baselineLST={city.meanLST} />
      </main>
    </div>
  );
}

function Horizon({ label, value, delta }: { label: string; value: number; delta: string }) {
  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-semibold tabular-nums">
        {value.toFixed(1)}<span className="text-base text-muted-foreground">°C</span>
      </div>
      <div className="font-mono text-[10px] text-accent">{delta}</div>
    </div>
  );
}
