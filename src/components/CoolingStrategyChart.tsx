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
    <div className="glass-panel h-full rounded-lg p-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Intervention efficacy
          </div>
          <div className="text-sm font-semibold">Cooling potential (°C) by strategy</div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Simulated · noon · clear sky
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={COOLING_STRATEGIES} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="oklch(0.30 0.03 250)" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "oklch(0.68 0.03 250)", fontSize: 10 }}
              axisLine={{ stroke: "oklch(0.30 0.03 250)" }}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: "oklch(0.68 0.03 250)", fontSize: 10 }}
              axisLine={{ stroke: "oklch(0.30 0.03 250)" }}
              tickLine={false}
              unit="°"
            />
            <Tooltip
              cursor={{ fill: "oklch(0.30 0.03 250 / 0.3)" }}
              contentStyle={{
                background: "oklch(0.20 0.025 250)",
                border: "1px solid oklch(0.30 0.03 250)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "oklch(0.96 0.01 240)" }}
              formatter={(v: number) => [`${v}°C reduction`, "ΔT"]}
            />
            <Bar dataKey="reduction" radius={[6, 6, 0, 0]}>
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
