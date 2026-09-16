"use client";

import React from "react";
import { ChevronDown, BedDouble, DollarSign } from "lucide-react";

interface StackedKPICardProps {
  data: {
    total_volume: {
      title: string;
      period: string;
      value: string;
      change: string;
      compare_value: string;
    };
    active_fleet: {
      title: string;
      period: string;
      value: string;
      unit?: string;
    };
  };
  years?: number[];
  selectedYear?: number;
  onSelectYear?: (year: number) => void;
}

export const StackedKPICard: React.FC<StackedKPICardProps> = ({
  data,
  years,
  selectedYear,
  onSelectYear,
}) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top Box: Total Expenditure */}
      <div className="bg-ocean-850 border border-ocean-700/60 rounded-lg p-5 flex-1 flex flex-col justify-between shadow-ocean-glow">
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-ocean-200">
            {data.total_volume.title}
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
                    {y} DOSM DTS Data
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 pointer-events-none" />
            </div>
          ) : (
            <span className="text-xs text-ocean-400 font-semibold">{data.total_volume.period}</span>
          )}
        </div>

        <div className="my-auto py-2">
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
            {data.total_volume.value}
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold">
            <span>{data.total_volume.change}</span>
            <span className="text-ocean-400 font-normal">Compare: {data.total_volume.compare_value}</span>
          </div>
        </div>

        <div className="text-[11px] text-ocean-400 pt-2 border-t border-ocean-700/40">
          Annual Coastal Tourist Spending (DOSM Tourism Benchmark)
        </div>
      </div>

      {/* Bottom Box: Total Visitor Nights */}
      <div className="bg-ocean-850 border border-ocean-700/60 rounded-lg p-5 flex-1 flex flex-col justify-between shadow-ocean-glow">
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-ocean-200">
            {data.active_fleet.title}
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
                    {y} Island & Coastal Stays
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-cyan-400 absolute right-1.5 pointer-events-none" />
            </div>
          ) : (
            <span className="text-xs text-ocean-400 font-semibold">{data.active_fleet.period}</span>
          )}
        </div>

        <div className="my-auto py-2 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-ocean-800 border border-ocean-700 flex items-center justify-center text-cyan-400">
            <BedDouble className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
            {data.active_fleet.value}
          </div>
        </div>

        <div className="text-[11px] text-ocean-400 pt-2 border-t border-ocean-700/40">
          Cumulative Guest Stays in Island & Coastal Destinations
        </div>
      </div>
    </div>
  );
};
