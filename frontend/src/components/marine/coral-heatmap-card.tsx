"use client";

import React, { useState, useMemo } from "react";
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
  const [selectedSite, setSelectedSite] = useState<ReefSite | null>(DEFAULT_SITES[4]); // Default to Tioman
  const [hoveredSite, setHoveredSite] = useState<ReefSite | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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

  // Dynamic viewport camera zoom based on region
  const currentViewBox = useMemo(() => {
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
  }, [selectedRegion]);

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

  return (
    <div
      className={`bg-ocean-850 border border-ocean-700/60 rounded-xl p-4 shadow-ocean-glow flex flex-col transition-all duration-300 relative ${
        isExpanded ? "fixed inset-4 z-50 overflow-y-auto bg-ocean-900" : ""
      }`}
    >
      {/* Compact Header Bar with Integrated Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pb-3 border-b border-ocean-700/50">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h2 className="text-xs sm:text-sm font-extrabold text-white tracking-tight uppercase">
                Malaysia Coral Bleaching & Reef Surveillance
              </h2>
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9.5px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                NOAA Alert Level 2
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10.5px] text-ocean-400 mt-0.5 font-medium">
              <span>Mean Bleaching: <strong className="text-rose-400 font-mono">{nationalBleachAvg}%</strong></span>
              <span>•</span>
              <span>Peak Stress: <strong className="text-amber-300 font-mono">{peakDHW} DHW</strong></span>
              <span>•</span>
              <span>Impacted Sites: <strong className="text-white font-mono">{severeSitesCount}/{totalSites}</strong></span>
            </div>
          </div>
        </div>

        {/* Filter & Toggle Controls */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          {/* Region Switcher */}
          <div className="flex items-center bg-ocean-950 border border-ocean-700/60 rounded-lg p-0.5">
            {[
              { id: "all", label: "National" },
              { id: "peninsular", label: "Peninsular" },
              { id: "sabah", label: "Sabah" },
              { id: "sarawak", label: "Sarawak" },
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-2 py-0.5 rounded text-[10.5px] font-semibold transition-all ${
                  selectedRegion === reg.id
                    ? "bg-cyan-500 text-ocean-950 shadow-sm"
                    : "text-ocean-300 hover:text-white"
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-ocean-950 border border-ocean-700/60 text-ocean-200 rounded-lg px-2 py-0.5 text-[11px] outline-none cursor-pointer focus:border-cyan-400"
          >
            <option value="all">All Levels</option>
            <option value="level2">Alert Level 2 (≥8 DHW)</option>
            <option value="level1">Alert Level 1 (4-8 DHW)</option>
          </select>

          {/* Heatmap Halo Toggle */}
          <button
            onClick={() => setShowHeatmapHalos(!showHeatmapHalos)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg border text-[11px] transition-all ${
              showHeatmapHalos
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                : "bg-ocean-950 text-ocean-400 border-ocean-700/60 hover:text-white"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Halo</span>
          </button>

          {/* Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 bg-ocean-950 border border-ocean-700/60 text-ocean-300 hover:text-white rounded-lg transition-colors"
            title={isExpanded ? "Collapse View" : "Fullscreen View"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Map & Inspection Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch mt-2.5">
        {/* SVG Interactive Geospatial Canvas (Expansive 8/9 Cols for Maximum Readability) */}
        <div className="lg:col-span-8 xl:col-span-9 bg-ocean-950 border border-ocean-700/60 rounded-xl p-3 relative overflow-hidden shadow-inner flex flex-col justify-between">
          {/* Watermark / Coordinates */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none flex items-center space-x-1.5 text-[10px] font-mono text-ocean-400/80">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>MALAYSIA REEF SURVEILLANCE • 99°E - 120°E</span>
          </div>

          <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5 text-[10px] font-mono bg-ocean-900/90 border border-ocean-700/60 px-2 py-0.5 rounded text-ocean-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>NOAA Coral Reef Watch 5km</span>
          </div>

          {/* SVG Map Container (Enlarged Height for Crisp Legibility) */}
          <div className={`w-full relative mt-5 ${isExpanded ? "h-[70vh]" : "h-[360px] sm:h-[400px] md:h-[450px] lg:h-[480px]"}`}>
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
              <rect width="960" height="420" fill="#091f35" />
              <rect width="960" height="420" fill="url(#oceanGrid)" />

              {/* Bathymetry Shelf Contours */}
              <path
                d="M 60 80 Q 220 200 240 410 M 380 40 Q 500 240 600 410 M 660 60 Q 750 200 870 390"
                fill="none"
                stroke="#123c64"
                strokeWidth="1"
                strokeDasharray="4 6"
                strokeOpacity="0.4"
              />

              {/* Malaysian Maritime EEZ Boundary (Exclusive Economic Zone) */}
              <path
                d="M 50 25 L 140 15 L 260 85 L 285 190 L 295 330 L 260 415 M 350 390 L 470 270 L 590 210 L 730 145 L 900 85 L 935 165 L 920 330 L 870 415"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.2"
                strokeDasharray="6 4"
                strokeOpacity="0.45"
              />

              {/* ACCURATE MALAYSIA STATE POLYGONS (16 OFFICIAL BOUNDARIES) */}
              <g className="malaysia-states">
                {mapPathsData.states.map((st) => {
                  const isStateHighlighted =
                    selectedSite?.state === st.name || hoveredState === st.name;
                  const isRegionActive =
                    selectedRegion === "all" ||
                    (selectedRegion === "peninsular" && st.region === "peninsular") ||
                    (selectedRegion === "sabah" && st.region === "sabah") ||
                    (selectedRegion === "sarawak" && st.region === "sarawak");

                  return (
                    <path
                      key={st.name}
                      d={st.d}
                      fill={
                        isStateHighlighted
                          ? "#1b4d79"
                          : isRegionActive
                          ? "#0e3153"
                          : "#092037"
                      }
                      stroke={
                        isStateHighlighted
                          ? "#00d2ff"
                          : isRegionActive
                          ? "#1a548a"
                          : "#0d2b4a"
                      }
                      strokeWidth={isStateHighlighted ? 1.6 : 0.8}
                      className="transition-all duration-300 hover:fill-[#154673] cursor-pointer"
                      onMouseEnter={() => setHoveredState(st.name)}
                      onMouseLeave={() => setHoveredState(null)}
                    >
                      <title>{st.name}</title>
                    </path>
                  );
                })}
              </g>

              {/* TASTEFUL STATE CENTROID LABELS FOR PROMINENT STATES */}
              {mapPathsData.states
                .filter((st) =>
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
                .map((st) => {
                  const isRegionActive =
                    selectedRegion === "all" ||
                    (selectedRegion === "peninsular" && st.region === "peninsular") ||
                    (selectedRegion === "sabah" && st.region === "sabah") ||
                    (selectedRegion === "sarawak" && st.region === "sarawak");

                  return (
                    <text
                      key={`lbl-${st.name}`}
                      x={st.cx}
                      y={st.cy}
                      textAnchor="middle"
                      fill="#7dd3fc"
                      fontSize={st.name === "Sabah" || st.name === "Sarawak" ? "11" : "8"}
                      fontWeight="bold"
                      letterSpacing={st.name === "Sabah" || st.name === "Sarawak" ? "2" : "0.5"}
                      opacity={isRegionActive ? (st.name === "Sabah" || st.name === "Sarawak" ? "0.45" : "0.35") : "0.15"}
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
                    const radius = isSevere ? 55 : 38;
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
                const labelX = x + dx;
                const labelY = y + dy;

                return (
                  <g
                    key={site.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedSite(site)}
                    onMouseEnter={() => setHoveredSite(site)}
                    onMouseLeave={() => setHoveredSite(null)}
                  >
                    {/* Directional Leader Line from marker to offset label */}
                    {(Math.abs(dx) > 10 || Math.abs(dy) > 10) && (
                      <line
                        x1={x}
                        y1={y}
                        x2={labelX + (textAnchor === "end" ? 5 : textAnchor === "start" ? -5 : 0)}
                        y2={labelY + 2}
                        stroke={isSelected ? "#00d2ff" : isSevere ? "#f43f5e" : "#fb923c"}
                        strokeWidth={isSelected ? 1.6 : 1.0}
                        strokeOpacity={0.75}
                        strokeDasharray={isSelected ? "none" : "2 2"}
                      />
                    )}

                    {/* Concentric Pulsing Ring for Alert Level 2 */}
                    {isSevere && (
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="1.4"
                        className="animate-ping"
                        style={{ transformOrigin: `${x}px ${y}px`, animationDuration: "2.2s" }}
                      />
                    )}

                    {/* Outer Selection Indicator */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="16"
                        fill="none"
                        stroke="#00d2ff"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        className="animate-spin-slow"
                        style={{ transformOrigin: `${x}px ${y}px` }}
                      />
                    )}

                    {/* Node Core Marker */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? "7.5" : isHovered ? "6.2" : "5.0"}
                      fill={isSevere ? "#f43f5e" : "#fb923c"}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? "2.2" : "1.4"}
                      filter="url(#nodeGlow)"
                      className="transition-all duration-200"
                    />

                    {/* Non-overlapping Site Name */}
                    <text
                      x={labelX}
                      y={labelY - 1}
                      textAnchor={textAnchor}
                      fill={isSelected ? "#00d2ff" : isHovered ? "#ffffff" : "#f8fafc"}
                      fontSize={isSelected ? "11.5" : "10"}
                      fontWeight={isSelected ? "bold" : "600"}
                      className="transition-colors pointer-events-none select-none"
                      style={{
                        paintOrder: "stroke fill",
                        stroke: "#061526",
                        strokeWidth: "3.5px",
                        strokeLinejoin: "round",
                      }}
                    >
                      {site.short_name || site.name}
                    </text>

                    {/* Sub-label: Bleached % • DHW */}
                    <text
                      x={labelX}
                      y={labelY + 10}
                      textAnchor={textAnchor}
                      fill={isSevere ? "#fda4af" : "#fde047"}
                      fontSize="8.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                      style={{
                        paintOrder: "stroke fill",
                        stroke: "#061526",
                        strokeWidth: "2.8px",
                        strokeLinejoin: "round",
                      }}
                    >
                      {site.bleached_pct}% • {site.dhw} DHW
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Footer Legend & Controls Help */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-ocean-700/50 mt-2 px-1">
            <div className="flex items-center space-x-3 text-[10.5px] text-ocean-300">
              <span className="font-semibold text-ocean-400">NOAA Bleaching Alert:</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm animate-ping" />
                <span className="text-rose-300 font-medium">Alert Level 2 (DHW ≥ 8.0)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                <span>Alert Level 1 (DHW 4.0 - 7.9)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm" />
                <span>Watch / Oceanic Refuge</span>
              </div>
            </div>

            <div className="text-[10px] text-ocean-400 font-mono">
              Click any reef node to inspect environmental telemetry
            </div>
          </div>
        </div>

        {/* Site Inspection & Bioeconomic Telemetry Panel (Adaptive 4/3 Cols) */}
        <div className="lg:col-span-4 xl:col-span-3 bg-ocean-950 border border-ocean-700/60 rounded-xl p-3 flex flex-col justify-between shadow-lg">
          {selectedSite ? (
            <div className="space-y-2.5 flex flex-col justify-between h-full">
              {/* Site Header */}
              <div className="pb-2 border-b border-ocean-700/60 flex justify-between items-start">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-1 text-cyan-400 text-[9.5px] font-bold uppercase tracking-wider">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{selectedSite.state} • {selectedSite.region.replace("_", " ").toUpperCase()}</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white mt-0.5 truncate">{selectedSite.name}</h3>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                    selectedSite.dhw >= 8.0
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {selectedSite.alert_level}
                </span>
              </div>

              {/* Environmental Indicators Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-ocean-900 p-2 rounded-lg border border-ocean-700/50">
                  <span className="text-[9px] text-ocean-400 uppercase font-semibold">Bleached Colonies</span>
                  <div className="text-base font-extrabold font-mono text-rose-400 mt-0.5">
                    {selectedSite.bleached_pct}%
                  </div>
                  <div className="w-full bg-ocean-800 h-1 rounded-full mt-1 overflow-hidden">
                    <div className="bg-rose-500 h-full" style={{ width: `${selectedSite.bleached_pct}%` }} />
                  </div>
                </div>

                <div className="bg-ocean-900 p-2 rounded-lg border border-ocean-700/50">
                  <span className="text-[9px] text-ocean-400 uppercase font-semibold">Degree Heating Wks</span>
                  <div className="text-base font-extrabold font-mono text-amber-300 mt-0.5">
                    {selectedSite.dhw} <span className="text-[10px] font-normal text-ocean-400">°C-wks</span>
                  </div>
                  <div className="w-full bg-ocean-800 h-1 rounded-full mt-1 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full"
                      style={{ width: `${Math.min(100, (selectedSite.dhw / 12) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-ocean-900 p-2 rounded-lg border border-ocean-700/50">
                  <span className="text-[9px] text-ocean-400 uppercase font-semibold">SST Anomaly</span>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    +{selectedSite.sst_anomaly.toFixed(1)} °C
                  </div>
                  <span className="text-[9px] text-ocean-400">Above baseline</span>
                </div>

                <div className="bg-ocean-900 p-2 rounded-lg border border-ocean-700/50">
                  <span className="text-[9px] text-ocean-400 uppercase font-semibold">Live Coral Cover</span>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                    {selectedSite.live_coral_cover}%
                  </div>
                  <span className="text-[9px] text-ocean-400">Nursery cover</span>
                </div>
              </div>

              {/* Compact Management Action & Nursery Impact */}
              <div className="bg-ocean-900/90 p-2 rounded-lg border border-ocean-700/50 text-[10.5px] leading-tight space-y-1">
                <div className="flex items-center space-x-1.5 text-rose-300 font-semibold text-[10px]">
                  <ShieldAlert className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>Est. Mortality: {selectedSite.mortality_rate}% • Demersal Nursery Risk</span>
                </div>
                <div className="text-cyan-300 text-[10px] truncate">
                  Action: {selectedSite.management_action}
                </div>
              </div>

              {/* Direct Simulator Link Button */}
              {onOpenSimulator && (
                <button
                  onClick={onOpenSimulator}
                  className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-ocean-950 font-bold py-1.5 px-3 rounded-lg text-[11px] transition-all shadow-cyan-glow"
                >
                  <Sliders className="w-3 h-3 text-ocean-950" />
                  <span>Simulate Quota for {selectedSite.short_name}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 py-16 text-center text-ocean-400">
              <div className="w-11 h-11 rounded-full bg-ocean-900/90 border border-ocean-700/60 flex items-center justify-center mb-2.5 text-cyan-400 shadow-inner">
                <Eye className="w-5 h-5 animate-pulse" />
              </div>
              <p className="text-xs font-semibold text-ocean-200">Reef Telemetry Standby</p>
              <p className="text-[10.5px] text-ocean-400 mt-1 max-w-[210px] leading-relaxed">
                Click any reef node on the map to inspect live satellite telemetry, SST anomaly, and quota impact.
              </p>
            </div>
          )}

          {/* Research Attribution Footer */}
          <div className="pt-2 border-t border-ocean-700/50 text-[9.5px] text-ocean-400 flex items-center justify-between">
            <span>Source: 2024CoralBleachingImpactReportMalaysia.pdf</span>
            <span className="text-cyan-400 font-mono">Reef Check / DoF</span>
          </div>
        </div>
      </div>
    </div>
  );
};

