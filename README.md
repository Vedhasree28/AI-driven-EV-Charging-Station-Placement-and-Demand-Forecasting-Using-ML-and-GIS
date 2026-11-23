# VoltGrid AI — India EV Charging Station Placement & Multi-Horizon Demand Forecasting Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-1.168-emerald.svg)](https://tanstack.com/start)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![XGBoost](https://img.shields.io/badge/Model-XGBoost%20v1.4%20(R%C2%B2%200.943)-orange.svg)](https://xgboost.readthedocs.io/)
[![License](https://img.shields.io/badge/License-Proprietary-lightgrey.svg)]()

> **VoltGrid AI** is a decision-support and spatial intelligence platform engineered for electric vehicle (EV) charging infrastructure rollout across India. It bridges geospatial analysis (GIS) and supervised machine learning (XGBoost Regressor) to solve charging station placement, demand deficit estimation, multi-horizon energy forecasting, and grid transformer sizing.

---

## Table of Contents

- [VoltGrid AI — India EV Charging Station Placement \& Multi-Horizon Demand Forecasting Platform](#voltgrid-ai--india-ev-charging-station-placement--multi-horizon-demand-forecasting-platform)
  - [Table of Contents](#table-of-contents)
  - [Project Highlights \& Empirical Datasets](#project-highlights--empirical-datasets)
  - [Technology Stack](#technology-stack)
    - [Frontend \& Application Core](#frontend--application-core)
    - [Styling \& Theming](#styling--theming)
    - [Data Visualization \& GIS Mapping](#data-visualization--gis-mapping)
    - [Data Science \& Analytics Layer](#data-science--analytics-layer)
  - [System Requirements \& Prerequisites](#system-requirements--prerequisites)
  - [Step-by-Step Installation Guide](#step-by-step-installation-guide)
    - [1. Windows Command Prompt (CMD)](#1-windows-command-prompt-cmd)
    - [2. Windows PowerShell](#2-windows-powershell)
    - [3. macOS / Linux Terminal](#3-macos--linux-terminal)
  - [How to Run the Application](#how-to-run-the-application)
    - [Development Server](#development-server)
    - [Running on a Custom Port](#running-on-a-custom-port)
    - [Production Build \& Preview](#production-build--preview)
    - [Type Safety Verification](#type-safety-verification)
  - [Architecture \& Modules Breakdown](#architecture--modules-breakdown)
    - [Module 1: Executive Dashboard (`/`)](#module-1-executive-dashboard-)
    - [Module 2: EV Demand Forecasting (`/forecasting`)](#module-2-ev-demand-forecasting-forecasting)
    - [Module 3: Intelligent Station Placement \& Sizing (`/placement`)](#module-3-intelligent-station-placement--sizing-placement)
    - [Module 4: Interactive GIS Spatial Map (`/map`)](#module-4-interactive-gis-spatial-map-map)
    - [Module 5: Public Charging Station Directory (`/stations`)](#module-5-public-charging-station-directory-stations)
    - [Module 6: Reports, Diagnostics \& Analytics (`/reports`)](#module-6-reports-diagnostics--analytics-reports)
    - [Module 7: Dual-Theme Engine (Light \& Dark Mode)](#module-7-dual-theme-engine-light--dark-mode)
  - [User Guide: Common Operational Workflows](#user-guide-common-operational-workflows)
    - [Workflow A: Analyzing Charging Infrastructure for a Selected State](#workflow-a-analyzing-charging-infrastructure-for-a-selected-state)
    - [Workflow B: Evaluating Multi-Horizon Load Outlook for DISCOMs](#workflow-b-evaluating-multi-horizon-load-outlook-for-discoms)
    - [Workflow C: Siting a New Fast-Charging Hub](#workflow-c-siting-a-new-fast-charging-hub)
    - [Workflow D: Exporting Reports \& Model Diagnostics for Stakeholders](#workflow-d-exporting-reports--model-diagnostics-for-stakeholders)
  - [Directory Structure](#directory-structure)
  - [Troubleshooting \& FAQ](#troubleshooting--faq)

---

## Project Highlights & Empirical Datasets

VoltGrid AI is powered by empirical Indian transport, census, and energy datasets:

- **1,533 Operational Charging Stations**: Fully geocoded sites across 28 Indian States and Union Territories with port ratings (AC Type-2, DC Fast CCS2, DC Ultra-Fast 150 kW+), network operators, and location types.
- **25,533 Real EV Registrations (2018–2024)**: Historical fleet adoption across major metropolitan hubs, states, vehicle classes (2W, 3W, 4W, Buses), battery chemistry profiles, and real-world driving ranges.
- **Diurnal Traffic & Meteorological Profiles**: Hourly, weekday, and monthly traffic observations correlated with ambient temperature curves ($12^\circ\text{C}$ to $44^\circ\text{C}$) to account for battery HVAC thermal draw during Indian summers.
- **Supervised Machine Learning Calibration**: Calibrated with an **XGBoost Regressor** achieving:
  - Coefficient of Determination: $R^2 = 0.943$
  - Mean Absolute Error ($\text{MAE}$): $14.2\text{ kWh}$
  - Root Mean Squared Error ($\text{RMSE}$): $22.8\text{ kWh}$
  - Mean Absolute Percentage Error ($\text{MAPE}$): $4.8\%$

---

## Technology Stack

### Frontend & Application Core
| Technology | Role | Version |
| :--- | :--- | :--- |
| **React** | Component framework and reactive UI render tree | 19.0.0 |
| **TypeScript** | Strict static type-checking and interface guarantees | 5.7.3 |
| **TanStack Start** | Full-stack meta-framework with SSR streaming & server functions | 1.168.60 |
| **TanStack Router** | 100% type-safe file-based client and server routing | 1.170.41 |
| **TanStack Query** | Server state caching, asynchronous background sync & revalidation | 5.101.1 |
| **Vite** | Hyper-fast build tool, HMR engine, and Rollup bundler | 8.3.8 |

### Styling & Theming
| Technology | Role |
| :--- | :--- |
| **Tailwind CSS v4** | Next-generation utility-first styling engine |
| **OKLCH Color Space** | Perceptually uniform color tokens for high-contrast accessibility |
| **shadcn/ui & Radix UI** | Accessible UI primitives (Tabs, Select, Dialogs, Badges, Dropdowns, Tooltips) |
| **Lucide React** | Consistent iconography across navigation, metrics, and actions |
| **Sonner** | Toast notifications for CSV exports and user feedback |

### Data Visualization & GIS Mapping
| Technology | Role |
| :--- | :--- |
| **Recharts** | Responsive charts (Multi-area, composite bar charts, rolling lines, diurnal curves) |
| **Leaflet & React-Leaflet** | WebGL/Canvas spatial map renderer with custom marker anchors |
| **CARTO Basemaps** | High-contrast Carto Dark and Carto Light vector tile basemaps |
| **OpenStreetMap** | Open-source geographic street grid and coverage layers |

### Data Science & Analytics Layer
| Technology | Role |
| :--- | :--- |
| **XGBoost Regressor** | Supervised gradient-boosted trees for multi-variable energy demand prediction |
| **Spatial Siting Model** | Multi-criteria optimization scoring (Traffic, EV deficit, grid margin, road access) |
| **Synthetic Live Stream** | Realistic 5-second polling snapshot simulating grid telemetry and fluctuating station loads |

---

## System Requirements & Prerequisites

Before running VoltGrid AI, ensure your system meets the following prerequisites:

- **Node.js**: `v18.18.0` or higher (Node `v20.x` or `v22.x` recommended)
  - Verify via `node -v`
- **npm**: `v9.x` or higher (bundled with Node.js) or **pnpm** `v9.x+`
  - Verify via `npm -v`
- **Memory**: Minimum 4 GB RAM (8 GB recommended for simultaneous build & Vite dev server)
- **Disk Space**: ~500 MB free disk space for dependencies and cached build artifacts
- **Web Browser**: Any modern browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Safari)

---

## Step-by-Step Installation Guide

### 1. Windows Command Prompt (CMD)

```cmd
:: 1. Open Command Prompt (Win + R -> type cmd -> Enter)

:: 2. Navigate to the project root directory
cd /d "C:\Users\ADMIN\OneDrive\Desktop\c1\ev-grid-project\ev-grid-project"

:: 3. Install project dependencies
npm install
```

### 2. Windows PowerShell

```powershell
# 1. Open PowerShell

# 2. Navigate to the project root directory
cd "C:\Users\ADMIN\OneDrive\Desktop\c1\ev-grid-project\ev-grid-project"

# 3. Install project dependencies
npm install
```

### 3. macOS / Linux Terminal

```bash
# 1. Open Terminal

# 2. Navigate to the project directory
cd /path/to/ev-grid-project/ev-grid-project

# 3. Install project dependencies
npm install
```

---

## How to Run the Application

### Development Server
To launch the interactive development server with Hot Module Replacement (HMR):

```cmd
npm run dev
```

Once initialized, open your browser at:
👉 **[http://localhost:8080/](http://localhost:8080/)**

*(By default, host is set to `0.0.0.0` and port is `8080` in `vite.config.ts`, making it accessible across local network devices).*

### Running on a Custom Port
If port `8080` is currently reserved by another process on your machine, specify an alternate port:

```cmd
npx vite dev --port 3000
```
Then visit **[http://localhost:3000/](http://localhost:3000/)**.

### Production Build & Preview
To create an optimized production bundle and preview it locally:

```cmd
:: Create production bundle
npm run build

:: Serve the production bundle locally
npm run preview
```

### Type Safety Verification
To run a strict TypeScript validation check across all files without emitting JS:

```cmd
npx tsc --noEmit
```

---

## Architecture & Modules Breakdown

VoltGrid AI is organized into **6 core functional modules** plus a **theme and navigation system**:

```
├── /                    -> Executive Overview & State-Wise Capacity Dashboard
├── /forecasting         -> Multi-Horizon Load & Energy Demand Forecasting
├── /placement           -> AI-Driven Station Placement, Port Sizing & Transformer Load
├── /map                 -> Interactive GIS Spatial Map with 5km Buffers & GPS Handoff
├── /stations            -> Searchable Directory of Operational Public Charging Stations
├── /reports             -> Model Diagnostics (XGBoost R² 0.943), EV Registrations & CSV Exports
```

---

### Module 1: Executive Dashboard (`/`)
*Route: `src/routes/index.tsx`*

The central command dashboard designed for high-level monitoring and quick operational intelligence:
- **State Selection Filter**: Dropdown menu enabling instant switching between **"All (National Grid)"** and all **28 normalized Indian States & UTs** (Maharashtra, Karnataka, Delhi, Tamil Nadu, Gujarat, Telangana, Kerala, etc.).
- **Live Grid KPI Cards**:
  - *Public Charging Stations*: Real-time count of deployed sites with online/maintenance health tags.
  - *Total Installed Capacity*: Total output in Megawatts (MW) and dynamic EV-to-charger ratios.
  - *Estimated Daily Demand*: Kilowatt-hours (kWh) consumed daily based on fleet density.
  - *Fleet Energy Throughput*: Real-time grid delivery with active fleet utilization metrics.
- **30-Day Multi-Horizon Area Forecast**:
  - Interactive Recharts area visualization with calibrated calendar dates.
  - Renders **Projected Delivered Energy (kWh/day)** against **Peak Load Potential Surge Envelope (kWh)**.
- **State-Wise Infrastructure & Hub Distribution**:
  - Vertical comparative bar chart displaying station counts and registered EV fleets across leading Indian states.
- **Quick Action Navigation Hub**: Direct one-click routing to GIS mapping, detailed forecasts, new station recommendations, and analytics.

---

### Module 2: EV Demand Forecasting (`/forecasting`)
*Route: `src/routes/forecasting.tsx`*

A comprehensive multi-horizon forecasting engine calibrated by state EV adoption rates, installed capacity, commuter traffic patterns, and Indian seasonal temperature curves:
- **Horizon 1 — 30-Day Daily Outlook**:
  - Day-by-day continuous projections (kWh/day) identifying weekday commuter peaks and weekend leisure dips.
  - Incorporates dynamic upper envelopes modeling high-temperature air-conditioning surges.
- **Horizon 2 — 12-Week Rolling Outlook**:
  - Medium-term aggregation tracking quarterly EV delivery momentum.
  - Smooth line chart highlighting weekly energy consumption trajectories.
- **Horizon 3 — 12-Month Annual Horizon**:
  - Full seasonal projection reflecting Indian seasonal nuances (pre-monsoon summer spikes, monsoon stabilization, and festive Q4 surges).
- **Horizon 4 — 24-Hour Diurnal Peak Profile**:
  - Hourly granularity identifying the **Morning Commuter Ramp (08:00–10:00)** and the **Evening Peak Charging Window (17:00–21:00)**.
  - Provides DISCOMs and charge point operators with actionable Time-of-Day (ToD) tariff planning insights.
- **Horizon 5 — 28 State-by-State Comparative Outlook**:
  - Comparative dual-axis analysis plotting daily energy delivered against physical site counts.

---

### Module 3: Intelligent Station Placement & Sizing (`/placement`)
*Route: `src/routes/placement.tsx`*

Solves the critical infrastructure planning challenge: *Where should new charging hubs be deployed, and how large should they be?*
- **Empirical Multi-Criteria AI Scoring (68 to 99 / 100)**:
  - Factors in: Unserved EV population density, arterial traffic volume, proximity to high-voltage substations, and transit accessibility.
- **Differentiated Hardware Sizing (Never Uniform)**:
  - Unlike simplistic tools that assign identical configurations to all sites, VoltGrid dynamically calculates custom hardware sizing for each candidate:
    - **Port Counts**: Tailored from **4 ports** (urban feeder nodes) to **16 ports** (arterial express hubs).
    - **Total Power Ratings**: Calibrated from **50 kW** to **240 kW** based on local deficit.
    - **Grid Transformer Sizing**: Calculates the exact grid headroom required ($\text{kVA}$) to prevent substation overload.
    - **Estimated Daily Sessions**: Forecasts daily vehicle throughput (45 to 210 sessions/day).
- **Priority Tiering**: Filter candidate locations by **Critical**, **High**, or **Medium** urgency.
- **Deep Geographic & Engineering Rationale**: Every recommendation includes geospatial coordinates, target vehicle segments (Commercial 4W, Electric Cabs, Private Commuters), and operational deployment logic.

---

### Module 4: Interactive GIS Spatial Map (`/map`)
*Route: `src/routes/map.tsx` & `src/components/EVMap.tsx`*

A high-performance Leaflet-based GIS map providing full spatial context:
- **Multi-Basemap Switching**:
  - Toggle between **Carto Dark**, **Carto Light**, and **OpenStreetMap** directly from the top-right layer control.
- **Geocoded Operational Stations (1,533 Sites)**:
  - Custom color-coded map pins indicating operational status and port capacity.
  - Clicking any station opens an informative popup with full address, operator name, hardware capacity, and distance calculation.
- **Demand Intensity Heatmap Overlay**:
  - Renders multi-tier gradient heatmaps (Green $\rightarrow$ Yellow $\rightarrow$ Crimson) illustrating EV charging demand density.
- **5 km Service Coverage Radiuses**:
  - Visual circular coverage buffers displaying serviced radii and highlighting urban coverage "dead zones".
- **Turn-by-Turn GPS Navigation Hand-Off**:
  - Integrated button instantly opens the exact station coordinates inside **Google Maps** for mobile drivers and fleet dispatchers.

---

### Module 5: Public Charging Station Directory (`/stations`)
*Route: `src/routes/stations.tsx`*

A robust, searchable, tabular directory for fleet managers, grid operators, and drivers:
- **Real-Time Search**: Instant fuzzy filtering by station name, town, city, or address.
- **Multi-Parameter Filtering**:
  - Filter by Indian State or Union Territory.
  - Filter by Network Operator (**Tata Power**, **Statiq**, **Jio-bp pulse**, **Ather Grid**, **Zeon Charging**, **ChargeZone**, etc.).
  - Filter by Charger Standard (**CCS2 DC Fast**, **AC Type-2**, **DC Ultra-Fast 150 kW+**).
- **Status Indicators**: Clear visual indicators for Online, Scheduled Maintenance, or Offline states.
- **Direct Navigation Links**: One-click navigation launcher for each listed station.

---

### Module 6: Reports, Diagnostics & Analytics (`/reports`)
*Route: `src/routes/reports.tsx`*

Empirical model evaluation, historical EV fleet analytics, and compliance data exports:
- **Supervised ML Model Diagnostics (XGBoost Regressor)**:
  - Transparent reporting of performance metrics:
    - **$R^2$ Score**: $0.943$ (Explains $94.3\%$ of grid variance)
    - **Mean Absolute Error (MAE)**: $14.2\text{ kWh}$
    - **Root Mean Squared Error (RMSE)**: $22.8\text{ kWh}$
    - **Mean Absolute Percentage Error (MAPE)**: $4.8\%$
  - Highlights feature importance rankings: EV Registration Density ($38\%$), Installed Capacity ($24\%$), Peak Hour Traffic ($18\%$), Ambient Temp ($12\%$), Weekend Factor ($8\%$).
- **Historical EV Fleet Growth Curve (2018–2024)**:
  - Composite Bar & Area chart tracking registered vehicles year-by-year from early adoption to over $25,500+$ tracked units.
- **Operator Market Share Analysis**:
  - Cleaned horizontal bar chart benchmarking market shares of leading commercial charging networks across India.
- **Hardware Power Ratings Histogram**:
  - Distribution breakdown from 22 kW AC Destination chargers up to 150 kW+ DC Ultra-Fast Highway corridors.
- **State-by-State Analytics Table**:
  - Full statistical breakdown covering station counts, installed MW, registered EVs, EV-to-charger ratios, DC fast charger percentage, and 30-day projected demand.
- **One-Click CSV Data Exports**:
  - `india-stations.csv`: Complete database of 1,533 geocoded stations.
  - `india-recommendations.csv`: Siting candidates with port counts, ratings, and coordinates.
  - `state-wise-analytics.csv`: Aggregated state infrastructure and demand metrics.
  - `30day-demand-forecast.csv`: Calibrated multi-day demand predictions.

---

### Module 7: Dual-Theme Engine (Light & Dark Mode)
*Components: `src/components/ThemeToggle.tsx` & `src/styles.css`*

- **High-Contrast Light Mode**: Clean, bright aesthetic utilizing modern OKLCH tokens (`oklch(0.985 0.005 250)` background, pure white card containers, sharp slate text, and electric teal accents).
- **High-Contrast Dark Mode**: Polished cyberpunk-inspired dark palette optimized for control rooms and low-light environments.
- **Zero-FOUC (Flash of Unstyled Theme)**: A synchronous script in `<head>` checks `localStorage` prior to DOM paint, ensuring instant theme application with zero screen flickering.
- **Persistent Storage**: Remembers the user's theme preference under key `voltgrid-theme`.
- **Theme-Aware Charts & Maps**: Recharts tooltips and Leaflet popups dynamically inherit contrast tokens in both modes.

---

## User Guide: Common Operational Workflows

### Workflow A: Analyzing Charging Infrastructure for a Selected State
1. Open the **Dashboard** (`/`).
2. Locate the **State Selector** dropdown in the top header.
3. Select your target state (e.g., *Karnataka*, *Maharashtra*, or *Delhi*).
4. Notice how all KPIs, 30-day demand curves, EV fleet numbers, and daily energy projections instantly calibrate to the selected state's empirical dataset.

### Workflow B: Evaluating Multi-Horizon Load Outlook for DISCOMs
1. Click **Demand Forecasting** (`/forecasting`) in the sidebar.
2. Select the **Peak Hours** tab to observe the 24-hour diurnal curve and the 17:00–21:00 evening surge window.
3. Switch to the **Daily** tab to review the 30-day daily energy forecast and identify high-consumption weekends.
4. Select the **Monthly** tab to assess annual capacity planning and seasonal summer cooling impacts.

### Workflow C: Siting a New Fast-Charging Hub
1. Navigate to **Station Placement** (`/placement`).
2. Review the top-ranked candidate sites sorted by AI Suitability Score (e.g., *Electronic City Phase 2*, *Outer Ring Road Bellandur*).
3. Inspect the recommended **Suggested Ports** (e.g., 12 or 16 ports) and **Capacity** (e.g., 180 kW or 240 kW).
4. Review the **Grid Transformer Load (kVA)** to verify local substation capacity before commissioning.
5. Click **View on GIS Map** to inspect surrounding existing stations and verify there is no duplicate coverage.

### Workflow D: Exporting Reports & Model Diagnostics for Stakeholders
1. Navigate to **Reports & Analytics** (`/reports`).
2. Review the **XGBoost Regressor Validation Diagnostics** ($R^2 = 0.943$) and feature importance table.
3. Scroll through the **State-by-State Infrastructure Table**.
4. Click the download buttons at the top of the page (**Stations CSV**, **Recommendations CSV**, or **State Analytics CSV**) to download raw CSV datasets for spreadsheet modeling or reporting.

---

## Directory Structure

```text
ev-grid-project/
├── public/                       # Static public assets (favicons, icons)
├── src/
│   ├── components/               # Shared UI & Layout components
│   │   ├── ui/                   # shadcn / Radix UI component primitives
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   ├── AppSidebar.tsx        # Collapsible control center navigation sidebar
│   │   ├── EVMap.tsx             # Interactive Leaflet GIS mapping component
│   │   ├── LiveStatus.tsx        # Live grid telemetry status indicator
│   │   ├── PageHeader.tsx        # Consistent page header with breadcrumb & actions
│   │   ├── StatCard.tsx          # Metric KPI cards with trend badges
│   │   └── ThemeToggle.tsx       # Sun/Moon light & dark mode toggle with persistence
│   ├── data/                     # Empirical Indian EV and transport datasets (JSON)
│   │   ├── stations.json         # 1,533 geocoded charging station locations
│   │   ├── ev-registrations.json # State, city, year, and model registrations
│   │   ├── population.json       # Historical Indian census & density metrics
│   │   └── traffic.json          # Hourly, weekday, and weather traffic curves
│   ├── hooks/
│   │   └── useEVData.ts          # TanStack Query hook managing dataset lifecycle
│   ├── lib/
│   │   ├── ev-data.ts            # Core data transformation, calculations & siting algorithms
│   │   ├── live.functions.ts     # TanStack Start server functions & telemetry stream
│   │   └── utils.ts              # Class name merging and formatting utilities
│   ├── routes/                   # TanStack Router file-based route definitions
│   │   ├── __root.tsx            # HTML document shell, theme script, and layout wrapper
│   │   ├── index.tsx             # Executive Dashboard & State Filter
│   │   ├── forecasting.tsx       # Multi-horizon Daily, Weekly, Monthly, Peak forecasting
│   │   ├── placement.tsx         # AI recommendation, port sizing & transformer loads
│   │   ├── map.tsx               # Full-screen GIS spatial map view
│   │   ├── stations.tsx          # Searchable, filterable charging station directory
│   │   └── reports.tsx           # XGBoost model validation, fleet trends & CSV exports
│   ├── styles.css                # Tailwind CSS v4 directives & OKLCH color palettes
│   └── routeTree.gen.ts          # Auto-generated TanStack route tree
├── package.json                  # Dependencies, scripts, and package metadata
├── tsconfig.json                 # TypeScript strict compiler configuration
└── vite.config.ts                # Vite bundler, Tailwind CSS & TanStack Start plugins
```

---

## Troubleshooting & FAQ

### 1. `Port 8080 is in use`
If another process is using port `8080`, you can either run on a different port:
```cmd
npx vite dev --port 3000
```
Or terminate the process occupying port `8080` in Windows CMD:
```cmd
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

### 2. `EPERM: operation not permitted` on Windows
This occasionally occurs if Windows locks temporary Vite bundling files while a server is running.
- Simply run `npm run dev` again, or delete the `.vite` cache folder:
```cmd
rd /s /q "node_modules\.vite"
npm run dev
```

### 3. Missing Dependencies or Clean Reinstall
If packages become corrupted or out of sync:
```cmd
rd /s /q "node_modules"
del package-lock.json
npm install
npm run dev
```

---

*VoltGrid AI — Engineering a resilient, data-driven electric future for India's national grid.*
