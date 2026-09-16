"use client";

import React from "react";
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
import { FeatureImportance } from "@/lib/types";

interface FeatureImportanceChartProps {
  data: FeatureImportance[];
}

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">Feature Importance Ranking</h3>
        <p className="text-xs text-slate-500">Relative predictive power calculated by the Random Forest model</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" stroke="#94a3b8" fontSize={11} unit="%" />
            <YAxis
              type="category"
              dataKey="feature"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => v.replace(/_/g, " ")}
            />
            <Tooltip
              formatter={(value: any) => [`${Number(value).toFixed(1)}%`, "Importance Contribution"]}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#4f46e5" : index === 1 ? "#6366f1" : "#a5b4fc"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
