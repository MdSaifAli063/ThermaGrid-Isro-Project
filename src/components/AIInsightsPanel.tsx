import { AI_DRIVERS, type Ward } from "@/lib/heat-data";
import { Brain, TrendingUp, Sparkles } from "lucide-react";

export function AIInsightsPanel({ ward }: { ward: Ward | null }) {
  return (
    <aside className="flex h-full flex-col gap-4">
      <div className="glass-panel rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/15 p-1.5 text-primary">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              PINN + XGBoost · SHAP
            </div>
            <div className="text-sm font-semibold">AI Heat Drivers</div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {AI_DRIVERS.map((d, i) => (
            <div key={d.feature}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground/90">
                  <span className="mr-2 font-mono text-muted-foreground">0{i + 1}</span>
                  {d.feature}
                </span>
                <span className="font-mono text-muted-foreground">{d.confidence}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full animate-thermal-shift rounded-full"
                  style={{
                    width: `${d.impact * 100 * 2.5}%`,
                    background:
                      "linear-gradient(90deg, var(--heat-warm), var(--heat-hot), var(--heat-extreme))",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-accent/15 p-1.5 text-accent">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-sm font-semibold">
            {ward ? `Recommendations · ${ward.name}` : "Select a zone"}
          </div>
        </div>

        {ward ? (
          <div className="mt-4 space-y-3 text-xs">
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
          <p className="mt-3 text-xs text-muted-foreground">
            Tap any ward on the thermal map to surface site-specific cooling interventions.
          </p>
        )}
      </div>

      <div className="glass-panel mt-auto rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Model · v2.3.1
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] text-emerald-400">HEALTHY</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
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
    <div className="rounded-md border border-border/60 bg-background/40 p-3">
      <div className="flex items-start gap-2">
        <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <div className="flex-1">
          <div className="font-medium text-foreground/95">{title}</div>
          <div className="mt-0.5 text-muted-foreground">{detail}</div>
          <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
            {roi}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-sm font-semibold text-foreground">{value}</div>
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
