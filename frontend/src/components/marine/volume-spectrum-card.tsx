"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface VolumeSpectrumCardProps {
  data: {
    title: string;
    period: string;
    bins: Array<{
      id: number;
      color: string;
      label: string;
      value: number;
    }>;
    legend_min: string;
    legend_max: string;
  };
  years?: number[];
  selectedYear?: number;
  onSelectYear?: (year: number) => void;
  selectedRegion?: string;
}

export const VolumeSpectrumCard: React.FC<VolumeSpectrumCardProps> = ({
  data,
  years,
  selectedYear,
  onSelectYear,
  selectedRegion,
}) => {
  const [hoveredBin, setHoveredBin] = useState<number | null>(null);

  return (
    <div className="bg-ocean-850 border border-ocean-700/60 rounded-lg p-5 flex flex-col justify-between shadow-ocean-glow relative">
      {/* Header with Interactive Dropdown */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-ocean-200">
          {data.title}
        </span>

        {years && onSelectYear && selectedYear ? (
          <div className="relative flex items-center">
            <select
              value={selectedYear}
              onChange={(e) => onSelectYear(Number(e.target.value))}
              className="appearance-none bg-ocean-800/90 hover:bg-ocean-750 text-cyan-300 hover:text-white font-semibold text-[11px] sm:text-xs py-1 pl-2.5 pr-6 rounded border border-ocean-700/80 hover:border-cyan-500/50 focus:outline-none cursor-pointer transition-all shadow-sm"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-ocean-900 text-white">
                  {y} {selectedRegion || "All Regions"} (k MT)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 pointer-events-none" />
          </div>
        ) : (
          <span className="text-xs text-ocean-400 font-semibold">{data.period}</span>
        )}
      </div>

      {/* Spectrum Colored Rectangular Blocks (Matching Reference Screenshot) */}
      <div className="my-auto py-6">
        <div
          className="grid gap-2 sm:gap-3 h-24 sm:h-28 w-full items-stretch"
          style={{ gridTemplateColumns: `repeat(${Math.max(data.bins.length, 1)}, minmax(0, 1fr))` }}
        >
          {data.bins.map((bin) => (
            <div
              key={bin.id}
              onMouseEnter={() => setHoveredBin(bin.id)}
              onMouseLeave={() => setHoveredBin(null)}
              style={{ backgroundColor: bin.color }}
              className="rounded-sm transition-all duration-200 hover:scale-105 hover:brightness-110 cursor-pointer shadow-sm relative group flex items-end justify-center pb-2"
            >
              {/* Tooltip on Hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-ocean-950 text-white text-[11px] px-2 py-0.5 rounded border border-ocean-600 whitespace-nowrap z-20 pointer-events-none">
                {bin.label}: {bin.value} MT
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend Footer (Matching Reference Screenshot) */}
      <div className="flex items-center justify-between text-[11px] text-ocean-400 pt-2 border-t border-ocean-700/40">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 bg-[#0e3153] border border-ocean-600 rounded-xs inline-block" />
          <span>{data.legend_min}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-ocean-400">12</span>
          <div className="w-24 h-2 rounded-full bg-gradient-to-r from-[#cbf1f5] via-[#30b6d4] to-[#0d5578]" />
          <span className="text-[10px] font-mono text-ocean-400">75</span>
        </div>
      </div>
    </div>
  );
};
