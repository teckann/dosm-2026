export interface KPIItem {
  id: string;
  title: string;
  value: string;
  raw_value: number;
  change: string;
  isPositive: boolean;
  description: string;
}

export interface SummaryMetrics {
  latest_year: number;
  total_states: number;
  kpis: KPIItem[];
}

export interface StateData {
  state: string;
  year: number;
  median_income: number;
  unemployment_rate: number;
  cpi: number;
  poverty_rate: number;
  gini_coefficient: number;
  digital_adoption_index: number;
  population_millions: number;
  resilience_index: number;
}

export interface TimeSeriesPoint {
  year: string;
  median_income: number;
  poverty_rate: number;
  unemployment_rate: number;
  digital_adoption_index: number;
  cpi: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  percentage: number;
}

export interface ModelInsights {
  target: string;
  features: string[];
  metrics: {
    r2_score: number;
    mae: number;
    mse: number;
    sample_size: number;
  };
  feature_importances: FeatureImportance[];
  simulator_weights: {
    intercept: number;
    coefficients: Record<string, number>;
  };
}
