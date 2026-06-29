import { MATERIALS, heatColor } from "@/lib/heat-data";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

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
    <th className="px-4 py-2 text-left font-normal">
      <button
        onClick={() => click(k)}
        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
      >
        {label}
        <ArrowUpDown className="h-3 w-3 opacity-50" />
      </button>
    </th>
  );

  return (
    <div className="glass-panel overflow-hidden rounded-lg">
      <div className="border-b border-border/60 px-4 py-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Material performance · lab + field
        </div>
        <div className="text-sm font-semibold">Surface treatment comparison</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
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
              <tr key={m.name} className="border-t border-border/40 hover:bg-muted/30">
                <td className="px-4 py-2.5 font-medium">{m.name}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${m.albedo * 100}%` }}
                      />
                    </div>
                    <span className="font-mono tabular-nums">{m.albedo.toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 font-mono tabular-nums" style={{ color: heatColor(m.surfaceTemp) }}>
                  {m.surfaceTemp.toFixed(1)}
                </td>
                <td className="px-4 py-2.5">
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-xs tabular-nums text-emerald-400">
                    −{m.cooling.toFixed(1)}°
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono tabular-nums text-muted-foreground">
                  ₹{m.cost.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-2.5 font-mono tabular-nums text-muted-foreground">
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
