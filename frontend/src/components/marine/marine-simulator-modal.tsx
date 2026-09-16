"use client";

import React, { useState } from "react";
import { X, Sparkles, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";

interface MarineSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelData: {
    model_name: string;
    r2_score: number;
    mae: number;
    features: Array<{ feature: string; percentage: number }>;
    simulator_weights: {
      intercept: number;
      coefficients: Record<string, number>;
    };
  };
}

export const MarineSimulatorModal: React.FC<MarineSimulatorModalProps> = ({
  isOpen,
  onClose,
  modelData,
}) => {
  const defaults = {
    fleet_size: 660,
    fuel_subsidy: 3500000,
    patrol_hours: 450,
    sst_anomaly: 0.6,
  };

  const [inputs, setInputs] = useState(defaults);

  if (!isOpen) return null;

  const { intercept, coefficients } = modelData.simulator_weights;

  // Bioeconomic formula calculation
  const predictedCatchRate = Math.max(
    15,
    intercept +
      (coefficients.fleet_size || 0.08) * inputs.fleet_size +
      (coefficients.fuel_subsidy || 0.000045) * (inputs.fuel_subsidy / 1000) +
      (coefficients.patrol_hours || -0.05) * inputs.patrol_hours +
      (coefficients.sst_anomaly || 2.1) * inputs.sst_anomaly
  );

  // Overfishing Risk calculation (0 to 100)
  const overfishingRisk = Math.min(
    99,
    Math.max(
      5,
      Math.round(
        (inputs.fleet_size / 900) * 45 +
          (inputs.fuel_subsidy / 6000000) * 35 -
          (inputs.patrol_hours / 800) * 25 +
          inputs.sst_anomaly * 15
      )
    )
  );

  const isRiskHigh = overfishingRisk > 65;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-ocean-900 border border-ocean-700/80 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ocean-400 hover:text-white p-1 rounded-lg hover:bg-ocean-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Bioeconomic Predictive Model (Python ML)</span>
        </div>
        <h2 className="text-xl font-extrabold text-white">
          Marine Catch Quota & Overfishing Risk Simulator
        </h2>
        <p className="text-xs text-ocean-300 mt-1">
          Model: {modelData.model_name} (R² = {modelData.r2_score})
        </p>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* Slider 1: Fleet Size */}
          <div className="bg-ocean-850 p-3.5 rounded-lg border border-ocean-700/60">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-ocean-200">Active Vessel Fleet</span>
              <span className="text-cyan-400 font-mono">{inputs.fleet_size} vessels</span>
            </div>
            <input
              type="range"
              min="300"
              max="1000"
              step="10"
              value={inputs.fleet_size}
              onChange={(e) => setInputs({ ...inputs, fleet_size: Number(e.target.value) })}
              className="w-full h-1.5 bg-ocean-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-ocean-400 mt-1">
              <span>300 (Low)</span>
              <span>1000 (Intense)</span>
            </div>
          </div>

          {/* Slider 2: Fuel Subsidy */}
          <div className="bg-ocean-850 p-3.5 rounded-lg border border-ocean-700/60">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-ocean-200">Fuel Subsidy Allocation</span>
              <span className="text-cyan-400 font-mono">
                RM {(inputs.fuel_subsidy / 1000000).toFixed(1)}M
              </span>
            </div>
            <input
              type="range"
              min="1000000"
              max="6000000"
              step="200000"
              value={inputs.fuel_subsidy}
              onChange={(e) => setInputs({ ...inputs, fuel_subsidy: Number(e.target.value) })}
              className="w-full h-1.5 bg-ocean-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-ocean-400 mt-1">
              <span>RM 1.0M</span>
              <span>RM 6.0M</span>
            </div>
          </div>

          {/* Slider 3: Patrol Hours */}
          <div className="bg-ocean-850 p-3.5 rounded-lg border border-ocean-700/60">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-ocean-200">Enforcement Patrol Hours</span>
              <span className="text-cyan-400 font-mono">{inputs.patrol_hours} hrs/mo</span>
            </div>
            <input
              type="range"
              min="100"
              max="800"
              step="25"
              value={inputs.patrol_hours}
              onChange={(e) => setInputs({ ...inputs, patrol_hours: Number(e.target.value) })}
              className="w-full h-1.5 bg-ocean-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-ocean-400 mt-1">
              <span>100 hrs</span>
              <span>800 hrs</span>
            </div>
          </div>

          {/* Slider 4: Sea Surface Temperature */}
          <div className="bg-ocean-850 p-3.5 rounded-lg border border-ocean-700/60">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-ocean-200">Sea Temp Anomaly (SST)</span>
              <span className="text-cyan-400 font-mono">+{inputs.sst_anomaly.toFixed(1)} °C</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.5"
              step="0.1"
              value={inputs.sst_anomaly}
              onChange={(e) => setInputs({ ...inputs, sst_anomaly: Number(e.target.value) })}
              className="w-full h-1.5 bg-ocean-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-ocean-400 mt-1">
              <span>0.0 °C (Normal)</span>
              <span>+2.5 °C (Warm El Niño)</span>
            </div>
          </div>
        </div>

        {/* Prediction Results Banner */}
        <div className="mt-5 p-4 rounded-xl bg-ocean-950 border border-ocean-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-ocean-400 uppercase font-semibold">
              Projected Daily Catch Volume
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-0.5">
              {predictedCatchRate.toFixed(1)} <span className="text-sm font-normal text-ocean-300">k MT</span>
            </div>
          </div>

          <div className="w-full sm:w-1/2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-ocean-300 flex items-center gap-1">
                {isRiskHigh ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                Overfishing Risk Score
              </span>
              <span
                className={`font-mono font-bold ${
                  isRiskHigh ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {overfishingRisk}%
              </span>
            </div>
            <div className="w-full bg-ocean-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  overfishingRisk > 65
                    ? "bg-rose-500"
                    : overfishingRisk > 40
                    ? "bg-amber-400"
                    : "bg-emerald-400"
                }`}
                style={{ width: `${overfishingRisk}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-ocean-800">
          <button
            onClick={() => setInputs(defaults)}
            className="flex items-center space-x-1.5 text-xs text-ocean-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Baseline</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-ocean-750 hover:bg-ocean-700 text-white rounded-lg transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
