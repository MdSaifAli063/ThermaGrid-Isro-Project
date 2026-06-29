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
    <div className="glass-panel overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Priority queue
          </div>
          <div className="text-sm font-semibold">Neighborhood Heat Risk Index</div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {ranked.length} of {wards.length} zones
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card/95 backdrop-blur">
            <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-2 font-normal">Ward</th>
              <th className="px-4 py-2 font-normal">LST</th>
              <th className="px-4 py-2 font-normal">Exposed</th>
              <th className="px-4 py-2 font-normal">Risk</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((w) => {
              const active = selectedId === w.id;
              return (
                <tr
                  key={w.id}
                  onClick={() => onSelect(w.id)}
                  className={`cursor-pointer border-t border-border/40 transition-colors ${
                    active ? "bg-primary/10" : "hover:bg-muted/40"
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <div className="font-medium">{w.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      NDVI {w.ndvi.toFixed(2)} · ISF {w.isf.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono tabular-nums" style={{ color: heatColor(w.lst) }}>
                    {w.lst.toFixed(1)}°
                  </td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-muted-foreground">
                    {(w.populationExposed / 1000).toFixed(0)}k
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${w.risk}%`,
                            background:
                              w.risk > 75
                                ? "var(--heat-extreme)"
                                : w.risk > 55
                                ? "var(--heat-hot)"
                                : "var(--heat-warm)",
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs tabular-nums">{w.risk}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {ranked.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-xs text-muted-foreground">
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
