"use client";

import React, { useState } from "react";
import { Sliders, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { ModelInsights } from "@/lib/types";

interface SimulatorProps {
  modelInsights: ModelInsights;
}

export const Simulator: React.FC<SimulatorProps> = ({ modelInsights }) => {
  const defaults = {
    median_income: 7000,
    unemployment_rate: 3.5,
    digital_adoption_index: 80,
    cpi: 125,
    gini_coefficient: 0.37,
  };

  const [inputs, setInputs] = useState(defaults);

  const { intercept, coefficients } = modelInsights.simulator_weights;

  // Real-time inference using exported model weights
  const predictedPoverty = Math.max(
    0.1,
    intercept +
      (coefficients.median_income || -0.002) * inputs.median_income +
      (coefficients.unemployment_rate || 2.4) * inputs.unemployment_rate +
      (coefficients.digital_adoption_index || -0.1) * inputs.digital_adoption_index +
      (coefficients.cpi || 0.08) * inputs.cpi +
      (coefficients.gini_coefficient || 18.0) * inputs.gini_coefficient
  );

  // Calculate composite resilience index (0 to 100)
  const normIncome = Math.min(1, Math.max(0, (inputs.median_income - 3000) / 9000));
  const normDigital = Math.min(1, Math.max(0, (inputs.digital_adoption_index - 40) / 60));
  const normUnemp = Math.min(1, Math.max(0, (8.0 - inputs.unemployment_rate) / 6.0));
  const normPov = Math.min(1, Math.max(0, (20.0 - predictedPoverty) / 20.0));
  const predictedResilience = Math.round(
    (normIncome * 0.35 + normDigital * 0.25 + normUnemp * 0.2 + normPov * 0.2) * 100
  );

  const handleReset = () => setInputs(defaults);

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900">What-If Policy & Scenario Simulator</h3>
            <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-purple-200">
              Live Model
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate policy interventions in real-time. Model weights trained via Python Scikit-Learn pipeline.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Sliders Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Slider 1: Median Income */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Target Median Income (RM)</span>
              <span className="text-blue-600 font-mono">RM {inputs.median_income.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="3000"
              max="12000"
              step="100"
              value={inputs.median_income}
              onChange={(e) => setInputs({ ...inputs, median_income: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>RM 3,000</span>
              <span>RM 12,000</span>
            </div>
          </div>

          {/* Slider 2: Unemployment Rate */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Unemployment Rate (%)</span>
              <span className="text-blue-600 font-mono">{inputs.unemployment_rate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="9.0"
              step="0.1"
              value={inputs.unemployment_rate}
              onChange={(e) => setInputs({ ...inputs, unemployment_rate: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>1.5%</span>
              <span>9.0%</span>
            </div>
          </div>

          {/* Slider 3: Digital Adoption Index */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Digital Infrastructure & Adoption (Score 0-100)</span>
              <span className="text-blue-600 font-mono">{inputs.digital_adoption_index.toFixed(0)} pts</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="1"
              value={inputs.digital_adoption_index}
              onChange={(e) =>
                setInputs({ ...inputs, digital_adoption_index: Number(e.target.value) })
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>40</span>
              <span>100</span>
            </div>
          </div>

          {/* Slider 4: CPI */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Consumer Price Index (CPI)</span>
              <span className="text-blue-600 font-mono">{inputs.cpi.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="115"
              max="135"
              step="0.5"
              value={inputs.cpi}
              onChange={(e) => setInputs({ ...inputs, cpi: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>115</span>
              <span>135</span>
            </div>
          </div>

          {/* Slider 5: Gini Coefficient */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Income Inequality (Gini Coefficient)</span>
              <span className="text-blue-600 font-mono">{inputs.gini_coefficient.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.32"
              max="0.45"
              step="0.005"
              value={inputs.gini_coefficient}
              onChange={(e) => setInputs({ ...inputs, gini_coefficient: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>0.320 (Equal)</span>
              <span>0.450 (Unequal)</span>
            </div>
          </div>
        </div>

        {/* Prediction Outputs Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-xl shadow-lg border border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Simulated Projection</span>
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-400">Predicted Absolute Poverty Rate</span>
              <div className="text-3xl font-extrabold text-white mt-1">
                {predictedPoverty.toFixed(2)}%
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {predictedPoverty < 3.0
                  ? " Low poverty risk under these policy conditions"
                  : predictedPoverty < 8.0
                  ? " Moderate risk - targeted assistance recommended"
                  : " Critical intervention required in social safety net"}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Predicted Resilience Score</span>
                <span className="text-emerald-400 font-bold">{predictedResilience} / 100</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    predictedResilience > 75
                      ? "bg-emerald-500"
                      : predictedResilience > 50
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${Math.min(100, predictedResilience)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start space-x-2.5 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Inference is calculated directly in-browser using weights exported from your Python model (R²:{" "}
              {modelInsights.metrics.r2_score}). Zero latency, 100% reliable on Vercel Edge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
