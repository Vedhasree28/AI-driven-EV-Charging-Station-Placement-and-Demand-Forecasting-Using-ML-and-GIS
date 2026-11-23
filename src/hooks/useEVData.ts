import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { derive, mergeLiveStations, STATIONS, type DerivedBundle } from "@/lib/ev-data";
import { getLiveSnapshot, type LiveSnapshot } from "@/lib/live.functions";

export const LIVE_REFRESH_MS = 5 * 60 * 1000;

/**
 * Historical CSV baseline (2018–2024) overlaid with a live snapshot that
 * refreshes on load and every 5 minutes.
 */
export function useEVData() {
  const baseline = useMemo<DerivedBundle>(() => derive(STATIONS), []);

  const cities = useMemo(
    () =>
      baseline.areaDemand.slice(0, 12).map((a) => {
        const point = baseline.demandPoints.find((p) => p.area === a.area);
        return { name: a.area, lat: point?.lat ?? 0, lng: point?.lng ?? 0 };
      }).filter((c) => c.lat !== 0),
    [baseline],
  );

  const fetchLive = useServerFn(getLiveSnapshot);

  const liveQuery = useQuery<LiveSnapshot>({
    queryKey: ["ev-live-snapshot", cities.map((c) => c.name).join(",")],
    queryFn: () => fetchLive({ data: { cities } }),
    enabled: cities.length > 0,
    refetchInterval: LIVE_REFRESH_MS,
    refetchOnWindowFocus: true,
    staleTime: LIVE_REFRESH_MS,
  });

  const live = liveQuery.data ?? null;

  const data = useMemo<DerivedBundle>(
    () => (live ? derive(mergeLiveStations(STATIONS, live), live) : baseline),
    [live, baseline],
  );

  return {
    data,
    isLoading: false,
    error: null as Error | null,

    isLive: Boolean(live),
    isRefreshing: liveQuery.isFetching,
    lastUpdated: live?.fetchedAt ?? null,
    refresh: () => liveQuery.refetch(),
  };
}
