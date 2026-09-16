"use client";

import React from "react";
import { ChevronDown, Anchor, Users } from "lucide-react";

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
}

export const StackedKPICard: React.FC<StackedKPICardProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top Box: Total Volume / Conversations */}
      <div className="bg-ocean-850 border border-ocean-700/60 rounded-lg p-5 flex-1 flex flex-col justify-between shadow-ocean-glow">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ocean-200">
              {data.total_volume.title}
            </span>
            <button className="flex items-center space-x-1 text-xs text-ocean-400 hover:text-white transition-colors">
              <span>{data.total_volume.period}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
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
          Metric Tonnes (MT) Cumulative
        </div>
      </div>

      {/* Bottom Box: Active People / Vessels */}
      <div className="bg-ocean-850 border border-ocean-700/60 rounded-lg p-5 flex-1 flex flex-col justify-between shadow-ocean-glow">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ocean-200">
              {data.active_fleet.title}
            </span>
            <button className="flex items-center space-x-1 text-xs text-ocean-400 hover:text-white transition-colors">
              <span>{data.active_fleet.period}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="my-auto py-2 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-ocean-800 border border-ocean-700 flex items-center justify-center text-ocean-400">
            <Anchor className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
            {data.active_fleet.value}
          </div>
        </div>

        <div className="text-[11px] text-ocean-400 pt-2 border-t border-ocean-700/40">
          Verified Maritime Vessels in Waters
        </div>
      </div>
    </div>
  );
};
