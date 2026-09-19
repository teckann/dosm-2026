"use client";

import React, { useState } from "react";
import { MarineHeader } from "@/components/marine/marine-header";
import { KpiStrip } from "@/components/marine/kpi-strip";
import { HeroKPIChart } from "@/components/marine/hero-kpi-chart";
import { DonutBreakdownCard } from "@/components/marine/donut-breakdown-card";
import { MaritimeLeaderboardCard, DestinationRow } from "@/components/marine/maritime-leaderboard-card";
import { CoralHeatmapCard } from "@/components/marine/coral-heatmap-card";
import { MarineSimulatorModal } from "@/components/marine/marine-simulator-modal";
import { VisitorSplitChart } from "@/components/marine/visitor-split-chart";

// Data contracts
import fullDashboardData from "@/data/marine_dashboard_full.json";
import modelData from "@/data/marine_model.json";
import visitorSplitData from "@/data/visitor_split.json";

export default function MarineDashboardPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationRow | null>(null);

  const years = fullDashboardData.years;
  const regions = fullDashboardData.regions;

  // Active matrix slice
  const sliceKey = `${selectedYear}_${selectedRegion}`;
  const slice =
    (fullDashboardData.matrix as any)[sliceKey] ||
    (fullDashboardData.matrix as any)["2024_All Regions"];

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

  // ── KPI Strip data derivations ──────────────────────────────────────────────
  // Sparkline arrays: extract just the numeric values from trajectories
  const touristSpark = fullDashboardData.trajectories.total_tourists.map((d) => d.current);
  const parkSpark = fullDashboardData.trajectories.marine_park_visitors.map((d) => d.current);
  const fishSpark = fullDashboardData.trajectories.seafood_landings.map((d) => d.current);

  // Average MWQI across all destinations in current slice
  const leaderboardRows: any[] = slice.leaderboard || [];
  const avgMwqi =
    leaderboardRows.length > 0
      ? Math.round(
          leaderboardRows.reduce((acc: number, r: any) => acc + (r.mwqi || 0), 0) /
            leaderboardRows.length
        )
      : 72;

  // Dominant overtourism risk tier
  const riskCounts: Record<string, number> = { Critical: 0, High: 0, Moderate: 0, Low: 0 };
  leaderboardRows.forEach((r: any) => {
    const score = r.stress_score || 0;
    if (score >= 90) riskCounts["Critical"]++;
    else if (score >= 70) riskCounts["High"]++;
    else if (score >= 50) riskCounts["Moderate"]++;
    else riskCounts["Low"]++;
  });
  const dominantRisk = (Object.entries(riskCounts).sort((a, b) => b[1] - a[1])[0]?.[0]) || "Critical";

  // Avg stress across all destinations
  const avgStress =
    leaderboardRows.length > 0
      ? Math.round(
          leaderboardRows.reduce((acc: number, r: any) => acc + (r.stress_score || 0), 0) /
            leaderboardRows.length
        )
      : 85;

  // Actual fish-landings total exported for the active year and region.
  const fishLandingsKmt = slice.fish_landings_kmt;

  return (
    <div className="dashboard-shell bg-ocean-900 text-white selection:bg-cyan-500 selection:text-ocean-950 font-sans marine-grid-bg">

      {/* ── HEADER (52px) ─────────────────────────────────────────────────── */}
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

      {/* ── ROW 1: KPI STRIP (68px) ───────────────────────────────────────── */}
      <KpiStrip
        totalTouristsM={slice.total_tourists_m}
        marineParkM={slice.mp_total_m}
        mwqi={avgMwqi}
        fishLandingsKmt={fishLandingsKmt}
        touristGrowthYoY={slice.tourist_growth_yoy}
        marineParkGrowthYoY={slice.marine_park_growth_yoy}
        fishLandingsGrowthYoY={slice.fish_landings_growth_yoy}
        stressScore={avgStress}
        riskLabel={dominantRisk}
        touristSpark={touristSpark}
        parkSpark={parkSpark}
        fishSpark={fishSpark}
      />

      {/* ── ROW 2: MAIN CONTENT (flex-fill) ──────────────────────────────── */}
      <div className="row2-grid">

        {/* Left: Hero Trajectory Area Chart */}
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
          seafoodVal={`${fishLandingsKmt}k MT`}
          growthYoY={slice.growth_yoy}
          compareYearText={`${slice.compare_year}: ${slice.compare_val_m}M`}
        />

        {/* Center: Interactive Coral Bleaching Map (always visible) */}
        <CoralHeatmapCard onOpenSimulator={handleOpenSimulator} />

        {/* Right: Destination Leaderboard with MWQI (Marine Destinations) */}
        <MaritimeLeaderboardCard
          data={{
            title:
              selectedRegion === "All Regions"
                ? "MARINE DESTINATIONS"
                : `${selectedRegion.toUpperCase()} DESTINATIONS`,
            period: `${selectedYear} • Carrying Capacity`,
            headers: {
              rank: "#",
              name: "Destination",
              open_ops: "Arrivals",
              closed_ops: "Stress",
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

      {/* ── ROW 3: BOTTOM PANELS (252px) ─────────────────────────────────── */}
      <div className="row3-grid">

        {/* Left: Marine Park Visitor Allocation Donut */}
        <DonutBreakdownCard
          data={{
            title: "MARINE PARK ALLOCATION",
            period: `${selectedYear} ${selectedRegion}`,
            total: `${slice.mp_total_m}M`,
            total_formatted: `${slice.mp_total_m}M`,
            total_label: "Park Footfall",
            segments: slice.dest_slices,
          }}
        />

        {/* Center: Domestic vs International Visitor Split */}
        <VisitorSplitChart
          data={visitorSplitData}
          selectedYear={selectedYear}
        />

        {/* Right: Coastal Expenditure Breakdown */}
        <DonutBreakdownCard
          variant="detailed"
          data={{
            title: "COASTAL EXPENDITURE BY DESTINATION",
            period: `${selectedYear} ${selectedRegion} • DTS Survey`,
            total: `RM ${slice.total_spend_b}B`,
            total_formatted: `RM ${slice.total_spend_b}B`,
            total_label: "Total Spend",
            segments: slice.spend_cats,
          }}
        />
      </div>

      {/* ── ML Bioeconomic Policy Simulator Modal ─────────────────────────── */}
      <MarineSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        modelData={modelData}
        initialDestination={selectedDestination}
      />
    </div>
  );
}
