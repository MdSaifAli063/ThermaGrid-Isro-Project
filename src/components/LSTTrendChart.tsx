import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ltsHistory } from "@/lib/heat-data";
import { TrendingUp } from "lucide-react";

export function LSTTrendChart({ baseline, label }: { baseline: number; label: string }) {
  const data = ltsHistory(baseline);
  return (
    <div className="space-panel h-full rounded-2xl p-5">
      <div className="mb-4 flex items-end justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[var(--heat-hot)]/12 p-2.5 text-[var(--heat-hot)]">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              12-month time series
            </div>
            <div className="text-sm font-bold">LST seasonality · {label}</div>
          </div>
        </div>
        <div className="rounded-xl border border-accent/20 bg-accent/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
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
            <CartesianGrid stroke="oklch(0.22 0.03 250)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "oklch(0.60 0.03 250)", fontSize: 10, fontWeight: 600 }} axisLine={{ stroke: "oklch(0.22 0.03 250)" }} tickLine={false} />
            <YAxis tick={{ fill: "oklch(0.60 0.03 250)", fontSize: 10, fontWeight: 600 }} axisLine={{ stroke: "oklch(0.22 0.03 250)" }} tickLine={false} unit="°" />
            <Tooltip
              contentStyle={{
                background: "oklch(0.16 0.025 250)",
                border: "1px solid oklch(0.25 0.06 250)",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                boxShadow: "0 4px 24px oklch(0.10 0.02 250 / 0.5)",
              }}
              labelStyle={{ color: "oklch(0.96 0.01 240)" }}
              formatter={(v: number) => [`${v}°C`, "LST"]}
            />
            <Area type="monotone" dataKey="lst" stroke="var(--heat-hot)" strokeWidth={2.5} fill="url(#lstGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
