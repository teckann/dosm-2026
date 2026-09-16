import React from "react";
import { TrendingUp, TrendingDown, HelpCircle } from "lucide-react";
import { KPIItem } from "@/lib/types";

interface KPICardProps {
  kpi: KPIItem;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {kpi.title}
        </span>
        <div title={kpi.description} className="text-slate-400 hover:text-slate-600 cursor-help">
          <HelpCircle className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {kpi.value}
        </span>
        <div
          className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full ${
            kpi.isPositive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {kpi.isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{kpi.change}</span>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500 truncate">{kpi.description}</p>
    </div>
  );
};
