"use client";

import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ChevronDown } from "lucide-react";

interface DonutSegment {
  name: string;
  percentage: number;
  color: string;
  count: number;
}

interface DonutBreakdownCardProps {
  data: {
    title: string;
    period: string;
    total: number | string;
    total_formatted?: string;
    total_label?: string;
    segments: DonutSegment[];
  };
}

export const DonutBreakdownCard: React.FC<DonutBreakdownCardProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayTotal = data.total_formatted || String(data.total);

  // Split segments into left and right callout columns matching the image layout
  const midPoint = Math.ceil(data.segments.length / 2);
  const leftSegments = data.segments.slice(midPoint);
  const rightSegments = data.segments.slice(0, midPoint);

  return (
    <div className="bg-ocean-850 border border-ocean-700/60 rounded-lg p-5 flex flex-col justify-between shadow-ocean-glow relative">
      {/* Header with Dropdown */}
      <div className="flex items-center justify-between pb-2">
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

      {/* Donut Chart & Callout Breakdown Grid (Matching Reference Screenshot) */}
      <div className="grid grid-cols-12 items-center my-auto py-2">
        {/* Left Side Callouts */}
        <div className="col-span-3 space-y-1.5 text-right pr-2">
          {leftSegments.map((item, idx) => (
            <div
              key={item.name}
              className="text-[11px] leading-tight transition-colors cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(midPoint + idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="text-ocean-400 group-hover:text-white truncate font-medium">
                {item.name.split(" (")[0]}
              </div>
              <div className="text-ocean-200 font-mono text-[10px] font-semibold flex items-center justify-end space-x-1">
                <span>{item.percentage.toFixed(1)}%</span>
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Center Donut Chart with Centered Total */}
        <div className="col-span-6 relative flex items-center justify-center h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.segments}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={68}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
                stroke="#0e3153"
                strokeWidth={2}
              >
                {data.segments.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
                    className="transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: any, name: any) => [`${val}%`, name]}
                contentStyle={{
                  backgroundColor: "#081d33",
                  borderRadius: "6px",
                  border: "1px solid #164775",
                  fontSize: "12px",
                  color: "#ffffff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Text inside Donut Hole */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-mono">
              {displayTotal}
            </span>
            <span className="text-[10px] uppercase font-semibold text-ocean-400 tracking-wider">
              {data.total_label || "Total"}
            </span>
          </div>
        </div>

        {/* Right Side Callouts */}
        <div className="col-span-3 space-y-1.5 text-left pl-2">
          {rightSegments.map((item, idx) => (
            <div
              key={item.name}
              className="text-[11px] leading-tight transition-colors cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="text-ocean-400 group-hover:text-white truncate font-medium">
                {item.name.split(" (")[0]}
              </div>
              <div className="text-ocean-200 font-mono text-[10px] font-semibold flex items-center space-x-1">
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Status / Subtle indicator */}
      <div className="flex items-center justify-between text-[11px] text-ocean-400 pt-2 border-t border-ocean-700/40">
        <span>Active Categories: {data.segments.length}</span>
        <span className="text-[10px] font-mono text-ocean-300">DOSM Marine 2026</span>
      </div>
    </div>
  );
};
