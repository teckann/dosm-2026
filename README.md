# DOSM Datathon 2026: Socio-Economic Intelligence & Predictive Dashboard

A production-grade, hackathon-ready platform combining a **Python Machine Learning & Data Pipeline** with a **high-performance Next.js Web Dashboard**, specifically engineered for **seamless Vercel deployment** with zero cold starts and sub-50ms latency.

---

##  Architecture Overview

This project is built using a **Decoupled Datathon Architecture**:

```
┌────────────────────────────────────────────────────────┐
│               Python ML Pipeline (Local / Colab)       │
│                                                        │
│  data/raw/*.csv ──> preprocess.py ──> train.py         │
│                                            │           │
│                                   export_insights.py   │
└────────────────────────────────────────────┬───────────┘
                                             │ JSON Contracts
                                             ▼
┌────────────────────────────────────────────────────────┐
│               Next.js 14 Web Dashboard (Vercel)       │
│                                                        │
│  Executive Overview   State Analytics   Model Metrics  │
│  ──────────────────   ───────────────   ─────────────  │
│          Interactive "What-If" Policy Simulator        │
└────────────────────────────────────────────────────────┘
```

### Why this architecture wins Datathons:
1. **100% Demo Reliability on Vercel**: Heavy Python ML models running directly inside serverless functions often face cold-start timeouts (5-10 seconds delay) or 250MB size limits. By exporting structured insight contracts to `frontend/src/data/`, your dashboard loads instantly on Vercel Edge.
2. **Real-time Client Simulator**: Policy sliders run live mathematical projections using weights derived directly from your trained Scikit-Learn model.
3. **Reproducible Science**: Clean separation between raw data, feature engineering, Jupyter exploration, and web presentation.

---

## 📁 Project Directory Structure

```
dosm-2026/
├── .gitignore                      # Comprehensive ignores (node_modules, .venv, large CSVs)
├── package.json                    # Root scripts (npm run dev, npm run ml:export, etc.)
├── vercel.json                     # Vercel deployment configuration
├── README.md                       # Project documentation
│
├── data/                           # Data storage
│   ├── raw/                        # Original source CSV files
│   │   └── sample_dataset.csv      # Sample Malaysian socio-economic dataset
│   ├── processed/                  # Cleaned and feature-engineered datasets
│   └── spatial/                    # GeoJSON files for Malaysian state/district maps
│
├── ml/                             # Python Data Science & ML
│   ├── requirements.txt            # Python dependencies (pandas, scikit-learn, etc.)
│   ├── notebooks/                  # Jupyter notebooks for exploratory data analysis (EDA)
│   ├── models/                     # Trained models (.joblib, model_metadata.json)
│   └── src/
│       ├── __init__.py
│       ├── preprocess.py           # Data cleaning & composite resilience index
│       ├── train.py                # Random Forest / Ridge regression training
│       └── export_insights.py      # Generates dashboard JSON contracts
│
└── frontend/                       # Next.js 14 App Router Dashboard
    ├── package.json                # Next.js, Tailwind, Lucide React, Recharts
    ├── tsconfig.json
    ├── tailwind.config.ts
    └── src/
        ├── app/
        │   ├── layout.tsx          # Root layout and metadata
        │   ├── page.tsx            # Executive Dashboard (Overview, Analytics, Model, Simulator)
        │   └── globals.css         # Styling
        ├── components/
        │   ├── navbar.tsx          # Navigation header
        │   ├── kpi-card.tsx        # Interactive metric cards
        │   ├── simulator.tsx       # Live "What-If" policy scenario simulator
        │   └── charts/             # Recharts (TimeSeries, StateBar, FeatureImportance)
        ├── data/                   # JSON contracts synced from Python ML pipeline
        │   ├── summary_metrics.json
        │   ├── state_analytics.json
        │   ├── time_series.json
        │   └── model_insights.json
        └── lib/
            ├── types.ts            # TypeScript data interfaces
            └── utils.ts            # Formatting helpers (MYR currency, percentages)
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (`node -v`)
- **Python**: 3.10, 3.11, or 3.12 (`python --version` or `py -3.12 --version`)

---

### 2. Python ML Pipeline Setup

1. Open a terminal in the root directory:
   ```bash
   # Navigate to the ml folder or stay in root
   py -3.12 -m venv ml/venv
   
   # Activate virtual environment
   # On Windows:
   .\ml\venv\Scripts\activate
   # On macOS/Linux:
   source ml/venv/bin/activate

   # Install dependencies
   pip install -r ml/requirements.txt
   ```

2. Run the pipeline and export insights:
   ```bash
   # Runs preprocessing, model training, and exports JSON contracts to frontend
   python ml/src/export_insights.py
   ```

---

### 3. Running the Dashboard (For Teammates / Collaborators)

Teammates who clone this repository **do NOT need to install Python** just to run the dashboard! All data contracts and model outputs are already pre-generated in `frontend/src/data/`.

**Option 1: From the `frontend` folder (Standard)**
```bash
git clone <repo-url>
cd dosm-2026/frontend
npm install
npm run dev
```

**Option 2: From the root folder**
```bash
git clone <repo-url>
cd dosm-2026
npm run install:all
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to Vercel

### Option A: Via Vercel Web Dashboard (Recommended)
1. Push your repository to GitHub / GitLab.
2. In Vercel, click **Add New...** > **Project** and import your repository.
3. Under **Build and Output Settings**:
   - **Root Directory**: Select `frontend` (or leave default if using root `vercel.json`).
   - Framework preset: **Next.js**.
4. Click **Deploy**. Your dashboard will be live in under 60 seconds with global CDN caching.

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy directly
vercel
```

---

## 🔄 Plugging in Your Own Datathon CSV Dataset

1. Place your new dataset in `data/raw/your_dataset.csv`.
2. Update column names in `ml/src/preprocess.py` and `ml/src/train.py`.
3. Run:
   ```bash
   python ml/src/export_insights.py
   ```
4. The frontend will immediately reflect the updated indicators, rankings, and model predictions upon page refresh or rebuild!
