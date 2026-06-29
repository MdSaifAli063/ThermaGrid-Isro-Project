import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Activity, Satellite, Thermometer, Sparkles, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CITIES, STATES } from "@/lib/heat-data";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ThermaGrid · Urban Heat Island Detection & Cooling AI" },
      {
        name: "description",
        content:
          "Geospatial AI platform that detects urban heat hotspots from satellite thermal imagery and recommends physics-informed cooling interventions.",
      },
      { property: "og:title", content: "ThermaGrid · Urban Heat Island AI" },
      {
        property: "og:description",
        content:
          "Satellite-driven UHI detection with PINN-based cooling optimization for Indian cities.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient grid + gradients */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[160px]" />
      <div className="pointer-events-none absolute -right-40 top-1/2 h-[600px] w-[600px] rounded-full bg-accent/15 blur-[180px]" />

      <Nav />

      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-32 lg:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-accent backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              ISRO Space Hackathon · Earth Observation Track
            </div>

            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              See your city's{" "}
              <span className="text-gradient-heat">heat</span>
              <br />
              before it sees you.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              ThermaGrid ingests Landsat-9, Sentinel-2 and ISRO Bhuvan thermal
              imagery to map urban heat islands at 30 m resolution — then a
              physics-informed neural network recommends the exact mix of cool
              roofs, canopy and reflective pavement to deploy.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_40px_-8px_var(--primary)]"
              >
                Launch mission control
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />

              </Link>
              <a
                href="#capabilities"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card/50 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-card"
              >
                How it works
              </a>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/60 pt-6">
              <Metric kpi="30 m" label="Spatial resolution" />
              <Metric kpi="1.21°" label="LST RMSE" />
              <Metric kpi="0.93" label="Model R²" />
            </div>
          </div>

          {/* Animated thermal globe */}
          <div className="relative aspect-square animate-fade-up [animation-delay:120ms]">
            <ThermalGlobe />
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="relative mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-12 max-w-2xl">
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
            End-to-end stack
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            From orbit to intervention, in one pipeline.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Capability
            icon={Satellite}
            title="Multi-sensor ingest"
            body="Landsat-9 Band-10, Sentinel-2, MOSDAC INSAT-3DR and Resourcesat-2A LISS-IV — fused into a single 30 m thermal stack."
          />
          <Capability
            icon={Thermometer}
            title="LST detection"
            body="Brightness-temperature inversion with emissivity correction over every neighborhood polygon."
          />
          <Capability
            icon={Activity}
            title="PINN + SHAP"
            body="Physics-informed network enforcing the surface energy balance, with SHAP attribution per driver."
          />
          <Capability
            icon={Sparkles}
            title="Cooling optimizer"
            body="Counterfactual scenarios across cool roofs, pavers, canopy & paint — ranked by ΔT, capex and CO₂ offset."
          />
        </div>
      </section>

      <section id="cities" className="relative mx-auto max-w-7xl px-6 pb-32">
        <StatePicker />
      </section>




      <footer className="border-t border-border/60 py-8 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        ThermaGrid · Built for ISRO Space Hackathon 2026
      </footer>
    </div>
  );
}

function Nav() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      <div className="flex items-center gap-2">
        <div className="relative h-7 w-7">
          <div className="absolute inset-0 rounded-md bg-gradient-to-br from-primary to-accent" />
          <div className="absolute inset-[2px] rounded-[5px] bg-background" />
          <div className="absolute inset-[5px] rounded-sm bg-gradient-to-br from-primary to-accent opacity-90" />
        </div>
        <div className="font-semibold tracking-tight">
          Therma<span className="text-primary">Grid</span>
        </div>
      </div>
      <div className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:flex">
        <a href="#capabilities" className="hover:text-foreground">Capabilities</a>
        <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <a href="#" className="hover:text-foreground">ISRO Bhuvan</a>
      </div>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-3 py-1.5 text-xs font-medium backdrop-blur transition-colors hover:bg-card"
      >
        Launch <ArrowRight className="h-3 w-3" />
      </Link>
    </nav>
  );
}

function Metric({ kpi, label }: { kpi: string; label: string }) {
  return (
    <div>
      <div className="font-mono text-2xl font-semibold text-foreground">{kpi}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function Capability({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Activity;
  title: string;
  body: string;
}) {
  return (
    <div className="glass-panel group rounded-xl p-5 transition-all hover:border-primary/40 hover:shadow-[0_0_40px_-10px_var(--primary)]">
      <div className="inline-flex rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary/20">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-base font-semibold">{title}</div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

/* ------------------------------ State picker ------------------------------ */

const REGIONS: Record<string, string[]> = {
  North: ["Delhi","Punjab","Haryana","Himachal Pradesh","Jammu and Kashmir","Ladakh","Uttarakhand","Uttar Pradesh","Rajasthan","Chandigarh"],
  South: ["Karnataka","Kerala","Tamil Nadu","Telangana","Andhra Pradesh","Puducherry","Lakshadweep","Andaman & Nicobar Islands"],
  East:  ["West Bengal","Bihar","Jharkhand","Odisha","Sikkim"],
  West:  ["Maharashtra","Gujarat","Goa","Dadra & Nagar Haveli and Daman & Diu"],
  Central: ["Madhya Pradesh","Chhattisgarh"],
  Northeast: ["Assam","Arunachal Pradesh","Manipur","Meghalaya","Mizoram","Nagaland","Tripura"],
};

function StatePicker() {
  const [region, setRegion] = useState<keyof typeof REGIONS | "All">("All");
  const [q, setQ] = useState("");

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return STATES
      .filter((g) => region === "All" || REGIONS[region].includes(g.state))
      .map((g) => ({
        ...g,
        cities: g.cities.filter(
          (c) => !needle || c.name.toLowerCase().includes(needle) || g.state.toLowerCase().includes(needle),
        ),
      }))
      .filter((g) => g.cities.length > 0);
  }, [region, q]);

  const totalCities = visible.reduce((s, g) => s + g.cities.length, 0);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Pick your region
          </div>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            All 28 states &amp; 8 UTs. One thermal lens.
          </h3>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            {STATES.length} states/UTs · {CITIES.length} cities monitored · {CITIES.reduce((s, c) => s + c.wards.length, 0)} ward polygons under live LST surveillance.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search state or city…"
              className="w-full rounded-md border border-border bg-card/60 py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...Object.keys(REGIONS)] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r as keyof typeof REGIONS | "All")}
                className={`rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  region === r
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.flatMap(g => g.cities.map(c => ({ ...c, state: g.state }))).map((c) => {
          const tone =
            c.meanLST >= 47 ? "var(--heat-extreme)" :
            c.meanLST >= 45 ? "var(--heat-hot)" :
            c.meanLST >= 43 ? "var(--heat-warm)" :
            c.meanLST >= 38 ? "var(--heat-mild)" : "var(--heat-cool)";
          return (
            <Link
              key={c.id}
              to="/dashboard"
              search={{ city: c.id }}
              className="glass-panel group relative overflow-hidden rounded-lg p-4 transition-all hover:border-primary/40 hover:shadow-[0_0_30px_-12px_var(--primary)]"
            >
              <div
                className="pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
                style={{ background: tone }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    <MapPin className="h-3 w-3 text-primary" />
                    {c.lat}
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold">{c.name}</div>
                    <div className="truncate font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      {c.state} · {c.climate}
                    </div>
                  </div>
                  <div
                    className="font-mono text-lg font-semibold tabular-nums"
                    style={{ color: tone }}
                  >
                    {c.meanLST.toFixed(1)}°
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  <span>{c.wards.length} wards</span>
                  <span>{(c.populationTotal / 1e6).toFixed(2)}M</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {visible.length === 0 && (
        <div className="rounded-lg border border-border/60 bg-card/40 py-12 text-center text-sm text-muted-foreground">
          No cities match "{q}" in {region}.
        </div>
      )}

      <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Showing {totalCities} of {CITIES.length} cities
      </div>
    </div>
  );
}

/* ------------------------- Animated 3D thermal globe ------------------------- */



function ThermalGlobe() {
  // Generate static "hotspot" positions on the sphere surface (lat/long projection)
  const hotspots = Array.from({ length: 14 }).map((_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const tilt = Math.sin(i * 1.7) * 0.7;
    const r = 42; // %
    const x = 50 + Math.cos(angle) * r * Math.cos(tilt);
    const y = 50 + Math.sin(angle) * r * 0.6 + tilt * 8;
    const temp = 38 + Math.abs(Math.sin(i * 2.3)) * 18;
    return { x, y, temp, delay: i * 0.2 };
  });

  return (
    <div className="relative h-full w-full" style={{ perspective: "1200px" }}>
      {/* Outer orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[88%] w-[88%] animate-orbit rounded-full border border-accent/30"
          style={{ transform: "rotateX(70deg)" }} />
        <div className="absolute h-[100%] w-[100%] animate-orbit-reverse rounded-full border border-primary/20"
          style={{ transform: "rotateX(72deg) rotateZ(28deg)" }} />
        <div className="absolute h-[112%] w-[112%] animate-orbit rounded-full border border-border/50"
          style={{ transform: "rotateX(68deg) rotateZ(-15deg)", animationDuration: "80s" }} />

        {/* Orbiting satellite */}
        <div className="absolute h-[100%] w-[100%] animate-orbit-reverse"
          style={{ transform: "rotateX(72deg) rotateZ(28deg)", animationDuration: "20s" }}>
          <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-sm bg-accent shadow-[0_0_20px_var(--accent)]" />
        </div>
      </div>

      {/* The globe */}
      <div className="absolute inset-[8%] animate-float-slow">
        <div
          className="relative h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, oklch(0.28 0.04 250), oklch(0.14 0.02 250) 70%)",
            boxShadow:
              "inset -30px -30px 80px oklch(0.08 0.02 250), inset 20px 20px 60px oklch(0.35 0.05 200 / 0.3), 0 0 80px oklch(0.74 0.18 50 / 0.25)",
          }}
        >
          {/* Latitude rings */}
          {[20, 40, 60, 80].map((v) => (
            <div
              key={v}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/15"
              style={{
                width: `${v}%`,
                height: `${v}%`,
              }}
            />
          ))}

          {/* Meridian lines */}
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <div
              key={deg}
              className="pointer-events-none absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2 bg-accent/10"
              style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
            />
          ))}

          {/* Continent-like blobs */}
          <Continent style={{ top: "18%", left: "22%", width: "32%", height: "26%" }} />
          <Continent style={{ top: "48%", left: "10%", width: "28%", height: "30%" }} />
          <Continent style={{ top: "30%", left: "55%", width: "30%", height: "40%" }} />
          <Continent style={{ top: "68%", left: "60%", width: "18%", height: "16%" }} />

          {/* Heat hotspots */}
          {hotspots.map((h, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <div
                className="h-2.5 w-2.5 animate-pulse-heat rounded-full"
                style={{
                  background:
                    h.temp > 50
                      ? "var(--heat-extreme)"
                      : h.temp > 44
                      ? "var(--heat-hot)"
                      : "var(--heat-warm)",
                  boxShadow: `0 0 20px ${
                    h.temp > 50
                      ? "var(--heat-extreme)"
                      : h.temp > 44
                      ? "var(--heat-hot)"
                      : "var(--heat-warm)"
                  }`,
                  animationDelay: `${h.delay}s`,
                }}
              />
            </div>
          ))}

          {/* Atmospheric rim */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow:
                "inset 0 0 60px oklch(0.78 0.13 200 / 0.15), 0 0 100px -10px oklch(0.78 0.13 200 / 0.4)",
            }}
          />
        </div>
      </div>

      {/* HUD ticks */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          12.97°N
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          77.59°E
        </div>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-accent">
          ◉ LANDSAT-9 · BAND 10
        </div>
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          λ 10.9 µm · ε 0.95
        </div>
      </div>
    </div>
  );
}

function Continent({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="pointer-events-none absolute rounded-[40%]"
      style={{
        ...style,
        background:
          "radial-gradient(ellipse at 40% 40%, oklch(0.35 0.05 160 / 0.6), oklch(0.22 0.03 160 / 0.3) 70%, transparent)",
        filter: "blur(2px)",
      }}
    />
  );
}
