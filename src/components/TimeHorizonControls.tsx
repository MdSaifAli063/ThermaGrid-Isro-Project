import { Sun, Sunrise, Sunset, Moon, Calendar } from "lucide-react";
import type { TimeOfDay, Horizon } from "@/lib/heat-data";

export function TimeHorizonControls({
  tod, setTod,
  horizon, setHorizon,
}: {
  tod: TimeOfDay; setTod: (t: TimeOfDay) => void;
  horizon: Horizon; setHorizon: (h: Horizon) => void;
}) {
  const tods: { id: TimeOfDay; label: string; icon: typeof Sun }[] = [
    { id: "dawn",  label: "Dawn",  icon: Sunrise },
    { id: "noon",  label: "Noon",  icon: Sun },
    { id: "dusk",  label: "Dusk",  icon: Sunset },
    { id: "night", label: "Night", icon: Moon },
  ];
  const horizons: Horizon[] = ["now", "2030", "2050"];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 rounded-xl border border-primary/15 bg-card/40 p-1.5 backdrop-blur">
        {tods.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTod(id)}
            title={label}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
              tod === id
                ? "bg-primary text-primary-foreground shadow-[0_0_10px_var(--primary)/25]"
                : "text-muted-foreground hover:text-foreground hover:bg-primary/8"
            }`}
          >
            <Icon className="h-3 w-3" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-primary/15 bg-card/40 p-1.5 backdrop-blur">
        <Calendar className="ml-1.5 h-3 w-3 text-muted-foreground" />
        {horizons.map((h) => (
          <button
            key={h}
            onClick={() => setHorizon(h)}
            className={`rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
              horizon === h
                ? "bg-accent text-accent-foreground shadow-[0_0_10px_var(--accent)/25]"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/8"
            }`}
          >
            {h === "now" ? "Today" : h}
          </button>
        ))}
      </div>
    </div>
  );
}
