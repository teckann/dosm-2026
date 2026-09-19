"use client";

import React, { useState } from "react";
import { Waves, X, MapPin, Users, Droplets, Activity } from "lucide-react";

export interface DestinationRow {
  rank: number;
  name: string;
  state?: string;
  island?: string;
  arrivals_m?: number;
  arrivals_formatted?: string;
  open_ops: string | number;
  closed_ops: string | number;
  stress_score?: number;
  hotel_occ?: number;
  mp_visitors_k?: number;
  avg_spend?: number;
  mwqi?: number;
}

interface DestinationModalProps {
  row: DestinationRow;
  onClose: () => void;
}

const DestinationDetailModal: React.FC<DestinationModalProps> = ({ row, onClose }) => {
  const mwqiVal = row.mwqi || 0;
  const mwqiLabel = mwqiVal >= 85 ? "Excellent (Class 1)" : mwqiVal >= 75 ? "Good (Class 2)" : mwqiVal >= 65 ? "Moderate (Class 3)" : "Poor";
  const mwqiColor = mwqiVal >= 75 ? "text-emerald-400" : mwqiVal >= 65 ? "text-amber-400" : "text-rose-400";
  const stressVal = row.stress_score || 0;
  const stressColor = stressVal >= 70 ? "text-rose-400" : stressVal >= 50 ? "text-amber-400" : "text-emerald-400";
  const stressLabel = stressVal >= 70 ? "High Day-Trip Strain" : stressVal >= 50 ? "Moderate Excursion Load" : "Low Carrying Strain";

  return (
    <div
      className="fixed inset-0 z-50 bg-ocean-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-ocean-900 border border-ocean-700/80 rounded-2xl shadow-2xl p-5 max-w-md w-full relative space-y-4 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Rank #{row.rank}
              </span>
              {row.state && (
                <span className="text-xs text-ocean-300 flex items-center gap-1 font-semibold">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  {row.state}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              {row.island || row.name}
            </h3>
            {row.name && row.island && row.name !== row.island && (
              <p className="text-xs text-cyan-300/80 font-medium">
                {row.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-ocean-800 hover:bg-ocean-700 text-ocean-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Metric Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-ocean-850 border border-ocean-700/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-ocean-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
              <Users className="w-3 h-3 text-cyan-400" />
              <span>Annual Arrivals</span>
            </div>
            <div className="text-lg font-extrabold text-white font-mono">{row.open_ops}</div>
            <div className="text-[10px] text-ocean-400">DOSM Survey Footfall</div>
          </div>

          <div className="bg-ocean-850 border border-ocean-700/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-ocean-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
              <Activity className="w-3 h-3 text-amber-400" />
              <span>Carrying Stress</span>
            </div>
            <div className={`text-lg font-extrabold font-mono ${stressColor}`}>
              {typeof row.closed_ops === "string" && row.closed_ops.includes("/")
                ? `${row.stress_score || row.closed_ops.split("/")[0]}%`
                : row.closed_ops}
            </div>
            <div className="text-[10px] text-ocean-400">{stressLabel}</div>
          </div>

          <div className="bg-ocean-850 border border-ocean-700/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-ocean-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
              <Droplets className="w-3 h-3 text-teal-400" />
              <span>Water Quality</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-lg font-extrabold font-mono ${mwqiColor}`}>{row.mwqi ?? "—"}</span>
              <span className="text-[10px] text-ocean-400">/ 100</span>
            </div>
            <div className={`text-[10px] font-semibold ${mwqiColor}`}>{mwqiLabel}</div>
          </div>

          <div className="bg-ocean-850 border border-ocean-700/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-ocean-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
              <span>Avg Tourist Spend</span>
            </div>
            <div className="text-lg font-extrabold text-cyan-200 font-mono">RM {row.avg_spend || 780}</div>
            <div className="text-[10px] text-ocean-400">DTS Benchmark Rate</div>
          </div>
        </div>

        {/* Note */}
        <p className="text-[10px] text-ocean-400 leading-relaxed border-t border-ocean-700/40 pt-2.5">
          Data benchmarked against official DOSM Domestic Tourism Survey (DTS Jadual 1 &amp; 9) and Department of Environment (DOE) Marine Water Quality Surveillance.
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-ocean-800 hover:bg-cyan-600 hover:text-white rounded-xl text-xs font-bold text-ocean-200 transition-colors shadow-sm"
        >
          Close Details
        </button>
      </div>
    </div>
  );
};

interface MaritimeLeaderboardCardProps {
  data: {
    title: string;
    period: string;
    headers: {
      rank: string;
      name: string;
      open_ops: string;
      closed_ops: string;
    };
    rows: DestinationRow[];
  };
  onSimulateDestination?: (row: DestinationRow) => void;
}

export const MaritimeLeaderboardCard: React.FC<MaritimeLeaderboardCardProps> = ({
  data,
  onSimulateDestination,
}) => {
  const [sortBy, setSortBy] = useState<"rank" | "arrivals" | "stress" | "mwqi">("rank");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedRow, setSelectedRow] = useState<DestinationRow | null>(null);

  const handleHeaderClick = (column: "rank" | "arrivals" | "stress" | "mwqi") => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(column === "rank");
    }
  };

  // Sort rows (no filter — show all in compact panel)
  const filteredRows = [...data.rows]
    .sort((a, b) => {
      if (sortBy === "rank") {
        return sortAsc ? a.rank - b.rank : b.rank - a.rank;
      }
      if (sortBy === "arrivals") {
        const valA = typeof a.open_ops === "number" ? a.open_ops : parseFloat(String(a.open_ops).replace("M", ""));
        const valB = typeof b.open_ops === "number" ? b.open_ops : parseFloat(String(b.open_ops).replace("M", ""));
        return sortAsc ? valA - valB : valB - valA;
      }
      if (sortBy === "stress") {
        const valA = typeof a.closed_ops === "number" ? a.closed_ops : parseFloat(String(a.closed_ops).replace("%", "").split("/")[0]);
        const valB = typeof b.closed_ops === "number" ? b.closed_ops : parseFloat(String(b.closed_ops).replace("%", "").split("/")[0]);
        return sortAsc ? valA - valB : valB - valA;
      }
      if (sortBy === "mwqi") {
        const valA = a.mwqi || 0;
        const valB = b.mwqi || 0;
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });

  const mwqiColor = (v?: number) => {
    if (!v) return "text-ocean-400";
    if (v >= 75) return "text-emerald-400";
    if (v >= 65) return "text-amber-400";
    return "text-rose-400";
  };

  const stressColor = (score?: number) => {
    if (!score) return "text-ocean-400";
    if (score >= 90) return "text-rose-400";
    if (score >= 70) return "text-amber-400";
    return "text-emerald-400";
  };

  return (
    <div className="bg-ocean-850 border border-ocean-700/60 rounded-xl p-3 flex flex-col shadow-ocean-glow h-full overflow-hidden panel">
      {/* Compact Header */}
      <div className="pb-2 border-b border-ocean-700/40 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ocean-100 block truncate">
              {data.title}
            </span>
            <p className="text-[9px] text-ocean-400 truncate">{data.period}</p>
          </div>

          {/* Sleek Segmented Control */}
          <div className="flex items-center bg-ocean-900/90 p-0.5 rounded-lg border border-ocean-700/60 shrink-0">
            <button
              onClick={() => {
                setSortBy("rank");
                setSortAsc(true);
              }}
              className={`px-2 py-0.5 rounded-md text-[9px] font-semibold transition-all ${
                sortBy === "rank"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-ocean-400 hover:text-ocean-200"
              }`}
            >
              Rank
            </button>
            <button
              onClick={() => {
                setSortBy("stress");
                setSortAsc(false);
              }}
              className={`px-2 py-0.5 rounded-md text-[9px] font-semibold transition-all ${
                sortBy === "stress"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-ocean-400 hover:text-ocean-200"
              }`}
            >
              Stress
            </button>
            <button
              onClick={() => {
                setSortBy("arrivals");
                setSortAsc(false);
              }}
              className={`px-2 py-0.5 rounded-md text-[9px] font-semibold transition-all ${
                sortBy === "arrivals"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-ocean-400 hover:text-ocean-200"
              }`}
            >
              Volume
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-hidden py-1 flex-1 overflow-y-auto ocean-scrollbar">
        <table className="w-full text-left table-fixed">
          <thead className="sticky top-0 bg-ocean-850 z-10">
            <tr className="text-ocean-400 font-semibold uppercase tracking-wider text-[8.5px] border-b border-ocean-700/40 select-none">
              <th
                onClick={() => handleHeaderClick("rank")}
                className="py-1 px-1 w-6 text-center cursor-pointer hover:text-cyan-300 transition-colors"
                title="Sort by Rank"
              >
                # {sortBy === "rank" ? (sortAsc ? "↑" : "↓") : ""}
              </th>
              <th className="py-1 px-1.5 w-auto">Destination</th>
              <th
                onClick={() => handleHeaderClick("arrivals")}
                className="py-1 px-1 text-right w-14 sm:w-16 cursor-pointer hover:text-cyan-300 transition-colors"
                title="Sort by Arrivals"
              >
                Arrivals {sortBy === "arrivals" ? (sortAsc ? "↑" : "↓") : ""}
              </th>
              <th
                onClick={() => handleHeaderClick("mwqi")}
                className="py-1 px-1 text-right w-11 sm:w-12 cursor-pointer hover:text-cyan-300 transition-colors"
                title="Sort by Water Quality"
              >
                MWQI {sortBy === "mwqi" ? (sortAsc ? "↑" : "↓") : ""}
              </th>
              <th
                onClick={() => handleHeaderClick("stress")}
                className="py-1 px-1.5 text-right w-14 sm:w-16 cursor-pointer hover:text-cyan-300 transition-colors"
                title="Sort by Stress Level"
              >
                Stress {sortBy === "stress" ? (sortAsc ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ocean-800/60 font-medium">
            {filteredRows.map((row) => (
              <tr
                key={row.name}
                onClick={() => setSelectedRow(row)}
                title={`Click to view full details for ${row.island || row.name}`}
                className="hover:bg-ocean-800/80 cursor-pointer transition-colors group"
              >
                {/* Rank */}
                <td className="py-1.5 px-1 text-center">
                  {row.rank === 1 ? (
                    <div className="w-4 h-4 mx-auto rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[8px] font-bold border border-amber-500/30">
                      ★
                    </div>
                  ) : (
                    <span className="font-mono text-ocean-400 text-[9px]">{row.rank}</span>
                  )}
                </td>

                {/* Name */}
                <td className="py-1.5 px-1.5 min-w-0">
                  <div className="flex items-center space-x-1 min-w-0">
                    <Waves className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                    <span className="truncate text-[9.5px] font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {row.island || row.name}
                    </span>
                  </div>
                  {row.state && (
                    <span className="text-[8px] text-ocean-400 block truncate pl-3.5 leading-tight">
                      {row.state}
                    </span>
                  )}
                </td>

                {/* Arrivals */}
                <td className="py-1.5 px-1 text-right font-mono text-cyan-200 font-semibold text-[9.5px] whitespace-nowrap">
                  {row.open_ops}
                </td>

                {/* MWQI */}
                <td className={`py-1.5 px-1 text-right font-mono font-bold text-[9.5px] whitespace-nowrap ${mwqiColor(row.mwqi)}`}>
                  {row.mwqi ?? "—"}
                </td>

                {/* Stress Score */}
                <td className={`py-1.5 px-1.5 text-right font-mono font-bold text-[9.5px] whitespace-nowrap ${stressColor(row.stress_score)}`}>
                  {typeof row.closed_ops === "string" && row.closed_ops.includes("/")
                    ? `${row.stress_score || row.closed_ops.split("/")[0]}%`
                    : row.closed_ops}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[8px] sm:text-[8.5px] text-ocean-400 pt-1.5 border-t border-ocean-700/40 shrink-0">
        <span className="truncate pr-1">
          {filteredRows.length} destinations • sorted by {sortBy === "rank" ? "rank" : sortBy === "stress" ? "stress level" : sortBy === "arrivals" ? "arrivals" : "water quality"}
        </span>
        <span className="text-emerald-400 shrink-0 whitespace-nowrap">
          🟢 &gt;75 · 🟡 65-75 · 🔴 &lt;65 MWQI
        </span>
      </div>

      {/* Destination Detail Modal */}
      {selectedRow && (
        <DestinationDetailModal
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
        />
      )}
    </div>
  );
};
