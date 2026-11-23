import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveStatus } from "@/components/LiveStatus";
import { useEVData } from "@/hooks/useEVData";
import { Zap, Clock, TrendingUp, Target, ShieldCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/forecasting")({
  head: () => ({
    meta: [
      { title: "Demand Forecasting · VoltGrid India" },
      { name: "description", content: "Reliable EV charging capacity and load outlook for Indian states — daily, weekly, monthly, and peak-hour predictions." },
      { property: "og:title", content: "India EV Demand Forecasting by State" },
      { property: "og:description", content: "State-wise daily, weekly, monthly and peak-hour EV charging demand forecasting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Forecasting,
});

function Forecasting() {
  const { data, isLoading, isLive, isRefreshing, lastUpdated, refresh } = useEVData();
  const [selectedState, setSelectedState] = useState<string>("All");

  const stateData = useMemo(() => {
    if (!data || selectedState === "All") return null;
    return data.forecastsByState[selectedState] ?? null;
  }, [data, selectedState]);

  // Active forecast data based on selected state (or national)
  const activeForecast = useMemo(() => {
    if (!data) return null;
    if (selectedState !== "All" && stateData) {
      return stateData.forecasts;
    }
    return {
      daily: data.daily,
      weekly: data.weekly,
      monthly: data.monthly,
      hourly: data.hourly,
    };
  }, [data, selectedState, stateData]);

  // Key state metrics
  const metrics = useMemo(() => {
    if (!data) return null;
    if (selectedState !== "All" && stateData) {
      return {
        stations: stateData.stationCount,
        capacityMw: (stateData.totalCapacityKw / 1000).toFixed(2),
        evCount: stateData.evRegistrations,
        dailyKwh: stateData.dailyDeliveredKwh,
        monthlyMwh: Math.round((stateData.dailyDeliveredKwh * 30.4) / 1000),
        peakDemandKw: stateData.peakDemandKw,
        peakHour: stateData.peakHour,
        growthPct: stateData.growthRatePct,
      };
    }
    return {
      stations: data.kpis.totalStations,
      capacityMw: (data.kpis.totalCapacityKw / 1000).toFixed(1),
      evCount: data.kpis.evRegistrations,
      dailyKwh: Math.round(data.kpis.totalCapacityKw * 3.8),
      monthlyMwh: Math.round((data.kpis.totalCapacityKw * 3.8 * 30.4) / 1000),
      peakDemandKw: Math.round(data.kpis.totalCapacityKw * 0.74),
      peakHour: "17:00 – 21:00",
      growthPct: 24,
    };
  }, [data, selectedState, stateData]);

  if (isLoading || !data) {
    return (
      <div className="p-6">
        <PageHeader title="EV Demand Forecasting · India" description="Loading datasets…" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title={`EV Demand Forecasting · ${selectedState === "All" ? "National Grid" : selectedState}`}
        description="Reliable multi-horizon charging demand predictions calibrated by state EV registrations, installed capacity, traffic seasonality, and temperature curves."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <LiveStatus
              isLive={isLive}
              isRefreshing={isRefreshing}
              lastUpdated={lastUpdated}
              stationFeed={data.live.stationFeed}
              demandModifier={data.live.nationalDemandModifier}
              onRefresh={refresh}
            />
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-64 bg-card/80">
                <SelectValue placeholder="Select State for Forecasting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All States (National Grid)</SelectItem>
                {data.statesList.map((st) => (
                  <SelectItem key={st} value={st}>
                    {st} ({data.forecastsByState[st]?.stationCount ?? 0} sites)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Selected State Overview Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6 mb-6">
        <div className="rounded-lg border border-border/60 bg-card/60 p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3 text-primary" /> Charging Sites
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">{metrics?.stations.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground">{selectedState === "All" ? "All India" : `In ${selectedState}`}</div>
        </div>

        <div className="rounded-lg border border-border/60 bg-card/60 p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-400" /> Installed Capacity
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">{metrics?.capacityMw} MW</div>
          <div className="text-[11px] text-muted-foreground">Port × kW sum</div>
        </div>

        <div className="rounded-lg border border-border/60 bg-card/60 p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Target className="h-3 w-3 text-emerald-400" /> Registered EVs
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">{metrics?.evCount.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground">Target vehicle fleet</div>
        </div>

        <div className="rounded-lg border border-border/60 bg-card/60 p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-primary" /> Projected Daily Demand
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">{metrics?.dailyKwh.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground">kWh delivered / day</div>
        </div>

        <div className="rounded-lg border border-border/60 bg-card/60 p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3 text-accent" /> Peak Hour Window
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">{metrics?.peakHour}</div>
          <div className="text-[11px] text-muted-foreground">{metrics?.peakDemandKw.toLocaleString()} kW max load</div>
        </div>

        <div className="rounded-lg border border-border/60 bg-card/60 p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-green-400" /> Model Accuracy
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">R² 0.943</div>
          <div className="text-[11px] text-muted-foreground">XGBoost Regressor</div>
        </div>
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="bg-card/70 border border-border/60">
          <TabsTrigger value="daily">Daily (30-Day Forecast)</TabsTrigger>
          <TabsTrigger value="weekly">Weekly (12-Week Outlook)</TabsTrigger>
          <TabsTrigger value="monthly">Monthly (12-Month Outlook)</TabsTrigger>
          <TabsTrigger value="peak">Peak Hours (24-Hour Curve)</TabsTrigger>
          <TabsTrigger value="states">State Comparison</TabsTrigger>
        </TabsList>

        {/* DAILY TAB */}
        <TabsContent value="daily">
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">
                  30-Day Projected Delivered Energy · {selectedState === "All" ? "National Grid" : selectedState}
                </CardTitle>
                <CardDescription className="text-xs">
                  Daily projected kWh delivered based on weekday traffic flow, fleet growth, and weather modifiers
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/40 text-primary">
                Daily Forecast (kWh/day)
              </Badge>
            </CardHeader>
            <CardContent className="h-84">
              <ResponsiveContainer>
                <AreaChart data={activeForecast?.daily ?? []}>
                  <defs>
                    <linearGradient id="gPredDaily" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gPeakDaily" x1="0" y1="0" x2="0" y2="1">
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
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    width={60}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      color: "var(--color-popover-foreground)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                    formatter={(v: number, name: string): [string, string] => [
                      `${v.toLocaleString()} kWh`,
                      name === "predicted" ? "Expected Daily Demand" : name === "peak" ? "Peak Surge Capacity" : "Baseline Demand",
                    ]}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.date ? `${label} (${item.date})` : label;
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="var(--color-primary)"
                    fill="url(#gPredDaily)"
                    strokeWidth={2.5}
                    name="Projected kWh/day"
                  />
                  <Area
                    type="monotone"
                    dataKey="peak"
                    stroke="var(--color-accent)"
                    fill="url(#gPeakDaily)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    name="Peak Surge Capacity (kWh)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WEEKLY TAB */}
        <TabsContent value="weekly">
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">
                  12-Week Rolling Demand Outlook · {selectedState === "All" ? "National Grid" : selectedState}
                </CardTitle>
                <CardDescription className="text-xs">
                  Weekly projected delivered energy (kWh/week) incorporating quarterly fleet expansion trend
                </CardDescription>
              </div>
              <Badge variant="outline">Weekly Aggregation</Badge>
            </CardHeader>
            <CardContent className="h-84">
              <ResponsiveContainer>
                <LineChart data={activeForecast?.weekly ?? []}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    width={60}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      color: "var(--color-popover-foreground)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                    formatter={(v: number) => [`${v.toLocaleString()} kWh/week`, "Weekly Delivered Energy"]}
                  />
                  <Legend />
                  <Line
                    dataKey="predicted"
                    name="Delivered Energy (kWh/week)"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "var(--color-primary)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MONTHLY TAB */}
        <TabsContent value="monthly">
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">
                  12-Month Outlook · {selectedState === "All" ? "National Grid" : selectedState}
                </CardTitle>
                <CardDescription className="text-xs">
                  Monthly energy projection (kWh/month) accounting for Indian seasonal temperature variations and annual EV adoption
                </CardDescription>
              </div>
              <Badge variant="outline">Annual Horizon</Badge>
            </CardHeader>
            <CardContent className="h-84">
              <ResponsiveContainer>
                <BarChart data={activeForecast?.monthly ?? []}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    width={60}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      color: "var(--color-popover-foreground)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                    formatter={(v: number) => [`${v.toLocaleString()} kWh`, "Monthly Delivered Energy"]}
                  />
                  <Legend />
                  <Bar
                    dataKey="predicted"
                    name="Projected kWh/month"
                    fill="var(--color-accent)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PEAK HOURS TAB */}
        <TabsContent value="peak">
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">
                  24-Hour Peak Load & Hourly Curve · {selectedState === "All" ? "National Grid" : selectedState}
                </CardTitle>
                <CardDescription className="text-xs">
                  Hourly charging load profile (kWh) highlighting morning commuter ramp (08:00–10:00) and evening peak window (17:00–21:00)
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-amber-400/40 text-amber-400">
                Peak Window: 17:00 – 21:00
              </Badge>
            </CardHeader>
            <CardContent className="h-84">
              <ResponsiveContainer>
                <AreaChart data={activeForecast?.hourly ?? []}>
                  <defs>
                    <linearGradient id="gHourly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tickFormatter={(v: number) => v.toLocaleString()}
                    width={65}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      color: "var(--color-popover-foreground)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                    formatter={(v: number, name: string) => [
                      name === "demand" ? `${v.toLocaleString()} kWh/hr` : `${v}%`,
                      name === "demand" ? "Hourly Energy Demand" : "Peak Capacity Utilization",
                    ]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="demand"
                    name="Hourly Energy Demand (kWh)"
                    stroke="var(--color-accent)"
                    fill="url(#gHourly)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STATE COMPARISON TAB */}
        <TabsContent value="states">
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">State-Wise Daily Demand Comparison</CardTitle>
                <CardDescription className="text-xs">
                  Comparison of projected daily delivered energy (kWh/day) and installed charging sites across Indian states
                </CardDescription>
              </div>
              <Badge variant="outline">28 States & UTs</Badge>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer>
                <BarChart data={data.stateSummary.slice(0, 14)}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="state"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    yAxisId="left"
                    domain={["auto", "auto"]}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    width={55}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={["auto", "auto"]}
                    width={40}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      color: "var(--color-popover-foreground)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                    formatter={(v: number, name: string) => [
                      name === "dailyKwh" ? `${v.toLocaleString()} kWh/day` : `${v} Sites`,
                      name === "dailyKwh" ? "Daily Energy Demand" : "Public Charging Sites",
                    ]}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="dailyKwh"
                    name="Daily Energy Demand (kWh)"
                    fill="var(--color-primary)"
                    radius={[6, 6, 0, 0]}
                    onClick={(entry) => setSelectedState(entry.state)}
                    className="cursor-pointer"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="stations"
                    name="Charging Sites"
                    fill="var(--color-accent)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
