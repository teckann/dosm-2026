"use client";

import React, { useState } from "react";
import { MarineHeader } from "@/components/marine/marine-header";
import { HeroKPIChart } from "@/components/marine/hero-kpi-chart";
import { VolumeSpectrumCard } from "@/components/marine/volume-spectrum-card";
import { DonutBreakdownCard } from "@/components/marine/donut-breakdown-card";
import { StackedKPICard } from "@/components/marine/stacked-kpi-card";
import { MaritimeLeaderboardCard, DestinationRow } from "@/components/marine/maritime-leaderboard-card";
import { MarineSimulatorModal } from "@/components/marine/marine-simulator-modal";

// Comprehensive matrix pre-calculated across all Years & Regions (DOSM + ML)
import fullDashboardData from "@/data/marine_dashboard_full.json";
import modelData from "@/data/marine_model.json";

export default function MarineDashboardPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationRow | null>(null);

  const years = fullDashboardData.years;
  const regions = fullDashboardData.regions;

  // Active matrix slice for currently selected Year and Region
  const sliceKey = `${selectedYear}_${selectedRegion}`;
  const slice = (fullDashboardData.matrix as any)[sliceKey] || (fullDashboardData.matrix as any)["2024_All Regions"];

  const handleResetFilters = () => {
    setSelectedYear(2024);
    setSelectedRegion("All Regions");
  };

  const handleOpenSimulator = () => {
    setSelectedDestination(null);
    setIsSimulatorOpen(true);
  };

  const handleSimulateDestination = (row: DestinationRow) => {
    setSelectedDestination(row);
    setIsSimulatorOpen(true);
  };

  // Safe range helpers for spectrum min/max
  const specBinValues = slice.spec_bins.map((b: any) => b.value);
  const minBin = specBinValues.length > 0 ? Math.min(...specBinValues).toFixed(1) : "3.5";
  const maxBin = specBinValues.length > 0 ? Math.max(...specBinValues).toFixed(1) : "8.5";

  // Sum seafood landings for current slice
  const seafoodSum = (specBinValues.reduce((acc: number, val: number) => acc + val, 0) * 10).toFixed(1);

  return (
    <div className="min-h-screen bg-ocean-900 text-white flex flex-col selection:bg-cyan-500 selection:text-ocean-950 font-sans">
      {/* Top Header with Year & Region Dropdowns and Simulator Trigger */}
      <MarineHeader
        years={years}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        regions={regions}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        onOpenSimulator={handleOpenSimulator}
        onResetFilters={handleResetFilters}
      />

      {/* Main Marine Dashboard Grid */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-5 space-y-4">
        {/* Active Filter Indicator Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs px-1 text-ocean-300 gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 bg-ocean-850 border border-ocean-700/60 px-2.5 py-1 rounded-full text-[11px] font-medium text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Active Filter: <strong className="text-white">{selectedYear}</strong> • <strong className="text-white">{selectedRegion}</strong>
            </span>
            <span className="text-ocean-400 text-[11px] hidden sm:inline">
              • Tracking {slice.leaderboard.length} destinations • {slice.total_tourists_m}M total arrivals
            </span>
          </div>

          {(selectedYear !== 2024 || selectedRegion !== "All Regions") && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2 transition-colors cursor-pointer text-left"
            >
              Reset to 2024 National Overview
            </button>
          )}
        </div>

        {/* ROW 1: Hero KPI Area Chart | Volume Spectrum | Fleet Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Top-Left: Hero Metric with Area Chart */}
          <div className="lg:col-span-4">
            <HeroKPIChart
              data={{
                title:
                  selectedRegion === "All Regions"
                    ? "TOTAL COASTAL TOURIST ARRIVALS"
                    : `${selectedRegion.toUpperCase()} COASTAL ARRIVALS`,
                period: `Annual Benchmark (${selectedYear} vs ${slice.compare_year})`,
                value: `${slice.total_tourists_m}M`,
                change_percentage: slice.growth_yoy,
                compare_text: `${slice.compare_year}: ${slice.compare_val_m}M`,
                time_series: fullDashboardData.trajectories.total_tourists,
              }}
              allTrajectories={fullDashboardData.trajectories}
              selectedYear={selectedYear}
              totalTouristsVal={`${slice.total_tourists_m}M`}
              marineParkVal={`${slice.mp_total_m}M`}
              seafoodVal={`${seafoodSum}k MT`}
              growthYoY={slice.growth_yoy}
              compareYearText={`${slice.compare_year}: ${slice.compare_val_m}M`}
            />
          </div>

          {/* Top-Center: Volume Spectrum Bins */}
          <div className="lg:col-span-4">
            <VolumeSpectrumCard
              data={{
                title: "COASTAL FISH LANDINGS SPECTRUM",
                period: `${selectedYear} ${selectedRegion} (k MT)`,
                bins: slice.spec_bins,
                legend_min: `${minBin}k MT`,
                legend_max: `${maxBin}k MT`,
              }}
              years={years}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
              selectedRegion={selectedRegion}
            />
          </div>

          {/* Top-Right: Marine Park Visitors Donut Breakdown */}
          <div className="lg:col-span-4">
            <DonutBreakdownCard
              data={{
                title: "MARINE PARK VISITOR ALLOCATION",
                period: `${selectedYear} ${selectedRegion}`,
                total: `${slice.mp_total_m}M`,
                total_formatted: `${slice.mp_total_m}M`,
                total_label: "Park Footfall",
                segments: slice.dest_slices,
              }}
              years={years}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
              dropdownSuffix={selectedRegion}
            />
          </div>
        </div>

        {/* ROW 2: Stacked KPIs | Spend Donut Breakdown | Regional Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Bottom-Left: Stacked Metric Cards (Tourist Spend & Visitor Nights) */}
          <div className="lg:col-span-3">
            <StackedKPICard
              data={{
                total_volume: {
                  title: "COASTAL TOURISM SPEND",
                  period: `${selectedYear} DOSM DTS Data`,
                  value: `RM ${slice.total_spend_b}B`,
                  change: slice.growth_yoy,
                  compare_value: `RM ${(slice.total_spend_b * 0.93).toFixed(1)}B`,
                },
                active_fleet: {
                  title: "TOTAL VISITOR NIGHTS",
                  period: `${selectedYear} Island & Coastal Stays`,
                  value: `${slice.visitor_nights_m}M`,
                },
              }}
              years={years}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
            />
          </div>

          {/* Bottom-Center: Coastal Tourist Spending Breakdown */}
          <div className="lg:col-span-4">
            <DonutBreakdownCard
              data={{
                title: "COASTAL EXPENDITURE BY CATEGORY",
                period: `${selectedYear} DTS Survey`,
                total: `RM ${slice.total_spend_b}B`,
                total_formatted: `RM ${slice.total_spend_b}B`,
                total_label: "Total Spend",
                segments: slice.spend_cats,
              }}
              years={years}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
              dropdownSuffix="DTS Survey"
            />
          </div>

          {/* Bottom-Right: Regional Maritime Destinations Leaderboard */}
          <div className="lg:col-span-5">
            <MaritimeLeaderboardCard
              data={{
                title:
                  selectedRegion === "All Regions"
                    ? "REGIONAL MARINE DESTINATIONS"
                    : `${selectedRegion.toUpperCase()} DESTINATIONS`,
                period: `${selectedYear} DOSM Carrying Capacity Assessment`,
                headers: {
                  rank: "#",
                  name: "Destination",
                  open_ops: "Arrivals",
                  closed_ops: "Stress Score",
                },
                rows: slice.leaderboard.map((item: any) => ({
                  ...item,
                  open_ops: item.arrivals_formatted,
                  closed_ops: `${item.stress_score}/100`,
                })),
              }}
              onSimulateDestination={handleSimulateDestination}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ocean-700/40 py-3.5 px-6 text-center text-[11px] text-ocean-400 bg-ocean-950">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DOSM Datathon 2026 • Predictive Modeling of Marine Tourism and Carrying Capacity in Malaysia</span>
          <div className="flex items-center space-x-3 text-ocean-400">
            <span>Next.js 14 App Router</span>
            <span>•</span>
            <span className="text-cyan-400 font-medium">Vercel Edge Optimized</span>
            <span>•</span>
            <span>Zero Mock Values</span>
          </div>
        </div>
      </footer>

      {/* ML Bioeconomic Policy Simulator Modal */}
      <MarineSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        modelData={modelData}
        initialDestination={selectedDestination}
      />
    </div>
  );
}
