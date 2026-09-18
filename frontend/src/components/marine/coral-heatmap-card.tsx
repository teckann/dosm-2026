"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Flame,
  ShieldAlert,
  Layers,
  MapPin,
  ChevronDown,
  Info,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Compass,
  Thermometer,
  Waves,
  Eye,
  Sliders,
  X,
} from "lucide-react";
import coralBleachingData from "@/data/coral_bleaching.json";
import mapPathsData from "@/data/malaysia_map_paths.json";

export interface ReefSite {
  id: string;
  name: string;
  short_name: string;
  state: string;
  region: "peninsular_east" | "peninsular_west" | "sarawak" | "sabah";
  lat: number;
  lng: number;
  bleached_pct: number;
  dhw: number;
  sst_anomaly: number;
  alert_level: "Alert Level 2" | "Alert Level 1" | "Watch" | "Normal";
  live_coral_cover: number;
  mortality_rate: number;
  status: string;
  management_action: string;
  dx: number;
  dy: number;
  textAnchor: "start" | "middle" | "end";
}

const DEFAULT_SITES: ReefSite[] = [
  {
    id: "payar",
    name: "Pulau Payar Marine Park",
    short_name: "P. Payar",
    state: "Kedah",
    region: "peninsular_west",
    lat: 6.06,
    lng: 100.04,
    bleached_pct: 48.5,
    dhw: 6.2,
    sst_anomaly: 1.4,
    alert_level: "Alert Level 1",
    live_coral_cover: 38.2,
    mortality_rate: 16.5,
    status: "Moderate Bleaching",
    management_action: "Temporary dive visitor quota cap (-40%)",
    dx: -12,
    dy: 1,
    textAnchor: "end",
  },
  {
    id: "perhentian",
    name: "Pulau Perhentian",
    short_name: "Perhentian",
    state: "Terengganu",
    region: "peninsular_east",
    lat: 5.91,
    lng: 102.74,
    bleached_pct: 68.4,
    dhw: 8.7,
    sst_anomaly: 1.85,
    alert_level: "Alert Level 2",
    live_coral_cover: 42.0,
    mortality_rate: 26.0,
    status: "Severe Bleaching",
    management_action: "Selective site closure at Teluk Keke & Shark Point",
    dx: -14,
    dy: -12,
    textAnchor: "end",
  },
  {
    id: "redang",
    name: "Pulau Redang Marine Park",
    short_name: "Redang",
    state: "Terengganu",
    region: "peninsular_east",
    lat: 5.78,
    lng: 103.01,
    bleached_pct: 71.2,
    dhw: 9.1,
    sst_anomaly: 1.9,
    alert_level: "Alert Level 2",
    live_coral_cover: 45.8,
    mortality_rate: 28.5,
    status: "Severe Bleaching",
    management_action: "Mandatory anchoring ban; mooring buoys enforced",
    dx: 14,
    dy: -8,
    textAnchor: "start",
  },
  {
    id: "bidong",
    name: "Pulau Bidong Heritage Reef",
    short_name: "Bidong",
    state: "Terengganu",
    region: "peninsular_east",
    lat: 5.62,
    lng: 103.05,
    bleached_pct: 59.0,
    dhw: 7.8,
    sst_anomaly: 1.65,
    alert_level: "Alert Level 1",
    live_coral_cover: 39.5,
    mortality_rate: 21.0,
    status: "Significant Bleaching",
    management_action: "University research nursery monitoring active",
    dx: 14,
    dy: 12,
    textAnchor: "start",
  },
  {
    id: "tioman",
    name: "Pulau Tioman Marine Park",
    short_name: "P. Tioman",
    state: "Pahang",
    region: "peninsular_east",
    lat: 2.79,
    lng: 104.17,
    bleached_pct: 66.0,
    dhw: 8.4,
    sst_anomaly: 1.76,
    alert_level: "Alert Level 2",
    live_coral_cover: 44.1,
    mortality_rate: 24.4,
    status: "Severe Bleaching",
    management_action: "Full temporary closure of Renggis Island & Marine Park Center",
    dx: 14,
    dy: -8,
    textAnchor: "start",
  },
  {
    id: "sibu_tinggi",
    name: "Pulau Tinggi & Sibu Archipelago",
    short_name: "Tinggi & Sibu",
    state: "Johor",
    region: "peninsular_east",
    lat: 2.3,
    lng: 104.12,
    bleached_pct: 61.5,
    dhw: 8.1,
    sst_anomaly: 1.7,
    alert_level: "Alert Level 2",
    live_coral_cover: 36.4,
    mortality_rate: 22.8,
    status: "Severe Bleaching",
    management_action: "Demersal fishing gear buffer extended to 3 nautical miles",
    dx: 14,
    dy: 12,
    textAnchor: "start",
  },
  {
    id: "miri_sibuti",
    name: "Miri-Sibuti Coral Reefs National Park",
    short_name: "Miri-Sibuti",
    state: "Sarawak",
    region: "sarawak",
    lat: 4.33,
    lng: 113.83,
    bleached_pct: 44.0,
    dhw: 5.4,
    sst_anomaly: 1.25,
    alert_level: "Alert Level 1",
    live_coral_cover: 48.0,
    mortality_rate: 14.0,
    status: "Moderate Bleaching",
    management_action: "Commercial trawling exclusion zone patrols intensified",
    dx: -14,
    dy: -10,
    textAnchor: "end",
  },
  {
    id: "talang_satang",
    name: "Talang-Satang Marine Reserve",
    short_name: "Talang-Satang",
    state: "Sarawak",
    region: "sarawak",
    lat: 1.91,
    lng: 110.15,
    bleached_pct: 35.0,
    dhw: 4.2,
    sst_anomaly: 1.1,
    alert_level: "Watch",
    live_coral_cover: 33.5,
    mortality_rate: 9.5,
    status: "Mild Bleaching",
    management_action: "Green turtle nesting habitat surveillance active",
    dx: -14,
    dy: 12,
    textAnchor: "end",
  },
  {
    id: "tunku_abdul_rahman",
    name: "Tunku Abdul Rahman Park",
    short_name: "TAR Park (KK)",
    state: "Sabah",
    region: "sabah",
    lat: 5.98,
    lng: 115.99,
    bleached_pct: 52.0,
    dhw: 6.9,
    sst_anomaly: 1.5,
    alert_level: "Alert Level 1",
    live_coral_cover: 41.2,
    mortality_rate: 18.0,
    status: "Moderate Bleaching",
    management_action: "Tourist reef walking restricted at Sapi & Manukan",
    dx: -14,
    dy: 0,
    textAnchor: "end",
  },
  {
    id: "tun_mustapha",
    name: "Tun Mustapha Marine Park (Kudat)",
    short_name: "Tun Mustapha (Kudat)",
    state: "Sabah",
    region: "sabah",
    lat: 7.08,
    lng: 117.1,
    bleached_pct: 64.0,
    dhw: 8.2,
    sst_anomaly: 1.72,
    alert_level: "Alert Level 2",
    live_coral_cover: 43.5,
    mortality_rate: 23.5,
    status: "Severe Bleaching",
    management_action: "Community managed no-take zones (LMMA) fortified",
    dx: 0,
    dy: -16,
    textAnchor: "middle",
  },
  {
    id: "tun_sakaran",
    name: "Tun Sakaran Marine Park (Semporna)",
    short_name: "Tun Sakaran",
    state: "Sabah",
    region: "sabah",
    lat: 4.6,
    lng: 118.78,
    bleached_pct: 67.5,
    dhw: 8.6,
    sst_anomaly: 1.8,
    alert_level: "Alert Level 2",
    live_coral_cover: 51.0,
    mortality_rate: 25.0,
    status: "Severe Bleaching",
    management_action: "Bohey Dulang lagoon visitor access regulated",
    dx: -14,
    dy: -8,
    textAnchor: "end",
  },
  {
    id: "sipadan",
    name: "Sipadan Oceanic Oceanic Reserve",
    short_name: "Sipadan / Mabul",
    state: "Sabah",
    region: "sabah",
    lat: 4.11,
    lng: 118.63,
    bleached_pct: 39.5,
    dhw: 5.1,
    sst_anomaly: 1.2,
    alert_level: "Alert Level 1",
    live_coral_cover: 62.0,
    mortality_rate: 11.2,
    status: "Deep Water Refuge / Resilient",
    management_action: "Strict daily permit limit (176 divers/day) maintained",
    dx: -14,
    dy: 14,
    textAnchor: "end",
  },
];

interface CoralHeatmapCardProps {
  onOpenSimulator?: () => void;
}

export const CoralHeatmapCard: React.FC<CoralHeatmapCardProps> = ({ onOpenSimulator }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [showHeatmapHalos, setShowHeatmapHalos] = useState<boolean>(true);
  const [selectedSite, setSelectedSite] = useState<ReefSite | null>(null);
  const [hoveredSite, setHoveredSite] = useState<ReefSite | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Click on a reef node to zoom into it and show fixed telemetry card
  const handleSiteClick = (site: ReefSite, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedSite?.id === site.id) {
      // clicking already selected site toggles zoom out
      setSelectedSite(null);
    } else {
      setSelectedSite(site);
    }
  };

  // Reset selected card on filter switch
  useEffect(() => {
    setSelectedSite(null);
  }, [selectedRegion, severityFilter]);

  // Exact geographic projection matching official Malaysia GeoJSON boundaries:
  // Lng: 99.2 to 119.6, Lat: 0.6 to 7.6
  const projectCoordinates = (lat: number, lng: number) => {
    const minLng = 99.2;
    const maxLng = 119.6;
    const minLat = 0.6;
    const maxLat = 7.6;
    const viewW = 890;
    const viewH = 340;
    const offsetX = 35;
    const offsetY = 35;

    const x = offsetX + ((lng - minLng) / (maxLng - minLng)) * viewW;
    const y = offsetY + ((maxLat - lat) / (maxLat - minLat)) * viewH;
    return { x, y };
  };

  // Dynamic viewport camera zoom: focuses & zooms on selected reef point if clicked, otherwise region
  const currentViewBox = useMemo(() => {
    if (selectedSite) {
      const { x, y } = projectCoordinates(selectedSite.lat, selectedSite.lng);
      // Zoomed viewport window (centered on the node, framed so fixed top-right card doesn't occlude it)
      const zoomW = 340;
      const zoomH = 190;
      const targetX = Math.max(0, Math.min(960 - zoomW, x - zoomW * 0.38));
      const targetY = Math.max(0, Math.min(420 - zoomH, y - zoomH * 0.5));
      return `${Math.round(targetX)} ${Math.round(targetY)} ${zoomW} ${zoomH}`;
    }

    switch (selectedRegion) {
      case "peninsular":
        return "35 50 320 330";
      case "sabah":
        return "680 30 260 270";
      case "sarawak":
        return "420 130 380 270";
      default:
        return "0 0 960 420";
    }
  }, [selectedSite, selectedRegion]);

  const filteredSites = useMemo(() => {
    return DEFAULT_SITES.filter((site) => {
      const matchRegion =
        selectedRegion === "all" ||
        (selectedRegion === "peninsular" &&
          (site.region === "peninsular_east" || site.region === "peninsular_west")) ||
        (selectedRegion === "sabah" && site.region === "sabah") ||
        (selectedRegion === "sarawak" && site.region === "sarawak");

      const matchSeverity =
        severityFilter === "all" ||
        (severityFilter === "level2" && site.dhw >= 8.0) ||
        (severityFilter === "level1" && site.dhw >= 4.0 && site.dhw < 8.0);

      return matchRegion && matchSeverity;
    });
  }, [selectedRegion, severityFilter]);

  // Key Aggregates
  const totalSites = DEFAULT_SITES.length;
  const severeSitesCount = DEFAULT_SITES.filter((s) => s.dhw >= 8.0).length;
  const nationalBleachAvg = (
    DEFAULT_SITES.reduce((acc, s) => acc + s.bleached_pct, 0) / totalSites
  ).toFixed(1);
  const peakDHW = Math.max(...DEFAULT_SITES.map((s) => s.dhw));

  // Dynamic scaling factor based on camera zoom:
  const zoomFactor = useMemo(() => {
    const parts = currentViewBox.split(" ").map(Number);
    const w = parts[2] || 960;
    return 960 / w;
  }, [currentViewBox]);

  const invZoom = useMemo(() => {
    return 1 / Math.pow(zoomFactor, 0.72);
  }, [zoomFactor]);

  return (
    <div
      className={`bg-ocean-850 border border-ocean-700/60 rounded-xl shadow-ocean-glow relative h-full overflow-hidden panel flex flex-col p-0 ${
        isExpanded ? "fixed inset-4 z-50 overflow-y-auto bg-ocean-900" : ""
      }`}
    >
      {/* Interactive Map Canvas Filling Full Panel Area */}
      <div className="relative w-full h-full flex-1 overflow-hidden bg-ocean-950">
        <svg
          viewBox={currentViewBox}
          className="w-full h-full select-none transition-all duration-700 ease-out"
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: "drop-shadow(0 0 18px rgba(6, 182, 212, 0.08))" }}
        >
          <defs>
            {/* Oceanic Bathymetry Background Grid */}
            <pattern id="oceanGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path
                d="M 30 0 L 0 0 0 30"
                fill="none"
                stroke="#1a548a"
                strokeWidth="0.4"
                strokeOpacity="0.2"
              />
            </pattern>

            {/* Severe Heatmap Glow Gradient (Alert Level 2) */}
            <radialGradient id="heatGlowSevere" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#f43f5e" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#fb923c" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
            </radialGradient>

            {/* Moderate Heatmap Glow Gradient (Alert Level 1) */}
            <radialGradient id="heatGlowModerate" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.7" />
              <stop offset="40%" stopColor="#facc15" stopOpacity="0.35" />
              <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#081d33" stopOpacity="0" />
            </radialGradient>

            {/* Reef Node Halo Glow */}
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Ocean & Coordinates Grid */}
          <rect
            width="960"
            height="420"
            fill="#091f35"
            onClick={() => setSelectedSite(null)}
            className="cursor-pointer"
          />
          <rect
            width="960"
            height="420"
            fill="url(#oceanGrid)"
            onClick={() => setSelectedSite(null)}
            className="cursor-pointer pointer-events-none"
          />

          {/* Bathymetry Shelf Contours */}
          <path
            d="M 60 80 Q 220 200 240 410 M 380 40 Q 500 240 600 410 M 660 60 Q 750 200 870 390"
            fill="none"
            stroke="#123c64"
            strokeWidth="1"
            strokeDasharray="4 6"
            strokeOpacity="0.4"
          />

          {/* MALAYSIA COASTLINES & STATES GEOJSON LAYER */}
          {mapPathsData.states.map((statePath: any) => {
            const isSabahSarawak =
              statePath.name === "Sabah" || statePath.name === "Sarawak";
            const isPeninsular = !isSabahSarawak;
            const isMatch =
              selectedRegion === "all" ||
              (selectedRegion === "peninsular" && isPeninsular) ||
              (selectedRegion === "sabah" && statePath.name === "Sabah") ||
              (selectedRegion === "sarawak" && statePath.name === "Sarawak");

            return (
              <path
                key={statePath.name}
                d={statePath.d}
                fill={isMatch ? "#0d2d4d" : "#091c30"}
                stroke={isMatch ? "#00d2ff" : "#13426e"}
                strokeWidth={isMatch ? 0.95 : 0.6}
                strokeOpacity={isMatch ? 0.8 : 0.35}
                className="transition-all duration-500 ease-in-out cursor-pointer"
                onClick={() => setSelectedSite(null)}
              />
            );
          })}

          {/* STATE LABELS (Scaled with camera zoom) */}
          {mapPathsData.states
            .filter((st: any) =>
              [
                "Sabah",
                "Sarawak",
                "Pahang",
                "Johor",
                "Perak",
                "Terengganu",
                "Kelantan",
                "Kedah",
              ].includes(st.name)
            )
            .map((st: any) => {
              const isRegionActive =
                selectedRegion === "all" ||
                (selectedRegion === "peninsular" && st.region === "peninsular") ||
                (selectedRegion === "sabah" && st.region === "sabah") ||
                (selectedRegion === "sarawak" && st.region === "sarawak");

              const baseFontSize =
                st.name === "Sabah" || st.name === "Sarawak" ? 11 : 8;

              return (
                <text
                  key={`lbl-${st.name}`}
                  x={st.cx}
                  y={st.cy}
                  textAnchor="middle"
                  fill="#7dd3fc"
                  fontSize={Math.max(2.8, baseFontSize * invZoom)}
                  fontWeight="bold"
                  letterSpacing={
                    st.name === "Sabah" || st.name === "Sarawak"
                      ? `${Math.max(0.5, 2 * invZoom)}`
                      : `${Math.max(0.2, 0.5 * invZoom)}`
                  }
                  opacity={
                    isRegionActive
                      ? st.name === "Sabah" || st.name === "Sarawak"
                        ? 0.45
                        : 0.35
                      : 0.15
                  }
                  className="pointer-events-none select-none transition-opacity duration-300 uppercase"
                >
                  {st.name}
                </text>
              );
            })}

          {/* HEATMAP THERMAL HALOS LAYER */}
          {showHeatmapHalos && (
            <g className="heatmap-halos pointer-events-none transition-opacity duration-300">
              {filteredSites.map((site) => {
                const { x, y } = projectCoordinates(site.lat, site.lng);
                const isSevere = site.dhw >= 8.0;
                const baseRadius = isSevere ? 52 : 36;
                const radius =
                  baseRadius * Math.max(0.45, 1 / Math.pow(zoomFactor, 0.5));
                return (
                  <circle
                    key={`halo-${site.id}`}
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={isSevere ? "url(#heatGlowSevere)" : "url(#heatGlowModerate)"}
                    className="animate-pulse"
                    style={{ animationDuration: isSevere ? "2.5s" : "4s" }}
                  />
                );
              })}
            </g>
          )}

          {/* REEF SITE NODES & INTERACTIVE HOTSPOTS */}
          {filteredSites.map((site) => {
            const { x, y } = projectCoordinates(site.lat, site.lng);
            const isSelected = selectedSite?.id === site.id;
            const isHovered = hoveredSite?.id === site.id;
            const isSevere = site.dhw >= 8.0;

            const dx = site.dx ?? 14;
            const dy = site.dy ?? 0;
            const textAnchor = site.textAnchor ?? "start";

            // Offset and sizes scale with camera zoom so they remain crisp and close
            const offsetScale = Math.max(0.42, invZoom * 1.05);
            const labelX = x + dx * offsetScale;
            const labelY = y + dy * offsetScale;

            const baseR = isSelected ? 7.2 : isHovered ? 5.8 : 4.6;
            const nodeR = Math.max(1.8, baseR * invZoom);
            const outerR = Math.max(4.5, 14 * invZoom);

            const titleFontSize = Math.max(3.0, (isSelected ? 11 : 9.5) * invZoom);
            const subFontSize = Math.max(2.5, 8.0 * invZoom);
            const strokeW = Math.max(0.7, 3.2 * invZoom);
            const subStrokeW = Math.max(0.6, 2.5 * invZoom);

            return (
              <g
                key={site.id}
                className="cursor-pointer group"
                onClick={(e) => handleSiteClick(site, e)}
                onMouseEnter={() => setHoveredSite(site)}
                onMouseLeave={() => setHoveredSite(null)}
              >
                {/* Directional Leader Line from marker to offset label */}
                {(Math.abs(dx) > 10 || Math.abs(dy) > 10) && (
                  <line
                    x1={x}
                    y1={y}
                    x2={
                      labelX +
                      (textAnchor === "end"
                        ? 4 * invZoom
                        : textAnchor === "start"
                        ? -4 * invZoom
                        : 0)
                    }
                    y2={labelY + 2 * invZoom}
                    stroke={isSelected ? "#00d2ff" : isSevere ? "#f43f5e" : "#fb923c"}
                    strokeWidth={Math.max(0.35, (isSelected ? 1.5 : 1.0) * invZoom)}
                    strokeOpacity={0.75}
                    strokeDasharray={isSelected ? "none" : "2 2"}
                  />
                )}

                {/* Concentric Pulsing Ring for Alert Level 2 */}
                {isSevere && (
                  <circle
                    cx={x}
                    cy={y}
                    r={outerR}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth={Math.max(0.4, 1.4 * invZoom)}
                    className="animate-ping"
                    style={{
                      transformOrigin: `${x}px ${y}px`,
                      animationDuration: "2.2s",
                    }}
                  />
                )}

                {/* Outer Selection Indicator */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r={outerR * 1.15}
                    fill="none"
                    stroke="#00d2ff"
                    strokeWidth={Math.max(0.5, 2.0 * invZoom)}
                    strokeDasharray="3 3"
                    className="animate-spin-slow"
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                )}

                {/* Node Core Marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={nodeR}
                  fill={isSevere ? "#f43f5e" : "#fb923c"}
                  stroke="#ffffff"
                  strokeWidth={Math.max(0.4, (isSelected ? 2.0 : 1.3) * invZoom)}
                  filter="url(#nodeGlow)"
                  className="transition-all duration-200"
                />

                {/* Site Name Text */}
                <text
                  x={labelX}
                  y={labelY - 1}
                  textAnchor={textAnchor}
                  fill={isSelected ? "#00d2ff" : isHovered ? "#ffffff" : "#f8fafc"}
                  fontSize={titleFontSize}
                  fontWeight={isSelected ? "bold" : "600"}
                  className="transition-colors pointer-events-none select-none"
                  style={{
                    paintOrder: "stroke fill",
                    stroke: "#061526",
                    strokeWidth: `${strokeW}px`,
                    strokeLinejoin: "round",
                  }}
                >
                  {site.short_name || site.name}
                </text>

                {/* Sub-label: Bleached % • DHW */}
                <text
                  x={labelX}
                  y={labelY + 9 * invZoom}
                  textAnchor={textAnchor}
                  fill={isSevere ? "#fda4af" : "#fde047"}
                  fontSize={subFontSize}
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                  style={{
                    paintOrder: "stroke fill",
                    stroke: "#061526",
                    strokeWidth: `${subStrokeW}px`,
                    strokeLinejoin: "round",
                  }}
                >
                  {site.bleached_pct}% • {site.dhw} DHW
                </text>
              </g>
            );
          })}
        </svg>

        {/* ── TOP UNIFIED FLOATING HUD: Title, Metrics, & Toolbar (Collision-Proof) ── */}
        <div className="absolute top-2 left-2 right-2 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-1.5">
          {/* Top-Left: Title & Telemetry Metrics */}
          <div className="pointer-events-auto bg-ocean-950/90 backdrop-blur-md border border-ocean-700/60 rounded-xl px-2.5 py-1 shadow-xl shadow-ocean-950/70 min-w-0 flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Flame className="w-3 h-3 animate-pulse" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-white tracking-tight uppercase truncate">
              REEF SURVEILLANCE
            </span>
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[8.5px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse shrink-0">
              Alert 2
            </span>
            <span className="text-ocean-700 hidden lg:inline">•</span>
            <div className="hidden lg:flex items-center gap-2 text-[9.5px] text-ocean-300 font-mono whitespace-nowrap">
              <span>Mean: <strong className="text-rose-400">{nationalBleachAvg}%</strong></span>
              <span>Peak: <strong className="text-amber-300">{peakDHW} DHW</strong></span>
              <span>Sites: <strong className="text-white">{severeSitesCount}/{totalSites}</strong></span>
            </div>
          </div>

          {/* Top-Right: Region Switcher & Filters Toolbar */}
          <div className="pointer-events-auto flex items-center gap-1 bg-ocean-950/90 backdrop-blur-md border border-ocean-700/60 rounded-xl p-1 shadow-xl shadow-ocean-950/70 shrink-0">
            {/* Region Switcher Pills */}
            <div className="flex items-center bg-ocean-900/90 rounded-lg p-0.5 border border-ocean-800">
              {[
                { id: "all", short: "All", label: "Nat" },
                { id: "peninsular", short: "Pen", label: "Pen" },
                { id: "sabah", short: "Sab", label: "Sabah" },
                { id: "sarawak", short: "Sar", label: "Sarawak" },
              ].map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[9.5px] sm:text-[10px] font-semibold transition-all ${
                    selectedRegion === reg.id
                      ? "bg-cyan-500 text-ocean-950 shadow-sm font-bold"
                      : "text-ocean-300 hover:text-white"
                  }`}
                  title={reg.id}
                >
                  <span className="hidden xl:inline">{reg.label}</span>
                  <span className="xl:hidden">{reg.short}</span>
                </button>
              ))}
            </div>

            {/* Severity Dropdown */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-ocean-900 border border-ocean-700/60 text-ocean-200 rounded-lg px-1.5 py-0.5 text-[9.5px] sm:text-[10px] outline-none cursor-pointer focus:border-cyan-400"
            >
              <option value="all">All</option>
              <option value="level2">L2 (≥8)</option>
              <option value="level1">L1 (4-8)</option>
            </select>

            {/* Heatmap Halo Toggle */}
            <button
              onClick={() => setShowHeatmapHalos(!showHeatmapHalos)}
              className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-lg border text-[9.5px] sm:text-[10px] font-medium transition-all ${
                showHeatmapHalos
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  : "bg-ocean-900 text-ocean-400 border-ocean-700/60 hover:text-white"
              }`}
              title="Toggle Heatmap Halos"
            >
              <Layers className="w-3 h-3" />
              <span className="hidden xl:inline">Halo</span>
            </button>

            {/* Fullscreen Expand Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 bg-ocean-900 border border-ocean-700/60 text-ocean-300 hover:text-white rounded-lg transition-colors"
              title={isExpanded ? "Collapse View" : "Fullscreen View"}
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* ── BOTTOM DOCKED INSPECTOR: Selected Reef Site Details (Never Covers Map) ── */}
        {selectedSite ? (
          <div className="absolute bottom-2 left-2 right-2 z-30 pointer-events-auto bg-ocean-950/95 backdrop-blur-md border border-cyan-500/60 rounded-xl p-2 sm:p-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-2 animate-in slide-in-from-bottom-2">
            {/* Site Identity */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[150px] sm:max-w-[220px]">
                    {selectedSite.name}
                  </h3>
                  <span
                    className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0 ${
                      selectedSite.dhw >= 8.0
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {selectedSite.alert_level}
                  </span>
                </div>
                <p className="text-[9px] text-ocean-400 truncate max-w-[240px] sm:max-w-[320px]">
                  {selectedSite.state} • Action: <span className="text-cyan-300">{selectedSite.management_action}</span>
                </p>
              </div>
            </div>

            {/* Telemetry Metrics in sleek horizontal row */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs">
              <div className="bg-ocean-900/90 border border-ocean-700/60 rounded-lg px-2 py-0.5 text-center">
                <div className="text-[8px] text-ocean-400 uppercase font-semibold">Bleached</div>
                <div className="text-xs sm:text-sm font-extrabold font-mono text-rose-400">
                  {selectedSite.bleached_pct}%
                </div>
              </div>

              <div className="bg-ocean-900/90 border border-ocean-700/60 rounded-lg px-2 py-0.5 text-center">
                <div className="text-[8px] text-ocean-400 uppercase font-semibold">DHW Stress</div>
                <div className="text-xs sm:text-sm font-extrabold font-mono text-amber-300">
                  {selectedSite.dhw} <span className="text-[8px] font-normal text-ocean-400">°C-wks</span>
                </div>
              </div>

              <div className="hidden sm:block bg-ocean-900/90 border border-ocean-700/60 rounded-lg px-2 py-0.5 text-center">
                <div className="text-[8px] text-ocean-400 uppercase font-semibold">SST Anomaly</div>
                <div className="text-xs sm:text-sm font-extrabold font-mono text-white">
                  +{selectedSite.sst_anomaly.toFixed(1)}°C
                </div>
              </div>

              <div className="hidden sm:block bg-ocean-900/90 border border-ocean-700/60 rounded-lg px-2 py-0.5 text-center">
                <div className="text-[8px] text-ocean-400 uppercase font-semibold">Coral Cover</div>
                <div className="text-xs sm:text-sm font-extrabold font-mono text-emerald-400">
                  {selectedSite.live_coral_cover}%
                </div>
              </div>
            </div>

            {/* Actions: Simulator trigger & Close */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              {onOpenSimulator && (
                <button
                  onClick={onOpenSimulator}
                  className="flex items-center space-x-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-ocean-950 font-bold py-1 px-2.5 rounded-lg text-[10px] sm:text-[10.5px] transition-all shadow-cyan-glow cursor-pointer whitespace-nowrap"
                >
                  <Sliders className="w-3 h-3 text-ocean-950" />
                  <span className="hidden sm:inline">Simulate </span><span>Quota</span>
                </button>
              )}
              <button
                onClick={() => setSelectedSite(null)}
                className="p-1 text-ocean-400 hover:text-white rounded-lg hover:bg-ocean-800 transition-colors"
                title="Close inspection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Normal Bottom Legend & Metadata */
          <div className="absolute bottom-2 left-2 right-2 z-20 pointer-events-none flex items-center justify-between gap-1.5 overflow-hidden">
            {/* Legend */}
            <div className="pointer-events-auto bg-ocean-950/85 backdrop-blur-md border border-ocean-700/60 rounded-lg px-2 py-0.5 text-[9px] sm:text-[9.5px] text-ocean-300 flex items-center space-x-2 sm:space-x-2.5 shadow-lg shadow-ocean-950/60 shrink">
              <span className="hidden sm:inline font-semibold text-ocean-400">NOAA:</span>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm animate-ping shrink-0" />
                <span className="text-rose-300 font-medium whitespace-nowrap">L2 (≥8)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shrink-0" />
                <span className="whitespace-nowrap">L1 (4-8)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shrink-0" />
                <span className="whitespace-nowrap">Watch</span>
              </div>
            </div>

            {/* Telemetry metadata */}
            <div className="pointer-events-auto bg-ocean-950/85 backdrop-blur-md border border-ocean-700/60 rounded-lg px-2 py-0.5 text-[9px] font-mono text-ocean-300 flex items-center space-x-1.5 shadow-lg shadow-ocean-950/60 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="hidden sm:inline text-ocean-300">NOAA 5km</span>
              <span className="hidden sm:inline text-ocean-600">•</span>
              <span className="text-ocean-400">99°E-120°E</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
