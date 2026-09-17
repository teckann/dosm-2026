"use client";

import React from "react";
import { Users, Waves, Banknote, BedDouble, TrendingUp, TrendingDown } from "lucide-react";

interface ExecutiveKPIBarProps {
  totalTourists: string;
  totalTouristsGrowth: string;
  compareYearText: string;
  marineParkVisitors: string;
  marineParkShare: string;
  totalSpend: string;
  totalSpendGrowth: string;
  visitorNights: string;
  selectedYear: number;
  selectedRegion: string;
}

export const ExecutiveKPIBar: React.FC<ExecutiveKPIBarProps> = ({
  totalTourists,
  totalTouristsGrowth,
  compareYearText,
  marineParkVisitors,
  marineParkShare,
  totalSpend,
  totalSpendGrowth,
  visitorNights,
  selectedYear,
  selectedRegion,
}) => {
  const isGrowthPositive = !totalTouristsGrowth.includes("-");
  const isSpendPositive = !totalSpendGrowth.includes("-");

  const cards = [
    {
      id: "tourists",
      title: "TOTAL COASTAL ARRIVALS",
      value: totalTourists,
      unit: "Tourists",
      pill: {
        text: totalTouristsGrowth,
        positive: isGrowthPositive,
        icon: isGrowthPositive ? TrendingUp : TrendingDown,
      },
      subtitle: compareYearText ? `vs ${compareYearText}` : `${selectedYear} Total Influx`,
      icon: Users,
      accentColor: "cyan",
      borderGlow: "hover:border-cyan-500/50",
      iconBg: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
    },
    {
      id: "marine_parks",
      title: "MARINE PARK FOOTFALL",
      value: marineParkVisitors,
      unit: "Visitors",
      pill: {
        text: `${marineParkShare} share`,
        positive: true,
        icon: Waves,
      },
      subtitle: "Protected reef & marine sanctuaries",
      icon: Waves,
      accentColor: "emerald",
      borderGlow: "hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    },
    {
      id: "spend",
      title: "COASTAL TOURISM SPEND",
      value: totalSpend,
      unit: "Revenue",
      pill: {
        text: totalSpendGrowth,
        positive: isSpendPositive,
        icon: isSpendPositive ? TrendingUp : TrendingDown,
      },
      subtitle: "DOSM DTS direct coastal expenditure",
      icon: Banknote,
      accentColor: "amber",
      borderGlow: "hover:border-amber-500/50",
      iconBg: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    },
    {
      id: "nights",
      title: "TOTAL VISITOR NIGHTS",
      value: visitorNights,
      unit: "Guest Stays",
      pill: {
        text: "~2.5 nights/guest",
        positive: true,
        icon: BedDouble,
      },
      subtitle: "Island resorts & coastal accommodations",
      icon: BedDouble,
      accentColor: "sky",
      borderGlow: "hover:border-sky-500/50",
      iconBg: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const PillIcon = card.pill.icon;

        return (
          <div
            key={card.id}
            className={`bg-ocean-850/90 backdrop-blur-sm border border-ocean-700/60 rounded-xl p-4 flex flex-col justify-between shadow-ocean-glow transition-all duration-200 ${card.borderGlow} group`}
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ocean-300">
                {card.title}
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${card.iconBg}`}
              >
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Middle row: Big metric & Badge */}
            <div className="my-2 flex items-baseline justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
                {card.value}
              </div>
              <div
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  card.pill.positive
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                }`}
              >
                <PillIcon className="w-2.5 h-2.5" />
                <span>{card.pill.text}</span>
              </div>
            </div>

            {/* Bottom row: Subtitle context */}
            <div className="text-[11px] text-ocean-400 pt-1 border-t border-ocean-700/40 truncate">
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};
