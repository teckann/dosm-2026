"use client";

import React from "react";
import { Sliders, Calendar, MapPin, Waves, RefreshCcw } from "lucide-react";

interface MarineHeaderProps {
  years: number[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
  regions: string[];
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  onOpenSimulator: () => void;
  onResetFilters: () => void;
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
}) => {
  return (
    <header className="border-b border-ocean-700/60 bg-ocean-950/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-cyan-glow">
            <Waves className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white tracking-tight text-base sm:text-lg">
                DOSM MARINE TOURISM INTELLIGENCE
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                SDG 14 • Marine Tourism
              </span>
            </div>
            <p className="text-[11px] text-ocean-300">
              Predictive Modeling of Marine Tourism Demand, Visitor Influx & Ecological Carrying Capacity
            </p>
          </div>
        </div>

        {/* Interactive Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Year Dropdown Selector */}
          <div className="flex items-center space-x-1.5 bg-ocean-850 border border-ocean-700/70 px-2.5 py-1.5 rounded-lg text-xs text-ocean-200">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-ocean-400 font-semibold uppercase">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => onSelectYear(Number(e.target.value))}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-ocean-900 text-white">
                  {y} {y === 2024 ? "(Latest)" : y === 2019 ? "(Pre-Pandemic)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Region Dropdown Selector */}
          <div className="flex items-center space-x-1.5 bg-ocean-850 border border-ocean-700/70 px-2.5 py-1.5 rounded-lg text-xs text-ocean-200">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-ocean-400 font-semibold uppercase">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => onSelectRegion(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
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
              className="p-1.5 rounded-lg bg-ocean-800 hover:bg-ocean-700 text-ocean-300 hover:text-white transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Carrying Capacity Simulator Modal Trigger */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-ocean-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-cyan-glow"
          >
            <Sliders className="w-3.5 h-3.5 text-ocean-950" />
            <span>AI Capacity Simulator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
