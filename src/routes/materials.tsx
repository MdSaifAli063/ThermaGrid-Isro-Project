import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { DashHeader } from "@/components/DashHeader";
import { AppBackground } from "@/components/AppBackground";
import { MaterialTable } from "@/components/MaterialTable";
import { CoolingStrategyChart } from "@/components/CoolingStrategyChart";
import { MATERIALS } from "@/lib/heat-data";
import { Zap, Palette } from "lucide-react";

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
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppBackground />
      <DashHeader cityId={city} />
      <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">
        <div className="space-panel rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/12 p-2.5 text-primary">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gradient-space">Material Performance Library</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Lab + field measurements for surface treatments deployed in Indian climates.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatTile label="Top cooling" value={best.name} delta={`−${best.cooling.toFixed(1)}°C ΔT`} tone="extreme" />
          <StatTile label="Lowest capex" value={cheapest.name} delta={`₹${cheapest.cost}/m²`} tone="mild" />
          <StatTile label="Longest life" value={longest.name} delta={`${longest.durability} years`} tone="cool" />
        </div>

        <CoolingStrategyChart />
        <MaterialTable />
      </main>
    </div>
  );
}

function StatTile({
  label, value, delta, tone
}: {
  label: string; value: string; delta: string;
  tone: "extreme" | "mild" | "cool";
}) {
  const colorMap = {
    extreme: "text-[var(--heat-extreme)] bg-[var(--heat-extreme)]/12 glow-extreme",
    mild: "text-[var(--heat-mild)] bg-[var(--heat-mild)]/12 glow-mild",
    cool: "text-[var(--heat-cool)] bg-[var(--heat-cool)]/12 glow-cool",
  }[tone];

  return (
    <div className="space-panel group rounded-2xl p-5 transition-all hover:shadow-[0_0_15px_var(--primary)/10]">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 truncate text-base font-bold">{value}</div>
      <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-primary/10 bg-primary/5 px-2.5 py-1 font-mono text-xs font-bold text-primary">
        <Zap className="h-3 w-3" />
        {delta}
      </div>
    </div>
  );
}
