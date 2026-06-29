import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ltsHistory } from "@/lib/heat-data";

export function LSTTrendChart({ baseline, label }: { baseline: number; label: string }) {
  const data = ltsHistory(baseline);
  return (
    <div className="glass-panel h-full rounded-lg p-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            12-month time series
          </div>
          <div className="text-sm font-semibold">LST seasonality · {label}</div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
          Peak {Math.max(...data.map((d) => d.lst)).toFixed(1)}°C · May
        </div>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="lstGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--heat-extreme)" stopOpacity={0.7} />
                <stop offset="100%" stopColor="var(--heat-cool)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="oklch(0.30 0.03 250)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "oklch(0.68 0.03 250)", fontSize: 10 }} axisLine={{ stroke: "oklch(0.30 0.03 250)" }} tickLine={false} />
            <YAxis tick={{ fill: "oklch(0.68 0.03 250)", fontSize: 10 }} axisLine={{ stroke: "oklch(0.30 0.03 250)" }} tickLine={false} unit="°" />
            <Tooltip
              contentStyle={{ background: "oklch(0.20 0.025 250)", border: "1px solid oklch(0.30 0.03 250)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "oklch(0.96 0.01 240)" }}
              formatter={(v: number) => [`${v}°C`, "LST"]}
            />
            <Area type="monotone" dataKey="lst" stroke="var(--heat-hot)" strokeWidth={2} fill="url(#lstGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
