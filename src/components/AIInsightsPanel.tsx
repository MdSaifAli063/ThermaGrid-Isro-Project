import { AI_DRIVERS, type Ward } from "@/lib/heat-data";
import { Brain, TrendingUp, Sparkles, Shield } from "lucide-react";

export function AIInsightsPanel({ ward }: { ward: Ward | null }) {
  return (
    <aside className="flex h-full flex-col gap-5">
      {/* ── AI Heat Drivers ── */}
      <div className="space-panel rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/12 p-2.5 text-primary" style={{ boxShadow: "0 0 12px color-mix(in oklch, var(--primary) 20%, transparent)" }}>
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              PINN + XGBoost · SHAP
            </div>
            <div className="text-sm font-bold">AI Heat Drivers</div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {AI_DRIVERS.map((d, i) => (
            <div key={d.feature}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground/90 font-medium">
                  <span className="mr-2 rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">0{i + 1}</span>
                  {d.feature}
                </span>
                <span className="font-mono font-bold text-muted-foreground">{d.confidence}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted/30">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${d.impact * 100 * 2.5}%`,
                    background:
                      "linear-gradient(90deg, var(--heat-warm), var(--heat-hot), var(--heat-extreme))",
                    boxShadow: "0 0 8px var(--heat-hot)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recommendations ── */}
      <div className="space-panel rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-accent/12 p-2.5 text-accent" style={{ boxShadow: "0 0 12px color-mix(in oklch, var(--accent) 20%, transparent)" }}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-sm font-bold">
            {ward ? `Recommendations · ${ward.name}` : "Select a zone"}
          </div>
        </div>

        {ward ? (
          <div className="mt-5 space-y-3 text-xs">
            <Recommendation
              title="Deploy Cool Roof Coating"
              detail={`Albedo uplift 0.05→0.78. Projected ΔT = -${(ward.lst > 46 ? 4.2 : 3.1).toFixed(1)}°C`}
              roi="ROI: 18 mo"
            />
            <Recommendation
              title="Tree canopy +25% along arterials"
              detail={`NDVI ${ward.ndvi.toFixed(2)} → 0.42. Latent heat flux ↑ via Penman-Monteith`}
              roi="CO₂ offset: 1.4kt/yr"
            />
            <Recommendation
              title="Permeable paver retrofit"
              detail={`ISF ${ward.isf.toFixed(2)} → 0.55. Evaporative cooling at noon -2.8°C`}
              roi="₹1.85k/m²"
            />
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-primary/10 bg-primary/5 p-4 text-xs text-muted-foreground">
            Tap any ward on the thermal map to surface site-specific cooling interventions.
          </p>
        )}
      </div>

      {/* ── Model Health ── */}
      <div className="space-panel mt-auto rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Model · v2.3.1
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-2.5 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] font-bold text-emerald-400">HEALTHY</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
          <Stat label="RMSE" value="1.21°C" />
          <Stat label="R²" value="0.93" />
          <Stat label="Zones" value="198" />
        </div>
      </div>
    </aside>
  );
}

function Recommendation({ title, detail, roi }: { title: string; detail: string; roi: string }) {
  return (
    <div className="rounded-xl border border-primary/10 bg-background/30 p-3.5 transition-all hover:border-primary/25 hover:bg-primary/5">
      <div className="flex items-start gap-2.5">
        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="flex-1">
          <div className="font-bold text-foreground/95">{title}</div>
          <div className="mt-1 text-muted-foreground leading-relaxed">{detail}</div>
          <div className="mt-2 inline-block rounded-lg bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent font-bold">
            {roi}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-primary/8 bg-card/30 p-3">
      <div className="font-mono text-base font-bold text-foreground">{value}</div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
