"use client";

import React, { useState } from "react";
import { Waves, Search, Sliders, ArrowUpDown } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"rank" | "arrivals" | "stress">("rank");
  const [sortAsc, setSortAsc] = useState(true);

  // Filter and sort rows
  const filteredRows = [...data.rows]
    .filter(
      (row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.state && row.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.island && row.island.toLowerCase().includes(searchTerm.toLowerCase()))
    )
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

  const toggleSort = (type: "rank" | "arrivals" | "stress") => {
    if (sortBy === type) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(type);
      setSortAsc(false); // default descending for values
    }
  };

  return (
    <div className="bg-ocean-850 border border-ocean-700/60 rounded-xl p-5 flex flex-col justify-between shadow-ocean-glow h-full">
      {/* Header with Search & Sort */}
      <div className="pb-3 border-b border-ocean-700/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ocean-200">
              {data.title}
            </span>
            <p className="text-[11px] text-ocean-400">{data.period}</p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-ocean-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-ocean-900 text-white text-xs pl-8 pr-3 py-1 rounded-md border border-ocean-700 focus:outline-none focus:border-cyan-500 w-full sm:w-44"
            />
          </div>
        </div>

        {/* Sort Pills */}
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-ocean-400">Sort:</span>
          <button
            onClick={() => toggleSort("rank")}
            className={`px-2 py-0.5 rounded transition-all ${
              sortBy === "rank" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-ocean-400 hover:text-white"
            }`}
          >
            Rank {sortBy === "rank" ? (sortAsc ? "↑" : "↓") : ""}
          </button>
          <button
            onClick={() => toggleSort("arrivals")}
            className={`px-2 py-0.5 rounded transition-all ${
              sortBy === "arrivals" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-ocean-400 hover:text-white"
            }`}
          >
            Arrivals {sortBy === "arrivals" ? (sortAsc ? "↑" : "↓") : ""}
          </button>
          <button
            onClick={() => toggleSort("stress")}
            className={`px-2 py-0.5 rounded transition-all ${
              sortBy === "stress" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-ocean-400 hover:text-white"
            }`}
          >
            Stress Score {sortBy === "stress" ? (sortAsc ? "↑" : "↓") : ""}
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto py-2 flex-1 max-h-[340px] overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-ocean-850">
            <tr className="text-ocean-400 font-semibold uppercase tracking-wider text-[10px] border-b border-ocean-700/40">
              <th className="py-2 px-2 w-8">#</th>
              <th className="py-2 px-3">Destination</th>
              <th className="py-2 px-3 text-right">Arrivals</th>
              <th className="py-2 px-3 text-right">Stress</th>
              <th className="py-2 px-2 text-center w-16">AI Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ocean-800/60 font-medium">
            {filteredRows.map((row) => (
              <tr
                key={row.name}
                className="hover:bg-ocean-800/60 transition-colors group"
              >
                {/* Rank */}
                <td className="py-2.5 px-2 text-ocean-400">
                  {row.rank === 1 ? (
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold border border-amber-500/30">
                      ★
                    </div>
                  ) : (
                    <span className="font-mono text-ocean-400 pl-1">{row.rank}</span>
                  )}
                </td>

                {/* Name */}
                <td className="py-2.5 px-3 text-white font-medium group-hover:text-cyan-300 transition-colors">
                  <div className="flex items-center space-x-1.5">
                    <Waves className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{row.name}</span>
                  </div>
                </td>

                {/* Arrivals */}
                <td className="py-2.5 px-3 text-right font-mono text-cyan-200 font-semibold">
                  {row.open_ops}
                </td>

                {/* Stress Score */}
                <td className="py-2.5 px-3 text-right font-mono text-amber-400 font-bold">
                  {row.closed_ops}
                </td>

                {/* Action: Simulate */}
                <td className="py-2.5 px-2 text-center">
                  <button
                    onClick={() => onSimulateDestination && onSimulateDestination(row)}
                    title="Simulate Carrying Capacity for this Destination"
                    className="p-1 rounded bg-ocean-750 hover:bg-cyan-500 hover:text-ocean-950 text-ocean-300 transition-colors"
                  >
                    <Sliders className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-ocean-400 pt-2 border-t border-ocean-700/40">
        <span>Showing {filteredRows.length} destinations</span>
        <span className="text-[10px] font-mono text-emerald-400">
          Click <Sliders className="w-2.5 h-2.5 inline" /> to simulate
        </span>
      </div>
    </div>
  );
};
