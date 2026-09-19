# Official Data Lineage & Provenance Log (DOSM Datathon 2026)

**Data Integrity Policy:** 100% Authentic Government Sources. **ZERO Synthetic Data**.

---

## 1. Purged Inaccurate / Synthetic Datasets

In accordance with enterprise data governance standards and user directive, the following fabricated files were permanently removed from the repository:

| Purged File | Previous Location | Rationale for Removal |
| :--- | :--- | :--- |
| `marine_tourism_indicators.csv` | `data/raw/integrated/` | **Fabricated / Critically Distorted**: Assigned 100% of state-level domestic tourists to single island destinations (e.g. 15.1M to Pulau Rawa/Aur; 12.6M to Semporna); target variable `carrying_capacity_stress` was synthetically generated from an artificial formula with 31.7% ceiling saturation at 100; static 88.5%/11.5% domestic/international visitor split cloned across COVID-19 border closure years. |
| `cleaned_dataset.csv` | `data/processed/` | **Derivative of Fabricated Data**: Direct pipeline output inheriting all synthetic biases and target leakage of the above file. |
| `dosm_domestic_tourism_by_state.csv` | `data/raw/tourism/` | **Manual Annotation**: Manually compiled partial table with unverified coastal focal tags. Replaced by direct parsing of primary DOSM DTS survey workbooks. |

---

## 2. Ingested Datasets from Official OpenDOSM & data.gov.my OpenAPIs

All datasets in this section were retrieved directly from official Malaysian government endpoints using [`ml/src/fetch_opendosm_data.py`](file:///c:/Users/Hp/Desktop/projects/dosm-2026/ml/src/fetch_opendosm_data.py) with rate-limit compliance:

### A. Marine Fish Landings (`fish_landings.csv`)
* **Local Path:** [`data/raw/marine/fish_landings.csv`](file:///c:/Users/Hp/Desktop/projects/dosm-2026/data/raw/marine/fish_landings.csv)
* **Authoritative Agency:** Department of Fisheries Malaysia (Jabatan Perikanan Malaysia - DOF)
* **API Endpoint:** `https://api.data.gov.my/data-catalogue?id=fish_landings&limit=5000`
* **Portal Reference:** [data.gov.my Data Catalogue - Fish Landings](https://data.gov.my/data-catalogue/fish_landings)
* **Records Count:** 1,368 records (Monthly)
* **Temporal Coverage:** 2018-01-01 to 2023-12-01
* **Schema:** `date` (YYYY-MM-DD), `coast` (all, west, east), `state` (State name / Malaysia), `landings` (Metric Tonnes)
* **Analytical Use:** Measures marine biodiversity stock and artisanal seafood supply across Malaysian coastal states (SDG 14).

### B. Inbound International Tourist Arrivals (`international_arrivals.csv`)
* **Local Path:** [`data/raw/tourism/international_arrivals.csv`](file:///c:/Users/Hp/Desktop/projects/dosm-2026/data/raw/tourism/international_arrivals.csv)
* **Authoritative Agency:** Immigration Department of Malaysia / Ministry of Tourism, Arts and Culture (MOTAC)
* **API Endpoint:** `https://api.data.gov.my/data-catalogue?id=arrivals&limit=5000`
* **Portal Reference:** [data.gov.my Data Catalogue - Monthly Arrivals](https://data.gov.my/data-catalogue/arrivals)
* **Records Count:** 5,000 records (Monthly)
* **Temporal Coverage:** 2020-01-01 to 2024-10-01
* **Schema:** `date`, `country` (Country of origin / ALL), `arrivals`, `arrivals_male`, `arrivals_female`
* **Analytical Use:** Official benchmark for foreign visitor influx and cross-border recovery trends.

### C. State Consumer Price Index (`cpi_state.csv`)
* **Local Path:** [`data/raw/economic/cpi_state.csv`](file:///c:/Users/Hp/Desktop/projects/dosm-2026/data/raw/economic/cpi_state.csv)
* **Authoritative Agency:** Department of Statistics Malaysia (DOSM)
* **API Endpoint:** `https://api.data.gov.my/opendosm?id=cpi_state&limit=5000`
* **Portal Reference:** [OpenDOSM Data Catalogue - CPI State](https://open.dosm.gov.my/data-catalogue/cpi_state)
* **Records Count:** 5,000 records (Monthly)
* **Temporal Coverage:** 2010-01-01 to 2024-10-01
* **Schema:** `date`, `state`, `division` (overall, food_beverage, transport, restaurants_hotels, etc.), `index`
* **Analytical Use:** Economic pressure indicator tracking inflation in coastal dining, lodging, and logistics.

### D. State Demographic Population (`population_state.csv`)
* **Local Path:** [`data/raw/demographics/population_state.csv`](file:///c:/Users/Hp/Desktop/projects/dosm-2026/data/raw/demographics/population_state.csv)
* **Authoritative Agency:** Department of Statistics Malaysia (DOSM)
* **API Endpoint:** `https://api.data.gov.my/opendosm?id=population_state&limit=5000`
* **Portal Reference:** [OpenDOSM Data Catalogue - Population State](https://open.dosm.gov.my/data-catalogue/population_state)
* **Records Count:** 5,000 records (Annual demographic series)
* **Schema:** `date`, `state`, `sex`, `age`, `ethnicity`, `population` (thousands)
* **Analytical Use:** Normalizes tourism carrying capacity on a per-capita resident basis ($V/P_{\text{resident}}$).

### E. Weekly Retail Fuel Prices (`fuelprice.csv`)
* **Local Path:** [`data/raw/economic/fuelprice.csv`](file:///c:/Users/Hp/Desktop/projects/dosm-2026/data/raw/economic/fuelprice.csv)
* **Authoritative Agency:** Ministry of Finance Malaysia (MOF)
* **API Endpoint:** `https://api.data.gov.my/data-catalogue?id=fuelprice&limit=5000`
* **Portal Reference:** [data.gov.my Data Catalogue - Fuel Price](https://data.gov.my/data-catalogue/fuelprice)
* **Records Count:** 409 records (Weekly price updates)
* **Schema:** `series_type`, `date`, `ron95`, `ron97`, `diesel`, `diesel_east_msia`
* **Analytical Use:** Models passenger boat fuel operational expenditure and the bioeconomic impact of maritime fuel subsidies.

---

## 3. Official DOSM Primary Source Workbooks (Unmodified)

The repository retains **23 official DOSM Excel workbooks** directly published by DOSM:

* **15 State Domestic Tourism Surveys (`data/raw/tourism/state_surveys/`):**
  * Survey Year: 2023 (covering all 13 states and 2 federal territories).
  * Key Official Tables:
    * `Jadual 2 & 3`: Excursionists (Pelawat Harian) vs Overnight Tourists (Pelancong) & Trips.
    * `Jadual 4-6`: Average Length of Stay (ALOS) in nights & Accommodation Type.
    * `Jadual 9`: **Official Top 5 Focus Destinations per State**.
    * `Jadual 10 & 11`: Real Expenditure Distribution (Food, Accommodation, Shopping, Transport).
* **8 Quarterly Domestic Tourism Bulletins (`data/raw/tourism/quarterly_bulletins/`):**
  * Time series coverage from 2023, 2024, 2025, through latest 2026-Q1.

---

## 4. Scientific Research & CKAN Portal Assessment

* **Reef Check Malaysia Report (`data/raw/coral/2024CoralBleachingImpactReportMalaysia.pdf`):**
  * Primary scientific survey detailing degree heating weeks (DHW) and thermal bleaching impact across Malaysian marine parks.
* **Malaysian Government CKAN DataStore Implementation:**
  * In reference to the official CKAN DataStore documentation (`https://docs.ckan.org/en/latest/maintaining/datastore.html`), active sub-national CKAN DataStore instances were queried using the `api/3/action/datastore_search` Action API.
  * Ingested Datasets from CKAN DataStore:
    1. **`ckan_sarawak_arrivals_2024.csv`** (Resource ID: `18d5a182-b5bc-4944-8802-261b247ddc8a`, 45 records, monthly arrivals by nationality into Sarawak for 2024).
    2. **`ckan_sarawak_arrivals_2018_2023.csv`** (Resource ID: `d4ae7341-2cae-4aa7-8dec-c5a75e380dde`, 34 records, multi-year arrivals into Sarawak 2018-2023).
  * Endpoint format used: `https://catalog.sarawak.gov.my/api/3/action/datastore_search?resource_id={resource_id}`.

