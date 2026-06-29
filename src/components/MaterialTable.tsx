import { MATERIALS, heatColor } from "@/lib/heat-data";
import { useState } from "react";
import { ArrowUpDown, Beaker } from "lucide-react";

type SortKey = "name" | "albedo" | "surfaceTemp" | "cooling" | "cost" | "durability";

export function MaterialTable() {
  const [sortKey, setSortKey] = useState<SortKey>("cooling");
  const [asc, setAsc] = useState(false);

  const sorted = [...MATERIALS].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return asc ? av - bv : bv - av;
    return asc
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const click = (k: SortKey) => {
    if (k === sortKey) setAsc(!asc);
    else {
      setSortKey(k);
      setAsc(false);
    }
  };

  const Th = ({ k, label }: { k: SortKey; label: string }) => (
    <th className="px-5 py-3 text-left font-bold">
      <button
        onClick={() => click(k)}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-all hover:text-primary"
      >
        {label}
        <ArrowUpDown className="h-3 w-3 opacity-40" />
      </button>
    </th>
  );

  return (
    <div className="space-panel overflow-hidden rounded-2xl">
      <div className="flex items-center gap-3 border-b border-primary/10 px-5 py-4">
        <div className="rounded-xl bg-accent/12 p-2.5 text-accent">
          <Beaker className="h-5 w-5" />
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Material performance · lab + field
          </div>
          <div className="text-sm font-bold">Surface treatment comparison</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-card/50">
            <tr>
              <Th k="name" label="Material" />
              <Th k="albedo" label="Albedo α" />
              <Th k="surfaceTemp" label="Surface T (°C)" />
              <Th k="cooling" label="ΔT cooling" />
              <Th k="cost" label="Cost (₹/m²)" />
              <Th k="durability" label="Lifespan (yrs)" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => (
              <tr key={m.name} className="border-t border-primary/6 transition-all hover:bg-primary/5">
                <td className="px-5 py-3 font-bold">{m.name}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-muted/30">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                        style={{ width: `${m.albedo * 100}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold tabular-nums">{m.albedo.toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono font-bold tabular-nums" style={{ color: heatColor(m.surfaceTemp) }}>
                  {m.surfaceTemp.toFixed(1)}
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-emerald-400">
                    −{m.cooling.toFixed(1)}°
                  </span>
                </td>
                <td className="px-5 py-3 font-mono tabular-nums text-muted-foreground">
                  ₹{m.cost.toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3 font-mono tabular-nums text-muted-foreground">
                  {m.durability}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
