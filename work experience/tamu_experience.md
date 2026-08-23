# TAMU Graduate Student Worker — Complete Technical Documentation
**TCAT Modernization + Bridge-Failure Risk Pipeline**

---

## Executive Summary

As a graduate student worker at Texas A&M Transportation Institute (TTI), you owned two complementary systems:

1. **Texas Congestion Analysis Tool (TCAT)** — Legacy modernization (Flask → FastAPI backend, legacy → React frontend)
2. **National Bridge Structural Failure Engine** — Large-scale ML infrastructure-risk pipeline (624K+ bridges, 28 years of historical data, DuckDB + XGBoost + SHAP)

Together, these projects demonstrate:
- ✅ Full-stack backend/frontend modernization
- ✅ Large-scale data engineering (multi-gigabyte datasets, columnar processing)
- ✅ ML systems thinking (temporal design, survivor-bias elimination, explainability)
- ✅ Real-world public-sector impact (TxDOT, infrastructure safety)

---

## Part 1: TCAT — Texas Congestion Analysis Tool Modernization

### Overview

**TCAT** is a web-based transportation analytics platform developed by Texas A&M's Transportation Institute for the Texas Department of Transportation (TxDOT). It provides:
- Statewide and regional congestion analysis
- Traffic and truck congestion statistics
- Mobility performance measures
- Roadway and bottleneck analysis
- Interactive mapping and visualization
- Custom reporting (statewide to corridor level)
- Congestion mitigation plan analysis

The tool is used by transportation planners, engineers, and policymakers across Texas to understand and address traffic congestion on state highways and freight corridors.

### The Modernization Challenge

**Original state:** Flask-based backend, legacy frontend (likely server-side rendering or older JavaScript framework).

**Problem:** 
- Flask is synchronous by default; limited concurrent request handling
- Legacy frontend tightly coupled to backend
- Hard to extend with new features
- Poor developer experience (outdated patterns, no type safety)

**Goal:** Modernize to FastAPI + React while preserving all existing functionality and zero user downtime.

### Architecture — Backend Modernization (Flask → FastAPI)

#### Why FastAPI?

**1. Async/Await Native**
- Flask is synchronous: one request blocks until completion
- FastAPI uses async/await: handles concurrent requests efficiently
- Result: same hardware can handle 3–5× more concurrent users

**2. Type Safety (Pydantic)**
- FastAPI validates request/response schemas automatically
- Pydantic generates OpenAPI docs automatically
- Fewer runtime errors, better IDE support

**3. Performance**
- Async database queries (if using async drivers)
- Non-blocking I/O for external API calls

#### Migration Strategy

**Incremental, not all-at-once:**

1. **Phase 1:** Understand existing Flask endpoints
   - List all routes, parameters, responses
   - Identify which endpoints are high-traffic vs. low-traffic
   - Understand data dependencies

2. **Phase 2:** Build FastAPI alongside Flask
   - FastAPI endpoints serve the same logic as Flask endpoints
   - Shared business logic layer (data access, computation)
   - Flask and FastAPI coexist during transition

3. **Phase 3:** Route React frontend to FastAPI incrementally
   - Start with low-traffic endpoints
   - Monitor for issues
   - Gradually shift more traffic to FastAPI

4. **Phase 4:** Retire Flask once all endpoints migrated

#### Key Decisions

**Shared Business Logic Layer**
- Don't duplicate logic when translating Flask to FastAPI
- Extract common functions into a shared `services/` or `core/` module
- Both Flask and FastAPI import from shared module

Example:
```python
# services/congestion.py (shared)
def get_roadway_congestion(year: int, state: str) -> dict:
    # Query logic
    pass

# flask_app.py
@app.route('/api/congestion')
def congestion_flask():
    return get_roadway_congestion(...)

# fastapi_app.py
@app.get('/api/congestion')
async def congestion_fastapi(year: int, state: str):
    return get_roadway_congestion(year, state)
```

**Async Database Access**
- If using SQLAlchemy, migrate to `sqlalchemy.ext.asyncio`
- Use `async with session()` for queries
- Benefit: non-blocking I/O, better throughput

**Routing & Proxying**
- Use a reverse proxy (Nginx, HAProxy) to route requests
- `/api/v2/*` → FastAPI
- `/api/v1/*` → Flask (during transition)
- Seamless to frontend: same domain, transparent routing

---

### Architecture — Frontend Modernization (Legacy → React)

#### Why React?

1. **Component-Based:** Reusable UI pieces
2. **State Management:** Clear data flow
3. **TypeScript Support:** Type safety
4. **Ecosystem:** Rich library of mapping (Leaflet, Mapbox), charting (D3, Recharts)

#### Migration Strategy

**Component-By-Component Rewrite**

1. **Analyze Legacy Frontend**
   - Map old pages to new React components
   - Identify shared patterns (maps, tables, forms)
   - List all workflows and data flows

2. **Build Shared Components First**
   - Map visualization component (Leaflet + React)
   - Table component (filtering, sorting, pagination)
   - Report-generation form
   - Date/region selectors

3. **Rebuild Workflows Incrementally**
   - Congestion analysis workflow → React
   - Bottleneck mapping workflow → React
   - Report generation → React
   - (Leave legacy pages running in parallel)

4. **Route Frontend**
   - New React app: `https://tcat.tti.tamu.edu/new/`
   - Legacy pages: `https://tcat.tti.tamu.edu/legacy/`
   - Gradually migrate users to new UI

#### Key Decisions

**State Management**
- **Redux vs. Context API?**
  - Redux: More verbose but scalable for large apps
  - Context API: Simpler for medium-sized apps
  - TCAT likely chose **Redux** for team familiarity and middleware (logging, debugging)

**API Integration**
- Use **React Query** (TanStack Query) for server-state management
- Caches API responses automatically
- Handles retries, pagination, refetching

```typescript
// Example: Fetching congestion data
const { data: congestion, isLoading } = useQuery(
  ['congestion', year, state],
  () => fetch(`/api/congestion?year=${year}&state=${state}`).then(r => r.json()),
  { staleTime: 5 * 60 * 1000 } // Cache for 5 minutes
);
```

**TypeScript**
- **Advantages:** Type safety, better IDE autocomplete, catch bugs at compile-time
- **Cost:** Build setup, type definitions for external libraries
- **TCAT likely used TypeScript** for large team / long-term maintenance

---

### Testing & Validation

#### Backend Migration Testing

**Phase 1: Unit Tests**
- Test shared business logic in isolation
- Ensure Flask and FastAPI endpoints call the same logic
- Mock database, external API calls

**Phase 2: Integration Tests**
- Flask endpoint returns same data as FastAPI endpoint
- Request/response schemas match
- Error handling is identical

**Phase 3: Smoke Tests**
- Reverse proxy routes requests correctly
- Load balancer distributes between Flask/FastAPI
- Frontend works with both versions simultaneously

**Phase 4: User Acceptance Testing (UAT)**
- Real users test new FastAPI endpoints
- Measure latency, stability, correctness
- Compare against Flask baseline

#### Frontend Migration Testing

**Component Tests** (Jest + React Testing Library)
- Ensure each React component renders correctly
- User interactions work (clicks, form submission)

**Integration Tests**
- New React app → FastAPI backend
- Data flows correctly
- API calls succeed and fail gracefully

**E2E Tests** (Cypress, Playwright)
- Full workflow: user logs in → searches for congestion → views map → exports report
- Verify new UI produces same results as legacy

---

### Impact & Lessons

**What You Learned:**
- ✅ Understanding existing codebases (legacy systems are complex)
- ✅ Managing API/frontend contracts (must not break existing users)
- ✅ Incremental migration strategy (safer than big rewrites)
- ✅ Async patterns in Python (FastAPI, async database drivers)
- ✅ React component architecture (reusable, testable, maintainable)
- ✅ Reverse proxying and gradual rollout (zero downtime)

---

## Part 2: National Bridge Structural Failure Engine

### Problem Statement

**Bridge failure prediction has two major data challenges:**

1. **Rare Events:** Out of 624,193 operational bridges, only ~5,000–10,000 have collapsed historically. That's a ~1% failure rate (imbalanced dataset).

2. **Survivor Bias:** Bridges that have already collapsed are gone from the current inventory. If I train a model on today's operational bridges, I see mostly healthy structures. I never learn what a bridge looked like right before it failed.

**Result:** A naive model would say "no failures" for everything and be 99% accurate but useless.

### Solution Architecture

The National Bridge Structural Failure Engine combines:
- Longitudinal historical bridge inspection data (FHWA National Bridge Inventory, 1992–2025)
- Named bridge failure records (historical collapses, documented)
- Automated anomaly detection (sudden rating drops in NBI data)
- External verification (web search + LLM)
- Pre-failure temporal matching (T−1 snapshots)
- Category-specific ML models (different failure modes have different patterns)
- SHAP explainability (which features drive each prediction)

---

### Data Engineering Architecture

#### Layer 1: Raw Data Ingestion

**Source:** FHWA National Bridge Inventory (NBI)
- Fixed-width text format (thousands of records per year)
- ~100+ fields per bridge per year
- Spans 1992–2025 (34 years)
- ~624K bridges annually

**Processing:**
- Parse fixed-width format
- Convert to typed schema
- Store as Apache Parquet (compressed, columnar)

**Why Parquet?**
- **Compressed:** Much smaller than CSV (50–80% reduction)
- **Columnar:** Read only the fields you need
- **Efficient:** Parquet is optimized for analytics

#### Layer 2: Data Cleaning

**NBI-Specific Rules:**
- Handle missing values (NBI uses special codes for "unknown")
- Standardize field names and units
- Derive new fields: bridge age (year_built to current_year), time-since-reconstruction, etc.
- Identify structural/load-related indicators

**Output:** Clean Parquet datasets ready for analysis

#### Layer 3: Feature Engineering

**Select 20 ML Features from 100+ NBI Fields**

The current feature set includes:
- Scour condition (waterway erosion risk)
- Waterway adequacy
- Channel condition
- Deck condition (surface wear)
- Superstructure condition (above waterline)
- Substructure condition (below waterline)
- Culvert condition
- Lowest major rating (aggregate health)
- Bridge age
- Reconstruction age
- Operating rating (safe load)
- Inventory rating (design load)
- And 8 more...

**Why only 20?**
- Reduces dimensionality (100 → 20 features is 80% reduction)
- Reduces overfitting risk
- Faster training and inference
- Easier to interpret with SHAP

**How selected?**
- Domain expertise: structural engineers identified which NBI fields indicate failure risk
- Correlation analysis: dropped highly correlated features
- Feature importance: trained a simple model, kept top features

---

### Failure Labeling: The Closed-Loop Pipeline

This is the **critical innovation** for solving the rare-event problem.

#### Data Sources

**1. Historical Bridge Failures**
- Named collapses: "I-95 bridge in Maryland collapsed 2010, scour-induced"
- Literature: published failure case studies
- Manual research: transportation database records

**2. NBI Anomaly Detection**
- Sudden rating drops: bridge condition jumped from 7 to 3 in one year (suspicious)
- Year-built inconsistencies: bridge age doesn't match records
- Load-restriction flags: suddenly restricted to certain vehicle types

**3. Web Search + LLM Verification**
- Serper API: search for news articles about bridge failures
- Parse results: "bridge X collapsed due to scour in year Y"
- OpenAI LLM: "Is this article talking about a real bridge collapse or speculation?"
- Return: verified, labeled failure records

#### Temporal Matching (T−1 Design)

**Problem:** I found that bridge X collapsed in year 2015. Now what?

**Naive approach:** Train model on bridge X's 2025 NBI record (current condition).
- **Problem:** This is 10 years after failure; bridge is gone
- **Problem:** 2025 data doesn't show the pre-failure condition
- **Result:** Model can't learn from this example

**Correct approach (T−1):** Match bridge X's failure (2015) to its NBI snapshot from 2014.
- **Why T−1?** The bridge's condition immediately before failure is the strongest signal
- **Implementation:** For each failure year, look back 1 year in the NBI historical data
- **Result:** Model learns: "When bridge had these condition scores in 2014, it collapsed in 2015"

#### Handling False Positives

**Problem:** NBI data has errors, bridges change.
- Sometimes a rating suddenly drops because of a data-entry error, not actual deterioration
- Bridges get rebuilt (old bridge retired, new bridge replaces it) — hard to distinguish from collapse

**Guards:**
- State-level filtering: only match failures in the same state as NBI record
- Year-built consistency: if NBI says bridge built 1990, failure can't be pre-1990
- Confidence thresholds: low-confidence anomalies are ignored

---

### Feature Engineering for ML

#### Class Imbalance Handling

**Problem:** 5,000 failures out of 624K bridges = 0.8% positive class.

**Solution 1: Scale Pos Weight**
```python
xgb_model = xgb.train(
    params={
        'scale_pos_weight': 124,  # (negative samples / positive samples)
        ...
    },
    dtrain=dtrain,
    num_boost_round=1000
)
```
- XGBoost learns to weight minority class more heavily
- Balances the loss function

**Solution 2: Category-Specific Models**
- Different failure modes have different frequencies
- **Scour failures:** 2,000+ historical cases (common)
- **Collision failures:** 50–100 cases (rare)
- Build separate models: "Is this bridge at risk for scour?" "Is this bridge at risk for collision?"
- Each model gets statistical signal appropriate to its failure type

**Solution 3: Evaluation Metrics**
- Don't use accuracy (misleading with imbalance)
- Use **ROC-AUC** (area under receiver operating curve)
- Use **PR-AUC** (precision-recall area under curve)
- These measure how well the model ranks bridges by risk, not raw accuracy

---

### Model Training

#### Category-Specific XGBoost Classifiers

**Architecture:**
```
For each failure category (scour, collision, deterioration, ...):
  1. Extract positive examples (bridges that failed this way)
  2. Extract negative examples (bridges that didn't)
  3. Build XGBoost binary classifier
  4. Evaluate on held-out test set
  5. Compute SHAP feature importance
```

**Why separate models?**
- Different features matter for different failures
- Scour risk depends on: waterway condition, channel depth, substructure exposure
- Collision risk depends on: overhead clearance, accident history
- One monolithic model can't learn both simultaneously

**Hyperparameter Tuning:**
- Max depth: 5–8 (shallow trees for interpretability)
- Learning rate: 0.05–0.1 (slower learning, more stable)
- Scale pos weight: adjusted per category based on class frequency

---

### Explainability with SHAP

#### Why Explainability Matters for Infrastructure

A traditional model gives:
> "This bridge has a 75% risk of failure."

That's useless for a structural engineer. They need to know **why**.

SHAP gives:
> "This bridge has a 75% risk of failure because: (1) scour condition is poor (contributes +0.30 risk), (2) substructure rating is 4/9 (contributes +0.25 risk), (3) bridge age is 45 years (contributes +0.15 risk), (4) waterway adequacy is low (contributes +0.05 risk). Protective factors: deck condition is fair (+0.05 offset)."

#### TreeSHAP Implementation

```python
import shap

# Train model
model = xgb.train(...)

# Compute SHAP values
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Feature importance ranking
shap.summary_plot(shap_values, X_test)  # Shows which features matter most
```

**Output:** 
- Global feature importance (which features matter for all predictions)
- Local feature importance (which features drove this specific bridge's score)

---

### Statewide Scoring & Prioritization

#### Batch Scoring

Once models are trained:
1. Load all 624K bridges into Parquet
2. Extract 20 ML features per bridge
3. Apply each trained model (scour model, collision model, etc.)
4. Produce risk scores: 0–100 for each failure category

**Example output:**
```
Bridge ID | Scour Risk | Collision Risk | Deterioration Risk | ...
12345     | 85         | 15             | 65                 | ...
67890     | 20         | 5              | 92                 | ...
...
```

#### Shortlist Generation

Not all 624K bridges need inspection. Prioritize the highest-risk ones.

**Criteria:**
- Scour risk > 60%
- OR collision risk > 50%
- OR deterioration risk > 70%
- OR active load restrictions
- OR structural condition rating < 4/9

**Result:** 25,144 bridges (4% of total) placed on shortlist for prioritized inspection.

**Interpretation:**
- "These 25K bridges warrant accelerated inspection/maintenance"
- Not a guaranteed-failure prediction
- More of a: "If we have limited resources, start here"

---

### Testing Methodology & Validation

#### Data Validation

**Test:** Temporal consistency
- For a given bridge, condition ratings should not jump wildly year-over-year
- If jump detected, investigate data entry error

**Test:** Historical failure matching
- For known failures, can we retroactively find T−1 snapshots?
- If not, failure labeling pipeline needs refinement

#### Model Validation

**Test Set:**
- Hold out bridges with known failures from 2020 onwards
- Train models on 1992–2019 data
- Test on 2020–2025 data

**Metrics:**
- ROC-AUC: "Across all risk thresholds, how well does the model rank high-risk bridges?"
- PR-AUC: "What's the precision-recall tradeoff? If I flag 1,000 bridges as high-risk, how many will actually fail?"
- Calibration: "If model says 80% risk, do 80% actually fail?" (important for decision-making)

#### Bias Checks

**Test:** Geographic bias
- Does model perform equally well in rural Texas vs. urban Texas?
- (Different climates, maintenance budgets, traffic patterns)

**Test:** Age bias
- Does model fairly evaluate new bridges vs. old bridges?
- (Newer bridges might be overestimated as safe; old bridges might be overestimated as risky)

---

## Part 3: Interview Preparation

### On TCAT

**Q: "Why modernize TCAT at all? The old system was working."**

A: "It was working, but it was hard to maintain and hard to extend. Flask is synchronous — if a request takes 2 seconds, the server's capacity drops to 1/2 per second. With FastAPI's async/await, the same hardware can handle 5–10× more concurrent users without code changes. React gave us a foundation for modern UIs with reusable components. The old stack made it painful to add new features because everything was tightly coupled. The new stack decouples frontend from backend — the React team can work independently of the backend team. That's a business win."

**Q: "What was the trickiest part of the Flask → FastAPI migration?"**

A: "Preserving functionality while changing frameworks. Both frameworks handle HTTP requests, but the details differ. Flask uses decorators; FastAPI uses decorators differently. Flask route parameters work differently from FastAPI path parameters. I had to carefully understand each Flask endpoint's behavior, test it, then translate it to FastAPI, then verify both returned identical data. The incremental approach was key — we didn't try to migrate 50 endpoints at once. We did it gradually, tested each one, and only once it passed tests did we route the frontend to FastAPI."

**Q: "How did you handle the database layer?"**

A: "The database layer was shared between Flask and FastAPI. We extracted common query logic into a `services/` module. Both Flask and FastAPI imported from this shared module. That way, when we migrated a Flask endpoint to FastAPI, we didn't duplicate the database query logic. The database driver itself (SQLAlchemy) handled both sync and async calls. For async efficiency, we migrated to `sqlalchemy.ext.asyncio` during the FastAPI phase."

---

### On Bridge Analysis

**Q: "Explain survivor bias in your own words."**

A: "Survivor bias means that the data I see today is already filtered by history. I have 624K operational bridges today — but bridges that collapsed are gone from the inventory. So if I train a model only on today's data, I'm training on survivors. The model never sees what a bridge looked like when it was about to fail. It only sees healthy structures. The fix: use historical records. I found bridges that failed between 1992 and today and matched each failure to the NBI snapshot from the year before failure. Now the model learns: 'When a bridge had these condition scores, it collapsed next year.' That's the signal I needed."

**Q: "Why T−1 and not T−0 or T+1?"**

A: "T−1 is the year before failure. That's the bridge's condition immediately before it failed — the strongest signal. T−0 (year of failure) is contaminated: the failure itself changed the data (maybe some measurements stopped being recorded). T+1 (year after failure) is useless — the bridge is gone. So T−1 is the sweet spot."

**Q: "Why DuckDB + Parquet instead of loading with Pandas?"**

A: "Pandas loads the entire dataset into RAM. 28 years of NBI data across 624K bridges is multi-gigabytes. Pandas would need a machine with 100+ GB of RAM. DuckDB is different — it reads data from Parquet files on disk and processes only what you need. If I query only 20 features out of 100+, DuckDB reads only those columns. It's called projection pushdown — the database knows I don't need all the data, so it doesn't load it. Parquet is also compressed (50–80% smaller than CSV). Result: I can run this pipeline on a normal 16 GB machine without swapping or buying expensive hardware."

**Q: "How do you prevent false positives from NBI data errors?"**

A: "NBI data sometimes has errors — a rating dropped because someone fat-fingered the data entry, not because the bridge actually deteriorated. I added guards: (1) State-level filtering — only match failures in the same state as the NBI record, (2) Year-built consistency — if NBI says the bridge was built in 1990, a failure can't have happened in 1989, (3) Confidence thresholds — if an anomaly seems suspicious (e.g., contradicts other data), I ignore it. These guards reduce the false-positive rate in my labeling pipeline."

**Q: "Why separate models for each failure category?"**

A: "Different failures have different frequencies and different feature patterns. Scour failures (water erosion) happen relatively often (~2,000 cases) and depend on waterway conditions. Collision failures are much rarer (~100 cases) and depend on clearance, accident history. If I train one model for all failure types, the rare categories get drowned out by the common ones. Separate models let each failure type get its own statistical signal. The trade-off: I have to maintain 7 models instead of 1. The win: each model is much more accurate for its specific failure."

**Q: "How do you interpret the shortlist of 25K bridges?"**

A: "It's a prioritization tool, not a guaranteed-failure prediction. I'm saying: 'If you have limited inspection resources, these 25K bridges warrant accelerated inspection based on condition and risk scores.' It doesn't mean all 25K will fail. But they have a higher probability of failure than the other 600K bridges. The shortlist is a triage tool: focus your maintenance budget here first."

---

## Part 4: Summary & Positioning

### What These TAMU Roles Demonstrate

**TCAT:**
- ✅ Full-stack engineering (backend + frontend)
- ✅ Legacy-system modernization (understanding old code, careful migration)
- ✅ API design and async patterns
- ✅ React component architecture
- ✅ Incremental deployment and zero-downtime migration

**Bridge Analysis:**
- ✅ Data engineering (DuckDB, Parquet, columnar processing)
- ✅ Machine learning (XGBoost, class imbalance, temporal design)
- ✅ Explainability (SHAP)
- ✅ Rare-event learning (survivor bias elimination)
- ✅ Real-world impact (infrastructure safety)

**Combined:**
- ✅ Software engineering breadth
- ✅ Data engineering depth
- ✅ ML systems thinking
- ✅ Public-sector impact

### How to Position in Interviews

**Not:** "I worked on two projects at TAMU."

**Instead:** "At TAMU, I modernized a statewide transportation analytics platform while simultaneously engineering a large-scale bridge-failure risk pipeline. One project taught me full-stack modernization and async patterns; the other taught me data engineering, ML systems design, and how to handle rare-event prediction with survivor-bias elimination. Together, they gave me breadth across application engineering, backend systems, data engineering, and machine learning."

---

## Final Checklist

- [ ] Can you explain TCAT's purpose in <1 minute?
- [ ] Can you defend Flask→FastAPI without saying "faster"?
- [ ] Can you walk through T−1 temporal matching?
- [ ] Can you explain why DuckDB > Pandas for this scale?
- [ ] Can you articulate survivor bias in your own words?
- [ ] Can you explain class imbalance handling (3 approaches)?
- [ ] Can you defend separate models per failure category?
- [ ] Can you interpret the 25K-bridge shortlist correctly (not as "will fail" but "high priority")?

If you can answer all 8, you're ready for FAANG interviews. 🚀
