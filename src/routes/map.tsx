import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ClientOnly } from "@/components/ClientOnly";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Navigation, Locate } from "lucide-react";
import { haversineKm, etaMinutes, gmapsNavUrl } from "@/lib/ev-data";
import { useEVData } from "@/hooks/useEVData";

const EVMap = lazy(() => import("@/components/EVMap").then((m) => ({ default: m.EVMap })));

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "GIS Map · VoltGrid India" },
      { name: "description", content: "Interactive Leaflet map of India's public EV charging network with demand heatmap and Google Maps navigation." },
      { property: "og:title", content: "Interactive India EV GIS Map" },
      { property: "og:description", content: "Live India EV map with heatmap, coverage, and Google Maps navigation." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { data, isLoading } = useEVData();
  const stations = data?.stations ?? [];
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setUserPos([p.coords.latitude, p.coords.longitude]),
      () => {},
      { timeout: 5000 },
    );
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? stations.filter((s) =>
          [s.name, s.address, s.operator, s.chargerType, s.state, s.town].some((v) => v.toLowerCase().includes(q)),
        )
      : stations;
    if (userPos) {
      return [...list].sort(
        (a, b) => haversineKm(userPos, [a.lat, a.lng]) - haversineKm(userPos, [b.lat, b.lng]),
      );
    }
    return list;
  }, [query, userPos, stations]);

  const shown = filtered.slice(0, 200);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col p-4">
      <PageHeader
        title="Interactive GIS Map · India"
        description="OpenStreetMap + Leaflet with demand heatmap, coverage, and Google Maps hand-off for navigation."
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        <Card className="flex min-h-0 flex-col border-border/60 bg-card/60">
          <CardContent className="flex min-h-0 flex-col gap-3 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search station, city, state, operator…"
                className="pl-8"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{isLoading ? "Loading…" : `${filtered.length} stations`}</span>
              {userPos && (
                <span className="flex items-center gap-1">
                  <Locate className="h-3 w-3 text-primary" /> Nearest first
                </span>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-auto pr-1">
              <div className="space-y-2">
                {shown.map((s) => {
                  const dist = userPos ? haversineKm(userPos, [s.lat, s.lng]) : null;
                  const eta = dist != null ? etaMinutes(dist) : null;
                  const active = selected === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelected(s.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") setSelected(s.id);
                      }}
                      role="button"
                      tabIndex={0}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        active
                          ? "border-primary/60 bg-primary/5"
                          : "border-border/60 bg-background/40 hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{s.name}</div>
                          <div className="truncate text-xs text-muted-foreground">{s.address}</div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            s.status === "online"
                              ? "border-[color:var(--color-success)]/40 text-[color:var(--color-success)]"
                              : s.status === "offline"
                              ? "border-destructive/40 text-destructive"
                              : "border-[color:var(--color-warning)]/40 text-[color:var(--color-warning)]"
                          }
                        >{s.status}</Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span>{s.chargerType}</span>
                        <span>·</span>
                        <span>{s.capacityKw}kW</span>
                        <span>·</span>
                        <span>{s.ports} ports</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {dist != null ? `${dist.toFixed(1)} km · ${eta} min` : `${s.town}, ${s.state}`}
                        </span>
                        <Button asChild size="sm" variant="secondary" className="h-7 px-2 text-xs">
                          <a
                            href={gmapsNavUrl(s.lat, s.lng)}
                            target="_blank"
                            rel="noopener noreferrer external"
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            <Navigation className="mr-1 h-3 w-3" /> Navigate
                          </a>
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {!isLoading && shown.length === 0 && (
                  <div className="py-8 text-center text-xs text-muted-foreground">No matches.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="min-h-0">
          <ClientOnly fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground">Loading map…</div>}>
            <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground">Loading map…</div>}>
              <EVMap height="100%" focusStationId={selected} />
            </Suspense>
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
