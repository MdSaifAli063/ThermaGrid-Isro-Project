import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, Sliders, Zap } from "lucide-react";

type Horizon = "now" | "2030" | "2050";
const HORIZON_MULT: Record<Horizon, number> = { now: 1, "2030": 0.95, "2050": 0.88 };

// Per-intervention max ΔT contribution at 100% adoption (°C)
const WEIGHTS = {
  coolRoofs: 4.2,
  trees: 3.6,
  pavement: 2.4,
  paint: 2.1,
  walls: 1.6,
  water: 1.4,
} as const;

// Cost (₹ lakh per % adoption) and CO2 (kt/yr per % adoption)
const COST = {
  coolRoofs: 18.2, trees: 6.4, pavement: 24.5, paint: 11.0, walls: 16.8, water: 22.0,
};
const CO2 = {
  coolRoofs: 0.06, trees: 0.14, pavement: 0.02, paint: 0.04, walls: 0.05, water: 0.08,
};

const DEFAULTS = { coolRoofs: 35, trees: 20, pavement: 15, paint: 10, walls: 5, water: 8 };

export function ScenarioSimulator({ baselineLST }: { baselineLST: number }) {
  const [vals, setVals] = useState(DEFAULTS);
  const [horizon, setHorizon] = useState<Horizon>("2030");

  const set = (k: keyof typeof DEFAULTS) => (v: number) =>
    setVals((s) => ({ ...s, [k]: v }));

  const { deltaT, cost, co2, beneficiaries } = useMemo(() => {
    const mult = HORIZON_MULT[horizon];
    const dT =
      ((vals.coolRoofs / 100) * WEIGHTS.coolRoofs +
        (vals.trees / 100) * WEIGHTS.trees +
        (vals.pavement / 100) * WEIGHTS.pavement +
        (vals.paint / 100) * WEIGHTS.paint +
        (vals.walls / 100) * WEIGHTS.walls +
        (vals.water / 100) * WEIGHTS.water) *
      mult;
    const cost =
      vals.coolRoofs * COST.coolRoofs +
      vals.trees * COST.trees +
      vals.pavement * COST.pavement +
      vals.paint * COST.paint +
      vals.walls * COST.walls +
      vals.water * COST.water;
    const co2 =
      vals.coolRoofs * CO2.coolRoofs +
      vals.trees * CO2.trees +
      vals.pavement * CO2.pavement +
      vals.paint * CO2.paint +
      vals.walls * CO2.walls +
      vals.water * CO2.water;
    const beneficiaries = Math.round(
      (vals.coolRoofs + vals.trees + vals.pavement + vals.paint + vals.walls + vals.water) * 1800
    );
    return { deltaT: dT, cost, co2, beneficiaries };
  }, [vals, horizon]);

  const projected = baselineLST - deltaT;

  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-accent/15 p-1.5 text-accent">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Counterfactual engine · 6 levers
            </div>
            <div className="text-sm font-semibold">Scenario Simulator</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex rounded-md border border-border/60 bg-card/60 p-0.5">
            {(["now", "2030", "2050"] as Horizon[]).map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  horizon === h ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {h === "now" ? "Today" : h}
              </button>
            ))}
          </div>
          <button
            onClick={() => setVals(DEFAULTS)}
            className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <SliderRow label="Cool-roof conversion" value={vals.coolRoofs} onChange={set("coolRoofs")} hint="Albedo 0.05 → 0.78" />
          <SliderRow label="Urban tree canopy added" value={vals.trees} onChange={set("trees")} hint="NDVI uplift · Penman-Monteith" />
          <SliderRow label="Permeable pavement" value={vals.pavement} onChange={set("pavement")} hint="ISF reduction" />
          <SliderRow label="Reflective paint (TiO₂)" value={vals.paint} onChange={set("paint")} hint="α +0.66 on facades" />
          <SliderRow label="Green walls / vertical gardens" value={vals.walls} onChange={set("walls")} hint="Evapotranspiration" />
          <SliderRow label="Water bodies & misting" value={vals.water} onChange={set("water")} hint="Latent heat flux" />
        </div>

        <div className="rounded-lg border border-border/60 bg-background/40 p-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Projected LST · {horizon === "now" ? "today" : horizon}
          </div>
          <div className="mt-1 flex items-baseline gap-3">
            <div className="text-4xl font-semibold tabular-nums">
              {projected.toFixed(1)}
              <span className="text-lg text-muted-foreground">°C</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
              <Zap className="h-3 w-3" />−{deltaT.toFixed(2)}°C
            </div>
          </div>
          <div className="mt-1 font-mono text-[10px] text-muted-foreground">
            Baseline {baselineLST.toFixed(1)}°C · climate multiplier ×{HORIZON_MULT[horizon]}
          </div>

          <div className="relative mt-4 h-2 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--heat-cool), var(--heat-mild), var(--heat-warm), var(--heat-hot), var(--heat-extreme))",
            }}
          >
            <div className="absolute -top-1 h-4 w-0.5 bg-foreground"
              style={{ left: `${Math.min(95, Math.max(5, ((projected - 30) / 25) * 100))}%` }}
            />
          </div>

          <div className="mt-4 rounded-md border border-border/40 bg-muted/20 p-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
            ΔT = ({(vals.coolRoofs / 100).toFixed(2)}·4.2 + {(vals.trees / 100).toFixed(2)}·3.6 + {(vals.pavement / 100).toFixed(2)}·2.4
            <br />
            + {(vals.paint / 100).toFixed(2)}·2.1 + {(vals.walls / 100).toFixed(2)}·1.6 + {(vals.water / 100).toFixed(2)}·1.4) × {HORIZON_MULT[horizon]}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <Outcome label="Capex" value={`₹${cost.toFixed(0)}L`} />
            <Outcome label="CO₂ offset" value={`${co2.toFixed(2)} kt/yr`} />
            <Outcome label="Benefited" value={`${(beneficiaries / 1000).toFixed(1)}k`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label, value, onChange, hint,
}: { label: string; value: number; onChange: (v: number) => void; hint: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-medium text-foreground/90">{label}</label>
        <span className="font-mono text-sm tabular-nums text-primary">{value}%</span>
      </div>
      <Slider value={[value]} max={100} step={1} onValueChange={(v) => onChange(v[0])} className="mt-2" />
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{hint}</div>
    </div>
  );
}

function Outcome({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}
