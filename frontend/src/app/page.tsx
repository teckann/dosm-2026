"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { KPICard } from "@/components/kpi-card";
import { TimeSeriesChart } from "@/components/charts/time-series-chart";
import { StateBarChart } from "@/components/charts/state-bar-chart";
import { FeatureImportanceChart } from "@/components/charts/feature-importance-chart";
import { Simulator } from "@/components/simulator";

// Static JSON contracts generated directly by Python ML pipeline (ml/src/export_insights.py)
import summaryData from "@/data/summary_metrics.json";
import stateData from "@/data/state_analytics.json";
import timeSeriesData from "@/data/time_series.json";
import modelData from "@/data/model_insights.json";

import { SummaryMetrics, StateData as IStateData, TimeSeriesPoint, ModelInsights } from "@/lib/types";
import { Search, ArrowUpDown, BrainCircuit, FileSpreadsheet, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchState, setSearchState] = useState("");
  const [sortField, setSortField] = useState<keyof IStateData>("median_income");
  const [sortAsc, setSortAsc] = useState(false);

  const summary = summaryData as unknown as SummaryMetrics;
  const states = stateData as unknown as IStateData[];
  const timeSeries = timeSeriesData as unknown as TimeSeriesPoint[];
  const modelInsights = modelData as unknown as ModelInsights;

  // Filter & sort states for Analytics Tab
  const filteredStates = states
    .filter((s) => s.state.toLowerCase().includes(searchState.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  const toggleSort = (field: keyof IStateData) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-blue-300">
                Department of Statistics Malaysia • Datathon 2026
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Malaysia Socio-Economic & Resilience Dashboard
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl mt-2">
                Integrating real-time econometric indicators, state-level disparities, and machine learning
                predictive models for evidence-based policymaking.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-slate-400">Target Year: </span>
                <span className="font-bold text-white">{summary.latest_year}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-slate-400">States Tracked: </span>
                <span className="font-bold text-white">{summary.total_states}</span>
              </div>
              <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Vercel Edge Ready
              </div>
            </div>
          </div>
        </div>

        {/* Global KPI Cards (Shown on all or overview tab) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {summary.kpis.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeSeriesChart data={timeSeries} />
              <StateBarChart data={states} />
            </div>

            {/* Quick Policy Simulator Preview */}
            <Simulator modelInsights={modelInsights} />
          </div>
        )}

        {/* TAB 2: STATE ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search state (e.g. Selangor, Sabah)..."
                  value={searchState}
                  onChange={(e) => setSearchState(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-900">{filteredStates.length}</span> of{" "}
                {states.length} states
              </div>
            </div>

            {/* State Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th
                        onClick={() => toggleSort("state")}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>State</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => toggleSort("median_income")}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Median Income (RM)</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => toggleSort("poverty_rate")}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Poverty Rate</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => toggleSort("unemployment_rate")}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Unemployment</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => toggleSort("digital_adoption_index")}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Digital Index</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => toggleSort("resilience_index")}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Resilience Score</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStates.map((s, idx) => (
                      <tr key={s.state} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 text-slate-400 text-xs">{idx + 1}.</span>
                            <span>{s.state}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                          RM {s.median_income.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              s.poverty_rate < 1.0
                                ? "bg-emerald-100 text-emerald-800"
                                : s.poverty_rate < 5.0
                                ? "bg-blue-100 text-blue-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {s.poverty_rate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {s.unemployment_rate.toFixed(1)}%
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {s.digital_adoption_index.toFixed(1)} / 100
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {s.resilience_index.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ML MODEL & EXPLAINABILITY */}
        {activeTab === "model" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Model Architecture</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">Random Forest + Ridge</p>
                <span className="text-xs text-slate-400 mt-1 block">Supervised Regressor Ensemble</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Variance Explained (R²)</span>
                <p className="text-xl font-extrabold text-indigo-600 mt-1">
                  {(modelInsights.metrics.r2_score * 100).toFixed(1)}%
                </p>
                <span className="text-xs text-slate-400 mt-1 block">R² Score = {modelInsights.metrics.r2_score}</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Mean Absolute Error (MAE)</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  ±{modelInsights.metrics.mae.toFixed(2)}%
                </p>
                <span className="text-xs text-slate-400 mt-1 block">Average absolute deviation</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Training Observations</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {modelInsights.metrics.sample_size} records
                </p>
                <span className="text-xs text-slate-400 mt-1 block">Across all Malaysian states</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FeatureImportanceChart data={modelInsights.feature_importances} />

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Econometric Feature Interpretability</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    How each socioeconomic variable influences the poverty and resilience models.
                  </p>
                  <div className="mt-4 space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-900">Median Household Income</span>
                      <p className="text-slate-500 mt-0.5">
                        Strongest negative correlation with poverty. Higher baseline income serves as the primary shock absorber.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-900">Digital Adoption Index</span>
                      <p className="text-slate-500 mt-0.5">
                        Acts as a strong multiplier for economic resilience and high-value employment transition.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-900">Unemployment & Gini Inequality</span>
                      <p className="text-slate-500 mt-0.5">
                        Direct compounding indicators of economic vulnerability at the district and state levels.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Pipeline script: ml/src/train.py</span>
                  <span className="font-mono text-emerald-600">Model verified ✓</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SIMULATOR */}
        {activeTab === "simulator" && (
          <div className="animate-fadeIn">
            <Simulator modelInsights={modelInsights} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DOSM Datathon 2026 • Socio-Economic Intelligence System</span>
          <span>Deployable to Vercel with zero cold starts • Next.js & Python Pipeline</span>
        </div>
      </footer>
    </div>
  );
}
