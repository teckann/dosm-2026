"""
Data Preprocessing Module for Marine Tourism Datathon Pipeline
Loads raw CSV data from structured folders, performs validation, feature engineering, and exports cleaned data.
"""

from pathlib import Path
import pandas as pd
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent.parent
RAW_DATA_PATH = BASE_DIR / "data" / "raw" / "integrated" / "marine_tourism_indicators.csv"
PROCESSED_DATA_PATH = BASE_DIR / "data" / "processed" / "cleaned_dataset.csv"


def load_raw_data(filepath: Path = RAW_DATA_PATH) -> pd.DataFrame:
    """Loads raw dataset from CSV."""
    if not filepath.exists():
        # Fallback to older or alternative raw files if needed
        alt_paths = [
            BASE_DIR / "data" / "raw" / "marine" / "fish_landings.csv",
            BASE_DIR / "data" / "raw" / "tourism" / "dosm_domestic_tourism_by_state.csv",
        ]
        for alt in alt_paths:
            if alt.exists():
                filepath = alt
                break
        else:
            raise FileNotFoundError(f"Raw data file not found at: {filepath}")

    df = pd.read_csv(filepath)
    print(f" Loaded {len(df)} rows from {filepath.name}")
    return df


def clean_and_engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans data and engineers relevant indicators for marine tourism analysis.
    """
    df = df.copy()

    # Sort by state and date if present
    sort_cols = [c for c in ["state", "year", "quarter"] if c in df.columns]
    if sort_cols:
        df = df.sort_values(by=sort_cols).reset_index(drop=True)

    # Compute year-over-year tourist growth if historical data exists
    if "total_tourists" in df.columns and "state" in df.columns:
        df["tourist_growth_qoq"] = df.groupby("state")["total_tourists"].pct_change() * 100
        df["tourist_growth_qoq"] = df["tourist_growth_qoq"].fillna(0.0).round(2)

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
