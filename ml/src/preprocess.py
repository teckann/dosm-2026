"""
Data Preprocessing Module for Datathon Pipeline
Loads raw CSV data, performs validation, feature engineering, and exports cleaned data.
"""

from pathlib import Path
import pandas as pd
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent.parent
RAW_DATA_PATH = BASE_DIR / "data" / "raw" / "sample_dataset.csv"
PROCESSED_DATA_PATH = BASE_DIR / "data" / "processed" / "cleaned_dataset.csv"


def load_raw_data(filepath: Path = RAW_DATA_PATH) -> pd.DataFrame:
    """Loads raw dataset from CSV."""
    if not filepath.exists():
        raise FileNotFoundError(f"Raw data file not found at: {filepath}")
    df = pd.read_csv(filepath)
    print(f" Loaded {len(df)} rows from {filepath.name}")
    return df


def clean_and_engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans data and engineers relevant indicators for analysis.
    """
    df = df.copy()

    # Sort by state and year
    if "state" in df.columns and "year" in df.columns:
        df = df.sort_values(by=["state", "year"]).reset_index(drop=True)

        # Calculate Year-over-Year (YoY) income growth per state
        df["income_growth_yoy"] = df.groupby("state")["median_income"].pct_change() * 100
        df["income_growth_yoy"] = df["income_growth_yoy"].fillna(0.0).round(2)

        # Calculate an Economic Resilience Score (normalized composite index)
        # Higher income & digital adoption, lower poverty & unemployment
        norm_income = (df["median_income"] - df["median_income"].min()) / (df["median_income"].max() - df["median_income"].min())
        norm_digital = (df["digital_adoption_index"] - df["digital_adoption_index"].min()) / (df["digital_adoption_index"].max() - df["digital_adoption_index"].min())
        norm_unemp = (df["unemployment_rate"].max() - df["unemployment_rate"]) / (df["unemployment_rate"].max() - df["unemployment_rate"].min())
        norm_pov = (df["poverty_rate"].max() - df["poverty_rate"]) / (df["poverty_rate"].max() - df["poverty_rate"].min())

        df["resilience_index"] = ((norm_income * 0.35 + norm_digital * 0.25 + norm_unemp * 0.20 + norm_pov * 0.20) * 100).round(2)

    return df


def run_preprocessing() -> pd.DataFrame:
    """Main preprocessing execution function."""
    df = load_raw_data()
    cleaned_df = clean_and_engineer_features(df)
    
    PROCESSED_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    cleaned_df.to_csv(PROCESSED_DATA_PATH, index=False)
    print(f" Saved cleaned dataset to {PROCESSED_DATA_PATH}")
    return cleaned_df


if __name__ == "__main__":
    run_preprocessing()
