import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { DashHeader } from "@/components/DashHeader";
import { MaterialTable } from "@/components/MaterialTable";
import { CoolingStrategyChart } from "@/components/CoolingStrategyChart";
import { MATERIALS } from "@/lib/heat-data";

const searchSchema = z.object({
  city: fallback(z.string(), "bengaluru").default("bengaluru"),
});

export const Route = createFileRoute("/materials")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Materials · ThermaGrid" },
      { name: "description", content: "Compare cool roofs, reflective paints, permeable pavers and other UHI mitigation surfaces." },
    ],
  }),
  component: MaterialsPage,
});

function MaterialsPage() {
  const { city } = Route.useSearch();
  const best = [...MATERIALS].sort((a, b) => b.cooling - a.cooling)[0];
  const cheapest = [...MATERIALS].sort((a, b) => a.cost - b.cost)[0];
  const longest = [...MATERIALS].sort((a, b) => b.durability - a.durability)[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashHeader cityId={city} />
      <main className="mx-auto max-w-[1600px] space-y-5 px-6 py-6">
        <div>
          <h1 className="text-xl font-semibold">Material Performance Library</h1>
          <p className="text-sm text-muted-foreground">
            Lab + field measurements for surface treatments deployed in Indian climates.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <StatTile label="Top cooling" value={best.name} delta={`−${best.cooling.toFixed(1)}°C ΔT`} />
          <StatTile label="Lowest capex" value={cheapest.name} delta={`₹${cheapest.cost}/m²`} />
          <StatTile label="Longest life" value={longest.name} delta={`${longest.durability} years`} />
        </div>
        <CoolingStrategyChart />
        <MaterialTable />
      </main>
    </div>
  );
}

function StatTile({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-base font-semibold">{value}</div>
      <div className="font-mono text-[10px] text-accent">{delta}</div>
    </div>
  );
}
