"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChevronDown, BarChart3 } from "lucide-react";

interface HeroKPIChartProps {
  data: {
    title: string;
    period: string;
    value: string | number;
    change_percentage: string;
    compare_text: string;
    time_series: Array<{
      date: string;
      current: number;
      compare: number;
    }>;
  };
  allTrajectories?: {
    total_tourists: Array<{ date: string; current: number; compare: number }>;
    marine_park_visitors: Array<{ date: string; current: number; compare: number }>;
    seafood_landings: Array<{ date: string; current: number; compare: number }>;
  };
  selectedYear?: number;
  totalTouristsVal?: string;
  marineParkVal?: string;
  seafoodVal?: string;
  growthYoY?: string;
  compareYearText?: string;
}

export const HeroKPIChart: React.FC<HeroKPIChartProps> = ({
  data,
  allTrajectories,
  totalTouristsVal,
  marineParkVal,
  seafoodVal,
  growthYoY,
  compareYearText,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<"total_tourists" | "marine_park_visitors" | "seafood_landings">(
    "total_tourists"
  );

  const metricConfigs = {
    total_tourists: {
      label: "Total Tourist Arrivals",
      unit: "M Visitors",
      color: "#00d2ff",
      gradientId: "cyanOceanGlow",
      ticks: [0, 25, 50, 75, 100],
      formatter: (v: number) => `${v}M`,
    },
    marine_park_visitors: {
      label: "Marine Park Footfall",
      unit: "M Visitors",
      color: "#34d399",
      gradientId: "emeraldGlow",
      ticks: [0, 8, 16, 24, 32],
      formatter: (v: number) => `${v}M`,
    },
    seafood_landings: {
      label: "Coastal Fish Landings",
      unit: "k Metric Tonnes",
      color: "#38bdf8",
      gradientId: "blueGlow",
      ticks: [0, 100, 200, 300, 400, 500],
      formatter: (v: number) => `${v}k`,
    },
  };

  const activeConfig = metricConfigs[selectedMetric];
  const chartData = allTrajectories ? allTrajectories[selectedMetric] : data.time_series;

  // Dynamic value display depending on selected metric
  let displayValue = totalTouristsVal || data.value;
  let displayChange = growthYoY || data.change_percentage;
  let displayCompare = compareYearText || data.compare_text;
  let displayTitle = data.title;

  if (selectedMetric === "marine_park_visitors") {
    displayValue = marineParkVal || "24.4M";
    displayChange = "▲ +7.5%";
    displayCompare = "Marine Protected Parks";
    displayTitle = "MARINE PARK ECO-FOOTFALL";
  } else if (selectedMetric === "seafood_landings") {
    displayValue = seafoodVal || "382.3k MT";
    displayChange = "▶ -0.8%";
    displayCompare = "DOF Landing Registry";
    displayTitle = "COASTAL SEAFOOD LANDINGS";
  }

  return (
    <div className="bg-ocean-850 border border-ocean-700/60 rounded-lg p-5 flex flex-col justify-between relative shadow-ocean-glow overflow-hidden h-full">
      {/* Header & Interactive Metric Switcher */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-ocean-200">
            {displayTitle}
          </span>

          {/* Interactive Metric Switcher Dropdown */}
          <div className="relative">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="bg-ocean-800 text-cyan-300 text-xs font-semibold py-1 px-2.5 rounded border border-ocean-700 focus:outline-none cursor-pointer"
            >
              <option value="total_tourists">Arrivals (M)</option>
              <option value="marine_park_visitors">Park Visitors (M)</option>
              <option value="seafood_landings">Seafood (k MT)</option>
            </select>
          </div>
        </div>

        {/* Hero Value & Delta */}
        <div className="mt-2 flex items-baseline space-x-3">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
            {displayValue}
          </span>
          <div className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold">
            <span>{displayChange}</span>
            <span className="text-ocean-400 font-normal">({displayCompare})</span>
          </div>
        </div>
      </div>

      {/* Embedded Glowing Area Chart */}
      <div className="h-44 w-full mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cyanOceanGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d2ff" stopOpacity={0.4} />
                <stop offset="90%" stopColor="#00d2ff" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="emeraldGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                <stop offset="90%" stopColor="#34d399" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="90%" stopColor="#38bdf8" stopOpacity={0.0} />
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
              ticks={activeConfig.ticks}
              tickFormatter={activeConfig.formatter}
            />
            <Tooltip
              formatter={(val: any) => [`${val} ${activeConfig.unit}`, activeConfig.label]}
              contentStyle={{
                backgroundColor: "#0c2844",
                borderRadius: "6px",
                border: "1px solid #164775",
                fontSize: "12px",
                color: "#ffffff",
              }}
              labelStyle={{ color: "#7dd3fc" }}
            />

            {/* Baseline comparison */}
            <Area
              type="monotone"
              dataKey="compare"
              stroke="#6b9cb8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#compareGlow)"
            />

            {/* Selected Metric Area */}
            <Area
              type="monotone"
              dataKey="current"
              stroke={activeConfig.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${activeConfig.gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-between text-[11px] text-ocean-300 mt-2 pt-2 border-t border-ocean-700/40">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: activeConfig.color }} />
          <span>{activeConfig.label} ({activeConfig.unit})</span>
        </div>
        <div className="flex items-center space-x-1.5 text-ocean-400">
          <span className="w-3 h-0.5 border-t border-dashed border-[#6b9cb8]" />
          <span>Baseline Benchmark</span>
        </div>
      </div>
    </div>
  );
};
