"use client";

import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export interface DonutSegment {
  name: string;
  percentage: number;
  color: string;
  count?: number;
  amount_b?: number;
}

const DonutHoverCard = ({ segment }: { segment: DonutSegment }) => {
  return (
    <div className="pointer-events-none absolute left-1/2 top-10 z-50 min-w-[170px] max-w-[85%] -translate-x-1/2 rounded-lg border border-cyan-300 bg-ocean-950 px-3 py-2 text-white shadow-2xl shadow-black">
      <div className="text-[11px] font-bold leading-tight text-white">
        {segment.name}
      </div>
      <div className="mt-1 flex items-center justify-between gap-4 text-[11px] text-white">
        <span>Share</span>
        <span className="font-mono font-bold text-white">
          {segment.percentage.toFixed(1)}%
        </span>
      </div>
      {segment.amount_b !== undefined && (
        <div className="mt-0.5 flex items-center justify-between gap-4 text-[10px] text-white">
          <span>Expenditure</span>
          <span className="font-mono font-semibold text-white">
            RM {segment.amount_b.toFixed(2)}B
          </span>
        </div>
      )}
      {segment.count !== undefined && (
        <div className="mt-0.5 flex items-center justify-between gap-4 text-[10px] text-white">
          <span>Visitors</span>
          <span className="font-mono font-semibold text-white">
            {segment.count.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

interface DonutBreakdownCardProps {
  data: {
    title: string;
    period: string;
    total: number | string;
    total_formatted?: string;
    total_label?: string;
    segments: DonutSegment[];
  };
  variant?: "compact" | "detailed";
  className?: string;
}

export const DonutBreakdownCard: React.FC<DonutBreakdownCardProps> = ({
  data,
  variant = "compact",
  className = "",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayTotal = data.total_formatted || String(data.total);

  // Split segments into left and right callout columns
  const midPoint = Math.ceil(data.segments.length / 2);
  const leftSegments = data.segments.slice(midPoint);
  const rightSegments = data.segments.slice(0, midPoint);

  return (
    <div
      className={`bg-ocean-850 border border-ocean-700/60 rounded-xl p-3 flex flex-col shadow-ocean-glow relative h-full overflow-hidden panel ${className}`}
    >
      {/* Header reflects the filters controlled by the dashboard header */}
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-ocean-200">
          {data.title}
        </span>
        <span className="text-xs text-ocean-400 font-semibold">{data.period}</span>
      </div>

      {hoveredIndex !== null && data.segments[hoveredIndex] && (
        <DonutHoverCard segment={data.segments[hoveredIndex]} />
      )}

      {variant === "detailed" ? (
        /* Detailed Layout with Donut + Spend Allocation Progress Bars */
        <div className="flex flex-col gap-3 my-auto py-1">
          {/* Top Section: Donut with Callouts */}
          <div className="grid grid-cols-12 items-center gap-1">
            {/* Left Side Callouts */}
            <div className="col-span-4 space-y-1 text-right pr-1">
              {leftSegments.map((item, idx) => (
                <div
                  key={item.name}
                  className="text-[11px] leading-tight transition-colors cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(midPoint + idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="text-ocean-300 group-hover:text-white truncate font-medium">
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

            {/* Center Donut Chart */}
            <div className="col-span-4 relative flex items-center justify-center h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.segments}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    startAngle={90}
                    endAngle={-270}
                    stroke="#0e3153"
                    strokeWidth={2}
                    onMouseEnter={(_, index) => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
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
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Total Text inside Donut Hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base sm:text-lg font-extrabold text-white tracking-tight font-mono">
                  {displayTotal}
                </span>
                <span className="text-[9px] uppercase font-semibold text-ocean-400 tracking-wider">
                  {data.total_label || "Total"}
                </span>
              </div>
            </div>

            {/* Right Side Callouts */}
            <div className="col-span-4 space-y-1 text-left pl-1">
              {rightSegments.map((item, idx) => (
                <div
                  key={item.name}
                  className="text-[11px] leading-tight transition-colors cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="text-ocean-300 group-hover:text-white truncate font-medium">
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

          {/* Bottom Section: Detailed Category Progress Bars */}
          <div className="space-y-2 pt-2 border-t border-ocean-700/40">
            {data.segments.slice(0, 4).map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-ocean-300 font-medium truncate flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <div className="flex items-center space-x-2 shrink-0">
                    {item.amount_b ? (
                      <span className="font-mono text-cyan-300 font-semibold">
                        RM {item.amount_b.toFixed(1)}B
                      </span>
                    ) : item.count ? (
                      <span className="font-mono text-cyan-300 font-semibold">
                        {(item.count / 1000000).toFixed(1)}M
                      </span>
                    ) : null}
                    <span className="text-ocean-400 font-mono text-[10px]">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-ocean-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Compact Standard Layout (for Marine Park Allocation in Row 3) */
        <div className="grid grid-cols-12 items-center my-auto py-1">
          {/* Left Side Callouts */}
          <div className="col-span-4 space-y-1 text-right pr-1">
            {leftSegments.map((item, idx) => (
              <div
                key={item.name}
                className="text-[10px] leading-tight transition-colors cursor-pointer group"
                onMouseEnter={() => setHoveredIndex(midPoint + idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="text-ocean-300 group-hover:text-white truncate font-medium">
                  {item.name.split(" (")[0]}
                </div>
                <div className="text-ocean-200 font-mono text-[9px] font-semibold flex items-center justify-end space-x-1">
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
          <div className="col-span-4 relative flex items-center justify-center h-28 sm:h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.segments}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={54}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                  stroke="#0e3153"
                  strokeWidth={2}
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
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
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Total Text inside Donut Hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-base sm:text-lg font-extrabold text-white tracking-tight font-mono">
                {displayTotal}
              </span>
              <span className="text-[9px] uppercase font-semibold text-ocean-400 tracking-wider">
                {data.total_label || "Total"}
              </span>
            </div>
          </div>

          {/* Right Side Callouts */}
          <div className="col-span-4 space-y-1 text-left pl-1">
            {rightSegments.map((item, idx) => (
              <div
                key={item.name}
                className="text-[10px] leading-tight transition-colors cursor-pointer group"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="text-ocean-300 group-hover:text-white truncate font-medium">
                  {item.name.split(" (")[0]}
                </div>
                <div className="text-ocean-200 font-mono text-[9px] font-semibold flex items-center space-x-1">
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
      )}

      {/* Footer Status */}
      <div className="flex items-center justify-between text-[11px] text-ocean-400 pt-2 border-t border-ocean-700/40">
        <span>Active Categories: {data.segments.length}</span>
        <span className="text-[10px] font-mono text-ocean-300">DOSM Marine 2026</span>
      </div>
    </div>
  );
};
