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
      <div className="flex items-center gap-1 rounded-md border border-border/60 bg-card/60 p-1">
        {tods.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTod(id)}
            title={label}
            className={`inline-flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              tod === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3 w-3" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 rounded-md border border-border/60 bg-card/60 p-1">
        <Calendar className="ml-1 h-3 w-3 text-muted-foreground" />
        {horizons.map((h) => (
          <button
            key={h}
            onClick={() => setHorizon(h)}
            className={`rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              horizon === h ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {h === "now" ? "Today" : h}
          </button>
        ))}
      </div>
    </div>
  );
}
