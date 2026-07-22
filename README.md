# 🌍 ThermaGrid

**🔥 Urban Heat Island Detection & Cooling AI 🌿**  
🚀 Built for the **ISRO Space Hackathon (Earth Observation Track)**.

ThermaGrid is a geospatial AI platform that detects urban heat hotspots from satellite thermal imagery and recommends physics-informed cooling interventions. It ingests imagery from Landsat-9, Sentinel-2, MOSDAC INSAT-3DR, and Resourcesat-2A LISS-IV to map urban heat islands at 30 m resolution. A physics-informed neural network (PINN) then recommends the exact mix of cool roofs, canopy, and reflective pavement to deploy.


## ✨ Features

- 🛰️ **Multi-sensor ingest**: Integrates multiple satellite feeds into a single 30 m thermal stack.
- 🌡️ **LST detection**: Brightness-temperature inversion with emissivity correction over neighborhood polygons.
- 🧠 **PINN + SHAP**: Physics-informed network enforcing surface energy balance with SHAP attribution.
- ❄️ **Cooling optimizer**: Counterfactual scenarios across cooling interventions ranked by ΔT, capex, and CO₂ offset.


## 🛠️ Tech Stack

- ⚛️ **Framework**: React 19 + TypeScript
- 🗺️ **Routing**: TanStack Router (Client-Side SPA)
- 💾 **State & Data**: TanStack Query
- 🎨 **Styling**: Tailwind CSS + Radix UI Primitives
- ⚡ **Build Tool**: Vite

## 🚀 Getting Started


### 📋 Prerequisites

Ensure you have [Bun 🥟](https://bun.sh/) or [Node.js 🟩](https://nodejs.org/) installed.

### 💻 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "isro project heatmap"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### 🧑‍💻 Development

Run the development server locally:
```bash
npm run dev
```

🌐 Open [http://localhost:5173](http://localhost:5173) to view the application in your browser.

### 🏗️ Build for Production

To build the optimized static assets for production:
```bash
npm run build
```

The output will be placed in the `dist` directory, ready to be deployed to any static hosting provider.
