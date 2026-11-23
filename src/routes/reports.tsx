import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileText, Cpu, CheckCircle2, TrendingUp, Zap, Building2, BarChart3 } from "lucide-react";
import { useEVData } from "@/hooks/useEVData";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics · VoltGrid India" },
      { name: "description", content: "Accurate reports, machine learning validation, state analytics, and charging network data derived from national EV datasets." },
      { property: "og:title", content: "India EV Reports & Analytics" },
      { property: "og:description", content: "Comprehensive analytics and XGBoost model outputs from actual India EV project datasets." },
    ],
  }),
  component: Reports,
});

function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`${filename} downloaded`);
}

function Reports() {
  const { data, isLoading } = useEVData();

  if (isLoading || !data) {
    return (
      <div className="p-6">
        <PageHeader title="Reports & Analytics · India" description="Loading datasets…" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // State-wise export rows
  const stateExportRows = data.stateSummary.map((s) => ({
    State: s.state,
    "Station Count": s.stations,
    "Installed Capacity (MW)": s.capacityMw,
    "Registered EVs": s.evCount,
    "EVs Per Station": s.evPerStation,
    "DC Fast Share (%)": s.dcSharePct,
    "Projected Daily Demand (kWh)": s.dailyKwh,
    "30-Day Total Demand (MWh)": s.monthlyMwh,
  }));

  // Forecast export rows
  const forecastExportRows = data.daily.map((d) => ({
    Date: d.date,
    Day: d.day,
    "Delivered Energy (kWh)": d.predicted,
    "Baseline Demand (kWh)": d.baseline,
    "Peak Capacity Surge (kWh)": d.peak,
  }));

  return (
    <div className="p-6">
      <PageHeader
        title="Reports & Analytics · India EV Grid"
        description="Empirical analytics, machine learning model diagnostics, and verified state-level infrastructure outputs derived from national EV, traffic, and weather datasets."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => downloadCSV("india-stations.csv", data.stations as unknown as Record<string, unknown>[])}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Stations CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => downloadCSV("india-recommendations.csv", data.recommendations as unknown as Record<string, unknown>[])}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Recommendations CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => downloadCSV("state-wise-analytics.csv", stateExportRows as unknown as Record<string, unknown>[])}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> State Data CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => downloadCSV("30-day-forecasts.csv", forecastExportRows as unknown as Record<string, unknown>[])}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Forecasts CSV
            </Button>
            <Button size="sm" onClick={() => window.print()}>
              <FileText className="mr-1.5 h-3.5 w-3.5" /> Print / PDF
            </Button>
          </div>
        }
      />

      {/* Machine Learning Model Diagnostics & Validation Card */}
      <Card className="border-border/60 bg-card/60 mb-6">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">
                AI Forecasting Model Diagnostics & Validation Outputs
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Supervised gradient-boosted regression trained on 2018–2024 national EV registrations, traffic observation curves, and ambient meteorological variables.
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-primary/40 text-primary">
            {data.modelMetrics.modelName}
          </Badge>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-4">
            <div className="rounded-lg border border-border/60 bg-background/50 p-3">
              <div className="text-[11px] text-muted-foreground uppercase">Coefficient of Determination (R²)</div>
              <div className="mt-1 text-2xl font-bold text-primary">{data.modelMetrics.r2Score}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3" /> High explanatory variance
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-background/50 p-3">
              <div className="text-[11px] text-muted-foreground uppercase">Mean Absolute Error (MAE)</div>
              <div className="mt-1 text-2xl font-bold text-foreground">{data.modelMetrics.maeKwh} kWh</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Average residual deviation</div>
            </div>

            <div className="rounded-lg border border-border/60 bg-background/50 p-3">
              <div className="text-[11px] text-muted-foreground uppercase">Root Mean Squared Error (RMSE)</div>
              <div className="mt-1 text-2xl font-bold text-foreground">{data.modelMetrics.rmseKwh} kWh</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Penalized outlier metric</div>
            </div>

            <div className="rounded-lg border border-border/60 bg-background/50 p-3">
              <div className="text-[11px] text-muted-foreground uppercase">Mean Absolute Percentage Error</div>
              <div className="mt-1 text-2xl font-bold text-emerald-400">{data.modelMetrics.mapePct}%</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">High operational reliability</div>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-background/40 p-3.5">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Model Feature Importance Breakdown (% relative weight):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {data.modelMetrics.features.map((f) => (
                <div key={f.feature} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground truncate">{f.feature}</span>
                    <span className="font-bold text-primary">{f.importance}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${f.importance * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Corrected Annual EV Adoption Trend (Accurate title and data) */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Annual EV Fleet Registrations & Adoption Trend (2018–2024)
              </CardTitle>
              <CardDescription className="text-xs">
                Actual EV registrations by model year from the national vehicle dataset ({data.kpis.evRegistrations.toLocaleString()} total units)
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/40 text-primary">
              Fleet Registrations
            </Badge>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer>
              <AreaChart data={data.evAdoptionTrend}>
                <defs>
                  <linearGradient id="gCum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} tickFormatter={(v) => v.toLocaleString()} width={55} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={50} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    color: "var(--color-popover-foreground)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                  formatter={(v: number, name: string) => [
                    `${v.toLocaleString()} vehicles`,
                    name === "count" ? "Annual Registrations" : "Cumulative EV Fleet",
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="count" name="Annual Registrations" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Area yAxisId="right" type="monotone" dataKey="cumulative" name="Cumulative Fleet" stroke="var(--color-accent)" fill="url(#gCum)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stations by State (Cleaned 28 States) */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Public Charging Stations by State & UT
              </CardTitle>
              <CardDescription className="text-xs">
                Cleaned distribution across 28 Indian States & Union Territories (Top 14 shown)
              </CardDescription>
            </div>
            <Badge variant="outline">28 States Normalized</Badge>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer>
              <BarChart data={data.stateMix.slice(0, 14)}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="state"
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} width={45} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    color: "var(--color-popover-foreground)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                  formatter={(v: number) => [`${v} Stations`, "Installed Sites"]}
                />
                <Bar dataKey="count" name="Stations" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cleaned Top Operators */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Top Charging Operators & Networks</CardTitle>
              <CardDescription className="text-xs">
                Market share of verified EV charging station operators across India
              </CardDescription>
            </div>
            <Badge variant="outline">Operator Breakdown</Badge>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer>
              <BarChart data={data.operatorMix} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis dataKey="operator" type="category" width={170} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    color: "var(--color-popover-foreground)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                  formatter={(v: number) => [`${v} Stations`, "Operated Sites"]}
                />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Capacity Distribution */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Power Capacity Distribution (kW per Port)</CardTitle>
              <CardDescription className="text-xs">
                Categorization from AC Level 2 (22 kW) to DC Ultra-Fast (150 kW+)
              </CardDescription>
            </div>
            <Badge variant="outline">Hardware Ratings</Badge>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer>
              <BarChart data={data.capacityHistogram}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="bucket" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} width={45} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    color: "var(--color-popover-foreground)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                  formatter={(v: number) => [`${v} Stations`, "Charger Count"]}
                />
                <Bar dataKey="count" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive State-by-State Analytics Table */}
      <div className="mt-6">
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Comprehensive State-by-State Infrastructure & Demand Table
              </CardTitle>
              <CardDescription className="text-xs">
                Full comparative metrics for all 28 covered States and Union Territories
              </CardDescription>
            </div>
            <Badge variant="outline">28 States & UTs</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="pb-2.5 font-medium">State / UT</th>
                    <th className="pb-2.5 font-medium">Station Sites</th>
                    <th className="pb-2.5 font-medium">Installed Capacity</th>
                    <th className="pb-2.5 font-medium">Registered EV Fleet</th>
                    <th className="pb-2.5 font-medium">EVs / Charger</th>
                    <th className="pb-2.5 font-medium">DC-Fast Share</th>
                    <th className="pb-2.5 font-medium">Projected Daily kWh</th>
                    <th className="pb-2.5 font-medium">30-Day Total MWh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {data.stateSummary.map((s) => (
                    <tr key={s.state} className="hover:bg-muted/30 transition">
                      <td className="py-2.5 font-medium flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-primary" /> {s.state}
                      </td>
                      <td className="py-2.5 tabular-nums font-semibold">{s.stations}</td>
                      <td className="py-2.5 tabular-nums">{s.capacityMw} MW</td>
                      <td className="py-2.5 tabular-nums">{s.evCount.toLocaleString()}</td>
                      <td className="py-2.5 tabular-nums">{s.evPerStation}</td>
                      <td className="py-2.5">
                        <Badge variant="outline" className="text-[10px]">{s.dcSharePct}%</Badge>
                      </td>
                      <td className="py-2.5 tabular-nums font-medium text-primary">{s.dailyKwh.toLocaleString()} kWh</td>
                      <td className="py-2.5 tabular-nums">{s.monthlyMwh.toLocaleString()} MWh</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
