"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Users, Globe } from "lucide-react";

interface VisitorSplitEntry {
  year: string;
  domestic_m: number;
  international_m: number;
  total_m: number;
  domestic_pct: number;
  international_pct: number;
}

interface VisitorSplitChartProps {
  data: VisitorSplitEntry[];
  selectedYear?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const dom = payload.find((p: any) => p.dataKey === "domestic_m");
  const intl = payload.find((p: any) => p.dataKey === "international_m");
  return (
    <div className="bg-ocean-900 border border-ocean-700 rounded-lg p-2.5 text-xs shadow-ocean-glow">
      <p className="text-cyan-300 font-bold mb-1.5">{label}</p>
      {dom && (
        <div className="flex items-center gap-2 text-teal-300">
          <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
          Domestic: <span className="font-mono font-bold ml-auto pl-3">{dom.value}M</span>
        </div>
      )}
      {intl && (
        <div className="flex items-center gap-2 text-cyan-300 mt-0.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
          International: <span className="font-mono font-bold ml-auto pl-3">{intl.value}M</span>
        </div>
      )}
      {dom && intl && (
        <div className="text-ocean-300 mt-1 border-t border-ocean-700/40 pt-1">
          Total: <span className="font-mono font-bold text-white">{(dom.value + intl.value).toFixed(1)}M</span>
        </div>
      )}
    </div>
  );
};

export const VisitorSplitChart: React.FC<VisitorSplitChartProps> = ({
  data,
  selectedYear,
}) => {
  // Highlight selected year bar
  const highlightedData = data.map((d) => ({
    ...d,
    highlight: selectedYear ? String(selectedYear) === d.year : false,
  }));

  const latestYear = data[data.length - 1];
  const prevYear = data[data.length - 2];
  const intlGrowth =
    prevYear && prevYear.international_m > 0
      ? (((latestYear.international_m - prevYear.international_m) / prevYear.international_m) * 100).toFixed(1)
      : null;

  return (
    <div className="bg-ocean-850 border border-ocean-700/60 rounded-xl p-3 flex flex-col shadow-ocean-glow h-full overflow-hidden panel">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-200">
            Visitor Origin Split
          </span>
          <p className="text-[9px] text-ocean-400 mt-0.5">Domestic vs International • 2019–2024</p>
        </div>
        <div className="flex items-center gap-3 text-[9px]">
          <div className="flex items-center gap-1 text-teal-300">
            <Users className="w-2.5 h-2.5" />
            <span className="font-semibold">Domestic</span>
          </div>
          <div className="flex items-center gap-1 text-cyan-300">
            <Globe className="w-2.5 h-2.5" />
            <span className="font-semibold">International</span>
          </div>
          {intlGrowth && (
            <span className={`font-mono font-bold text-[9px] px-1.5 py-0.5 rounded-full ${
              parseFloat(intlGrowth) >= 0
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-rose-500/20 text-rose-300"
            }`}>
              Intl {parseFloat(intlGrowth) >= 0 ? "▲" : "▼"}{Math.abs(parseFloat(intlGrowth))}% YoY
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={highlightedData}
            margin={{ top: 4, right: 8, left: -6, bottom: 0 }}
            barCategoryGap="24%"
            barGap={2}
          >
            <defs>
              <linearGradient id="domGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#0d9488" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="intlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d2ff" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#0284c7" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#164775"
              strokeOpacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey="year"
              stroke="#4a7a9b"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dy={3}
            />
            <YAxis
              stroke="#4a7a9b"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}M`}
              width={32}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#164775", fillOpacity: 0.3 }} />
            <Bar
              dataKey="domestic_m"
              name="Domestic"
              fill="url(#domGrad)"
              radius={[3, 3, 0, 0]}
              maxBarSize={22}
            />
            <Bar
              dataKey="international_m"
              name="International"
              fill="url(#intlGrad)"
              radius={[3, 3, 0, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer insight */}
      <div className="shrink-0 mt-1 pt-1.5 border-t border-ocean-700/40 flex items-center justify-between text-[8.5px] text-ocean-400">
        <span>
          Domestic consistently{" "}
          <span className="text-teal-300 font-semibold">~{latestYear.domestic_pct}%</span>{" "}
          of all arrivals
        </span>
        <span className="text-ocean-500">DOSM DTS Survey</span>
      </div>
    </div>
  );
};
