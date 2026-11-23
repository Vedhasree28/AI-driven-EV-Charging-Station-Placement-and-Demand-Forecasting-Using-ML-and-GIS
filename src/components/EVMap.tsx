import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  LayersControl,
  LayerGroup,
  Popup,
  useMap,
  Marker,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "lucide-react";
import {
  INDIA_CENTER,
  etaMinutes,
  gmapsNavUrl,
  haversineKm,
  type Station,
} from "@/lib/ev-data";
import { useEVData } from "@/hooks/useEVData";

const stationIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.45));">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 20 14 20s14-9.5 14-20c0-7.732-6.268-14-14-14z" fill="white"/>
      <path d="M14 2C7.373 2 2 7.373 2 14c0 8.5 12 16.5 12 16.5S26 22.5 26 14c0-6.627-5.373-12-12-12z" fill="${color}"/>
      <circle cx="14" cy="14" r="5" fill="white"/>
    </svg>`,
    iconSize: [28, 34],
    iconAnchor: [14, 34],
    popupAnchor: [0, -32],
  });

const userIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative"><div style="width:16px;height:16px;border-radius:50%;background:#38bdf8;border:3px solid white;box-shadow:0 0 0 4px rgba(56,189,248,.35)"></div></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function statusColor(s: Station["status"]) {
  return s === "online" ? "#5EE6A3" : s === "offline" ? "#F26D6D" : "#FFC857";
}

function FlyTo({ pos }: { pos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo(pos, 13, { duration: 0.8 });
  }, [pos, map]);
  return null;
}

interface EVMapProps {
  height?: string;
  showRecommendations?: boolean;
  showHeatmap?: boolean;
  showCoverage?: boolean;
  focusStationId?: string | null;
}

export function EVMap({
  height = "100%",
  showRecommendations = true,
  showHeatmap = true,
  showCoverage = true,
  focusStationId = null,
}: EVMapProps) {
  const { data, isLoading, error } = useEVData();
  const stations = data?.stations ?? [];
  const recommendations = data?.recommendations ?? [];
  const demandPoints = data?.demandPoints ?? [];

  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setUserPos([p.coords.latitude, p.coords.longitude]),
      () => {},
      { timeout: 5000 },
    );
  }, []);

  const focus = useMemo(() => {
    if (!focusStationId) return null;
    const s = stations.find((x) => x.id === focusStationId);
    return s ? ([s.lat, s.lng] as [number, number]) : null;
  }, [focusStationId, stations]);

  useEffect(() => {
    if (focus) setFlyTarget(focus);
  }, [focus]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border/60" style={{ height }}>
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        scrollWheelZoom
        className="h-full w-full"
        preferCanvas
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Carto Dark">
            <TileLayer
              attribution='&copy; OpenStreetMap &copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Carto Light">
            <TileLayer
              attribution='&copy; OpenStreetMap &copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {showHeatmap && (
            <LayersControl.Overlay checked name="Demand Heatmap">
              <LayerGroup>
                {demandPoints.map((p, i) => (
                  <CircleMarker
                    key={i}
                    center={[p.lat, p.lng]}
                    radius={14 + p.intensity * 26}
                    pathOptions={{
                      color: "transparent",
                      fillColor: p.intensity > 0.75 ? "#F26D6D" : p.intensity > 0.4 ? "#FFC857" : "#5EE6A3",
                      fillOpacity: 0.18 + p.intensity * 0.25,
                    }}
                  />
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          {showCoverage && (
            <LayersControl.Overlay name="Coverage (5km)">
              <LayerGroup>
                {stations.map((s) => (
                  <Circle
                    key={`c-${s.id}`}
                    center={[s.lat, s.lng]}
                    radius={5000}
                    pathOptions={{ color: "#78E9E1", weight: 1, fillOpacity: 0.04 }}
                  />
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          {showRecommendations && (
            <LayersControl.Overlay checked name="AI Recommended">
              <LayerGroup>
                {recommendations.map((r) => (
                  <CircleMarker
                    key={r.id}
                    center={[r.lat, r.lng]}
                    radius={9}
                    pathOptions={{ color: "#C6F04A", fillColor: "#C6F04A", fillOpacity: 0.85, weight: 2 }}
                  >
                    <Tooltip direction="top" offset={[0, -8]}>
                      <div className="text-xs">
                        <div className="font-semibold">{r.name}</div>
                        <div>Score {r.score} · {r.priority}</div>
                      </div>
                    </Tooltip>
                    <Popup>
                      <div className="min-w-[220px] space-y-1 text-xs">
                        <div className="text-sm font-semibold">{r.name}</div>
                        <div className="text-muted-foreground">AI recommended site</div>
                        <div>Priority: <b>{r.priority}</b> · Score {r.score}/100</div>
                        <div>Suggested: {r.suggestedPorts} ports · {r.suggestedCapacityKw}kW</div>
                        <div>Expected: {r.expectedDailyKwh.toLocaleString()} kWh/day</div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          <LayersControl.Overlay checked name="Existing Stations">
            <LayerGroup>
              {stations.map((s) => {
                const dist = userPos ? haversineKm(userPos, [s.lat, s.lng]) : null;
                const eta = dist != null ? etaMinutes(dist) : null;
                return (
                  <Marker
                    key={s.id}
                    position={[s.lat, s.lng]}
                    icon={stationIcon("#F26D6D")}
                  >
                    <Popup>
                      <div className="min-w-[240px] space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold">{s.name}</div>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{ background: `${statusColor(s.status)}22`, color: statusColor(s.status) }}
                          >
                            {s.status}
                          </span>
                        </div>
                        <div className="text-muted-foreground">{s.address}</div>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                          <span>Type: <b>{s.chargerType}</b></span>
                          <span>Capacity: <b>{s.capacityKw} kW</b></span>
                          <span>Ports: <b>{s.ports}</b></span>
                          <span>Operator: <b>{s.operator}</b></span>
                        </div>
                        {dist != null && (
                          <div>Distance: <b>{dist.toFixed(1)} km</b> · ETA <b>{eta} min</b></div>
                        )}
                        <a
                          href={gmapsNavUrl(s.lat, s.lng)}
                          target="_blank"
                          rel="noopener noreferrer external"
                          className="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                        >
                          <Navigation className="h-3.5 w-3.5" />
                          Navigate (Google Maps)
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </LayerGroup>
          </LayersControl.Overlay>

          {userPos && (
            <LayersControl.Overlay checked name="Your Location">
              <LayerGroup>
                <Marker position={userPos} icon={userIcon}>
                  <Popup>You are here</Popup>
                </Marker>
                <Circle
                  center={userPos}
                  radius={400}
                  pathOptions={{ color: "#38bdf8", weight: 1, fillOpacity: 0.08 }}
                />
              </LayerGroup>
            </LayersControl.Overlay>
          )}
        </LayersControl>

        <FlyTo pos={flyTarget} />
      </MapContainer>

      <div className="pointer-events-none absolute left-3 top-3 z-[500] flex flex-col gap-2">
        <Badge variant="outline" className="pointer-events-auto border-border/60 bg-card/80 backdrop-blur">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#F26D6D]" /> Existing Stations
        </Badge>
        {isLoading && (
          <Badge variant="outline" className="pointer-events-auto border-border/60 bg-card/80 backdrop-blur">
            Loading map data…
          </Badge>
        )}
        {error && (
          <Badge variant="outline" className="pointer-events-auto border-destructive/60 bg-card/80 text-destructive backdrop-blur">
            Failed to load datasets
          </Badge>
        )}
      </div>
    </div>
  );
}
