import { heatColor, riskIndex, type Ward } from "@/lib/heat-data";

export function NeighborhoodTable({
  wards,
  selectedId,
  onSelect,
  filter = "",
}: {
  wards: Ward[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  filter?: string;
}) {
  const ranked = [...wards]
    .map((w) => ({ ...w, risk: riskIndex(w) }))
    .filter((w) => w.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.risk - a.risk);

  return (
    <div className="space-panel overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-primary/10 px-5 py-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Priority queue
          </div>
          <div className="text-sm font-bold">Neighborhood Heat Risk Index</div>
        </div>
        <div className="rounded-xl border border-primary/15 bg-primary/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
          {ranked.length} of {wards.length} zones
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card/95 backdrop-blur">
            <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <th className="px-5 py-3 font-bold">Ward</th>
              <th className="px-5 py-3 font-bold">LST</th>
              <th className="px-5 py-3 font-bold">Exposed</th>
              <th className="px-5 py-3 font-bold">Risk</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((w) => {
              const active = selectedId === w.id;
              return (
                <tr
                  key={w.id}
                  onClick={() => onSelect(w.id)}
                  className={`cursor-pointer border-t border-primary/6 transition-all ${
                    active ? "bg-primary/10" : "hover:bg-primary/5"
                  }`}
                >
                  <td className="px-5 py-3">
                    <div className="font-bold">{w.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      NDVI {w.ndvi.toFixed(2)} · ISF {w.isf.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono font-bold tabular-nums" style={{ color: heatColor(w.lst) }}>
                    {w.lst.toFixed(1)}°
                  </td>
                  <td className="px-5 py-3 font-mono tabular-nums text-muted-foreground">
                    {(w.populationExposed / 1000).toFixed(0)}k
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-muted/30">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${w.risk}%`,
                            background:
                              w.risk > 75
                                ? "linear-gradient(90deg, var(--heat-hot), var(--heat-extreme))"
                                : w.risk > 55
                                ? "linear-gradient(90deg, var(--heat-warm), var(--heat-hot))"
                                : "var(--heat-warm)",
                            boxShadow:
                              w.risk > 75 ? "0 0 6px var(--heat-extreme)" : "none",
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold tabular-nums">{w.risk}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {ranked.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-xs text-muted-foreground">
                  No zones match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
