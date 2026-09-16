"use client";

import React from "react";
import { ChevronDown, Award, Anchor, Waves } from "lucide-react";

interface LeaderboardRow {
  rank: number;
  name: string;
  open_ops: number;
  closed_ops: number;
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
    rows: LeaderboardRow[];
  };
}

export const MaritimeLeaderboardCard: React.FC<MaritimeLeaderboardCardProps> = ({ data }) => {
  return (
    <div className="bg-ocean-850 border border-ocean-700/60 rounded-lg p-5 flex flex-col justify-between shadow-ocean-glow">
      {/* Header with Dropdown */}
      <div className="flex items-center justify-between pb-3 border-b border-ocean-700/40">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-ocean-200">
            {data.title}
          </span>
          <button className="flex items-center space-x-1 text-xs text-ocean-400 hover:text-white transition-colors">
            <span>{data.period}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Leaderboard Table (Matching Reference Screenshot) */}
      <div className="overflow-x-auto py-2 flex-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-ocean-400 font-semibold uppercase tracking-wider text-[10px] border-b border-ocean-700/40">
              <th className="py-2.5 px-2 w-8">{data.headers.rank}</th>
              <th className="py-2.5 px-3">{data.headers.name}</th>
              <th className="py-2.5 px-3 text-right">{data.headers.open_ops}</th>
              <th className="py-2.5 px-3 text-right">{data.headers.closed_ops}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ocean-800/60 font-medium">
            {data.rows.map((row) => (
              <tr
                key={row.rank}
                className="hover:bg-ocean-800/50 transition-colors group cursor-pointer"
              >
                {/* Rank with Trophy/Badge for #1 */}
                <td className="py-3 px-2 text-ocean-400">
                  {row.rank === 1 ? (
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold border border-amber-500/30">
                      ★
                    </div>
                  ) : (
                    <span className="font-mono text-ocean-400 pl-1">{row.rank}</span>
                  )}
                </td>

                {/* Name / Port */}
                <td className="py-3 px-3 text-white font-medium group-hover:text-cyan-300 transition-colors">
                  <div className="flex items-center space-x-2">
                    <Waves className="w-3.5 h-3.5 text-ocean-400 shrink-0" />
                    <span className="truncate">{row.name}</span>
                  </div>
                </td>

                {/* Open Ops */}
                <td className="py-3 px-3 text-right font-mono text-ocean-200">
                  {row.open_ops}
                </td>

                {/* Closed Ops / Tonnage */}
                <td className="py-3 px-3 text-right font-mono text-white font-semibold">
                  {row.closed_ops}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-ocean-400 pt-2 border-t border-ocean-700/40">
        <span>Displaying Top 6 Bases</span>
        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live AIS Satellite Feed
        </span>
      </div>
    </div>
  );
};
