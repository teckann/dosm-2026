"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TimeSeriesPoint } from "@/lib/types";

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  const [metric, setMetric] = useState<"median_income" | "poverty_rate" | "unemployment_rate" | "digital_adoption_index">("median_income");

  const metricConfig = {
    median_income: {
      label: "Median Household Income (RM)",
      color: "#2563eb",
      format: (val: number) => `RM ${val.toLocaleString()}`,
    },
    poverty_rate: {
      label: "Absolute Poverty Rate (%)",
      color: "#e11d48",
      format: (val: number) => `${val.toFixed(1)}%`,
    },
    unemployment_rate: {
      label: "Unemployment Rate (%)",
      color: "#d97706",
      format: (val: number) => `${val.toFixed(1)}%`,
    },
    digital_adoption_index: {
      label: "Digital Adoption Index",
      color: "#059669",
      format: (val: number) => `${val.toFixed(1)} pts`,
    },
  };

  const current = metricConfig[metric];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">National Socio-Economic Trajectory</h3>
          <p className="text-xs text-slate-500">Historical trend across all Malaysian states (2019 - 2023)</p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
          {(Object.keys(metricConfig) as Array<keyof typeof metricConfig>).map((key) => (
            <button
              key={key}
              onClick={() => setMetric(key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                metric === key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {metricConfig[key].label.split(" (")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={current.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={current.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}`} />
            <Tooltip
              formatter={(value: any) => [current.format(Number(value)), current.label]}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={current.color}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#metricGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
