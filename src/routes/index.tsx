import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MapPin,
  Search,
  Globe2,
  Zap,
  Thermometer,
  Satellite,
  Cpu,
  Activity,
} from "lucide-react";
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
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Starfield layer */}
      <div className="pointer-events-none fixed inset-0 star-bg opacity-70" />
      {/* Grid layer */}
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-15" />
      {/* Glow blobs */}
      <div className="pointer-events-none fixed left-[-20%] top-[-10%] h-[700px] w-[700px] rounded-full bg-cyan-500/[0.06] blur-[180px]" />
      <div className="pointer-events-none fixed right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/[0.05] blur-[160px]" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[30%] h-[400px] w-[400px] rounded-full bg-cyan-400/[0.04] blur-[140px]" />

      <Nav />

      {/* ─── HERO ─── */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-16">
        {/* scan-line on top */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-px w-full animate-scanline"
            style={{ background: "linear-gradient(90deg,transparent,var(--primary),transparent)" }}
          />
        </div>

        <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_1fr]">
          {/* ── Left: text ── */}
          <div className="animate-fade-up space-y-8">
            {/* badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                ISRO Space Hackathon · Earth Observation
              </span>
            </div>

            {/* heading */}
            <div className="space-y-3">
              <h1 className="font-mono text-[2.6rem] font-extrabold uppercase leading-[1.06] tracking-tight text-white md:text-5xl lg:text-[3.4rem]">
                The Observatory
                <br />
                <span className="text-gradient-space">of the Surface</span>
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                A high-precision geospatial surveillance system mapping the
                thermal landscape of Indian cities. Multi-spectral orbital
                sensors, PINN-based heat attribution, and physics-informed
                cooling interventions — all in one mission control.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
              >
                <Zap className="h-3.5 w-3.5" />
                Launch Mission Control
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#cities"
                className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/30 px-6 py-3 text-xs font-bold uppercase tracking-wider text-foreground/80 backdrop-blur transition-all hover:border-primary/40 hover:bg-card/50 hover:text-foreground"
              >
                Browse Cities
              </a>
            </div>

            {/* 2-column stat blocks */}
            <div className="grid grid-cols-2 gap-5 border-t border-border/30 pt-6">
              <StatBlock
                icon={<Satellite className="h-4 w-4" />}
                title="Sensor Integration"
                body="Landsat-9 TIRS Band 10, Sentinel-2 MSI, and ISRO Bhuvan real-time feeds at 30 m resolution."
              />
              <StatBlock
                icon={<Cpu className="h-4 w-4" />}
                title="Thermal Diagnostics"
                body="PINN-based energy budget modelling outputs true ground LST with 1.21 °C RMSE accuracy."
              />
              <StatBlock
                icon={<Activity className="h-4 w-4" />}
                title="Heat Attribution"
                body="XAI-driven impervious surface fraction and NDVI deficit analysis across ward polygons."
              />
              <StatBlock
                icon={<Thermometer className="h-4 w-4" />}
                title="Cooling Optimizer"
                body="Multi-objective cooling strategy with cool roofs, permeable pavements, and urban greening."
              />
            </div>
          </div>

          {/* ── Right: Planet HUD ── */}
          <div
            className="animate-fade-up relative mx-auto flex aspect-square w-full max-w-[460px] items-center justify-center [animation-delay:120ms]"
          >
            <BigPlanetHUD />
          </div>
        </div>
      </section>

      {/* ─── CAPABILITY CARDS ─── */}
      <section id="capabilities" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/40" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            System Capabilities
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/40" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CapabilityCard
            title="Spectral Fusion"
            body="Multi-band thermal IR + optical fusion at 30 m grid scale."
            graphicType="sun"
          />
          <CapabilityCard
            title="LST Inversion"
            body="Split-window brightness temperature inversion with dynamic emissivity maps."
            graphicType="dots"
          />
          <CapabilityCard
            title="Heat Attribution"
            body="Physics-informed heat flux attribution vs. surface characteristics."
            graphicType="blue-planet"
          />
          <CapabilityCard
            title="Cooling Grid"
            body="Multi-objective optimization of green space, cool roofs, and pavements."
            graphicType="fire-planet"
          />
        </div>
      </section>

      {/* ─── TICKER ─── */}
      <div className="overflow-hidden border-y border-primary/12 bg-primary/5 py-3 backdrop-blur">
        <div
          className="flex gap-12 whitespace-nowrap px-6 font-mono text-[9px] uppercase tracking-widest"
          style={{ animation: "scroll-left 35s linear infinite" }}
        >
          {Array.from({ length: 6 }).flatMap((_, j) => [
            <span key={`a${j}`} className="text-primary text-glow-cyan">● Landsat-9 · Band 10 · 30 m</span>,
            <span key={`b${j}`} className="text-muted-foreground">○ Sentinel-2 · MSI · 10 m</span>,
            <span key={`c${j}`} className="text-primary text-glow-cyan">● MOSDAC · INSAT-3DR · 4 km</span>,
            <span key={`d${j}`} className="text-muted-foreground">○ Resourcesat-2A · LISS-IV</span>,
            <span key={`e${j}`} className="text-primary text-glow-cyan">● ISRO Bhuvan · Live Feed</span>,
            <span key={`f${j}`} className="text-muted-foreground">○ LST RMSE: 1.21 °C</span>,
          ])}
        </div>
      </div>

      {/* ─── CITY PICKER ─── */}
      <section id="cities" className="mx-auto max-w-7xl px-6 py-20 pb-28">
        <StatePicker />
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-primary/15 bg-card/20 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center shrink-0">
                {/* Outer Squircle Ring */}
                <div className="absolute inset-0 rounded-[10px] border border-cyan-500/80 bg-background/20 shadow-[0_0_8px_rgba(34,211,238,0.25)]" />
                {/* Inner Planet Radar Globe */}
                <div className="relative h-5 w-5 rounded-full bg-gradient-to-b from-[#0a1e36] to-[#030914] border border-cyan-400/30 overflow-hidden shadow-[0_0_8px_rgba(34,211,238,0.5)] flex items-center justify-center">
                  {/* Faint crosshairs */}
                  <div className="absolute left-1/2 top-0 w-[0.5px] h-full bg-cyan-400/20" />
                  <div className="absolute left-0 top-1/2 w-full h-[0.5px] bg-cyan-400/20" />
                  {/* Tiny colored hotspot dots */}
                  <div className="absolute h-1 w-1 rounded-full bg-[#ff0055] top-[25%] left-[30%] animate-pulse shadow-[0_0_3px_#ff0055]" />
                  <div className="absolute h-1 w-1 rounded-full bg-[#ff0055] top-[60%] left-[65%] shadow-[0_0_3px_#ff0055]" />
                  <div className="absolute h-1 w-1 rounded-full bg-orange-400 top-[35%] left-[60%] shadow-[0_0_3px_#fb923c]" />
                  <div className="absolute h-1 w-1 rounded-full bg-emerald-400 top-[65%] left-[30%] shadow-[0_0_3px_#34d399]" />
                  <div className="absolute h-1 w-1 rounded-full bg-emerald-400 top-[30%] left-[45%] shadow-[0_0_3px_#34d399]" />
                </div>
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight">
                  Therma<span className="text-primary">Grid</span>
                </div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  Earth Observation AI
                </div>
              </div>
            </div>
            <p className="text-center font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Built for ISRO Space Hackathon 2026 · Earth Observation Track
            </p>
            <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <Link to="/dashboard" className="transition-colors hover:text-primary">Dashboard</Link>
              <a href="#cities" className="transition-colors hover:text-primary">Cities</a>
              <a href="#capabilities" className="transition-colors hover:text-primary">Observatory</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ──────────────────────────────────────────────
   NAV
────────────────────────────────────────────── */
function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-primary/12 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center shrink-0">
            {/* Outer Squircle Ring */}
            <div className="absolute inset-0 rounded-[10px] border border-cyan-500/80 bg-background/20 shadow-[0_0_8px_rgba(34,211,238,0.25)]" />
            {/* Inner Planet Radar Globe */}
            <div className="relative h-5 w-5 rounded-full bg-gradient-to-b from-[#0a1e36] to-[#030914] border border-cyan-400/30 overflow-hidden shadow-[0_0_8px_rgba(34,211,238,0.5)] flex items-center justify-center">
              {/* Faint crosshairs */}
              <div className="absolute left-1/2 top-0 w-[0.5px] h-full bg-cyan-400/20" />
              <div className="absolute left-0 top-1/2 w-full h-[0.5px] bg-cyan-400/20" />
              {/* Tiny colored hotspot dots */}
              <div className="absolute h-1 w-1 rounded-full bg-[#ff0055] top-[25%] left-[30%] animate-pulse shadow-[0_0_3px_#ff0055]" />
              <div className="absolute h-1 w-1 rounded-full bg-[#ff0055] top-[60%] left-[65%] shadow-[0_0_3px_#ff0055]" />
              <div className="absolute h-1 w-1 rounded-full bg-orange-400 top-[35%] left-[60%] shadow-[0_0_3px_#fb923c]" />
              <div className="absolute h-1 w-1 rounded-full bg-emerald-400 top-[65%] left-[30%] shadow-[0_0_3px_#34d399]" />
              <div className="absolute h-1 w-1 rounded-full bg-emerald-400 top-[30%] left-[45%] shadow-[0_0_3px_#34d399]" />
            </div>
          </div>
          <div className="font-mono text-sm font-bold tracking-tight">
            Therma<span className="text-primary">Grid</span>
          </div>
        </div>

        <div className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:flex">
          <a href="#capabilities" className="transition-colors hover:text-primary">Observatory</a>
          <a href="#cities" className="transition-colors hover:text-primary">Cities</a>
          <Link to="/dashboard" className="transition-colors hover:text-primary">Dashboard</Link>
        </div>

        <Link
          to="/dashboard"
          className="group inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/12 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        >
          <Zap className="h-3 w-3" />
          Launch Control
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </nav>
  );
}

/* ──────────────────────────────────────────────
   STAT BLOCK (hero bottom columns)
────────────────────────────────────────────── */
function StatBlock({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">
          {title}
        </h3>
      </div>
      <p className="pl-9 text-[11px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   BIG PLANET HUD
────────────────────────────────────────────── */
function BigPlanetHUD() {
  const hotspots = Array.from({ length: 14 }).map((_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const tilt = Math.sin(i * 1.7) * 0.6;
    const r = 38;
    const x = 50 + Math.cos(angle) * r * Math.cos(tilt);
    const y = 50 + Math.sin(angle) * r * 0.55 + tilt * 8;
    const temp = 36 + Math.abs(Math.sin(i * 2.3)) * 20;
    return { x, y, temp, delay: i * 0.22 };
  });

  return (
    <div className="relative h-full w-full select-none" style={{ perspective: "1200px" }}>
      {/* Outer tick ring */}
      <svg
        className="absolute inset-0 h-full w-full animate-spin-slow"
        style={{ animationDuration: "120s" }}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="48" fill="none" stroke="oklch(0.78 0.20 215 / 0.12)" strokeWidth="0.8" strokeDasharray="1,4" />
        {/* degree labels */}
        {[0, 90, 180, 270].map((deg, i) => {
          const rad = (deg - 90) * (Math.PI / 180);
          const x = 50 + Math.cos(rad) * 45.5;
          const y = 50 + Math.sin(rad) * 45.5;
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              fill="oklch(0.78 0.20 215 / 0.55)" fontSize="3" fontFamily="monospace">
              {deg}°
            </text>
          );
        })}
      </svg>

      {/* Orbital rings — 3D tilted */}
      <div className="absolute inset-[4%] rounded-full border border-cyan-400/10"
        style={{ transform: "rotateX(72deg)" }} />
      <div className="absolute inset-[10%] rounded-full border border-dashed border-cyan-400/15 animate-spin-slow"
        style={{ transform: "rotateX(70deg) rotateZ(20deg)", animationDuration: "55s" }} />
      <div className="absolute inset-[1%] rounded-full border border-cyan-400/[0.07]"
        style={{ transform: "rotateX(65deg) rotateZ(-25deg)" }} />

      {/* Satellite dot 1 */}
      <div className="absolute inset-[4%] animate-spin"
        style={{ transform: "rotateX(72deg)", animationDuration: "16s" }}>
        <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_14px_#22d3ee]" />
      </div>
      {/* Satellite dot 2 */}
      <div className="absolute inset-[10%] animate-spin"
        style={{ transform: "rotateX(70deg) rotateZ(20deg)", animationDuration: "32s" }}>
        <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
      </div>

      {/* Planet globe */}
      <div className="absolute inset-[14%] animate-float-slow">
        <div
          className="relative h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, oklch(0.40 0.14 230), oklch(0.20 0.09 245) 45%, oklch(0.09 0.04 258) 85%)",
            boxShadow:
              "inset -28px -28px 55px oklch(0.05 0.02 258), inset 12px 12px 35px oklch(0.42 0.13 225 / 0.22), 0 0 70px oklch(0.78 0.20 215 / 0.35), 0 0 130px oklch(0.72 0.18 240 / 0.18)",
          }}
        >
          {/* Continent blobs */}
          {[
            { top: "16%", left: "18%", w: "36%", h: "22%" },
            { top: "43%", left: "8%", w: "30%", h: "26%" },
            { top: "24%", left: "54%", w: "34%", h: "36%" },
            { top: "64%", left: "48%", w: "24%", h: "22%" },
          ].map((pos, i) => (
            <div
              key={i}
              className="pointer-events-none absolute rounded-[40%]"
              style={{
                top: pos.top, left: pos.left, width: pos.w, height: pos.h,
                background: "radial-gradient(ellipse at 40% 35%, oklch(0.50 0.14 210 / 0.4), oklch(0.28 0.09 230 / 0.2) 65%, transparent)",
                filter: "blur(5px)",
              }}
            />
          ))}

          {/* Grid lines on globe */}
          {[30, 55, 78].map((v) => (
            <div key={v} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ width: `${v}%`, height: `${v}%`, border: "1px solid oklch(0.78 0.20 215 / 0.09)" }} />
          ))}
          {[0, 45, 90, 135].map((deg) => (
            <div key={deg} className="pointer-events-none absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2"
              style={{ transform: `translate(-50%,-50%) rotate(${deg}deg)`, background: "oklch(0.78 0.20 215 / 0.07)" }} />
          ))}

          {/* Heat hotspots */}
          {hotspots.map((h, i) => (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}>
              <div
                className="animate-pulse-heat rounded-full"
                style={{
                  width: h.temp > 50 ? "10px" : "6px",
                  height: h.temp > 50 ? "10px" : "6px",
                  background: h.temp > 50 ? "var(--heat-extreme)" : h.temp > 44 ? "var(--heat-hot)" : "var(--heat-warm)",
                  boxShadow: `0 0 ${h.temp > 50 ? 14 : 7}px ${h.temp > 50 ? "var(--heat-extreme)" : h.temp > 44 ? "var(--heat-hot)" : "var(--heat-warm)"}`,
                  animationDelay: `${h.delay}s`,
                }}
              />
            </div>
          ))}

          {/* Atmosphere glow rim */}
          <div className="pointer-events-none absolute inset-0 rounded-full"
            style={{ boxShadow: "inset 0 0 30px oklch(0.72 0.18 240 / 0.12), 0 0 90px -5px oklch(0.78 0.20 215 / 0.45)" }} />
          {/* Scanline sweep */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute left-0 h-px w-full animate-scanline"
              style={{ background: "linear-gradient(90deg, transparent, oklch(0.78 0.20 215 / 0.35), transparent)" }} />
          </div>
        </div>
      </div>

      {/* HUD coordinate labels */}
      <div className="absolute left-[2%] top-1/2 -translate-y-1/2 font-mono text-[9px] font-bold text-cyan-400/75 text-glow-cyan">
        12.97°N
      </div>
      <div className="absolute right-[2%] top-1/2 -translate-y-1/2 text-right font-mono text-[9px] font-bold text-cyan-400/75 text-glow-cyan">
        77.59°E
      </div>
      <div className="absolute left-1/2 top-[2%] -translate-x-1/2 font-mono text-[9px] font-bold text-cyan-400/75 text-glow-cyan">N</div>
      <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold text-cyan-400/75 text-glow-cyan">S</div>

      {/* Sensor metadata chip */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-border/40 bg-background/80 px-2.5 py-1 font-mono text-[8px] uppercase tracking-widest text-muted-foreground backdrop-blur">
        λ 10.9 µm · ε 0.95
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   CAPABILITY CARD
────────────────────────────────────────────── */
function CapabilityCard({
  title,
  body,
  graphicType,
}: {
  title: string;
  body: string;
  graphicType: "sun" | "dots" | "blue-planet" | "fire-planet";
}) {
  return (
    <div className="space-panel group flex flex-col items-center gap-4 rounded-2xl p-6 text-center transition-all hover:-translate-y-1">
      {/* Orb graphic */}
      <div className="flex justify-center">
        {graphicType === "sun" && (
          <svg className="h-24 w-24" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="oklch(0.78 0.20 215 / 0.22)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="50" cy="50" r="15" fill="url(#sunGlow1)" />
            <g style={{ transformOrigin: "50px 50px", animation: "spin 10s linear infinite" }}>
              <circle cx="50" cy="12" r="3.5" fill="#f59e0b" />
            </g>
            <defs>
              <radialGradient id="sunGlow1" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="40%" stopColor="#fef08a" />
                <stop offset="75%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </radialGradient>
            </defs>
          </svg>
        )}
        {graphicType === "dots" && (
          <svg className="h-24 w-24" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="oklch(0.78 0.20 215 / 0.15)" strokeWidth="1" strokeDasharray="4,4" />
            <circle cx="50" cy="50" r="26" fill="none" stroke="oklch(0.78 0.20 215 / 0.12)" strokeWidth="1" strokeDasharray="3,3" />
            <g style={{ transformOrigin: "50px 50px", animation: "spin 16s linear infinite" }}>
              <circle cx="50" cy="12" r="3" fill="#f43f5e" />
              <circle cx="88" cy="50" r="2.5" fill="#f59e0b" />
              <circle cx="50" cy="88" r="3" fill="#ec4899" />
              <circle cx="12" cy="50" r="2.5" fill="#e11d48" />
              <circle cx="79" cy="79" r="2.5" fill="#ef4444" />
            </g>
          </svg>
        )}
        {graphicType === "blue-planet" && (
          <svg className="h-24 w-24" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="oklch(0.78 0.20 215 / 0.22)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="50" cy="50" r="17" fill="url(#bp1)" />
            <circle cx="50" cy="50" r="17" fill="url(#bpAtm1)" />
            <g style={{ transformOrigin: "50px 50px", animation: "spin 12s linear infinite" }}>
              <circle cx="50" cy="12" r="3" fill="oklch(0.78 0.20 215)" />
            </g>
            <defs>
              <radialGradient id="bp1" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#075985" />
              </radialGradient>
              <radialGradient id="bpAtm1" cx="50%" cy="50%" r="50%">
                <stop offset="75%" stopColor="transparent" stopOpacity="0" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
              </radialGradient>
            </defs>
          </svg>
        )}
        {graphicType === "fire-planet" && (
          <svg className="h-24 w-24" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="oklch(0.78 0.20 215 / 0.22)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="50" cy="50" r="17" fill="url(#fp1)" />
            <g style={{ transformOrigin: "50px 50px", animation: "spin 8s linear infinite" }}>
              <circle cx="50" cy="12" r="3.5" fill="#f43f5e" />
            </g>
            <defs>
              <radialGradient id="fp1" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="35%" stopColor="#f43f5e" />
                <stop offset="75%" stopColor="#9f1239" />
                <stop offset="100%" stopColor="#4c0519" />
              </radialGradient>
            </defs>
          </svg>
        )}
      </div>

      <h3 className="font-mono text-sm font-extrabold uppercase tracking-widest text-foreground">
        {title}
      </h3>
      <p className="flex-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
      <div className="w-full rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
        Explore →
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   REGIONS
────────────────────────────────────────────── */
const REGIONS: Record<string, string[]> = {
  North:     ["Delhi","Punjab","Haryana","Himachal Pradesh","Jammu and Kashmir","Ladakh","Uttarakhand","Uttar Pradesh","Rajasthan","Chandigarh"],
  South:     ["Karnataka","Kerala","Tamil Nadu","Telangana","Andhra Pradesh","Puducherry","Lakshadweep","Andaman & Nicobar Islands"],
  East:      ["West Bengal","Bihar","Jharkhand","Odisha","Sikkim"],
  West:      ["Maharashtra","Gujarat","Goa","Dadra & Nagar Haveli and Daman & Diu"],
  Central:   ["Madhya Pradesh","Chhattisgarh"],
  Northeast: ["Assam","Arunachal Pradesh","Manipur","Meghalaya","Mizoram","Nagaland","Tripura"],
};

/* ──────────────────────────────────────────────
   STATE PICKER
────────────────────────────────────────────── */
function StatePicker() {
  const [region, setRegion] = useState<keyof typeof REGIONS | "All">("All");
  const [q, setQ] = useState("");

  /* Flat list of all cities, filtered + sorted alphabetically by city name */
  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return CITIES
      .filter((c) => {
        const regionOk = region === "All" || REGIONS[region]?.includes(c.state);
        const searchOk = !needle || c.name.toLowerCase().includes(needle) || c.state.toLowerCase().includes(needle);
        return regionOk && searchOk;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [region, q]);

  return (
    <div>
      {/* Header */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary text-glow-cyan">
            <Globe2 className="h-3.5 w-3.5" />
            Thermal City Index
          </div>
          <h2 className="font-mono text-3xl font-extrabold uppercase tracking-tight md:text-4xl lg:text-5xl">
            Indian Metros &amp; Cities
            <br />
            <span className="text-gradient-space">Surveillance Lens.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {STATES.length} states/UTs · {CITIES.length} cities monitored ·{" "}
            {CITIES.reduce((s, c) => s + c.wards.length, 0)} ward polygons under live LST surveillance.
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search city or state…"
              className="w-full rounded-xl border border-border/70 bg-card/50 py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all backdrop-blur"
            />
          </div>
          {/* Region filter pills */}
          <div className="flex flex-wrap gap-2">
            {(["All", ...Object.keys(REGIONS)] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r as keyof typeof REGIONS | "All")}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all ${
                  region === r
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "border border-border/50 bg-card/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alphabetical city list — one city card per row */}
      <div className="space-y-3">
        {visible.map((c) => {
          const tone =
            c.meanLST >= 47 ? "var(--heat-extreme)" :
            c.meanLST >= 45 ? "var(--heat-hot)" :
            c.meanLST >= 43 ? "var(--heat-warm)" :
            c.meanLST >= 38 ? "var(--heat-mild)" : "var(--heat-cool)";
          const label =
            c.meanLST >= 47 ? "Extreme" :
            c.meanLST >= 45 ? "Hot" :
            c.meanLST >= 43 ? "Warm" :
            c.meanLST >= 38 ? "Mild" : "Cool";

          return (
            <Link
              key={c.id}
              to="/dashboard"
              search={{ city: c.id }}
              className="city-row group relative flex items-center overflow-hidden rounded-2xl border border-border/40 bg-card/30 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Side heat accent bar */}
              <div
                className="absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-all group-hover:w-1.5"
                style={{ background: tone }}
              />
              {/* Heat glow bg blob */}
              <div
                className="pointer-events-none absolute right-0 top-0 h-full w-48 opacity-10 transition-opacity group-hover:opacity-20"
                style={{ background: `linear-gradient(to left, ${tone}, transparent)` }}
              />

              {/* Col 1: city name + state + climate */}
              <div className="relative min-w-0 flex-1 pl-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-base font-extrabold uppercase tracking-wide text-foreground transition-colors group-hover:text-primary">
                    {c.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {c.state}
                  </span>
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                  {c.climate}
                </div>
              </div>

              {/* Col 2: coordinates */}
              <div className="relative hidden shrink-0 items-center gap-1.5 sm:flex">
                <MapPin className="h-3 w-3 text-cyan-400" />
                <span className="font-mono text-[10px] text-muted-foreground">
                  {c.lat} · {c.lon}
                </span>
              </div>

              {/* Col 3: wards & population */}
              <div className="relative hidden shrink-0 flex-col items-end gap-0.5 px-8 lg:flex">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {c.wards.length} Wards
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                  {(c.populationTotal / 1e6).toFixed(2)}M Pop
                </span>
              </div>

              {/* Col 4: heat badge */}
              <div className="relative shrink-0 px-4">
                <div
                  className="rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest"
                  style={{
                    background: `color-mix(in oklch, ${tone} 15%, transparent)`,
                    color: tone,
                    border: `1px solid color-mix(in oklch, ${tone} 30%, transparent)`,
                  }}
                >
                  {label}
                </div>
              </div>

              {/* Col 5: temperature */}
              <div
                className="relative shrink-0 font-mono text-2xl font-black tabular-nums"
                style={{ color: tone, textShadow: `0 0 12px color-mix(in oklch, ${tone} 50%, transparent)` }}
              >
                {c.meanLST.toFixed(1)}°
              </div>

              {/* Col 6: arrow */}
              <div className="relative ml-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {visible.length === 0 && (
        <div className="rounded-2xl border border-primary/20 bg-card/30 py-16 text-center backdrop-blur">
          <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-mono text-sm text-muted-foreground">
            No cities match "{q}" in {region}.
          </p>
        </div>
      )}

      {/* Footer row */}
      <div className="mt-10 flex items-center justify-between border-t border-border/30 pt-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Showing {visible.length} of {CITIES.length} cities · sorted A → Z
        </div>
        <Link
          to="/dashboard"
          className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-primary transition-colors hover:text-primary/80"
        >
          Open mission control
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
