# Decision Engine for Industrial AI-Based Vision
### From Process Constraints to Edge Deployment: A Quantitative Co-Design Framework for Manufacturing

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Academic Prototype](https://img.shields.io/badge/Status-Academic%20Prototype-success.svg)]()
[![Methodology: CIRP 2026 Compatible](https://img.shields.io/badge/Methodology-CIRP%202026%20Werheid%20et%20al.-orange.svg)]()
[![Stack: Vanilla HTML5 / ES6](https://img.shields.io/badge/Stack-Zero%20Dependency%20Static-emerald.svg)]()

---

## 📌 Executive Overview

In discrete manufacturing, **over 70% of AI vision proofs-of-concept (POCs) fail to achieve continuous production deployment**. This "POC Purgatory" typically stems from heuristic trial-and-error: motion blur caused by improper exposure times, thermal throttling of edge GPUs inside sealed IP67 cabinets, missed plant cycle times, or an incomplete business case that ignores multi-year lifecycle costs.

This repository provides an **open-source, quantitative engineering selection and dimensioning decision engine**. It operationalizes the procedural macro-lifecycle of **Werheid et al. (WZL RWTH Aachen, CIRP 2026)** by transforming qualitative guidelines into closed-form optical physics, latency waterfall budgets, multi-criteria Pareto synthesis, and dynamic capital budgeting (Net Present Value - NPV).

```
       SHOP-FLOOR CONSTRAINTS                       DETERMINISTIC CO-DESIGN                       DEPLOYABLE PRODUCTION STACK
+------------------------------------+       +------------------------------------+       +------------------------------------+
| * Takt Time / Velocity (m/s)       |       | 1. Dynamic Capital Budgeting (NPV) |       | * Sized Industrial 2D/3D Sensor    |
| * Smallest Defect d_min (µm)       | ----> | 2. Optical Nyquist Sizing (MP)     | ----> | * C-Mount Lens & Strobe LED        |
| * Surface (Specular/Matte/Dark)    |       | 3. Motion Blur Exposure Limit (µs) |       | * INT8/FP16 AI Model (ONNX/TRT)    |
| * 2D vs. 3D Spatial Geometry       |       | 4. Latency Waterfall & TOPS Sizing |       | * Fanless Edge IPC / Embedded GPU  |
| * OT Fieldbus & Machine Safety     |       | 5. 4-Pillar Integration Verification|      | * Harmonized Itemized BOM & Specs  |
+------------------------------------+       +------------------------------------+       +------------------------------------+
```

---

## ⚠️ Academic Disclaimer & Limitation of Liability (Haftungsausschluss)

> **English:**  
> This software is an **academic research prototype and engineering decision-support tool** created for scientific research, higher education, and conceptual pre-dimensioning.  
> * **No Claim of Completeness or Correctness:** Calculations, component recommendations, cost estimates, and latency budgets are analytical approximations based on published scientific literature, EMVA 1288 standards, and vendor data sheets. They do not claim commercial completeness or definitive technical accuracy.  
> * **Exclusion of Warranty & Liability:** The software is provided *"as is"*, without warranty of any kind, express or implied. The authors and contributors accept no liability for damages, production downtime, sizing errors, integration failures, or economic losses resulting from the use of this tool.  
> * **Mandatory Field Engineering Validation:** Physical machine commissioning, optical stray-light verification, thermal cabinet design, functional machine safety (ISO 13849 / Performance Level d/e, CE marking), and workforce safety regulations must always be verified and approved on-site by certified automation and vision engineers.

> **Deutsch:**  
> Dieses Tool ist ein **akademischer Forschungsprototyp zur ingenieurwissenschaftlichen Entscheidungsunterstützung**.  
> * **Kein Anspruch auf Vollständigkeit oder Richtigkeit:** Alle physikalischen Berechnungen, Komponentenauswahlen, Zeitbudgets und Kostenschätzungen sind heuristische bzw. analytische Näherungen. Sie erheben keinen Anspruch auf Vollständigkeit oder Richtigkeit.  
> * **Haftungsausschluss:** Die Bereitstellung erfolgt ohne jegliche Gewährleistung (*"as is"*). Jegliche Haftung für Produktionsausfälle, Fehldimensionierungen, entgangene Gewinne oder wirtschaftliche Fehlentscheidungen ist ausdrücklich ausgeschlossen.  
> * **Ingenieurtechnische Pflichtprüfung:** Reale Industrieanlagen, Schaltschrank-Entwärmungen, optische Fremdlichtabschirmungen sowie die funktionale Maschinensicherheit (ISO 13849 / CE) müssen vor Inbetriebnahme zwingend durch qualifiziertes Fachpersonal verifiziert werden.

---

## 🚀 Key Technical Features

1. **Dynamic Capital Budgeting Engine (NPV / Kapitalwert):**  
   Replaces static ROI with discounted multi-year cash flow streams ($	ext{NPV} = -I_0 + \sum rac{R_t}{(1+i)^t}$). Transparently synchronizes Year 0 CAPEX with the itemized Bill of Materials (BOM).
2. **Deterministic Optical Physics:**  
   Computes exact Nyquist sensor resolutions ($R_{	ext{min}}$), maximum exposure limits ($t_{	ext{exp}}$) to eliminate motion blur, and C-mount lens focal lengths ($f$).
3. **2D vs. 3D Spatial Decision Matrix:**  
   Evaluates part dynamics and surface topology to determine whether 2D planar inspection suffices or whether depth sensing (Structured Light, Active Stereo, Laser Triangulation, Time-of-Flight) is mandatory for 6-DoF robotic grasp planning.
4. **Shop-Floor Latency Waterfall:**  
   Subtracts optical exposure, sensor readout, GigE transmission, and PLC handshake overheads from takt time to define the true remaining millisecond budget for AI model execution.
5. **Multi-Criteria Pareto Synthesis (MCDM):**  
   Evaluates candidate architectures across **Latency**, **Accuracy**, **Total Cost (€)**, and **Thermal Dissipation (W)**, pruning unfeasible combinations.
6. **4-Pillar Plant Integration Framework:**  
   Provides a structured deployment checklist across:
   * **Pillar 1: Data Bus Integration** (Deterministic fieldbuses: PROFINET IRT, EtherCAT, OPC UA, optocoupled hardware triggers).
   * **Pillar 2: Calibration** (VDI/VDE 2634 metric scaling, lens distortion removal, hand-eye matrix).
   * **Pillar 3: Quality Assurance** (Data drift detection, MLOps retraining queues, ISO 9001 image audit logging).
   * **Pillar 4: Training & Operating Guidelines** (Worker-in-the-loop explainable UI, role-based qualification, laminated shopfloor SOPs).
7. **Zero-Dependency Architecture:**  
   Built entirely with vanilla HTML5, CSS3, and ES6. Runs immediately in any standard browser without Node.js, Python, or database backends. Completely offline-capable.

---

## 📂 Repository Structure

```
selection-tool/
├── index.html                   # Overview, Framework Navigator & Case Study Presets
├── step1_use_case.html          # Step 1: Use Case, Stakeholder Alignment & Net Present Value (NPV)
├── step2_requirements.html      # Step 2: Requirement Definition & 2D/3D Spatial Branching
├── step3_hardware_optics.html   # Step 3: Optics & Sensors (Nyquist, Blur, Focal Length, Catalog)
├── step4_software_ai.html       # Step 4: AI Software & Compute Hardware (Latency, TOPS, VRAM)
├── step5_integration.html       # Step 5: 4-Pillar Integration & Plant Readiness Checklist
├── results.html                 # Comprehensive Synthesis Report, Itemized BOM & JSON Export
├── calculator_economic.html     # Interactive Multi-Year Cashflow & NPV Capital Budgeting Tool
├── css/
│   └── style.css                # Industrial HMI design system & responsive styling
├── js/
│   ├── app.js                   # Central state management & localStorage persistence
│   ├── engine/
│   │   ├── optics.js            # Analytical optical equations (Nyquist, Blur, Focal length)
│   │   ├── latency.js           # Real-time timing waterfall & budget engine
│   │   └── mcdm.js              # Multi-Criteria Pareto scoring & ranking
│   └── data/
│       ├── cameras.js           # EMVA 1288 2D and 3D camera sensor catalog
│       ├── models.js            # AI vision model taxonomy (CNNs, ViTs, 3D Pose nets)
│       └── hardware.js          # Edge AI hardware platforms (Jetson, Industrial IPC, Hailo)
├── data/                        # Raw CSV reference catalogs (cameras, lenses, models, hardware)
├── Icons/                       # Clean monochrome SVG & PNG workflow and pillar icons
└── docs/
    ├── ARCHITECTURE.md          # Systems engineering architecture & C4 alignment
    ├── EQUATIONS.md             # Theoretical mathematical derivations & formulas
    └── CONTRIBUTING.md          # Guide for adding new sensors, lenses, and hardware
```

---

## ⚡ Quickstart

### Option 1: Direct Browser Launch (No server required)
Simply double-click `index.html` or open it from the terminal:
```bash
# Windows (PowerShell)
Start-Process "index.html"

# macOS / Linux
open index.html   # or xdg-open index.html
```

### Option 2: Local Static Web Server
```bash
# Python 3
python -m http.server 8080

# Or via Node.js
npx serve .
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 3: Instant Deployment on GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings** $ightarrow$ **Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch to `main`, and folder to `/ (root)`.
4. Your decision tool is live globally with an interactive URL in under 60 seconds!

---

## 🏭 Built-in Industrial Case Studies

Click the preset buttons on `index.html` to explore three diverse manufacturing paradigms:

1. **Case Study 1: High-Speed Inline Sheet Metal Flaw Inspection**
   * *Domain:* Automotive stamping quality control.
   * *Dynamics:* Continuous conveyor at $v = 2.0	ext{ m/s}$, Takt time $T = 150	ext{ ms}$.
   * *Resolution:* Sub-millimeter crack detection ($d_{	ext{min}} = 50\,\mu	ext{m}$).
   * *Synthesis:* 20.4 MP Global Shutter CMOS + $12.5\,\mu	ext{s}$ Pulsed Blue Dome Light + INT8 YOLOv8-Seg on NVIDIA Jetson AGX Orin Industrial.
   * *Economics:* Initial CAPEX $I_0 = 11.590\,	ext{€}$, NPV = $+94.500\,	ext{€}$ (Payback: 3.5 months).

2. **Case Study 2: Robotic 3D Bin-Picking of Cast-Iron Pump Housings**
   * *Domain:* Unstructured robot feeding & assembly.
   * *Dynamics:* Robot cycle pause ($T = 2.5	ext{ s}$), Stand-off $WD = 1200	ext{ mm}$.
   * *Task:* 6-DoF grasp pose estimation of overlapping, specular cast-iron parts.
   * *Synthesis:* Photoneo PhoXi 3D Scanner Gen2 L (Structured Light) + FoundationPose 6-DoF Net on NVIDIA Jetson Orin Nano + 6-Axis Articulated Robot Arm & Gripper Tooling.
   * *Economics:* Initial CAPEX $I_0 = 69.430\,	ext{€}$, NPV = $+157.800\,	ext{€}$ (Payback: 9.8 months).

3. **Case Study 3: Continuous Conveyor Polymer & Waste Sorting**
   * *Domain:* Circular economy & high-speed material singulation.
   * *Dynamics:* Continuous belt at $v = 2.5	ext{ m/s}$, Takt time $T = 67	ext{ ms}$ (15 items/s).
   * *Synthesis:* Basler racer Line Scan (2048 px) in Near-Infrared (NIR) spectrum + Discrete I/O high-speed air-jet blow-off + Jetson Orin Nano.
   * *Economics:* Initial CAPEX $I_0 = 8.700\,	ext{€}$, NPV = $+106.200\,	ext{€}$ (Payback: 2.6 months).

---

## 📖 Scientific References & Foundations

1. **Werheid et al. (2026):** *"A conceptual framework for machine vision integration in manufacturing SMEs"*, Procedia CIRP / Journal of Manufacturing Systems.
2. **VDI/VDE/VDMA 2632 (Blatt 1–3):** *"Industrielle Bildverarbeitung - Grundlagen, Leitfaden für Erstellung von Lasten- und Pflichtenheften sowie Abnahme"*.
3. **Bischof et al. (2025):** *"A Decision Framework for AI and MLOps Toolchain Selection in Manufacturing"*, Applied AI in Production.
4. **Rysiński et al. (2026):** *"EF-IVIS: An Engineering Framework for Intelligent Vision Inspection Systems in Industrial Quality Control"*, MDPI Sensors.
5. **Roth et al. (2022):** *"Towards Total Recall in Industrial Anomaly Detection"*, CVPR.
6. **Wen et al. (2024):** *"FoundationPose: Unified 6D Pose Estimation and Tracking"*, CVPR.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for full legal text and warranty disclaimer.
