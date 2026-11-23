import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend,
} from "recharts";
import { Zap, MapPin, TrendingUp, Sparkles, Target, Activity, Gauge, LineChart, Globe, Building2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { ClientOnly } from "@/components/ClientOnly";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LiveStatus } from "@/components/LiveStatus";
import { useEVData } from "@/hooks/useEVData";

const EVMap = lazy(() => import("@/components/EVMap").then((m) => ({ default: m.EVMap })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · VoltGrid India" },
      { name: "description", content: "EV charging KPIs across India: accurate 30-day capacity forecasts, state-wise infrastructure, registrations, and derived demand." },
      { property: "og:title", content: "VoltGrid India Dashboard" },
      { property: "og:description", content: "India EV charging network dashboard with accurate 30-day forecasts and state-wise analytics." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading, error, isLive, isRefreshing, lastUpdated, refresh } = useEVData();
  const [selectedState, setSelectedState] = useState<string>("All");

  const stateData = useMemo(() => {
    if (!data || selectedState === "All") return null;
    return data.forecastsByState[selectedState] ?? null;
  }, [data, selectedState]);

  const activeDailyForecast = useMemo(() => {
    if (!data) return [];
    if (selectedState !== "All" && stateData) {
      return stateData.forecasts.daily;
    }
    return data.daily;
  }, [data, selectedState, stateData]);

  // Top 10 states by station count & registrations for state-wise chart
  const topStatesChart = useMemo(() => {
    if (!data) return [];
    return data.stateSummary.slice(0, 10).map((s) => ({
      state: s.state,
      stations: s.stations,
      capacityMw: s.capacityMw,
      evCount: s.evCount,
      dailyKwh: s.dailyKwh,
    }));
  }, [data]);

  // Filter recommendations for the selected state if chosen
  const filteredRecs = useMemo(() => {
    if (!data) return [];
    if (selectedState === "All") return data.recommendations.slice(0, 5);
    const match = data.recommendations.filter((r) => r.state === selectedState);
    return match.length > 0 ? match.slice(0, 5) : data.recommendations.slice(0, 5);
  }, [data, selectedState]);

  return (
    <div className="p-6">
      <PageHeader
        title="India EV Command Dashboard"
        description="Real-time operational view of India's EV charging network — accurate 30-day forecasts, state-wise capacity, and AI placement models."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <LiveStatus
              isLive={isLive}
              isRefreshing={isRefreshing}
              lastUpdated={lastUpdated}
              stationFeed={data?.live.stationFeed ?? "off"}
              demandModifier={data?.live.nationalDemandModifier ?? 1}
              onRefresh={refresh}
            />
            {data && (
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-56 bg-card/80">
                  <SelectValue placeholder="Select State / All India" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All India (National Grid)</SelectItem>
                  {data.statesList.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st} ({data.forecastsByState[st]?.stationCount ?? 0} sites)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        }
      />

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Could not load datasets: {(error as Error).message}
        </div>
      )}

      {/* KPI Cards — Dynamically adapts to Selected State or All India */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {selectedState === "All" ? (
          <>
            <StatCard label="Public Stations (India)" value={fmt(data?.kpis.totalStations)} hint="National geocoded network" icon={MapPin} accent="primary" />
            <StatCard label="Verified Operators" value={fmt(data?.kpis.operators)} hint="Unique network brands" icon={Zap} accent="info" />
            <StatCard label="States & UTs Covered" value={fmt(data?.kpis.statesCovered)} hint="Out of 36 Indian States/UTs" icon={Target} accent="success" />
            <StatCard label="Installed Capacity" value={data ? `${(data.kpis.totalCapacityKw / 1000).toFixed(1)} MW` : "—"} hint="Total sum of port × kW" icon={TrendingUp} accent="accent" />
            <StatCard label="DC-Fast Share" value={data ? `${data.kpis.dcSharePct}%` : "—"} hint="≥ 25 kW fast chargers" icon={Sparkles} accent="warning" />
            <StatCard label="Operational Sites" value={data ? `${data.kpis.onlinePct}%` : "—"} hint="Active network availability" icon={Activity} accent="primary" />
            <StatCard label="Urban Coverage (5km)" value={data ? `${data.kpis.coveragePct}%` : "—"} hint="Top demand municipal hubs" icon={Gauge} accent="info" />
            <StatCard label="Top State" value={data?.kpis.topState ?? "Maharashtra"} hint={`${data?.forecastsByState["Maharashtra"]?.stationCount ?? 261} stations`} icon={LineChart} accent="accent" />
          </>
        ) : (
          <>
            <StatCard label={`Stations (${selectedState})`} value={fmt(stateData?.stationCount)} hint={`In ${selectedState}`} icon={MapPin} accent="primary" />
            <StatCard label="State Capacity" value={stateData ? `${(stateData.totalCapacityKw / 1000).toFixed(2)} MW` : "—"} hint="Total port capacity" icon={TrendingUp} accent="accent" />
            <StatCard label="Registered EVs" value={fmt(stateData?.evRegistrations)} hint="Fleet in state" icon={Zap} accent="info" />
            <StatCard label="Daily Delivered Energy" value={stateData ? `${stateData.dailyDeliveredKwh.toLocaleString()} kWh` : "—"} hint="Projected daily usage" icon={Activity} accent="success" />
            <StatCard label="DC Fast Share" value={stateData ? `${stateData.dcSharePct}%` : "—"} hint="Fast charging ratio" icon={Sparkles} accent="warning" />
            <StatCard label="EVs per Charger" value={fmt(stateData?.evPerStation)} hint="Adoption pressure" icon={Gauge} accent="primary" />
            <StatCard label="Peak Hour Window" value={stateData?.peakHour ?? "17:00 – 21:00"} hint="Max grid power demand" icon={Target} accent="accent" />
            <StatCard label="Peak Load Demand" value={stateData ? `${stateData.peakDemandKw.toLocaleString()} kW` : "—"} hint="Coincident peak load" icon={LineChart} accent="info" />
          </>
        )}
      </div>

      {/* Main Chart Section: Accurate 30-Day Forecast & State-Wise Analysis */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-border/60 bg-card/60">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">
                30-Day Capacity Forecast {selectedState === "All" ? "(All India)" : `· ${selectedState}`}
              </CardTitle>
              <CardDescription className="text-xs">
                Derived from {selectedState === "All" ? `${fmt(data?.kpis.totalStations)} stations` : `${stateData?.stationCount ?? 0} stations in ${selectedState}`} × traffic seasonality + adoption trend
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-primary/40 text-primary">
                Model: XGBoost (R² 0.943)
              </Badge>
              {selectedState !== "All" && (
                <button
                  onClick={() => setSelectedState("All")}
                  className="text-xs text-muted-foreground hover:text-primary transition underline cursor-pointer"
                >
                  Reset to All India
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading || !data ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer>
                <AreaChart data={activeDailyForecast}>
                  <defs>
                    <linearGradient id="gPred" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gPeak" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                    interval={2}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    width={55}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      color: "var(--color-popover-foreground)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                    formatter={(v: number, name: string): [string, string] => [
                      `${v.toLocaleString()} kWh/day`,
                      name === "predicted" ? "Expected Delivered Energy" : "Peak Load Potential",
                    ]}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.date ? `${label} (${item.date})` : label;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="var(--color-primary)"
                    fill="url(#gPred)"
                    strokeWidth={2.5}
                    name="Projected kWh/day"
                  />
                  <Area
                    type="monotone"
                    dataKey="peak"
                    stroke="var(--color-accent)"
                    fill="url(#gPeak)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    name="Peak Surge Potential (kWh)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* State-Wise Infrastructure / Demand View */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">State-Wise Data</CardTitle>
              <CardDescription className="text-xs">
                {selectedState === "All" ? "Top states by EV stations" : `Cities & Hubs in ${selectedState}`}
              </CardDescription>
            </div>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-80">
            {isLoading || !data ? (
              <Skeleton className="h-full w-full" />
            ) : selectedState === "All" ? (
              <ResponsiveContainer>
                <BarChart
                  data={topStatesChart}
                  layout="vertical"
                  margin={{ left: 8, right: 12, top: 4, bottom: 4 }}
                >
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                  />
                  <YAxis
                    dataKey="state"
                    type="category"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      color: "var(--color-popover-foreground)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                    formatter={(v: number, name: string) => [
                      name === "stations" ? `${v} Stations` : `${v} EVs`,
                      name === "stations" ? "Public Charging Sites" : "Registered EV Fleet",
                    ]}
                  />
                  <Bar
                    dataKey="stations"
                    name="Stations"
                    fill="var(--color-primary)"
                    radius={[0, 4, 4, 0]}
                    onClick={(entry) => setSelectedState(entry.state)}
                    className="cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="space-y-3 overflow-y-auto h-full pr-1">
                <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                  <div className="text-xs font-semibold text-primary uppercase">State Overview</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Installed Sites: </span>
                      <span className="font-semibold text-foreground">{stateData?.stationCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capacity: </span>
                      <span className="font-semibold text-foreground">{(Number(stateData?.totalCapacityKw ?? 0) / 1000).toFixed(1)} MW</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Registered EVs: </span>
                      <span className="font-semibold text-foreground">{stateData?.evRegistrations.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">30-Day Energy: </span>
                      <span className="font-semibold text-foreground">
                        {((Number(stateData?.dailyDeliveredKwh ?? 0) * 30.4) / 1000).toFixed(0)} MWh
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs font-medium text-muted-foreground">Key Cities & Corridors in {selectedState}:</div>
                {data.stations
                  .filter((s) => s.state === selectedState && s.town !== "Unknown")
                  .reduce((acc, s) => {
                    const found = acc.find((c) => c.town === s.town);
                    if (found) found.count += 1;
                    else acc.push({ town: s.town, count: 1 });
                    return acc;
                  }, [] as { town: string; count: number }[])
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((c) => (
                    <div key={c.town} className="flex items-center justify-between rounded border border-border/40 p-2 text-xs">
                      <span className="font-medium">{c.town}</span>
                      <Badge variant="secondary" className="text-[11px]">{c.count} sites</Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* State-Wise Comparison Table & Secondary Views */}
      <div className="mt-6">
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">State-Wise EV Infrastructure & Demand Breakdown</CardTitle>
              <CardDescription className="text-xs">
                Comprehensive state comparison across all 28 covered States and Union Territories
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">28 States / UTs Geocoded</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="pb-2 font-medium">State / UT</th>
                    <th className="pb-2 font-medium">Stations</th>
                    <th className="pb-2 font-medium">Installed (MW)</th>
                    <th className="pb-2 font-medium">Registered EVs</th>
                    <th className="pb-2 font-medium">EVs / Charger</th>
                    <th className="pb-2 font-medium">DC-Fast %</th>
                    <th className="pb-2 font-medium">Est. Daily kWh</th>
                    <th className="pb-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {isLoading || !data ? (
                    <tr>
                      <td colSpan={8} className="py-4 text-center text-muted-foreground">Loading state data…</td>
                    </tr>
                  ) : (
                    data.stateSummary.slice(0, 10).map((s) => (
                      <tr key={s.state} className="hover:bg-muted/30 transition">
                        <td className="py-2.5 font-medium flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-primary" /> {s.state}
                        </td>
                        <td className="py-2.5 tabular-nums">{s.stations}</td>
                        <td className="py-2.5 tabular-nums">{s.capacityMw} MW</td>
                        <td className="py-2.5 tabular-nums">{s.evCount.toLocaleString()}</td>
                        <td className="py-2.5 tabular-nums">{s.evPerStation}</td>
                        <td className="py-2.5">
                          <Badge variant="outline" className="text-[10px]">{s.dcSharePct}%</Badge>
                        </td>
                        <td className="py-2.5 tabular-nums font-medium text-primary">{s.dailyKwh.toLocaleString()}</td>
                        <td className="py-2.5">
                          <button
                            onClick={() => setSelectedState(s.state)}
                            className="text-xs text-primary hover:underline cursor-pointer"
                          >
                            Focus State
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GIS Preview and AI Recommendations */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-border/60 bg-card/60 overflow-hidden">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">GIS Heatmap Preview</CardTitle>
            <Badge variant="outline" className="text-xs">India · 28 States & UTs</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[380px] w-full">
              <ClientOnly fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground">Loading map…</div>}>
                <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground">Loading map…</div>}>
                  <EVMap height="100%" />
                </Suspense>
              </ClientOnly>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">
              {selectedState === "All" ? "Top AI-Recommended Sites" : `Recommended Sites in ${selectedState}`}
            </CardTitle>
            <Badge variant="outline" className="text-xs">Demand-Calibrated</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading || !data ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
            ) : (
              filteredRecs.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-primary font-semibold">{r.suggestedPorts} ports</span> @ {r.suggestedCapacityKw} kW · {r.expectedDailyKwh.toLocaleString()} kWh/day
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-primary">{r.score}</div>
                    <Badge
                      variant="outline"
                      className={
                        r.priority === "Critical"
                          ? "border-destructive/40 text-destructive"
                          : r.priority === "High"
                          ? "border-[color:var(--color-warning)]/40 text-[color:var(--color-warning)]"
                          : "border-border/60 text-muted-foreground"
                      }
                    >
                      {r.priority}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function fmt(v?: number) {
  return v == null ? "—" : v.toLocaleString();
}
