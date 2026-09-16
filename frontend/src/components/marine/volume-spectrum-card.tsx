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
}

export const VolumeSpectrumCard: React.FC<VolumeSpectrumCardProps> = ({ data }) => {
  const [hoveredBin, setHoveredBin] = useState<number | null>(null);

  return (
    <div className="bg-ocean-850 border border-ocean-700/60 rounded-lg p-5 flex flex-col justify-between shadow-ocean-glow relative">
      {/* Header with Dropdown */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-ocean-200">
            {data.title}
          </span>
          <button className="flex items-center space-x-1 text-xs text-ocean-400 hover:text-white transition-colors">
            <span>{data.period}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Spectrum Colored Rectangular Blocks (Matching Reference Screenshot) */}
      <div className="my-auto py-6">
        <div className="grid grid-cols-6 gap-2 sm:gap-3 h-24 sm:h-28 w-full items-stretch">
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
