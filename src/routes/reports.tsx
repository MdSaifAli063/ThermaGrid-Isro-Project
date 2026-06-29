import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { DashHeader } from "@/components/DashHeader";
import { CITIES, generateAlerts, riskIndex, getCity } from "@/lib/heat-data";
import { Download, FileText } from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground">
      <DashHeader cityId={cityId} />
      <main className="mx-auto max-w-[1600px] space-y-5 px-6 py-6">
        <div>
          <h1 className="text-xl font-semibold">Reports & Exports</h1>
          <p className="text-sm text-muted-foreground">
            Download CSV bundles for offline analysis, GIS ingestion, or stakeholder briefings.
          </p>
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

        <div className="glass-panel rounded-lg p-4">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            City exports
          </div>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => exportCity(c.id)}
                className="flex items-center justify-between rounded-md border border-border/40 bg-card/40 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"
              >
                <span>
                  <span className="font-medium">{c.name}</span>
                  <span className="ml-2 font-mono text-[10px] text-muted-foreground">{c.wards.length} wards</span>
                </span>
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
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
      className="glass-panel group flex flex-col gap-3 rounded-lg p-4 text-left transition-colors hover:border-primary/60"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-md bg-primary/15 p-2 text-primary">
          <FileText className="h-4 w-4" />
        </div>
        <Download className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}
