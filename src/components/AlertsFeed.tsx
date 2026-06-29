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
    <div className="glass-panel overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-[var(--heat-extreme)]/15 p-1.5 text-[var(--heat-extreme)]">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Threshold monitor · realtime
            </div>
            <div className="text-sm font-semibold">Active Heat Alerts</div>
          </div>
        </div>
        <div className="rounded-full bg-[var(--heat-extreme)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--heat-extreme)]">
          {alerts.length} active
        </div>
      </div>

      <div className="max-h-[420px] divide-y divide-border/40 overflow-auto">
        {alerts.map((a) => {
          const tone = TONE[a.severity];
          return (
            <button
              key={a.id}
              onClick={() => onSelectWard(a.wardId)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
            >
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ background: tone.bar }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{a.wardName}</span>
                  <span
                    className="rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest"
                    style={{ background: `color-mix(in oklch, ${tone.bar} 18%, transparent)`, color: tone.bar }}
                  >
                    {tone.label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.message}</p>
                <div className="mt-1 font-mono text-[10px] text-muted-foreground">{a.triggeredAt}</div>
              </div>
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </button>
          );
        })}
        {alerts.length === 0 && (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">
            No zones currently exceed the 45°C threshold.
          </div>
        )}
      </div>
    </div>
  );
}
