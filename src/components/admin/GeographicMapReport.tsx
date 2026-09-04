"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  ETHIOPIA_CENTER,
  ETHIOPIA_BOUNDS,
  REGION_COORDINATES,
  ZONE_COORDINATES,
  getLocationCoords,
} from "@/lib/location-coordinates";
import { MapPin, Users, Activity, Layers, RefreshCw, ZoomIn, ZoomOut, Compass } from "lucide-react";

interface PersonLocationItem {
  id: string;
  first_name?: string;
  father_name?: string;
  region: any;
  zone_id?: string;
  woreda_id?: string;
  status?: string;
  membership_type?: string;
  profession?: string;
}

interface GeographicMapReportProps {
  items: PersonLocationItem[];
  title: string;
  type: "members" | "volunteers";
  onSelectRegion?: (regionId: string) => void;
}

export function GeographicMapReport({
  items,
  title,
  type,
  onSelectRegion,
}: GeographicMapReportProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const [selectedDivision, setSelectedDivision] = useState<"regions" | "zones" | "all">("regions");
  const [activeLayer, setActiveLayer] = useState<"standard" | "satellite">("standard");
  const [highlightedRegion, setHighlightedRegion] = useState<string>("all");

  // Aggregate stats
  const aggregatedData = useMemo(() => {
    const regionCounts: Record<string, { name: string; count: number; active: number; id: number; coords: [number, number] }> = {};
    const zoneCounts: Record<string, { name: string; count: number; active: number; zoneId: string; coords: [number, number]; regionId?: number }> = {};

    items.forEach((item) => {
      // 1. Process Region
      let regionId = typeof item.region === "object" ? item.region?.id : item.region;
      if (!regionId) regionId = 1; // Default to Addis Ababa if unassigned

      const regCoordInfo = REGION_COORDINATES[regionId] || REGION_COORDINATES[String(regionId).toLowerCase()];
      const regName = regCoordInfo?.name || `Region ${regionId}`;
      const regCoords: [number, number] = regCoordInfo ? [regCoordInfo.lat, regCoordInfo.lng] : [9.03, 38.74];

      if (!regionCounts[regName]) {
        regionCounts[regName] = { name: regName, count: 0, active: 0, id: Number(regionId), coords: regCoords };
      }
      regionCounts[regName].count++;
      if (item.status === "ACTIVE" || item.status === "APPROVED") {
        regionCounts[regName].active++;
      }

      // 2. Process Zone
      if (item.zone_id) {
        const zoneCoordInfo = ZONE_COORDINATES[item.zone_id] || ZONE_COORDINATES[item.zone_id.toLowerCase()];
        const zoneName = zoneCoordInfo?.name || item.zone_id;
        const zoneCoords: [number, number] = zoneCoordInfo ? [zoneCoordInfo.lat, zoneCoordInfo.lng] : regCoords;

        if (!zoneCounts[zoneName]) {
          zoneCounts[zoneName] = { name: zoneName, count: 0, active: 0, zoneId: item.zone_id, coords: zoneCoords, regionId: Number(regionId) };
        }
        zoneCounts[zoneName].count++;
        if (item.status === "ACTIVE" || item.status === "APPROVED") {
          zoneCounts[zoneName].active++;
        }
      }
    });

    const sortedRegions = Object.values(regionCounts).sort((a, b) => b.count - a.count);
    const sortedZones = Object.values(zoneCounts).sort((a, b) => b.count - a.count);

    return {
      regions: sortedRegions,
      zones: sortedZones,
      total: items.length,
      activeTotal: items.filter((i) => i.status === "ACTIVE" || i.status === "APPROVED").length,
    };
  }, [items]);

  // Initialize and update Leaflet map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      const L = (await import("leaflet")).default;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: ETHIOPIA_CENTER,
          zoom: 6,
          minZoom: 5,
          maxZoom: 14,
          maxBounds: ETHIOPIA_BOUNDS,
          zoomControl: false,
        });

        // OSM Standard Tile Layer
        const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: "bottomright" }).addTo(map);

        mapInstanceRef.current = map;
        layerGroupRef.current = L.layerGroup().addTo(map);
      }

      if (!mapInstanceRef.current || !layerGroupRef.current) return;

      const map = mapInstanceRef.current;
      const layerGroup = layerGroupRef.current;
      layerGroup.clearLayers();

      // Render Region Markers / Circles
      if (selectedDivision === "regions" || selectedDivision === "all") {
        aggregatedData.regions.forEach((reg) => {
          if (highlightedRegion !== "all" && String(reg.id) !== highlightedRegion) return;

          const ratio = aggregatedData.total > 0 ? reg.count / aggregatedData.total : 0;
          const radius = Math.max(16, Math.min(48, 16 + ratio * 60));
          const activePct = reg.count > 0 ? Math.round((reg.active / reg.count) * 100) : 0;

          // Circle marker for heat density
          const circle = L.circleMarker(reg.coords, {
            radius: radius,
            fillColor: "#ED1C24",
            color: "#ffffff",
            weight: 3,
            opacity: 0.9,
            fillOpacity: 0.75,
          });

          const popupContent = `
            <div style="font-family: system-ui, sans-serif; padding: 4px 2px; min-width: 170px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #f0f0f0; padding-bottom: 4px;">
                <span style="font-weight: 800; font-size: 14px; color: #111;">${reg.name}</span>
                <span style="background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 9999px;">Region</span>
              </div>
              <div style="font-size: 12px; color: #555; line-height: 1.5;">
                <div>Total ${type === "members" ? "Members" : "Volunteers"}: <b style="color: #111;">${reg.count}</b></div>
                <div>Active: <b style="color: #16a34a;">${reg.active} (${activePct}%)</b></div>
              </div>
            </div>
          `;

          circle.bindPopup(popupContent);
          layerGroup.addLayer(circle);

          // Pulse text label for counts
          const labelIcon = L.divIcon({
            className: "custom-map-label",
            html: `
              <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%); pointer-events: none;">
                <span style="background: #111827; color: #fff; font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); white-space: nowrap;">
                  ${reg.count}
                </span>
                <span style="font-size: 10px; font-weight: 700; color: #111; text-shadow: 0 1px 2px #fff, 0 -1px 2px #fff, 1px 0 2px #fff, -1px 0 2px #fff; margin-top: 2px;">
                  ${reg.name}
                </span>
              </div>
            `,
            iconSize: [0, 0],
          });

          const labelMarker = L.marker(reg.coords, { icon: labelIcon });
          layerGroup.addLayer(labelMarker);
        });
      }

      // Render Zone Markers
      if (selectedDivision === "zones" || selectedDivision === "all") {
        aggregatedData.zones.forEach((zone) => {
          if (highlightedRegion !== "all" && String(zone.regionId) !== highlightedRegion) return;

          const radius = Math.max(10, Math.min(26, 10 + (zone.count / (aggregatedData.total || 1)) * 40));

          const zoneMarker = L.circleMarker(zone.coords, {
            radius: radius,
            fillColor: "#2563EB",
            color: "#ffffff",
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0.8,
          });

          const popupContent = `
            <div style="font-family: system-ui, sans-serif; padding: 4px 2px; min-width: 160px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #f0f0f0; padding-bottom: 4px;">
                <span style="font-weight: 800; font-size: 13px; color: #111;">${zone.name}</span>
                <span style="background: #dbeafe; color: #2563eb; font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 9999px;">Zone</span>
              </div>
              <div style="font-size: 12px; color: #555;">
                <div>Total: <b style="color: #111;">${zone.count}</b></div>
                <div>Active: <b style="color: #16a34a;">${zone.active}</b></div>
              </div>
            </div>
          `;

          zoneMarker.bindPopup(popupContent);
          layerGroup.addLayer(zoneMarker);
        });
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [aggregatedData, selectedDivision, highlightedRegion, type]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(ETHIOPIA_CENTER, 6);
      setHighlightedRegion("all");
    }
  };

  const activeRate = aggregatedData.total > 0
    ? Math.round((aggregatedData.activeTotal / aggregatedData.total) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* KPI Overview Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-primary" />
            Total On Map
          </div>
          <div className="text-2xl font-black text-foreground">{aggregatedData.total.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{aggregatedData.regions.length} active regions</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            Active Coverage
          </div>
          <div className="text-2xl font-black text-emerald-600">{activeRate}%</div>
          <div className="text-xs text-muted-foreground mt-0.5">{aggregatedData.activeTotal.toLocaleString()} in good standing</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            Top Region
          </div>
          <div className="text-lg font-black text-foreground truncate">
            {aggregatedData.regions[0]?.name || "N/A"}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {aggregatedData.regions[0]?.count ? `${aggregatedData.regions[0].count} individuals` : "0"}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            Top Zone / City
          </div>
          <div className="text-lg font-black text-foreground truncate">
            {aggregatedData.zones[0]?.name || "N/A"}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {aggregatedData.zones[0]?.count ? `${aggregatedData.zones[0].count} individuals` : "0"}
          </div>
        </div>
      </div>

      {/* Map Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs relative">
        {/* Map Header Toolbar */}
        <div className="p-3.5 bg-muted/40 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Ethiopia Geographic Distribution</h3>
              <p className="text-xs text-muted-foreground">Interactive Leaflet map powered by OpenStreetMap</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Division Switcher */}
            <div className="flex items-center bg-background border border-border rounded-lg p-0.5 text-xs font-semibold shadow-xs">
              <button
                onClick={() => setSelectedDivision("regions")}
                className={`px-3 py-1 rounded-md transition-all ${
                  selectedDivision === "regions" ? "bg-primary text-primary-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Regions
              </button>
              <button
                onClick={() => setSelectedDivision("zones")}
                className={`px-3 py-1 rounded-md transition-all ${
                  selectedDivision === "zones" ? "bg-primary text-primary-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Zones
              </button>
              <button
                onClick={() => setSelectedDivision("all")}
                className={`px-3 py-1 rounded-md transition-all ${
                  selectedDivision === "all" ? "bg-primary text-primary-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
            </div>

            {/* Region Filter */}
            <select
              value={highlightedRegion}
              onChange={(e) => setHighlightedRegion(e.target.value)}
              className="bg-background border border-border text-foreground text-xs rounded-lg px-2.5 py-1.5 font-medium shadow-xs focus:ring-1 focus:ring-primary outline-hidden"
            >
              <option value="all">All Regions</option>
              {aggregatedData.regions.map((r) => (
                <option key={r.id} value={String(r.id)}>
                  {r.name} ({r.count})
                </option>
              ))}
            </select>

            {/* Reset View Button */}
            <button
              onClick={handleResetView}
              title="Reset Map View"
              className="h-8 w-8 bg-background border border-border hover:bg-muted text-foreground rounded-lg flex items-center justify-center transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Map Canvas Container */}
        <div className="relative w-full h-[520px] bg-muted/20">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Map Legend Floating Overlay */}
          <div className="absolute bottom-4 left-4 z-10 bg-background/95 backdrop-blur-md border border-border/80 rounded-xl p-3 shadow-lg text-xs space-y-2 pointer-events-auto max-w-[200px]">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" /> Map Legend
            </div>
            <div className="space-y-1.5 text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-600 border border-white inline-block shrink-0 shadow-xs" />
                <span>Regional Concentrations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 border border-white inline-block shrink-0 shadow-xs" />
                <span>Zonal Concentrations</span>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground/70 pt-1 border-t border-border/50">
              Click any circle marker to view detailed counts & standing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
