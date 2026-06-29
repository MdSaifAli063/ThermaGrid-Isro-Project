import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { COOLING_STRATEGIES } from "@/lib/heat-data";
import { Snowflake } from "lucide-react";

const COLORS = [
  "var(--heat-extreme)",
  "var(--heat-hot)",
  "var(--heat-warm)",
  "var(--chart-3)",
  "var(--accent)",
  "var(--chart-4)",
];

export function CoolingStrategyChart() {
  return (
    <div className="space-panel h-full rounded-2xl p-5">
      <div className="mb-4 flex items-end justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/12 p-2.5 text-primary">
            <Snowflake className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Intervention efficacy
            </div>
            <div className="text-sm font-bold">Cooling potential (°C) by strategy</div>
          </div>
        </div>
        <div className="rounded-xl border border-primary/15 bg-primary/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Simulated · noon · clear sky
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={COOLING_STRATEGIES} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="oklch(0.22 0.03 250)" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "oklch(0.60 0.03 250)", fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: "oklch(0.22 0.03 250)" }}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: "oklch(0.60 0.03 250)", fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: "oklch(0.22 0.03 250)" }}
              tickLine={false}
              unit="°"
            />
            <Tooltip
              cursor={{ fill: "oklch(0.22 0.03 250 / 0.4)" }}
              contentStyle={{
                background: "oklch(0.16 0.025 250)",
                border: "1px solid oklch(0.25 0.06 250)",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                boxShadow: "0 4px 24px oklch(0.10 0.02 250 / 0.5)",
              }}
              labelStyle={{ color: "oklch(0.96 0.01 240)" }}
              formatter={(v: number) => [`${v}°C reduction`, "ΔT"]}
            />
            <Bar dataKey="reduction" radius={[8, 8, 0, 0]}>
              {COOLING_STRATEGIES.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
