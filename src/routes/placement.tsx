import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientOnly } from "@/components/ClientOnly";
import { MapPin, Zap, Users, ExternalLink, BatteryCharging, Gauge, ArrowUpRight, Cpu } from "lucide-react";
import { useEVData } from "@/hooks/useEVData";
import { gmapsSearchUrl, type Recommendation } from "@/lib/ev-data";

const EVMap = lazy(() => import("@/components/EVMap").then((m) => ({ default: m.EVMap })));

export const Route = createFileRoute("/placement")({
  head: () => ({
    meta: [
      { title: "Station Placement · VoltGrid India" },
      { name: "description", content: "Demand-calibrated AI recommended EV charging stations across India with differentiated port counts, power capacities, and grid sizing." },
      { property: "og:title", content: "India AI Station Placement & Sizing" },
      { property: "og:description", content: "Ranked EV site recommendations with customized ports and power capacities based on predicted demand." },
    ],
  }),
  component: Placement,
});

function priorityBadgeClass(p: string) {
  return p === "Critical"
    ? "border-destructive/50 text-destructive bg-destructive/10"
    : p === "High"
    ? "border-amber-400/50 text-amber-400 bg-amber-400/10"
    : "border-border/60 text-muted-foreground bg-muted/20";
}

function tierBadgeClass(tier: string) {
  if (tier.includes("Ultra-Fast") || tier.includes("Superhub")) {
    return "border-purple-400/40 text-purple-300 bg-purple-950/30";
  }
  if (tier.includes("Arterial") || tier.includes("Corridor")) {
    return "border-primary/40 text-primary bg-primary/10";
  }
  return "border-border/50 text-muted-foreground bg-muted/20";
}

function Placement() {
  const { data, isLoading } = useEVData();
  const allRecs = data?.recommendations ?? [];
  const [selectedState, setSelectedState] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Recommendation | null>(null);

  // States with recommendations
  const statesWithRecs = useMemo(() => {
    return Array.from(new Set(allRecs.map((r) => r.state).filter(Boolean))).sort();
  }, [allRecs]);

  // Filtered recommendations
  const recs = useMemo(() => {
    return allRecs.filter((r) => {
      if (selectedState !== "all" && r.state !== selectedState) return false;
      if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
      return true;
    });
  }, [allRecs, selectedState, priorityFilter]);

  useEffect(() => {
    if (recs.length > 0) {
      if (!selected || !recs.some((r) => r.id === selected.id)) {
        setSelected(recs[0]);
      }
    }
  }, [recs, selected]);

  return (
    <div className="p-6">
      <PageHeader
        title="AI Station Placement & Capacity Sizing · India"
        description="Recommended public charging hubs with differentiated port counts (4 to 16 ports) and power capacities (50 kW to 240 kW) mathematically tailored to local EV registration deficits."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-52 bg-card/80">
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States ({allRecs.length} sites)</SelectItem>
                {statesWithRecs.map((st) => (
                  <SelectItem key={st} value={st}>
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40 bg-card/80">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="space-y-3 xl:col-span-1">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
          </div>
          <div className="xl:col-span-2"><Skeleton className="h-[520px] w-full" /></div>
        </div>
      )}

      {!isLoading && selected && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {/* Left Column: Differentiated Recommendation Cards */}
          <div className="space-y-3 xl:col-span-1 max-h-[860px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1 pb-1">
              <span>Showing {recs.length} recommended locations</span>
              <span>Sorted by AI Score</span>
            </div>

            {recs.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected.id === r.id
                    ? "border-primary/80 bg-primary/10 shadow-[0_0_15px_-3px_var(--color-primary)]"
                    : "border-border/60 bg-card/60 hover:border-primary/40 hover:bg-card/90"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/15 text-sm font-bold text-primary">
                      #{i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.city}, {r.state}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={priorityBadgeClass(r.priority)}>
                    {r.priority}
                  </Badge>
                </div>

                {/* Differentiated Ports & Power Capacity Specs */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="text-[11px] font-semibold text-primary">
                    <Users className="mr-1 h-3 w-3 inline" />
                    {r.suggestedPorts} Ports
                  </Badge>
                  <Badge variant="secondary" className="text-[11px] font-semibold text-amber-400">
                    <Zap className="mr-1 h-3 w-3 inline" />
                    {r.suggestedCapacityKw} kW
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] ${tierBadgeClass(r.hubTier)}`}>
                    {r.hubTier}
                  </Badge>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Expected: <span className="font-semibold text-foreground">{r.expectedDailyKwh.toLocaleString()} kWh/day</span></span>
                  <span className="font-bold text-primary">{r.score}/100</span>
                </div>
                <Progress value={r.score} className="mt-1 h-1.5" />
              </button>
            ))}

            {recs.length === 0 && (
              <div className="rounded-xl border border-border/60 bg-card/60 p-8 text-center text-sm text-muted-foreground">
                No recommendations match the selected filters.
              </div>
            )}
          </div>

          {/* Right Column: Detailed Hub Engineering & Grid Blueprint */}
          <div className="xl:col-span-2 space-y-4">
            <Card className="border-border/60 bg-card/60">
              <CardHeader className="flex-row items-start justify-between pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-bold">{selected.name}</CardTitle>
                    <Badge variant="outline" className={tierBadgeClass(selected.hubTier)}>
                      {selected.hubTier}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {selected.city}, {selected.state}
                    </span>
                    <span>•</span>
                    <span>Lat: {selected.lat.toFixed(4)}, Lng: {selected.lng.toFixed(4)}</span>
                  </div>
                </div>
                <Badge variant="outline" className={`${priorityBadgeClass(selected.priority)} text-xs px-2.5 py-0.5`}>
                  {selected.priority} Priority
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 4 Key Performance Metrics */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Stat label="AI Optimization Score" value={`${selected.score}/100`} hint="Multi-factor ranking" />
                  <Stat label="Expected Daily Energy" value={`${selected.expectedDailyKwh.toLocaleString()} kWh`} hint="Daily delivered load" />
                  <Stat label="Est. Daily Sessions" value={`~${selected.estDailySessions} sessions`} hint="Vehicle throughput" />
                  <Stat label="Coverage Radius" value={`${selected.coverageRadiusKm} km`} hint="Optimal catchment zone" />
                </div>

                {/* Tailored Hardware & Electrical Capacity Blueprint */}
                <div className="rounded-xl border border-border/70 bg-background/50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Cpu className="h-4 w-4" /> Tailored Hardware & Electrical Specifications
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Cap
                      icon={Users}
                      label="Recommended Ports"
                      value={`${selected.suggestedPorts} Charging Ports`}
                      accent="text-primary"
                    />
                    <Cap
                      icon={Zap}
                      label="Charger Rating"
                      value={`${selected.suggestedCapacityKw} kW Fast DC`}
                      accent="text-amber-400"
                    />
                    <Cap
                      icon={BatteryCharging}
                      label="Total Hub Capacity"
                      value={`${selected.suggestedPorts * selected.suggestedCapacityKw} kW Peak`}
                      accent="text-emerald-400"
                    />
                    <Cap
                      icon={Gauge}
                      label="Grid Feeder Required"
                      value={`${selected.gridLoadKva} kVA Transformer`}
                      accent="text-accent"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-2.5">
                    <span>Target Vehicle Fleet: <span className="font-medium text-foreground">{selected.targetFleet}</span></span>
                    <span>Accessibility Index: <span className="font-semibold text-primary">{selected.accessibilityScore}/100</span></span>
                  </div>
                </div>

                {/* AI Rationale & Deficit Evidence */}
                <div className="rounded-lg border border-border/60 bg-background/40 p-3.5">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <ArrowUpRight className="h-3.5 w-3.5 text-primary" /> AI Sizing Rationale & Local Demand Evidence
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                    {selected.rationale}
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <a
                      href={gmapsSearchUrl(selected.lat, selected.lng, selected.name)}
                      target="_blank"
                      rel="noopener noreferrer external"
                    >
                      <ExternalLink className="mr-1.5 h-4 w-4" /> View Site on Google Maps
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Coverage Analysis Map */}
            <Card className="border-border/60 bg-card/60 overflow-hidden">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Interactive Coverage & Heatmap Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] w-full">
                  <ClientOnly fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground">Loading GIS Map…</div>}>
                    <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground">Loading GIS Map…</div>}>
                      <EVMap height="100%" showCoverage />
                    </Suspense>
                  </ClientOnly>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-bold tabular-nums text-foreground">{value}</div>
      <div className="text-[10px] text-muted-foreground">{hint}</div>
    </div>
  );
}

function Cap({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 p-3">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted/40 ${accent}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] text-muted-foreground">{label}</div>
        <div className="text-xs font-semibold text-foreground truncate">{value}</div>
      </div>
    </div>
  );
}
