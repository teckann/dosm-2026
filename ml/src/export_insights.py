"""
Export Insights Module
Aggregates and formats cleaned dataset and model predictions into JSON artifacts
directly consumed by the Next.js frontend on Vercel.
"""

from pathlib import Path
import json
import pandas as pd
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent.parent
CLEANED_DATA_PATH = BASE_DIR / "data" / "processed" / "cleaned_dataset.csv"
MODELS_METADATA_PATH = BASE_DIR / "ml" / "models" / "model_metadata.json"
FRONTEND_DATA_DIR = BASE_DIR / "frontend" / "src" / "data"


def export_dashboard_data():
    """Generates all JSON data contracts required by the frontend dashboard."""
    # Ensure cleaned data exists
    if not CLEANED_DATA_PATH.exists():
        from preprocess import run_preprocessing
        df = run_preprocessing()
    else:
        df = pd.read_csv(CLEANED_DATA_PATH)

    # Ensure model metadata exists
    if not MODELS_METADATA_PATH.exists():
        from train import train_baseline_model
        train_baseline_model()

    with open(MODELS_METADATA_PATH, "r") as f:
        model_meta = json.load(f)

    FRONTEND_DATA_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Summary Key Performance Indicators (Latest Year)
    latest_year = int(df["year"].max())
    latest_df = df[df["year"] == latest_year]
    prev_year = latest_year - 1
    prev_df = df[df["year"] == prev_year]

    avg_income = float(latest_df["median_income"].mean())
    prev_income = float(prev_df["median_income"].mean()) if not prev_df.empty else avg_income
    income_delta = round(((avg_income - prev_income) / prev_income) * 100, 1)

    avg_poverty = float(latest_df["poverty_rate"].mean())
    prev_poverty = float(prev_df["poverty_rate"].mean()) if not prev_df.empty else avg_poverty
    poverty_delta = round(avg_poverty - prev_poverty, 2)

    avg_unemployment = float(latest_df["unemployment_rate"].mean())
    prev_unemployment = float(prev_df["unemployment_rate"].mean()) if not prev_df.empty else avg_unemployment
    unemployment_delta = round(avg_unemployment - prev_unemployment, 2)

    avg_digital = float(latest_df["digital_adoption_index"].mean())
    prev_digital = float(prev_df["digital_adoption_index"].mean()) if not prev_df.empty else avg_digital
    digital_delta = round(avg_digital - prev_digital, 1)

    avg_resilience = float(latest_df["resilience_index"].mean()) if "resilience_index" in latest_df.columns else 78.5

    summary_metrics = {
        "latest_year": latest_year,
        "total_states": int(latest_df["state"].nunique()),
        "kpis": [
            {
                "id": "median_income",
                "title": "National Median Income",
                "value": f"RM {int(avg_income):,}",
                "raw_value": round(avg_income, 2),
                "change": f"{income_delta:+0.1f}% YoY",
                "isPositive": income_delta >= 0,
                "description": "Average monthly household income across states"
            },
            {
                "id": "poverty_rate",
                "title": "Absolute Poverty Rate",
                "value": f"{avg_poverty:.1f}%",
                "raw_value": round(avg_poverty, 2),
                "change": f"{poverty_delta:+0.2f}%",
                "isPositive": poverty_delta <= 0,
                "description": "Percentage of households below poverty threshold"
            },
            {
                "id": "unemployment_rate",
                "title": "Unemployment Rate",
                "value": f"{avg_unemployment:.1f}%",
                "raw_value": round(avg_unemployment, 2),
                "change": f"{unemployment_delta:+0.2f}%",
                "isPositive": unemployment_delta <= 0,
                "description": "Active labor force looking for employment"
            },
            {
                "id": "digital_adoption",
                "title": "Digital Adoption Index",
                "value": f"{avg_digital:.1f}/100",
                "raw_value": round(avg_digital, 2),
                "change": f"{digital_delta:+0.1f} pts",
                "isPositive": digital_delta >= 0,
                "description": "State digital infrastructure and adoption composite"
            },
            {
                "id": "economic_resilience",
                "title": "Socio-Economic Resilience",
                "value": f"{avg_resilience:.1f}/100",
                "raw_value": round(avg_resilience, 2),
                "change": "Composite Index",
                "isPositive": True,
                "description": "Multi-dimensional resilience benchmark"
            }
        ]
    }

    # 2. State-by-State Analytics (Ranked by Median Income)
    state_analytics = []
    for _, row in latest_df.sort_values(by="median_income", ascending=False).iterrows():
        state_analytics.append({
            "state": row["state"],
            "year": int(row["year"]),
            "median_income": int(row["median_income"]),
            "unemployment_rate": float(row["unemployment_rate"]),
            "cpi": float(row["cpi"]),
            "poverty_rate": float(row["poverty_rate"]),
            "gini_coefficient": float(row["gini_coefficient"]),
            "digital_adoption_index": float(row["digital_adoption_index"]),
            "population_millions": float(row["population_millions"]),
            "resilience_index": float(row.get("resilience_index", 75.0))
        })

    # 3. Time Series Trends (Aggregated by Year)
    time_series = []
    for year, group in df.groupby("year"):
        time_series.append({
            "year": str(year),
            "median_income": round(float(group["median_income"].mean()), 2),
            "poverty_rate": round(float(group["poverty_rate"].mean()), 2),
            "unemployment_rate": round(float(group["unemployment_rate"].mean()), 2),
            "digital_adoption_index": round(float(group["digital_adoption_index"].mean()), 2),
            "cpi": round(float(group["cpi"].mean()), 2)
        })
    time_series.sort(key=lambda x: x["year"])

    # 4. Save JSON files
    with open(FRONTEND_DATA_DIR / "summary_metrics.json", "w") as f:
        json.dump(summary_metrics, f, indent=2)

    with open(FRONTEND_DATA_DIR / "state_analytics.json", "w") as f:
        json.dump(state_analytics, f, indent=2)

    with open(FRONTEND_DATA_DIR / "time_series.json", "w") as f:
        json.dump(time_series, f, indent=2)

    with open(FRONTEND_DATA_DIR / "model_insights.json", "w") as f:
        json.dump(model_meta, f, indent=2)

    print(f" Successfully exported dashboard JSON contracts to {FRONTEND_DATA_DIR}")


if __name__ == "__main__":
    export_dashboard_data()
