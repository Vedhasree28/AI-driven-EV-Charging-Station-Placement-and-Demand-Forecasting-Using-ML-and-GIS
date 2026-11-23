import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Navigation } from "lucide-react";
import { gmapsNavUrl } from "@/lib/ev-data";
import { useEVData } from "@/hooks/useEVData";

export const Route = createFileRoute("/stations")({
  head: () => ({
    meta: [
      { title: "Charging Stations · VoltGrid India" },
      { name: "description", content: "Directory of India's public EV charging stations with navigation." },
      { property: "og:title", content: "India EV Charging Stations" },
      { property: "og:description", content: "Browse every public EV charging station in India by state, operator, and type." },
    ],
  }),
  component: Stations,
});

function Stations() {
  const { data, isLoading, error } = useEVData();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [state, setState] = useState("all");

  const states = useMemo(
    () => Array.from(new Set((data?.stations ?? []).map((s) => s.state))).filter((s) => s !== "Unknown").sort(),
    [data],
  );

  const rows = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return (data?.stations ?? []).filter((s) => {
      if (type !== "all" && s.chargerType !== type) return false;
      if (status !== "all" && s.status !== status) return false;
      if (state !== "all" && s.state !== state) return false;
      if (ql && ![s.name, s.address, s.operator, s.town, s.state].some((v) => v.toLowerCase().includes(ql))) return false;
      return true;
    }).slice(0, 250);
  }, [q, type, status, state, data]);

  return (
    <div className="p-6">
      <PageHeader
        title="Public Charging Stations · India"
        description={`Directory from national station dataset${data ? ` · ${data.stations.length} sites` : ""}.`}
      />

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load datasets: {(error as Error).message}
        </div>
      )}

      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search station, city, operator, state…" className="pl-8" />
            </div>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="w-48"><SelectValue placeholder="State" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All states</SelectItem>
                {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Charger Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All charger types</SelectItem>
                <SelectItem value="AC Type-2">AC Type-2</SelectItem>
                <SelectItem value="DC Fast (CCS2)">DC Fast (CCS2)</SelectItem>
                <SelectItem value="DC Ultra (150kW+)">DC Ultra (150kW+)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Station</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Ports</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">Loading station data…</TableCell></TableRow>
                )}
                {rows.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.address}</div>
                    </TableCell>
                    <TableCell className="text-sm">{s.operator}</TableCell>
                    <TableCell className="text-sm">{s.state}</TableCell>
                    <TableCell className="text-sm">{s.chargerType}</TableCell>
                    <TableCell className="text-sm tabular-nums">{s.capacityKw} kW</TableCell>
                    <TableCell className="text-sm tabular-nums">{s.ports}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        s.status === "online" ? "border-[color:var(--color-success)]/40 text-[color:var(--color-success)]" :
                        s.status === "offline" ? "border-destructive/40 text-destructive" :
                        "border-[color:var(--color-warning)]/40 text-[color:var(--color-warning)]"
                      }>{s.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="secondary" className="h-8">
                        <a
                          href={gmapsNavUrl(s.lat, s.lng)}
                          target="_blank"
                          rel="noopener noreferrer external"
                        >
                          <Navigation className="mr-1.5 h-3.5 w-3.5" /> Navigate
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                      No stations match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {data && rows.length === 250 && (
            <div className="mt-2 text-xs text-muted-foreground">Showing first 250 matches. Narrow filters to see more.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
