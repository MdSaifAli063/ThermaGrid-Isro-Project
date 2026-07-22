import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { DashHeader } from "@/components/DashHeader";
import { AppBackground } from "@/components/AppBackground";
import { CITIES, generateAlerts, riskIndex, getCity } from "@/lib/heat-data";
import { Download, FileText, Satellite } from "lucide-react";

const searchSchema = z.object({
  city: fallback(z.string(), "bengaluru").default("bengaluru"),
});

export const Route = createFileRoute("/reports")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Reports · ThermaGrid" },
      { name: "description", content: "Generate ward-level CSV exports and city briefings for stakeholders." },
    ],
  }),
  component: ReportsPage,
});

function downloadCSV(name: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function ReportsPage() {
  const { city: cityId } = Route.useSearch();

  function exportCity(id: string) {
    const c = getCity(id);
    const header = ["Ward", "LST_C", "NDVI", "Albedo", "ISF", "Population", "Area_km2", "RiskIndex"];
    const rows = c.wards.map((w) => [
      w.name, w.lst.toFixed(2), w.ndvi, w.albedo, w.isf, w.populationExposed, w.area, riskIndex(w),
    ]);
    downloadCSV(`thermagrid-${id}.csv`, [header, ...rows]);
  }

  function exportNational() {
    const header = ["City", "State", "Ward", "LST_C", "NDVI", "Albedo", "ISF", "Population", "RiskIndex"];
    const rows = CITIES.flatMap((c) =>
      c.wards.map((w) => [c.name, c.state, w.name, w.lst.toFixed(2), w.ndvi, w.albedo, w.isf, w.populationExposed, riskIndex(w)])
    );
    downloadCSV(`thermagrid-india-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...rows]);
  }

  function exportAlerts() {
    const header = ["City", "Ward", "Severity", "Triggered", "Message"];
    const rows = CITIES.flatMap((c) =>
      generateAlerts(c).map((a) => [c.name, a.wardName, a.severity, a.triggeredAt, a.message])
    );
    downloadCSV(`thermagrid-alerts.csv`, [header, ...rows]);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppBackground />
      <DashHeader cityId={cityId} />
      <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">
        <div className="space-panel rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/12 p-2.5 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gradient-space">Reports & Exports</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Download CSV bundles for offline analysis, GIS ingestion, or stakeholder briefings.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ReportCard
            title="National ward dataset"
            desc={`All ${CITIES.reduce((s, c) => s + c.wards.length, 0)} wards across ${CITIES.length} cities — LST, NDVI, albedo, ISF, risk index.`}
            onClick={exportNational}
          />
          <ReportCard
            title="Active alerts bundle"
            desc="Every ward currently crossing the 45°C threshold with severity classification."
            onClick={exportAlerts}
          />
          <ReportCard
            title={`${getCity(cityId).name} city pack`}
            desc="Ward roster for the currently selected city."
            onClick={() => exportCity(cityId)}
          />
        </div>

        <div className="space-panel rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-primary/12 p-2.5 text-primary">
              <Satellite className="h-5 w-5" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                City roster
              </div>
              <div className="text-sm font-bold">Individual city pack downloads</div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => exportCity(c.id)}
                className="flex items-center justify-between rounded-xl border border-primary/10 bg-card/25 px-4 py-3 text-left text-sm transition-all hover:bg-primary/5 hover:border-primary/20"
              >
                <span>
                  <span className="font-bold">{c.name}</span>
                  <span className="ml-3 font-mono text-[10px] text-muted-foreground/60">{c.wards.length} wards</span>
                </span>
                <Download className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function ReportCard({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="space-panel group flex flex-col gap-4 rounded-2xl p-5 text-left transition-all hover:border-primary/45 hover:shadow-[0_0_15px_var(--primary)/10]"
    >
      <div className="flex w-full items-center justify-between">
        <div className="rounded-xl bg-primary/12 p-2.5 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="rounded-xl border border-primary/15 bg-card/40 p-2 transition-all group-hover:bg-primary/10">
          <Download className="h-4.5 w-4.5 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
      </div>
      <div>
        <div className="text-base font-bold text-gradient-space">{title}</div>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </button>
  );
}
