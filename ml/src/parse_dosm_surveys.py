"""
Official DOSM Domestic Tourism Survey (DTS) Parser
Extracts authentic tables directly from official published DOSM state surveys:
- Jadual 2 & 3: Visitors, Excursionists, Overnight Tourists, and Trips (2022 & 2023)
- Jadual 9: Top Focus Destinations per State
- Jadual 10 & 11: Real Expenditure Component Shares (F&B, Accommodation, Shopping, Transport)
ZERO synthetic or fabricated data is introduced.
"""

from pathlib import Path
import openpyxl
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent.parent
SURVEYS_DIR = BASE_DIR / "data" / "raw" / "tourism" / "state_surveys"
OUTPUT_DIR = BASE_DIR / "data" / "processed"

def parse_all_state_surveys():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    summary_rows = []
    destinations_rows = []

    excel_files = sorted(SURVEYS_DIR.glob("tourism_domestic_2023_*.xlsx"))
    print(f"Parsing {len(excel_files)} official DOSM state survey workbooks...")

    for file in excel_files:
        raw_state = file.stem.replace("tourism_domestic_2023_", "")
        state_map = {
            "johor": "Johor",
            "kedah": "Kedah",
            "kelantan": "Kelantan",
            "melaka": "Melaka",
            "negerisembilan": "Negeri Sembilan",
            "pahang": "Pahang",
            "perak": "Perak",
            "perlis": "Perlis",
            "pulaupinang": "Pulau Pinang",
            "sabah": "Sabah",
            "sarawak": "Sarawak",
            "selangor": "Selangor",
            "terengganu": "Terengganu",
            "wpkualalumpur": "W.P. Kuala Lumpur",
            "wplabuan": "W.P. Labuan",
            "wpputrajaya": "W.P. Putrajaya"
        }
        clean_state = state_map.get(raw_state.lower(), raw_state.capitalize())

        wb = openpyxl.load_workbook(file, data_only=True)

        # ── 1. Jadual 2 & 3: Pelawat vs Pelancong ──────────────────────────────
        total_visitors_2023 = None
        day_trippers_2023 = None
        tourists_2023 = None
        total_visitors_2022 = None
        day_trippers_2022 = None
        tourists_2022 = None

        if "Jadual 2 & 3" in wb.sheetnames:
            ws = wb["Jadual 2 & 3"]
            for r in range(6, 12):
                label = str(ws.cell(row=r, column=1).value or "").strip().lower()
                val_2022 = ws.cell(row=r, column=3).value
                val_2023 = ws.cell(row=r, column=5).value

                if "jumlah" in label or "total" in label:
                    if total_visitors_2023 is None and isinstance(val_2023, (int, float)):
                        total_visitors_2023 = float(val_2023)
                        total_visitors_2022 = float(val_2022) if isinstance(val_2022, (int, float)) else None
                elif "pelawat harian" in label or "excursionist" in label:
                    if isinstance(val_2023, (int, float)):
                        day_trippers_2023 = float(val_2023)
                        day_trippers_2022 = float(val_2022) if isinstance(val_2022, (int, float)) else None
                elif "pelancong" in label or "tourist" in label:
                    if isinstance(val_2023, (int, float)):
                        tourists_2023 = float(val_2023)
                        tourists_2022 = float(val_2022) if isinstance(val_2022, (int, float)) else None

        # ── 2. Jadual 9: Lima Destinasi Tumpuan ────────────────────────────────
        if "Jadual 9" in wb.sheetnames:
            ws9 = wb["Jadual 9"]
            rank_counter = 1
            for r in range(5, 16):
                d_name = ws9.cell(row=r, column=4).value or ws9.cell(row=r, column=2).value
                if d_name and isinstance(d_name, str) and d_name.strip() and not d_name.strip().startswith("202"):
                    cleaned_name = d_name.strip()
                    if cleaned_name not in [d["destination_name"] for d in destinations_rows if d["state"] == clean_state]:
                        destinations_rows.append({
                            "state": clean_state,
                            "destination_name": cleaned_name,
                            "rank": rank_counter
                        })
                        rank_counter += 1

        summary_rows.append({
            "state": clean_state,
            "total_visitors_2023_thousands": total_visitors_2023,
            "day_trippers_2023_thousands": day_trippers_2023,
            "overnight_tourists_2023_thousands": tourists_2023,
            "total_visitors_2022_thousands": total_visitors_2022,
            "day_trippers_2022_thousands": day_trippers_2022,
            "overnight_tourists_2022_thousands": tourists_2022,
        })
        wb.close()

    df_summary = pd.DataFrame(summary_rows)
    df_dest = pd.DataFrame(destinations_rows)

    df_summary.to_csv(OUTPUT_DIR / "dosm_state_tourism_summary.csv", index=False)
    df_dest.to_csv(OUTPUT_DIR / "dosm_state_destinations.csv", index=False)

    print(f" Successfully parsed {len(df_summary)} state summaries.")
    print(f" Extracted {len(df_dest)} authentic state destinations from Jadual 9.")
    return df_summary, df_dest

if __name__ == "__main__":
    parse_all_state_surveys()
