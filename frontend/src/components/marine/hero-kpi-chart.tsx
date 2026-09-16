"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChevronDown } from "lucide-react";

interface HeroKPIChartProps {
  data: {
    title: string;
    period: string;
    value: number;
    change_percentage: string;
    compare_text: string;
    time_series: Array<{
      date: string;
      current: number;
      compare: number;
    }>;
  };
}

export const HeroKPIChart: React.FC<HeroKPIChartProps> = ({ data }) => {
  return (
    <div className="bg-ocean-850 border border-ocean-700/60 rounded-lg p-5 flex flex-col justify-between relative shadow-ocean-glow overflow-hidden">
      {/* Header & Dropdown */}
      <div>
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

        {/* Hero Value & Delta */}
        <div className="mt-2 flex items-baseline space-x-3">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
            {data.value}
          </span>
          <div className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold">
            <span>{data.change_percentage}</span>
            <span className="text-ocean-400 font-normal">({data.compare_text})</span>
          </div>
        </div>
      </div>

      {/* Embedded Glowing Area Chart */}
      <div className="h-44 w-full mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.time_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cyanOceanGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d2ff" stopOpacity={0.4} />
                <stop offset="90%" stopColor="#00d2ff" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="compareGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5f8ea8" stopOpacity={0.25} />
                <stop offset="90%" stopColor="#5f8ea8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              stroke="#6488a4"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={5}
            />
            <YAxis
              stroke="#6488a4"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              ticks={[0, 20, 40, 60, 80]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0c2844",
                borderRadius: "6px",
                border: "1px solid #164775",
                fontSize: "12px",
                color: "#ffffff",
              }}
              labelStyle={{ color: "#7dd3fc" }}
            />

            {/* Compare Period (Dashed Line & Muted Fill) */}
            <Area
              type="monotone"
              dataKey="compare"
              stroke="#6b9cb8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#compareGlow)"
            />

            {/* Current Period (Glowing Solid Cyan Line) */}
            <Area
              type="monotone"
              dataKey="current"
              stroke="#00d2ff"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#cyanOceanGlow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Footer matching reference */}
      <div className="flex items-center space-x-4 text-[11px] text-ocean-300 mt-2 pt-2 border-t border-ocean-700/40">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-0.5 bg-[#00d2ff]" />
          <span>New catch volume</span>
        </div>
        <div className="flex items-center space-x-1.5 text-ocean-400">
          <span className="w-3 h-0.5 border-t border-dashed border-[#6b9cb8]" />
          <span>Compare period (Jan 1 - 5)</span>
        </div>
      </div>
    </div>
  );
};
