# VoltGrid AI

### AI-Driven EV Charging Station Placement & Multi-Horizon Demand Forecasting for India

[![Live
Demo](https://img.shields.io/badge/Live%20Demo-VoltGrid%20AI-16a34a?style=for-the-badge)](https://voltgrid-ai-xokq.onrender.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TanStack
Start](https://img.shields.io/badge/TanStack%20Start-1.168-00A67E)](https://tanstack.com/start)
[![Tailwind
CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=black)](https://render.com/)

**VoltGrid AI** is a decision-support and spatial intelligence platform
for planning electric vehicle (EV) charging infrastructure across India.
It combines geospatial analysis (GIS), EV and transport datasets, demand
forecasting, and multi-criteria station-siting logic to help explore
charging demand, identify potential locations, and assess infrastructure
requirements.

> **Live application:** <https://voltgrid-ai-xokq.onrender.com>

------------------------------------------------------------------------

## Contents

-   [Overview](#overview)
-   [Key Features](#key-features)
-   [Project Data and Model Metrics](#project-data-and-model-metrics)
-   [Technology Stack](#technology-stack)
-   [Application Modules](#application-modules)
-   [Getting Started](#getting-started)
-   [Production Build](#production-build)
-   [Deployment on Render](#deployment-on-render)
-   [Project Structure](#project-structure)
-   [Usage Workflows](#usage-workflows)
-   [Notes and Limitations](#notes-and-limitations)
-   [License](#license)

------------------------------------------------------------------------

## Overview

EV adoption creates a growing need for accessible charging
infrastructure and reliable electricity-demand planning. VoltGrid AI
brings several planning views together in one web application:

-   Explore public charging-station distribution across Indian states
    and union territories.
-   Review EV demand forecasts across daily, weekly, monthly, and hourly
    horizons.
-   Examine candidate locations for new charging stations.
-   View station locations and coverage context on an interactive GIS
    map.
-   Review model diagnostics and export selected datasets as CSV files.

The platform is intended for exploration and planning support.
Recommendations should be validated against current local conditions,
site surveys, grid capacity information, and relevant regulatory
requirements before implementation.

## Key Features

-   **National and state-level dashboard:** View infrastructure
    indicators and state-wise comparisons.
-   **Multi-horizon demand forecasting:** Explore daily, weekly, annual,
    and 24-hour demand profiles.
-   **Station placement recommendations:** Review candidate sites using
    factors such as EV demand deficit, traffic, grid margin, and road
    access.
-   **Infrastructure sizing:** Inspect suggested charging-port counts,
    power capacity, and transformer requirements.
-   **Interactive GIS map:** Explore mapped charging stations, demand
    intensity, and 5 km service-coverage buffers.
-   **Station directory:** Search and filter charging stations by
    location, operator, and charger type.
-   **Reports and exports:** Review model diagnostics and download
    available CSV datasets.
-   **Light and dark themes:** Switch between two display themes.

## Project Data and Model Metrics

The project documentation describes the following datasets and model
results:

  -----------------------------------------------------------------------
  Dataset / Metric                    Project-documented details
  ----------------------------------- -----------------------------------
  Operational charging stations       1,533 geocoded sites across 28
                                      Indian states and union territories

  EV registrations                    25,533 registrations covering
                                      2018--2024

  Supporting profiles                 Traffic, weather, population, and
                                      energy-related profiles

  Forecasting model                   XGBoost Regressor

  Coefficient of determination (R²)   0.943

  Mean Absolute Error (MAE)           14.2 kWh

  Root Mean Squared Error (RMSE)      22.8 kWh

  Mean Absolute Percentage Error      4.8%
  (MAPE)                              
  -----------------------------------------------------------------------

*These are the metrics and dataset counts documented for this project.
They should be interpreted in the context of the dataset, evaluation
method, and assumptions used by the implementation.*

## Technology Stack

  -----------------------------------------------------------------------
  Area                                Technologies
  ----------------------------------- -----------------------------------
  Frontend                            React 19, TypeScript

  Application framework               TanStack Start, TanStack Router

  Build tooling                       Vite

  Styling and UI                      Tailwind CSS v4, shadcn/ui, Radix
                                      UI

  Charts                              Recharts

  GIS mapping                         Leaflet, React-Leaflet

  Basemaps                            CARTO, OpenStreetMap

  Data and application logic          JSON datasets, TanStack Query,
                                      TypeScript

  Forecasting                         XGBoost Regressor (as documented by
                                      the project)

  Hosting                             Render
  -----------------------------------------------------------------------

## Application Modules

  -----------------------------------------------------------------------
  Route                   Module                  Description
  ----------------------- ----------------------- -----------------------
  `/`                     Executive Dashboard     State selector,
                                                  infrastructure KPIs,
                                                  demand overview, and
                                                  state-wise comparisons

  `/forecasting`          EV Demand Forecasting   Daily, weekly, annual,
                                                  hourly, and state-wise
                                                  demand outlooks

  `/placement`            Station Placement       Candidate locations,
                                                  suitability scores,
                                                  suggested port counts,
                                                  and transformer sizing

  `/map`                  Interactive GIS Map     Charging-station
                                                  locations, demand
                                                  intensity, and
                                                  service-coverage
                                                  buffers

  `/stations`             Charging Station        Searchable and
                          Directory               filterable station
                                                  information

  `/reports`              Reports and Analytics   Model diagnostics, EV
                                                  fleet trends,
                                                  analytics, and CSV
                                                  exports
  -----------------------------------------------------------------------

## Getting Started

### Prerequisites

-   Node.js 20.x or 22.x recommended
-   npm 9.x or later
-   Git
-   A modern web browser

### 1. Clone the repository

``` bash
git clone https://github.com/Vedhasree28/AI-driven-EV-Charging-Station-Placement-and-Demand-Forecasting-Using-ML-and-GIS.git
cd AI-driven-EV-Charging-Station-Placement-and-Demand-Forecasting-Using-ML-and-GIS
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Start the development server

``` bash
npm run dev
```

Open the local URL printed in your terminal. The project is configured
to use port `8080` by default.

## Production Build

Create an optimized production build:

``` bash
npm run build
```

Start the production server:

``` bash
npm start
```

The production start script runs the Nitro output at
`.output/server/index.mjs`. Make sure the `start` script is present in
`package.json`.

## Deployment on Render

VoltGrid AI is deployed as a Node.js web service on Render.

**Live URL:** <https://voltgrid-ai-xokq.onrender.com>

Use the following settings when configuring the Render web service:

  Render setting   Value
  ---------------- --------------------------------
  Runtime          Node
  Branch           `main`
  Root directory   Leave blank (repository root)
  Build command    `npm install && npm run build`
  Start command    `npm start`

Configure these environment variables if required by the project's
Nitro/Render setup:

  Key              Value
  ---------------- --------------
  `NITRO_PRESET`   `render-com`
  `HOST`           `0.0.0.0`

Render provides the service port through its runtime environment. The
application should listen on the port supplied by the hosting
environment.

## Project Structure

``` text
.
├── public/                   # Static assets
├── src/
│   ├── components/           # Shared UI components and application layout
│   │   ├── ui/               # UI primitives
│   │   ├── AppSidebar.tsx
│   │   ├── EVMap.tsx
│   │   ├── LiveStatus.tsx
│   │   ├── PageHeader.tsx
│   │   ├── StatCard.tsx
│   │   └── ThemeToggle.tsx
│   ├── data/                 # EV, station, population, and traffic datasets
│   ├── hooks/                # Data-fetching hooks
│   ├── lib/                  # Data transformations and application logic
│   ├── routes/               # File-based application routes
│   └── styles.css            # Global styles and theme tokens
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Usage Workflows

### Explore infrastructure for a state

1.  Open the [Dashboard](https://voltgrid-ai-xokq.onrender.com/).
2.  Choose a state or the national view from the state selector.
3.  Review the displayed infrastructure and demand indicators.

### Review demand forecasts

1.  Open `/forecasting`.
2.  Switch between the available daily, weekly, monthly, peak-hour, and
    state comparison views.
3.  Compare the forecast patterns across the available horizons.

### Evaluate a potential charging-station location

1.  Open `/placement`.
2.  Review the ranked candidate locations.
3.  Inspect the suitability factors and suggested infrastructure sizing.
4.  Open the GIS map to examine nearby stations and spatial coverage.

### Review analytics and export data

1.  Open `/reports`.
2.  Review the model diagnostics and state-wise analytics.
3.  Use the available CSV export actions to download supported datasets.

## Notes and Limitations

-   Forecasts and placement scores are decision-support outputs; they
    are not guarantees of future demand or site suitability.
-   The project includes a synthetic live telemetry simulation, as
    described in its application documentation. It should not be
    interpreted as a live feed from electricity-grid operators.
-   Map display depends on access to the configured external map-tile
    providers.
-   Dataset coverage and quality affect the interpretation of forecasts
    and recommendations. Verify data freshness and source details before
    using outputs for operational decisions.
-   Render free services may take time to respond after periods of
    inactivity.

## License

The repository currently identifies the project license as
**Proprietary**. Contact the repository owner for permission before
redistributing or reusing the project.

------------------------------------------------------------------------

## Author

**Penchala Vedhasree**

-   GitHub: [@Vedhasree28](https://github.com/Vedhasree28)
-   Project repository: [VoltGrid AI on
    GitHub](https://github.com/Vedhasree28/AI-driven-EV-Charging-Station-Placement-and-Demand-Forecasting-Using-ML-and-GIS)
-   Live demo: [VoltGrid AI](https://voltgrid-ai-xokq.onrender.com)

------------------------------------------------------------------------

*VoltGrid AI --- Supporting data-driven EV charging infrastructure
planning for India.*
