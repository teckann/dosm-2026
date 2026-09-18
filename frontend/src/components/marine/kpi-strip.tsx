"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SparklineKpiCardProps {
  title: string;
  value: string;
  delta?: string;         // e.g. "+5.2%"
  isPositive?: boolean;
  isNeutral?: boolean;
  sparkData: Array<{ v: number }>;
  sparkColor: string;
  unit?: string;
  className?: string;
}

const SparklineKpiCard: React.FC<SparklineKpiCardProps> = ({
  title,
  value,
  delta,
  isPositive,
  isNeutral,
  sparkData,
  sparkColor,
  unit,
  className = "",
}) => {
  const DeltaIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const deltaColor = isNeutral
    ? "text-ocean-300"
    : isPositive
    ? "text-emerald-400"
    : "text-rose-400";

  return (
    <div
      className={`bg-ocean-850 border border-ocean-700/60 rounded-xl px-2.5 sm:px-3 py-1.5 flex items-center justify-between shadow-ocean-glow h-full overflow-hidden ${className}`}
    >
      {/* Left: label + value + delta */}
      <div className="flex flex-col justify-center gap-0.5 min-w-0">
        <span className="text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-widest text-ocean-400 truncate">
          {title}
        </span>
        <div className="flex items-baseline gap-1">
          <span
            className="text-base sm:text-lg xl:text-xl font-extrabold font-mono tracking-tight"
            style={{ color: sparkColor }}
          >
            {value}
          </span>
          {unit && (
            <span className="text-[8px] sm:text-[9px] text-ocean-400 font-semibold">{unit}</span>
          )}
        </div>
        {delta && (
          <div className={`flex items-center gap-0.5 text-[8.5px] sm:text-[9.5px] font-semibold ${deltaColor}`}>
            <DeltaIcon className="w-2.5 h-2.5 shrink-0" />
            <span>{delta}</span>
          </div>
        )}
      </div>

      {/* Right: mini sparkline */}
      <div className="w-14 sm:w-16 xl:w-20 h-7 sm:h-8 xl:h-9 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={sparkColor}
              strokeWidth={1.8}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface RiskKpiCardProps {
  stressScore: number;     // 0-100
  riskLabel: string;       // "Critical" | "High" | "Moderate" | "Low"
  mwqi: number;            // 0-100
}

const RiskKpiCard: React.FC<RiskKpiCardProps> = ({ stressScore, riskLabel, mwqi }) => {
  const riskColor =
    riskLabel === "Critical"
      ? { bg: "bg-rose-500/20", border: "border-rose-500/50", text: "text-rose-300", bar: "#f43f5e" }
      : riskLabel === "High"
      ? { bg: "bg-amber-500/20", border: "border-amber-500/50", text: "text-amber-300", bar: "#facc15" }
      : { bg: "bg-emerald-500/20", border: "border-emerald-500/50", text: "text-emerald-300", bar: "#34d399" };

  const mwqiColor =
    mwqi >= 75 ? "#34d399" : mwqi >= 65 ? "#facc15" : "#f43f5e";

  return (
    <div className="bg-ocean-850 border border-ocean-700/60 rounded-xl px-2.5 sm:px-3 py-1.5 flex flex-col justify-center shadow-ocean-glow h-full overflow-hidden gap-1">
      <span className="text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-widest text-ocean-400">
        Overtourism Risk
      </span>
      <div className="flex items-center justify-between">
        <span
          className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.2 rounded-full border ${riskColor.bg} ${riskColor.border} ${riskColor.text}`}
        >
          {riskLabel}
        </span>
        <div className="text-right">
          <span className="text-[8px] sm:text-[9px] text-ocean-400">MWQI </span>
          <span className="text-xs font-bold font-mono" style={{ color: mwqiColor }}>
            {mwqi}
          </span>
        </div>
      </div>
      {/* Stress progress bar */}
      <div>
        <div className="flex justify-between text-[8.5px] text-ocean-400 mb-0.5">
          <span>Carrying Capacity Stress</span>
          <span className="font-mono font-semibold" style={{ color: riskColor.bar }}>
            {stressScore}/100
          </span>
        </div>
        <div className="h-1.5 bg-ocean-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${stressScore}%`,
              background: `linear-gradient(90deg, ${riskColor.bar}99, ${riskColor.bar})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* ─── KpiStrip ─────────────────────────────────────────────────────────────── */

interface KpiStripProps {
  totalTouristsM: number;
  marineParkM: number;
  mwqi: number;
  fishLandingsKmt: number;
  touristGrowthYoY: number | null;
  marineParkGrowthYoY: number | null;
  fishLandingsGrowthYoY: number | null;
  stressScore: number;
  riskLabel: string;
  touristSpark: number[];
  parkSpark: number[];
  fishSpark: number[];
}

export const KpiStrip: React.FC<KpiStripProps> = ({
  totalTouristsM,
  marineParkM,
  mwqi,
  fishLandingsKmt,
  touristGrowthYoY,
  marineParkGrowthYoY,
  fishLandingsGrowthYoY,
  stressScore,
  riskLabel,
  touristSpark,
  parkSpark,
  fishSpark,
}) => {
  const toSpark = (arr: number[]) => arr.map((v) => ({ v }));

  const mwqiColor = mwqi >= 75 ? "#34d399" : mwqi >= 65 ? "#facc15" : "#f43f5e";
  const mwqiLabel = mwqi >= 75 ? "Good" : mwqi >= 65 ? "Moderate" : "Poor";

  const formatYoY = (value: number | null) =>
    value === null ? "No prior year" : `${value > 0 ? "+" : ""}${value.toFixed(1)}% YoY`;

  return (
    <div className="kpi-strip">
      <SparklineKpiCard
        title="Total Arrivals"
        value={`${totalTouristsM}M`}
        delta={formatYoY(touristGrowthYoY)}
        isPositive={touristGrowthYoY !== null && touristGrowthYoY > 0}
        isNeutral={touristGrowthYoY === null || touristGrowthYoY === 0}
        sparkData={toSpark(touristSpark)}
        sparkColor="#00d2ff"
      />
      <SparklineKpiCard
        title="Marine Park Visitors"
        value={`${marineParkM}M`}
        delta={formatYoY(marineParkGrowthYoY)}
        isPositive={marineParkGrowthYoY !== null && marineParkGrowthYoY > 0}
        isNeutral={marineParkGrowthYoY === null || marineParkGrowthYoY === 0}
        sparkData={toSpark(parkSpark)}
        sparkColor="#34d399"
      />
      {/* MWQI — custom inline card */}
      <div className="bg-ocean-850 border border-ocean-700/60 rounded-xl px-2.5 sm:px-3 py-1.5 flex items-center justify-between shadow-ocean-glow h-full overflow-hidden">
        <div className="flex flex-col justify-center gap-0.5 min-w-0">
          <span className="text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-widest text-ocean-400 truncate">
            Water Quality Index
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg xl:text-xl font-extrabold font-mono tracking-tight" style={{ color: mwqiColor }}>
              {mwqi}
            </span>
            <span className="text-[8px] sm:text-[9px] text-ocean-400 font-semibold">/ 100</span>
          </div>
          <span className="text-[8.5px] sm:text-[9.5px] font-semibold truncate" style={{ color: mwqiColor }}>
            {mwqiLabel} — Natl Avg
          </span>
        </div>
        {/* Radial arc hint */}
        <svg width="34" height="34" viewBox="0 0 40 40" className="shrink-0">
          <circle cx="20" cy="20" r="15" fill="none" stroke="#1a548a" strokeWidth="4" />
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke={mwqiColor}
            strokeWidth="4"
            strokeDasharray={`${(mwqi / 100) * 94.2} 94.2`}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
            style={{ transition: "stroke-dasharray 0.7s ease" }}
          />
          <text x="20" y="24" textAnchor="middle" fontSize="9" fontWeight="bold" fill={mwqiColor}>
            {mwqi}
          </text>
        </svg>
      </div>
      <SparklineKpiCard
        title="Fish Landings"
        value={`${fishLandingsKmt}k`}
        unit="MT"
        delta={formatYoY(fishLandingsGrowthYoY)}
        isPositive={fishLandingsGrowthYoY !== null && fishLandingsGrowthYoY > 0}
        isNeutral={fishLandingsGrowthYoY === null || fishLandingsGrowthYoY === 0}
        sparkData={toSpark(fishSpark)}
        sparkColor="#38bdf8"
      />
      <RiskKpiCard
        stressScore={stressScore}
        riskLabel={riskLabel}
        mwqi={mwqi}
      />
    </div>
  );
};
