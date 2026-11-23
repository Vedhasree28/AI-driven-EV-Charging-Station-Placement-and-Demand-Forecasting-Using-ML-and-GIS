import { RefreshCw, Radio, CloudSun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LiveStatus({
  isLive,
  isRefreshing,
  lastUpdated,
  stationFeed,
  demandModifier,
  onRefresh,
}: {
  isLive: boolean;
  isRefreshing: boolean;
  lastUpdated: string | null;
  stationFeed: "live" | "unavailable" | "off";
  demandModifier: number;
  onRefresh: () => void;
}) {
  const time = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge
        variant="outline"
        className={
          isLive
            ? "border-[color:var(--color-success)]/40 text-[color:var(--color-success)]"
            : "border-border/60 text-muted-foreground"
        }
      >
        <Radio className="mr-1.5 h-3 w-3" />
        {isLive ? `Live · ${time} IST` : "Connecting…"}
      </Badge>

      <Badge variant="outline" className="text-xs">
        <CloudSun className="mr-1.5 h-3 w-3" />
        Weather load ×{demandModifier.toFixed(2)}
      </Badge>

      <Badge
        variant="outline"
        className={
          stationFeed === "live"
            ? "border-primary/40 text-primary"
            : "border-border/60 text-muted-foreground"
        }
      >
        Station feed: {stationFeed === "live" ? "live" : "baseline only"}
      </Badge>

      <Button size="sm" variant="outline" onClick={onRefresh} disabled={isRefreshing}>
        <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
}
