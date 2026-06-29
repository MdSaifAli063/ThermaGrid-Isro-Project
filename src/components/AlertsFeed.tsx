import { AlertTriangle, Bell } from "lucide-react";
import type { Alert } from "@/lib/heat-data";

const TONE: Record<Alert["severity"], { bar: string; label: string }> = {
  extreme:  { bar: "var(--heat-extreme)", label: "EXTREME" },
  high:     { bar: "var(--heat-hot)",     label: "HIGH" },
  moderate: { bar: "var(--heat-warm)",    label: "MODERATE" },
};

export function AlertsFeed({
  alerts,
  onSelectWard,
}: {
  alerts: Alert[];
  onSelectWard: (id: string) => void;
}) {
  return (
    <div className="space-panel overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-primary/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[var(--heat-extreme)]/12 p-2.5 text-[var(--heat-extreme)]" style={{ boxShadow: "0 0 12px color-mix(in oklch, var(--heat-extreme) 20%, transparent)" }}>
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Threshold monitor · realtime
            </div>
            <div className="text-sm font-bold">Active Heat Alerts</div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--heat-extreme)]/20 bg-[var(--heat-extreme)]/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--heat-extreme)]">
          {alerts.length} active
        </div>
      </div>

      <div className="max-h-[420px] divide-y divide-primary/8 overflow-auto">
        {alerts.map((a) => {
          const tone = TONE[a.severity];
          return (
            <button
              key={a.id}
              onClick={() => onSelectWard(a.wardId)}
              className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-all hover:bg-primary/5"
            >
              <div
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: tone.bar, boxShadow: `0 0 6px ${tone.bar}` }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{a.wardName}</span>
                  <span
                    className="rounded-lg px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest"
                    style={{ background: `color-mix(in oklch, ${tone.bar} 15%, transparent)`, color: tone.bar }}
                  >
                    {tone.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{a.message}</p>
                <div className="mt-1.5 font-mono text-[10px] text-muted-foreground/60">{a.triggeredAt}</div>
              </div>
              <AlertTriangle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
            </button>
          );
        })}
        {alerts.length === 0 && (
          <div className="px-5 py-10 text-center text-xs text-muted-foreground">
            No zones currently exceed the 45°C threshold.
          </div>
        )}
      </div>
    </div>
  );
}
