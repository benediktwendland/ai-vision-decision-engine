# Systems Architecture & Methodology Mapping

This document details the software and systems engineering architecture of the **Industrial AI Vision Selection Tool**, highlighting its mapping to the process model of **Werheid et al. (WZL RWTH Aachen, 2026)**.

---

## 1. Methodological Mapping: From Qualitative to Quantitative

In their 2026 CIRP framework (*"A conceptual framework for machine vision integration in manufacturing SMEs"*), Werheid et al. defined a 5-phase lifecycle. Our tool directly adopts this procedural spine, replacing manual checklists with an equation-driven computation pipeline:

```
+------------------------------------+----------------------------------------+
| Werheid et al. (2026) CIRP Phase   | Selection Tool Quantitative Engine     |
+------------------------------------+----------------------------------------+
| Phase 1: Planning / Business Case  | Step 1: Dynamic Capital Budgeting (NPV) & Takt |
| Phase 2: Requirement Definition    | Step 2: Physical Constraints & 2D/3D   |
| Phase 3: Hardware Setup            | Step 3: Optical Sizing & Sensor Prune  |
| Phase 4: Software / Image Analysis | Step 4: AI Models & Compute Arch (VRAM/TOPS) |
| Phase 5: Operation Integration     | Step 5: 4-Pillar Integration & Deployment |
+------------------------------------+----------------------------------------+
```

---

## 2. Directory & Module Architecture

The project is structured into modular, human-readable components designed for static hosting (e.g., GitHub Pages) or local standalone execution without heavy backend dependencies:

```
selection-tool/
├── index.html                   # Landing page, presets & architecture overview
├── step1_use_case.html          # Stage 1: Economic justification & stakeholder gate
├── step2_requirements.html      # Stage 2: Process boundaries & 2D/3D decision tree
├── step3_hardware_optics.html   # Stage 3: Deterministic optical sizing & sensor catalog
├── step4_software_ai.html       # Stage 4: Latency waterfall & AI model topology
├── step5_integration.html       # Stage 5: 4-Pillar deployment verification & BOM
├── results.html                 # Comprehensive synthesis report, BOM & JSON export
├── css/
│   └── style.css                # Clean industrial engineering dark theme
├── js/
│   ├── app.js                   # State manager & localStorage persistence
│   ├── engine/
│   │   ├── optics.js            # Physics engine (Nyquist, exposure, focal length)
│   │   ├── latency.js           # Real-time timing waterfall & budgeter
│   │   └── mcdm.js              # Multi-Criteria Decision Making & Pareto ranking
│   └── data/
│       ├── cameras.js           # Extensible 2D/3D camera catalog (EMVA 1288)
│       ├── models.js            # AI model taxonomy with latency profiles
│       └── hardware.js          # Edge AI compute hardware catalog (TOPS, TDP, IP)
└── docs/
    ├── ARCHITECTURE.md          # This document
    ├── EQUATIONS.md             # Theoretical mathematical formulations
    └── CONTRIBUTING.md          # Guide for adding new sensors and hardware
```

---

## 3. Data Flow & State Management

The application uses an asynchronous, decentralized state architecture:
1. **Persistence:** `AppState` stores the full configuration in `localStorage` under the key `mv_selection_tool_state_v1`.
2. **Deterministic Recalculation:** Each page independently invokes the pure functional calculation engines (`OpticsEngine`, `LatencyEngine`, `McdmEngine`) on input change events.
3. **Decoupled Catalogs:** Hardware, camera, and model definitions reside in clean JavaScript data modules (`js/data/*.js`), allowing researchers and students to extend the knowledge base without touching application logic.
