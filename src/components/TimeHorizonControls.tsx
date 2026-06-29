import { Sun, Sunrise, Sunset, Moon, Calendar } from "lucide-react";
import type { TimeOfDay, Horizon } from "@/lib/heat-data";

export function TimeControls({
  tod,
  setTod,
}: {
  tod: TimeOfDay;
  setTod: (t: TimeOfDay) => void;
}) {
  const tods: { id: TimeOfDay; label: string; icon: typeof Sun }[] = [
    { id: "dawn", label: "Dawn", icon: Sunrise },
    { id: "noon", label: "Noon", icon: Sun },
    { id: "dusk", label: "Dusk", icon: Sunset },
    { id: "night", label: "Night", icon: Moon },
  ];

  return (
    <div className="flex items-center rounded-full border border-primary/20 bg-[#020814]/80 p-1 backdrop-blur-md shadow-lg">
      {tods.map(({ id, label, icon: Icon }) => {
        const active = tod === id;
        return (
          <button
            key={id}
            onClick={() => setTod(id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
              active
                ? "bg-primary text-[#020814] shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
            }`}
          >
            <Icon className={`h-3.5 w-3.5 ${active ? "text-[#020814]" : "text-primary/70"}`} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function HorizonControls({
  horizon,
  setHorizon,
}: {
  horizon: Horizon;
  setHorizon: (h: Horizon) => void;
}) {
  const horizons: Horizon[] = ["now", "2030", "2050"];

  return (
    <div className="flex items-center rounded-full border border-primary/20 bg-[#020814]/80 p-1 backdrop-blur-md shadow-lg">
      <div className="pl-3 pr-2 text-primary/70">
        <Calendar className="h-3.5 w-3.5" />
      </div>
      {horizons.map((h) => {
        const active = horizon === h;
        return (
          <button
            key={h}
            onClick={() => setHorizon(h)}
            className={`rounded-full px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
              active
                ? "bg-primary text-[#020814] shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
            }`}
          >
            {h === "now" ? "Today" : h}
          </button>
        );
      })}
    </div>
  );
}
