"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Flame,
  ShieldAlert,
  Layers,
  MapPin,
  ChevronDown,
  Info,
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

// Dynamically parse authentic reef telemetry from coral_bleaching.json contract
const getSitesFromContract = (): ReefSite[] => {
  const rawSites = (coralBleachingData as any)?.affected_marine_parks || [];
  return rawSites.map((site: any) => {
    const dhwVal = Number(site.dhw ?? site.peak_dhw ?? 0);
    const alertLevel: ReefSite["alert_level"] =
      site.alert_level || (dhwVal >= 8.0 ? "Alert Level 2" : dhwVal >= 4.0 ? "Alert Level 1" : "Watch");

    return {
      id: site.id || site.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      name: site.name,
      short_name: site.short_name || site.name.replace("Pulau ", "P. "),
      state: site.state,
      region: (site.region ||
        (site.state === "Sabah"
          ? "sabah"
          : site.state === "Sarawak"
          ? "sarawak"
          : site.state === "Kedah"
          ? "peninsular_west"
          : "peninsular_east")) as ReefSite["region"],
      lat: Number(site.lat),
      lng: Number(site.lng),
      bleached_pct: Number(site.bleached_pct ?? site.bleached_percentage ?? 0),
      dhw: dhwVal,
      sst_anomaly: Number(site.sst_anomaly ?? (coralBleachingData as any)?.sea_surface_temperature_anomaly_c ?? 1.5),
      alert_level: alertLevel,
      live_coral_cover: Number(site.live_coral_cover ?? 40.0),
      mortality_rate: Number(site.mortality_rate ?? 20.0),
      status: site.status || (dhwVal >= 8.0 ? "Severe Bleaching" : "Moderate Bleaching"),
      management_action: site.management_action || "Continuous monitoring active",
      dx: Number(site.dx ?? 14),
      dy: Number(site.dy ?? 0),
      textAnchor: (site.textAnchor || "start") as ReefSite["textAnchor"],
    };
  });
};

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

  const sites = useMemo<ReefSite[]>(() => getSitesFromContract(), []);

  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
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
  }, [sites, selectedRegion, severityFilter]);

  // Key Aggregates derived dynamically from authentic coral data contract
  const totalSites = sites.length;
  const severeSitesCount = sites.filter((s) => s.dhw >= 8.0).length;
  const nationalBleachAvg = (
    (coralBleachingData as any)?.average_bleaching_pct ??
    (sites.reduce((acc, s) => acc + s.bleached_pct, 0) / (totalSites || 1))
  ).toFixed(1);
  const peakDHW = (coralBleachingData as any)?.degree_heating_weeks_dhw ?? Math.max(...sites.map((s) => s.dhw), 0);
  const alertLevelLabel = (coralBleachingData as any)?.noaa_alert_level?.includes("Alert Level 2") ? "Alert 2" : "Alert 1";
  const sourceDocName = (coralBleachingData as any)?.source_document || "Reef Check Malaysia 2024";

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
    <div className="bg-ocean-850 border border-ocean-700/60 rounded-xl shadow-ocean-glow relative h-full overflow-hidden panel flex flex-col p-0">
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
              {alertLevelLabel}
            </span>
            <span className="text-ocean-700 hidden sm:inline">•</span>
            <span className="hidden xl:inline text-[9px] text-cyan-400/90 font-mono tracking-tight truncate max-w-[170px]" title={sourceDocName}>
              {sourceDocName.replace(".pdf", "")}
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
