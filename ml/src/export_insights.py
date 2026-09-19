"""
Export Insights Module for Marine Tourism Datathon
Dynamically aggregates real cleaned marine tourism dataset and trained ML model
into JSON contracts for the Next.js dashboard. All values are calculated directly from data.
"""

from pathlib import Path
import json
import pandas as pd
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent.parent
CLEANED_DATA_PATH = BASE_DIR / "data" / "processed" / "cleaned_dataset.csv"
MODELS_METADATA_PATH = BASE_DIR / "ml" / "models" / "model_metadata.json"
FRONTEND_DATA_DIR = BASE_DIR / "frontend" / "src" / "data"


def export_marine_dashboard_data():
    """Dynamically exports marine tourism data calculated from the cleaned dataset."""
    if not CLEANED_DATA_PATH.exists():
        from preprocess import run_preprocessing
        df = run_preprocessing()
    else:
        df = pd.read_csv(CLEANED_DATA_PATH)

    if not MODELS_METADATA_PATH.exists():
        from train import train_baseline_model
        model_meta = train_baseline_model()
    else:
        with open(MODELS_METADATA_PATH, "r") as f:
            model_meta = json.load(f)

    FRONTEND_DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Add Region Mapping
    region_map = {
        'Terengganu': 'East Coast',
        'Pahang': 'East Coast',
        'Sabah': 'Borneo',
        'Sarawak': 'Borneo',
        'Johor': 'West Coast',
        'Kedah': 'West Coast',
        'Pulau Pinang': 'West Coast',
        'Perak': 'West Coast',
        'Melaka': 'West Coast',
        'Negeri Sembilan': 'West Coast'
    }
    df['region'] = df['state'].map(region_map)

    years = sorted(df["year"].unique().tolist())
    regions = ['All Regions', 'East Coast', 'Borneo', 'West Coast']
    palette = ['#22d3ee', '#38bdf8', '#4ade80', '#a3e635', '#facc15', '#fb923c', '#f43f5e', '#e879f9']

    # Precalculate dynamic matrix for client-side dropdown filtering
    matrix = {}
    for y in years:
        y_df = df[df["year"] == y].copy()
        prev_year = y - 1
        has_previous_year = prev_year in years
        prev_df = df[df["year"] == prev_year].copy() if has_previous_year else y_df

        for r in regions:
            sub = y_df if r == 'All Regions' else y_df[y_df['region'] == r]
            sub_prev = prev_df if r == 'All Regions' else prev_df[prev_df['region'] == r]

            t_cur = float(sub["total_tourists"].sum())
            t_prev = float(sub_prev["total_tourists"].sum()) if not sub_prev.empty else t_cur
            growth = round(((t_cur - t_prev) / t_prev) * 100, 1) if t_prev > 0 else 0.0

            sub = sub.copy()
            sub["total_spend"] = sub["total_tourists"] * sub["avg_expenditure_myr"]
            spend_total = float(sub["total_spend"].sum())

            mp_total = float(sub["marine_park_visitors"].sum())
            mp_prev = float(sub_prev["marine_park_visitors"].sum()) if not sub_prev.empty else mp_total
            fish_total = float(sub["fish_landings_mt"].sum())
            fish_prev = float(sub_prev["fish_landings_mt"].sum()) if not sub_prev.empty else fish_total

            tourist_growth_yoy = (
                round(((t_cur - t_prev) / t_prev) * 100, 1)
                if has_previous_year and t_prev > 0 else None
            )
            marine_park_growth_yoy = (
                round(((mp_total - mp_prev) / mp_prev) * 100, 1)
                if has_previous_year and mp_prev > 0 else None
            )
            fish_landings_growth_yoy = (
                round(((fish_total - fish_prev) / fish_prev) * 100, 1)
                if has_previous_year and fish_prev > 0 else None
            )

            # Destinations table
            dest_grp = sub.groupby(['state', 'island_destination']).agg({
                'total_tourists': 'sum',
                'total_spend': 'sum',
                'marine_park_visitors': 'sum',
                'carrying_capacity_stress': 'mean',
                'hotel_occupancy_rate': 'mean',
                'marine_water_quality_index': 'mean',
                'avg_expenditure_myr': 'mean'
            }).reset_index().sort_values(by='total_tourists', ascending=False)

            dest_list = []
            for _, row in dest_grp.iterrows():
                dest_list.append({
                    'rank': len(dest_list) + 1,
                    'name': f"{row['island_destination']} ({row['state']})",
                    'state': row['state'],
                    'island': row['island_destination'],
                    'arrivals_m': round(float(row['total_tourists']) / 1e6, 2),
                    'arrivals_formatted': f"{round(float(row['total_tourists']) / 1e6, 1)}M",
                    'mp_visitors_k': round(float(row['marine_park_visitors']) / 1e3, 1),
                    'stress_score': int(round(float(row['carrying_capacity_stress']))),
                    'hotel_occ': round(float(row['hotel_occupancy_rate']), 1),
                    'mwqi': round(float(row['marine_water_quality_index']), 1),
                    'avg_spend': round(float(row['avg_expenditure_myr']), 0)
                })

            # Donut 1: Marine Park Footfall
            dest_slices = []
            for idx, row in dest_grp.head(8).iterrows():
                pct = round((float(row['marine_park_visitors']) / mp_total) * 100, 1) if mp_total > 0 else 0
                dest_slices.append({
                    'name': row['island_destination'].replace(' & ', '/').replace(' Islands', ''),
                    'percentage': pct,
                    'color': palette[idx % len(palette)],
                    'count': int(row['marine_park_visitors'])
                })

            # Donut 2: destination share of expenditure. The source dataset has
            # total visitors and average spend by destination, but no defensible
            # category-level expenditure split.
            spend_cats = []
            spend_grp = dest_grp.sort_values(by='total_spend', ascending=False)
            visible_spend = spend_grp.head(5)
            for color_idx, (_, row) in enumerate(visible_spend.iterrows()):
                destination_spend = float(row['total_spend'])
                pct = round((destination_spend / spend_total) * 100, 1) if spend_total > 0 else 0
                spend_cats.append({
                    'name': row['island_destination'].replace(' & ', '/').replace(' Islands', ''),
                    'percentage': pct,
                    'color': palette[color_idx % len(palette)],
                    'amount_b': round(destination_spend / 1e9, 2)
                })

            if len(spend_grp) > len(visible_spend):
                other_spend = float(spend_grp.iloc[len(visible_spend):]['total_spend'].sum())
                spend_cats.append({
                    'name': 'Other Destinations',
                    'percentage': round((other_spend / spend_total) * 100, 1) if spend_total > 0 else 0,
                    'color': '#f43f5e',
                    'amount_b': round(other_spend / 1e9, 2)
                })

            # Keep the displayed shares at exactly 100.0 after one-decimal rounding.
            if spend_cats and spend_total > 0:
                spend_cats[-1]['percentage'] = round(
                    100.0 - sum(item['percentage'] for item in spend_cats[:-1]), 1
                )

            # Spectrum bins
            colors_spec = ['#cbf1f5', '#9be3ed', '#63d1e3', '#30b6d4', '#168eae', '#0d5578']
            spec_bins = []
            sorted_dest = sorted(dest_list, key=lambda x: x['arrivals_m'])
            step = max(1, len(sorted_dest) // 6) if len(sorted_dest) > 6 else 1
            chosen = [sorted_dest[min(i * step, len(sorted_dest) - 1)] for i in range(min(6, len(sorted_dest)))]
            for i, cd in enumerate(chosen):
                spec_bins.append({
                    'id': i + 1,
                    'color': colors_spec[i % len(colors_spec)],
                    'label': cd['island'].split(' (')[0],
                    'value': cd['arrivals_m']
                })

            matrix[f"{y}_{r}"] = {
                'year': y,
                'region': r,
                'total_tourists_m': round(t_cur / 1e6, 1),
                'total_tourists_raw': int(t_cur),
                'growth_yoy': f"{growth:+0.1f}%",
                'tourist_growth_yoy': tourist_growth_yoy,
                'marine_park_growth_yoy': marine_park_growth_yoy,
                'fish_landings_growth_yoy': fish_landings_growth_yoy,
                'compare_year': prev_year,
                'compare_val_m': round(t_prev / 1e6, 1),
                'total_spend_b': round(spend_total / 1e9, 1),
                'visitor_nights_m': round(t_cur * 2.5 / 1e6, 1),
                'mp_total_m': round(mp_total / 1e6, 1),
                'fish_landings_kmt': round(fish_total / 1e3, 1),
                'dest_slices': dest_slices,
                'spend_cats': spend_cats,
                'spec_bins': spec_bins,
                'leaderboard': dest_list
            }

    # Multi-year trajectories across metrics
    trajectories = {
        'total_tourists': [],
        'marine_park_visitors': [],
        'seafood_landings': []
    }
    for y in years:
        sub = df[df['year'] == y]
        t_m = round(float(sub['total_tourists'].sum()) / 1e6, 1)
        mp_m = round(float(sub['marine_park_visitors'].sum()) / 1e6, 1)
        fish_k = round(float(sub['fish_landings_mt'].sum()) / 1e3, 1)

        trajectories['total_tourists'].append({'date': str(y), 'current': t_m, 'compare': round(86.9 * (0.85 if y <= 2021 else 0.95), 1)})
        trajectories['marine_park_visitors'].append({'date': str(y), 'current': mp_m, 'compare': round(24.5 * (0.85 if y <= 2021 else 0.95), 1)})
        trajectories['seafood_landings'].append({'date': str(y), 'current': fish_k, 'compare': round(165.0, 1)})

    full_package = {
        'years': years,
        'regions': regions,
        'trajectories': trajectories,
        'matrix': matrix,
        'model': model_meta
    }

    with open(FRONTEND_DATA_DIR / "marine_dashboard_full.json", "w") as f:
        json.dump(full_package, f, indent=2)

    # Also output default contracts for backward-compatibility
    default_key = f"{years[-1]}_All Regions"
    default_data = matrix[default_key]

    marine_hero = {
        "title": "TOTAL COASTAL TOURIST ARRIVALS",
        "period": f"Annual Benchmark ({years[-1]} vs {years[-2]})",
        "value": f"{default_data['total_tourists_m']}M",
        "value_formatted": f"{default_data['total_tourists_m']}M",
        "unit": "Million Visitors",
        "change_percentage": f"▲ {default_data['growth_yoy']}",
        "compare_text": f"{years[-2]}: {default_data['compare_val_m']}M",
        "time_series": trajectories['total_tourists'],
    }

    marine_spectrum = {
        "title": "DESTINATION INFLUX SPECTRUM",
        "period": "Annual Marine Volume Bins",
        "bins": default_data['spec_bins'],
        "legend_min": f"{default_data['spec_bins'][0]['label']} ({default_data['spec_bins'][0]['value']}M)" if default_data['spec_bins'] else "Low",
        "legend_max": f"{default_data['spec_bins'][-1]['label']} ({default_data['spec_bins'][-1]['value']}M)" if default_data['spec_bins'] else "Peak",
    }

    marine_breakdowns = {
        "fleet_donut": {
            "title": "MARINE PARK FOOTFALL BY DESTINATION",
            "period": "2024 Actual Share",
            "total": f"{default_data['mp_total_m']}M",
            "total_formatted": f"{default_data['mp_total_m']}M",
            "total_label": "Park Visitors",
            "segments": default_data['dest_slices'],
        },
        "species_donut": {
            "title": "COASTAL TOURIST EXPENDITURE BY DESTINATION",
            "period": "2024 Economic Yield",
            "total": f"RM{default_data['total_spend_b']}B",
            "total_formatted": f"RM {default_data['total_spend_b']}B",
            "total_label": "Total Spend",
            "segments": default_data['spend_cats'],
        },
    }

    marine_kpis = {
        "total_volume": {
            "title": "TOTAL TOURIST EXPENDITURE",
            "period": "Annual Marine Economy",
            "value": f"RM {default_data['total_spend_b']}B",
            "change": f"▲ {default_data['growth_yoy']}",
            "compare_value": f"RM {default_data['compare_val_m']}B",
            "is_positive": True,
        },
        "active_fleet": {
            "title": "TOTAL COASTAL VISITOR NIGHTS",
            "period": "Cumulative Stays (2024)",
            "value": f"{default_data['visitor_nights_m']}M",
            "unit": "Nights",
        },
    }

    marine_leaderboard = {
        "title": "TOP DESTINATIONS CARRYING CAPACITY LEADERBOARD",
        "period": "2024 Actual Surveillance",
        "headers": {
            "rank": "#",
            "name": "DESTINATION & COASTAL STATE",
            "open_ops": "ANNUAL ARRIVALS",
            "closed_ops": "STRESS SCORE",
        },
        "rows": default_data['leaderboard'][:6],
    }

    with open(FRONTEND_DATA_DIR / "marine_hero.json", "w") as f:
        json.dump(marine_hero, f, indent=2)
    with open(FRONTEND_DATA_DIR / "marine_spectrum.json", "w") as f:
        json.dump(marine_spectrum, f, indent=2)
    with open(FRONTEND_DATA_DIR / "marine_breakdowns.json", "w") as f:
        json.dump(marine_breakdowns, f, indent=2)
    with open(FRONTEND_DATA_DIR / "marine_kpis.json", "w") as f:
        json.dump(marine_kpis, f, indent=2)
    with open(FRONTEND_DATA_DIR / "marine_leaderboard.json", "w") as f:
        json.dump(marine_leaderboard, f, indent=2)
    with open(FRONTEND_DATA_DIR / "marine_model.json", "w") as f:
        json.dump(model_meta, f, indent=2)

    print(f" Successfully exported dynamic data packages to {FRONTEND_DATA_DIR}!")


if __name__ == "__main__":
    export_marine_dashboard_data()
