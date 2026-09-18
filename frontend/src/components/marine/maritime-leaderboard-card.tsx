"use client";

import React, { useState } from "react";
import { Waves, Sliders } from "lucide-react";

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
  const [sortBy, setSortBy] = useState<"rank" | "arrivals" | "stress">("stress");
  const [sortAsc, setSortAsc] = useState(false);

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
        const valA = typeof a.closed_ops === "number" ? a.closed_ops : parseFloat(String(a.closed_ops).split("/")[0]);
        const valB = typeof b.closed_ops === "number" ? b.closed_ops : parseFloat(String(b.closed_ops).split("/")[0]);
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
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-200">
              {data.title}
            </span>
            <p className="text-[9px] text-ocean-400">{data.period}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-ocean-400">
            <button onClick={() => setSortBy(sortBy === "stress" ? "rank" : "stress")} className="text-[9px] text-ocean-400 hover:text-cyan-300 transition-colors">
              Sort: <span className="text-cyan-300 font-semibold">{sortBy === "stress" ? "Stress ↓" : "Rank ↑"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto py-1 flex-1 overflow-y-auto ocean-scrollbar pr-1.5">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-ocean-850 z-10">
            <tr className="text-ocean-400 font-semibold uppercase tracking-wider text-[9px] border-b border-ocean-700/40">
              <th className="py-1.5 px-1.5 w-6">#</th>
              <th className="py-1.5 px-2">Destination</th>
              <th className="py-1.5 px-2 text-right">Arrivals</th>
              <th className="py-1.5 px-2 text-right">MWQI</th>
              <th className="py-1.5 px-2 text-right">Stress</th>
              <th className="py-1.5 px-1.5 text-center w-12">Sim</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ocean-800/60 font-medium">
            {filteredRows.map((row) => (
              <tr
                key={row.name}
                className="hover:bg-ocean-800/60 transition-colors group"
              >
                {/* Rank */}
                <td className="py-1.5 px-1.5 text-ocean-400">
                  {row.rank === 1 ? (
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[8px] font-bold border border-amber-500/30">
                      ★
                    </div>
                  ) : (
                    <span className="font-mono text-ocean-400 text-[9px]">{row.rank}</span>
                  )}
                </td>

                {/* Name */}
                <td className="py-1.5 px-2 text-white font-medium group-hover:text-cyan-300 transition-colors">
                  <div className="flex items-center space-x-1">
                    <Waves className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                    <span className="truncate max-w-[110px] sm:max-w-[140px] text-[9.5px]">{row.island || row.name}</span>
                  </div>
                  {row.state && (
                    <span className="text-[8px] text-ocean-400 ml-3.5">{row.state}</span>
                  )}
                </td>

                {/* Arrivals */}
                <td className="py-1.5 px-2 text-right font-mono text-cyan-200 font-semibold text-[9.5px]">
                  {row.open_ops}
                </td>

                {/* MWQI */}
                <td className={`py-1.5 px-2 text-right font-mono font-bold text-[9.5px] ${mwqiColor(row.mwqi)}`}>
                  {row.mwqi ?? "—"}
                </td>

                {/* Stress Score */}
                <td className={`py-1.5 px-2 text-right font-mono font-bold text-[9.5px] ${stressColor(row.stress_score)}`}>
                  {row.closed_ops}
                </td>

                {/* Action: Simulate */}
                <td className="py-1.5 px-1.5 text-center">
                  <button
                    onClick={() => onSimulateDestination && onSimulateDestination(row)}
                    title="Simulate Carrying Capacity for this Destination"
                    className="p-1 rounded bg-ocean-750 hover:bg-cyan-500 hover:text-ocean-950 text-ocean-300 transition-colors"
                  >
                    <Sliders className="w-2.5 h-2.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[8.5px] text-ocean-400 pt-1.5 border-t border-ocean-700/40 shrink-0">
        <span>{filteredRows.length} destinations • sorted by stress</span>
        <span className="text-emerald-400">🟢 &gt;75 · 🟡 65-75 · 🔴 &lt;65 MWQI</span>
      </div>
    </div>
  );
};
