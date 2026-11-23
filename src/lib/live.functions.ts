// Real-time layer: fetched server-side every request so there is no CORS/key exposure.
//  - Open-Meteo  : live weather per city (free, no key) → demand modifier
//  - OpenChargeMap: live station supply for India (requires OPENCHARGEMAP_API_KEY)
import { createServerFn } from "@tanstack/react-start";

export interface LiveWeather {
  city: string;
  tempC: number;
  precipMm: number;
  windKph: number;
  isDay: boolean;
}

export interface LiveStation {
  ocmId: number;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  ports: number;
  maxKw: number;
  operational: boolean;
  lastVerified: string | null;
}

export interface LiveSnapshot {
  fetchedAt: string;
  weather: LiveWeather[];
  stations: LiveStation[];
  stationFeed: "live" | "unavailable";
  stationFeedMessage: string | null;
}

interface CityInput {
  name: string;
  lat: number;
  lng: number;
}

export const getLiveSnapshot = createServerFn({ method: "POST" })
  .validator((input: { cities: CityInput[] }) => {
    const cities = Array.isArray(input?.cities) ? input.cities : [];
    return {
      cities: cities
        .filter(
          (c) =>
            typeof c?.name === "string" &&
            Number.isFinite(c?.lat) &&
            Number.isFinite(c?.lng),
        )
        .slice(0, 20)
        .map((c) => ({ name: c.name.slice(0, 80), lat: c.lat, lng: c.lng })),
    };
  })
  .handler(async ({ data }): Promise<LiveSnapshot> => {
    const [weather, stationResult] = await Promise.all([
      fetchWeather(data.cities),
      fetchOcmStations(),
    ]);

    return {
      fetchedAt: new Date().toISOString(),
      weather,
      stations: stationResult.stations,
      stationFeed: stationResult.feed,
      stationFeedMessage: stationResult.message,
    };
  });

async function fetchWeather(cities: CityInput[]): Promise<LiveWeather[]> {
  if (cities.length === 0) return [];
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${cities.map((c) => c.lat.toFixed(4)).join(",")}` +
    `&longitude=${cities.map((c) => c.lng.toFixed(4)).join(",")}` +
    "&current=temperature_2m,precipitation,wind_speed_10m,is_day" +
    "&timezone=Asia%2FKolkata";

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const body = (await res.json()) as unknown;
    const rows = Array.isArray(body) ? body : [body];
    return rows.map((row: any, i: number) => ({
      city: cities[i]?.name ?? `Site ${i + 1}`,
      tempC: Number(row?.current?.temperature_2m ?? 0),
      precipMm: Number(row?.current?.precipitation ?? 0),
      windKph: Number(row?.current?.wind_speed_10m ?? 0),
      isDay: Number(row?.current?.is_day ?? 1) === 1,
    }));
  } catch {
    return [];
  }
}

async function fetchOcmStations(): Promise<{
  stations: LiveStation[];
  feed: "live" | "unavailable";
  message: string | null;
}> {
  const key = process.env["OPENCHARGEMAP_API_KEY"];
  if (!key) {
    return {
      stations: [],
      feed: "unavailable",
      message:
        "Live station feed inactive — add an OpenChargeMap API key to stream current India stations.",
    };
  }

  const url =
    "https://api.openchargemap.io/v3/poi/?output=json&countrycode=IN" +
    "&maxresults=2000&compact=true&verbose=false&opendata=true";

  try {
    const res = await fetch(url, { headers: { "X-API-Key": key } });
    if (!res.ok) {
      const text = await res.text();
      console.error(`OpenChargeMap failed [${res.status}]: ${text}`);
      return {
        stations: [],
        feed: "unavailable",
        message: `Live station feed error (${res.status}).`,
      };
    }
    const pois = (await res.json()) as any[];
    const stations: LiveStation[] = pois
      .filter((p) => Number.isFinite(p?.AddressInfo?.Latitude))
      .map((p) => {
        const conns: any[] = Array.isArray(p.Connections) ? p.Connections : [];
        const ports = conns.reduce(
          (sum, c) => sum + (Number(c?.Quantity) || 1),
          0,
        );
        const maxKw = conns.reduce(
          (max, c) => Math.max(max, Number(c?.PowerKW) || 0),
          0,
        );
        return {
          ocmId: Number(p.ID),
          name: String(p.AddressInfo?.Title ?? "Charging site"),
          city: String(p.AddressInfo?.Town ?? "Unknown"),
          state: String(p.AddressInfo?.StateOrProvince ?? "Unknown"),
          lat: Number(p.AddressInfo.Latitude),
          lng: Number(p.AddressInfo.Longitude),
          ports: Math.max(1, ports),
          maxKw: maxKw || 22,
          operational: Number(p.StatusTypeID ?? 50) !== 100,
          lastVerified: p.DateLastVerified ?? null,
        };
      });
    return { stations, feed: "live", message: null };
  } catch (err) {
    console.error("OpenChargeMap request threw", err);
    return {
      stations: [],
      feed: "unavailable",
      message: "Live station feed unreachable.",
    };
  }
}
