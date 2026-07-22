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
    <div className="flex w-full max-w-full items-center overflow-x-auto rounded-full border border-primary/20 bg-card/80 p-1 backdrop-blur-md shadow-lg [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tods.map(({ id, label, icon: Icon }) => {
        const active = tod === id;
        return (
          <button
            key={id}
            onClick={() => setTod(id)}
            className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-300 sm:gap-2 sm:px-4 sm:py-2.5 ${
              active
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
            }`}
          >
            <Icon className={`h-3.5 w-3.5 ${active ? "text-primary-foreground" : "text-primary/70"}`} />
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
    <div className="flex w-full max-w-full items-center overflow-x-auto rounded-full border border-primary/20 bg-card/80 p-1 backdrop-blur-md shadow-lg [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="pl-3 pr-2 text-primary/70">
        <Calendar className="h-3.5 w-3.5" />
      </div>
      {horizons.map((h) => {
        const active = horizon === h;
        return (
          <button
            key={h}
            onClick={() => setHorizon(h)}
            className={`min-h-10 shrink-0 rounded-full px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-300 sm:px-4 sm:py-2.5 ${
              active
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
            }`}
          >
            {h === "now" ? (
              <>
                <span className="sm:hidden">Now</span>
                <span className="hidden sm:inline">Today</span>
              </>
            ) : (
              h
            )}
          </button>
        );
      })}
    </div>
  );
}
