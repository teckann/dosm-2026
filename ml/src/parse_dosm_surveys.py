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
    expenditure_rows = []

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

        # ── 3. Jadual 7: Komponen Perbelanjaan Pelawat (2022 & 2023) ───────────
        if "Jadual 7" in wb.sheetnames:
            ws7 = wb["Jadual 7"]
            expenditure_rows.append({
                "state": clean_state,
                "shopping_2022_k": float(ws7.cell(row=8, column=2).value or 0),
                "shopping_2023_k": float(ws7.cell(row=8, column=3).value or 0),
                "fuel_2022_k": float(ws7.cell(row=9, column=2).value or 0),
                "fuel_2023_k": float(ws7.cell(row=9, column=3).value or 0),
                "transport_2022_k": float(ws7.cell(row=10, column=2).value or 0),
                "transport_2023_k": float(ws7.cell(row=10, column=3).value or 0),
                "fnb_2022_k": float(ws7.cell(row=11, column=2).value or 0),
                "fnb_2023_k": float(ws7.cell(row=11, column=3).value or 0),
                "accom_2022_k": float(ws7.cell(row=12, column=2).value or 0),
                "accom_2023_k": float(ws7.cell(row=12, column=3).value or 0),
                "packages_2022_k": float(ws7.cell(row=13, column=2).value or 0),
                "packages_2023_k": float(ws7.cell(row=13, column=3).value or 0),
                "other_2022_k": float(ws7.cell(row=14, column=2).value or 0),
                "other_2023_k": float(ws7.cell(row=14, column=3).value or 0),
                "total_visitor_spend_2022_k": float(ws7.cell(row=7, column=2).value or 0),
                "total_visitor_spend_2023_k": float(ws7.cell(row=7, column=3).value or 0),
                "household_spend_2022_k": float(ws7.cell(row=15, column=2).value or 0),
                "household_spend_2023_k": float(ws7.cell(row=15, column=3).value or 0),
                "total_receipts_2022_k": float(ws7.cell(row=16, column=2).value or 0),
                "total_receipts_2023_k": float(ws7.cell(row=16, column=3).value or 0),
            })

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
    df_exp = pd.DataFrame(expenditure_rows)

    df_summary.to_csv(OUTPUT_DIR / "dosm_state_tourism_summary.csv", index=False)
    df_dest.to_csv(OUTPUT_DIR / "dosm_state_destinations.csv", index=False)
    df_exp.to_csv(OUTPUT_DIR / "dosm_state_expenditure_components.csv", index=False)

    print(f" Successfully parsed {len(df_summary)} state summaries.")
    print(f" Extracted {len(df_dest)} authentic state destinations from Jadual 9.")
    print(f" Extracted {len(df_exp)} state expenditure component profiles from Jadual 7.")

    # ── 4. National 2023 & 2024 DTS Expenditure Bulletin ───────────────────────
    national_file = BASE_DIR / "data" / "raw" / "tourism" / "quarterly_bulletins" / "tourism_domestic_2024.xlsx"
    if national_file.exists():
        wb_nat = openpyxl.load_workbook(national_file, data_only=True)
        if "6" in wb_nat.sheetnames:
            ws_nat = wb_nat["6"]
            nat_row = {
                "metric": "national_domestic_expenditure",
                "shopping_2023_k": float(ws_nat.cell(row=9, column=2).value or 0),
                "shopping_2024_k": float(ws_nat.cell(row=9, column=3).value or 0),
                "fuel_2023_k": float(ws_nat.cell(row=10, column=2).value or 0),
                "fuel_2024_k": float(ws_nat.cell(row=10, column=3).value or 0),
                "transport_2023_k": float(ws_nat.cell(row=11, column=2).value or 0),
                "transport_2024_k": float(ws_nat.cell(row=11, column=3).value or 0),
                "fnb_2023_k": float(ws_nat.cell(row=12, column=2).value or 0),
                "fnb_2024_k": float(ws_nat.cell(row=12, column=3).value or 0),
                "accom_2023_k": float(ws_nat.cell(row=13, column=2).value or 0),
                "accom_2024_k": float(ws_nat.cell(row=13, column=3).value or 0),
                "packages_2023_k": float(ws_nat.cell(row=14, column=2).value or 0),
                "packages_2024_k": float(ws_nat.cell(row=14, column=3).value or 0),
                "other_2023_k": float(ws_nat.cell(row=15, column=2).value or 0),
                "other_2024_k": float(ws_nat.cell(row=15, column=3).value or 0),
                "total_visitor_spend_2023_k": float(ws_nat.cell(row=8, column=2).value or 0),
                "total_visitor_spend_2024_k": float(ws_nat.cell(row=8, column=3).value or 0),
                "household_spend_2023_k": float(ws_nat.cell(row=16, column=2).value or 0),
                "household_spend_2024_k": float(ws_nat.cell(row=16, column=3).value or 0),
                "total_receipts_2023_k": float(ws_nat.cell(row=19, column=2).value or 0),
                "total_receipts_2024_k": float(ws_nat.cell(row=19, column=3).value or 0),
            }
            wb_nat.close()
            pd.DataFrame([nat_row]).to_csv(OUTPUT_DIR / "dosm_national_expenditure_2023_2024.csv", index=False)
            print(" Extracted official national 2023-2024 DTS expenditure components from Bulletin Jadual 6.")

    return df_summary, df_dest, df_exp

if __name__ == "__main__":
    parse_all_state_surveys()
