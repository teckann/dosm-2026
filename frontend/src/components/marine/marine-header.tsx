"use client";

import React from "react";
import { Sliders, Calendar, MapPin, Waves, RefreshCcw, Flame } from "lucide-react";
import coralBleachingData from "@/data/coral_bleaching.json";

interface MarineHeaderProps {
  years: number[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
  regions: string[];
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  onOpenSimulator: () => void;
  onResetFilters: () => void;
  activeView?: "overview" | "coral_map";
  setActiveView?: (view: "overview" | "coral_map") => void;
}

export const MarineHeader: React.FC<MarineHeaderProps> = ({
  years,
  selectedYear,
  onSelectYear,
  regions,
  selectedRegion,
  onSelectRegion,
  onOpenSimulator,
  onResetFilters,
  activeView = "overview",
  setActiveView,
}) => {
  return (
    <header className="border-b border-ocean-700/60 bg-ocean-950/90 backdrop-blur-md z-40 shadow-sm h-full flex items-center">
      <div className="w-full px-3 sm:px-4 flex items-center justify-between gap-2 overflow-hidden">
        {/* Brand & Title */}
        <div className="flex items-center space-x-2.5 min-w-0 shrink">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-cyan-glow shrink-0">
            <Waves className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="flex items-center space-x-2 min-w-0">
            <span className="font-extrabold text-white tracking-tight text-xs sm:text-sm xl:text-base shrink-0">
              MALAYSIA BLUE HARMONY
            </span>
            <span className="hidden md:inline text-ocean-300 text-[11px] lg:text-xs font-medium truncate">
              — Tourism Growth and Marine Preservation Dashboard
            </span>
            <span className="hidden 2xl:inline-flex bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              SDG 14 • Marine
            </span>
            {coralBleachingData && (
              <span className="hidden 2xl:inline-flex items-center space-x-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                <Flame className="w-3 h-3 text-rose-400 animate-pulse" />
                <span>Bleaching Alert Level 2 ({coralBleachingData.average_bleaching_pct}%)</span>
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs & Interactive Filters Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap">
          {/* Year Dropdown Selector */}
          <div className="flex items-center space-x-1 bg-ocean-850 border border-ocean-700/70 px-2 py-1 rounded-lg text-xs text-ocean-200">
            <Calendar className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline text-[9px] text-ocean-400 font-semibold uppercase">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => onSelectYear(Number(e.target.value))}
              className="bg-transparent text-white font-bold text-[11px] sm:text-xs focus:outline-none cursor-pointer pr-0.5"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-ocean-900 text-white">
                  {y} {y === 2024 ? "(Latest)" : y === 2019 ? "(Pre-Pandemic)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Region Dropdown Selector */}
          <div className="flex items-center space-x-1 bg-ocean-850 border border-ocean-700/70 px-2 py-1 rounded-lg text-xs text-ocean-200">
            <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline text-[9px] text-ocean-400 font-semibold uppercase">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => onSelectRegion(e.target.value)}
              className="bg-transparent text-white font-bold text-[11px] sm:text-xs focus:outline-none cursor-pointer pr-0.5"
            >
              {regions.map((r) => (
                <option key={r} value={r} className="bg-ocean-900 text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          {(selectedYear !== 2024 || selectedRegion !== "All Regions") && (
            <button
              onClick={onResetFilters}
              title="Reset to 2024 All Regions"
              className="p-1 sm:p-1.5 rounded-lg bg-ocean-800 hover:bg-ocean-700 text-ocean-300 hover:text-white transition-colors"
            >
              <RefreshCcw className="w-3 h-3" />
            </button>
          )}

          {/* Carrying Capacity Simulator Modal Trigger */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center space-x-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-ocean-950 font-bold px-2.5 sm:px-3 py-1 rounded-lg text-xs transition-all shadow-cyan-glow shrink-0"
          >
            <Sliders className="w-3 h-3 text-ocean-950" />
            <span className="hidden sm:inline">AI </span><span>Simulator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
