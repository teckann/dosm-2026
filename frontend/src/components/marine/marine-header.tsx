"use client";

import React from "react";
import { Compass, Sparkles, Sliders, Calendar, ChevronDown } from "lucide-react";

interface MarineHeaderProps {
  onOpenSimulator: () => void;
}

export const MarineHeader: React.FC<MarineHeaderProps> = ({ onOpenSimulator }) => {
  return (
    <header className="border-b border-ocean-700/60 bg-ocean-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-cyan-glow">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white tracking-tight text-base sm:text-lg">
                DOSM MARINE INTELLIGENCE
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Blue Economy 2026
              </span>
            </div>
            <p className="text-[11px] text-ocean-400">
              Department of Statistics Malaysia • Fisheries & Ocean Resource Surveillance
            </p>
          </div>
        </div>

        {/* Action Controls & Simulator Toggle */}
        <div className="flex items-center space-x-3">
          {/* Date Selector */}
          <div className="flex items-center space-x-1.5 bg-ocean-850 border border-ocean-700/60 px-3 py-1.5 rounded-lg text-xs text-ocean-200">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Month to Date (Feb 1 - 5)</span>
            <ChevronDown className="w-3 h-3 text-ocean-400" />
          </div>

          {/* Policy Simulator Modal Trigger */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-ocean-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-cyan-glow"
          >
            <Sliders className="w-3.5 h-3.5 text-ocean-950" />
            <span>ML Quota Simulator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
