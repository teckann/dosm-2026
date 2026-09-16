"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { StateData } from "@/lib/types";

interface StateBarChartProps {
  data: StateData[];
}

export const StateBarChart: React.FC<StateBarChartProps> = ({ data }) => {
  const [metric, setMetric] = useState<"median_income" | "resilience_index" | "poverty_rate">("median_income");

  const sortedData = [...data].sort((a, b) => b[metric] - a[metric]);

  const config = {
    median_income: {
      label: "Median Income (RM)",
      barColor: "#3b82f6",
      formatter: (val: number) => `RM ${val.toLocaleString()}`,
    },
    resilience_index: {
      label: "Resilience Score",
      barColor: "#10b981",
      formatter: (val: number) => `${val.toFixed(1)} pts`,
    },
    poverty_rate: {
      label: "Poverty Rate (%)",
      barColor: "#f43f5e",
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
  };

  const current = config[metric];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">State-by-State Comparison</h3>
          <p className="text-xs text-slate-500">Rankings across Malaysian states (Latest 2023)</p>
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {(Object.keys(config) as Array<keyof typeof config>).map((k) => (
            <button
              key={k}
              onClick={() => setMetric(k)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                metric === k
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {config[k].label.split(" (")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="state"
              stroke="#64748b"
              fontSize={11}
              angle={-25}
              textAnchor="end"
              interval={0}
            />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              formatter={(value: any) => [current.formatter(Number(value)), current.label]}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar dataKey={metric} radius={[4, 4, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#1d4ed8" : current.barColor}
                  opacity={1 - index * 0.05}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
