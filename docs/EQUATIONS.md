# Mathematical Foundations & Engineering Formulations

This document provides the theoretical physics and mathematical derivations implemented in the **Industrial AI Vision Selection & Dimensioning Engine**.

---


## 1. Dynamic Capital Budgeting & Net Present Value (NPV / Kapitalwertrechnung)

In industrial automation projects, static Return on Investment (ROI) or simple payback period calculations fail to account for the multi-year time value of money, corporate cost of capital (WACC), ongoing AI lifecycle OPEX (data drift, model retraining, calibration upkeep), and phased cash flows across project milestones (*Jahresscheiben*). 

The tool implements dynamic capital budgeting via the **Net Present Value (NPV / Kapitalwert)** method (Standard Dynamic Capital Budgeting / VDI 2632 Guideline):

$$\text{NPV} = -I_0 + \sum_{t=1}^{N} \frac{R_t}{(1 + i)^t}$$

Alternatively, explicitly separating gross annual returns and operating expenses:

$$\text{NPV} = -I_0 + \sum_{t=1}^{N} \frac{\text{Cash Inflows}_t - \text{OPEX}_t}{(1 + i)^t}$$

Where:
- **$I_0 \ge 0$ [€]:** Initial capital investment (*Anfangsinvestition* / Year 0 CAPEX), comprising:
  - Machine vision hardware (camera sensors, lenses, structured illumination, optical filters).
  - Industrial edge compute platform (DIN-rail IPC, Cabinet GPU, or Smart Camera NPU).
  - Mechanical mounting fixtures, PLC fieldbus gateways, safety wiring.
  - Engineering commissioning, initial dataset curation, and AI model baseline training.
- **$t \in \{1, 2, \dots, N\}$ [Years]:** Project period index across annual time slices (*Jahresscheiben*).
- **$N$ [Years]:** Economic planning horizon / lifecycle of the inspection station (typically $N \in [3, 5]$ years in manufacturing).
- **$i \in [0.03, 0.15]$ (or $3\% \dots 15\%$ p.a.):** Calculation interest rate (*Kalkulationszinsfuß* / Hurdle Rate / WACC), reflecting corporate opportunity cost of capital and technological project risk.
- **$R_t = \text{Cash Inflows}_t - \text{OPEX}_t$ [€/year]:** Net operating cash flow in year $t$.
  - **$\text{Cash Inflows}_t$:** Quantifiable economic returns:
    - Direct labor cost savings (reallocation of manual inspection / sorting personnel).
    - Scrap rate reduction and avoided raw material waste.
    - Rework prevention and assembly cycle time speedup.
    - Avoided customer warranty claims, recall penalties, and audit non-conformance fees.
  - **$\text{OPEX}_t$:** Recurring operating costs:
    - Preventive maintenance, sensor lens cleaning, and illumination source replacement.
    - AI lifecycle management / MLOps: Continuous data drift monitoring, automated edge retraining, and annotation pipeline upkeep.
    - Software runtime licenses, cloud storage for traceability logs, electrical power dissipation.

### Economic Decision Gate:
An industrial AI vision project is considered economically viable and cleared for engineering realization if and only if:

$$\mathbf{\text{NPV} > 0}$$

- **$\text{NPV} > 0$:** The project yields an internal rate of return exceeding the hurdle rate $i$, generating net shareholder value.
- **$\text{NPV} = 0$:** The project exactly earns the hurdle rate $i$ (break-even).
- **$\text{NPV} < 0$:** The capital investment destroys value relative to the corporate hurdle rate and must be re-scoped or rejected.

### Dynamic Discounted Payback Period ($t_{\text{amort}}$):
The exact point in time where the cumulative discounted net cash flows fully recoup the initial capital outlay $I_0$:

$$t_{\text{amort}} = \min \left\{ \tau \;\middle|\; \sum_{t=1}^{\tau} \frac{R_t}{(1 + i)^t} \ge I_0 \right\}$$

For constant annual net cash flows $R_t \equiv \bar{R}$, the continuous dynamic payback period is:

$$t_{\text{amort, dynamic}} = \frac{-\ln\left(1 - \frac{I_0 \cdot i}{\bar{R}}\right)}{\ln(1 + i)} \quad \text{for } \bar{R} > I_0 \cdot i$$

---

## 2. Optical Sizing & Nyquist Spatial Resolution

To reliably detect a defect or feature of minimum size $d_{\text{min}}$ within an inspection Field of View ($FoV_x \times FoV_y$), the optical sensor must satisfy the spatial Nyquist-Shannon sampling criterion with an empirical industrial safety factor $n_{\text{Nyquist}} \in [2.5, 4.0]$ pixels per feature:

$$\text{Pixel Resolution Limit: } \Delta s_{\text{px}} = \frac{d_{\text{min}}}{n_{\text{Nyquist}}} \quad [\text{mm/pixel}]$$

The minimum sensor pixel grid dimensions are:

$$N_x \ge \left\lceil \frac{FoV_x}{\Delta s_{\text{px}}} \right\rceil = \left\lceil \frac{FoV_x \cdot n_{\text{Nyquist}}}{d_{\text{min}}} \right\rceil$$

$$N_y \ge \left\lceil \frac{FoV_y}{\Delta s_{\text{px}}} \right\rceil = \left\lceil \frac{FoV_y \cdot n_{\text{Nyquist}}}{d_{\text{min}}} \right\rceil$$

Total minimum sensor resolution in Megapixels:

$$R_{\text{min}} = \frac{N_x \cdot N_y}{10^6} \quad [\text{Megapixels}]$$

---

## 3. Motion Smear & Maximum Exposure Time

For parts moving on a continuous conveyor or during robot trajectory execution at velocity $v_{\text{object}}$, the allowable motion blur $\Delta s_{\text{blur}}$ must not exceed a fraction $\beta$ (typically $\beta = 0.5$) of the minimum defect size $d_{\text{min}}$:

$$\Delta s_{\text{blur}} = v_{\text{object}} \cdot t_{\text{exp}} \le \beta \cdot d_{\text{min}}$$

Solving for maximum exposure time $t_{\text{exp, max}}$:

$$t_{\text{exp, max}} \le \frac{\beta \cdot d_{\text{min}}}{v_{\text{object}}} \quad [\text{seconds}]$$

### Industrial Shutter & Lighting Pruning Rules:
* If $t_{\text{exp, max}} < 1000\,\mu\text{s}$ ($1\text{ ms}$): **Rolling Shutter sensors are strictly pruned** due to geometric distortion (rolling shutter jello effect). **Global Shutter** is mandatory.
* If $t_{\text{exp, max}} < 50\,\mu\text{s}$: Continuous lighting cannot provide sufficient photon flux without burning parts or sensor saturation. **High-intensity pulsed LED strobe illumination** (overdriven by $3\times\text{--}5\times$) is flagged as mandatory.

---

## 4. Thin-Lens Approximation & Focal Length

Using Gaussian thin-lens optics, the relationship between Working Distance ($WD$), Field of View ($FoV$), Sensor Dimension ($y_{\text{sensor}}$), and Lens Focal Length ($f$) is:

$$f = WD \cdot \frac{y_{\text{sensor}}}{FoV + y_{\text{sensor}}} \approx WD \cdot \frac{y_{\text{sensor}}}{FoV}$$

The engine maps the calculated $f$ to the closest standard industrial C-Mount fixed-focal-length lens:
$$\mathcal{F}_{\text{standard}} = \{6, 8, 12, 16, 25, 35, 50, 75, 100\}\text{ mm}$$

---

## 5. Real-Time Latency Budget & Dual Hardware Sizing Rule (TOPS vs. VRAM)

Step 4 bridges the algorithmic vision model to the physical control cabinet using a two-tier mathematical formulation:

### 4.1 Real-Time Latency Budget ($t_{\text{AI,max}}$)
In discrete manufacturing, an AI model cannot be evaluated on theoretical benchmark accuracy alone; it is bounded by a rigid real-time clock:

$$t_{\text{AI,max}} = \frac{60\,\text{s}}{N_{\text{parts/min}}} - t_{\text{trigger}} - t_{\text{exposure}} - t_{\text{transfer}} - t_{\text{preproc}} - t_{\text{PLC}}$$

With pipelined ring-buffer execution (Frame $N+1$ is exposed and transferred while Frame $N$ is inferred on GPU), this simplifies to:

$$t_{\text{AI,max}} = T_{\text{cycle}} - t_{\text{PLC}} - t_{\text{sync}}$$

---

### 4.2 Dual Hardware Sizing Rule: Processing Speed ($P_{\text{compute}}$) vs. Memory ($V_{\text{RAM}}$)

Selecting industrial computing hardware requires satisfying two independent physical constraints:

#### 1. Processing Speed Dimension (Determines Cycle Time Compliance):
$$P_{\text{compute}} \ge \frac{\text{FLOPs}_{\text{model}}}{t_{\text{AI,max}} \cdot \eta_{\text{util}}} \quad [\text{TOPS}]$$

Where:
* $\text{FLOPs}_{\text{model}}$ is the forward-pass computational complexity of the chosen AI paradigm (e.g. $8.7\,\text{GFLOPs}$ for YOLOv8n, $35\,\text{GFLOPs}$ for PatchCore, $180\,\text{GFLOPs}$ for FoundationPose, $>1200\,\text{GFLOPs}$ for OpenVLA).
* $\eta_{\text{util}} \in [0.25, 0.40]$ is the realistic chip utilization efficiency on edge accelerators under thermal throttling.

#### 2. Memory Capacity Dimension (Prevents CUDA Out-Of-Memory Crashes):
$$V_{\text{RAM, min}} \ge (N_{\text{params}} \cdot B_{\text{precision}}) \cdot \alpha_{\text{activation}} \quad [\text{Gigabytes}]$$

Where:
* $N_{\text{params}}$ is the parameter count ($0$ for Classical CV, $3.2\text{M}$ for YOLOv8n, $25.6\text{M}$ for PatchCore, $7\text{B}$ for OpenVLA).
* $B_{\text{precision}}$ is the byte weight ($1\,\text{Byte/param}$ for INT8, $2\,\text{Bytes/param}$ for FP16, $4\,\text{Bytes/param}$ for FP32).
* $\alpha_{\text{activation}} \approx 1.30$ represents the $30\%$ safety overhead for activation tensors, high-resolution frame buffers, and CUDA runtime context.

---

### 4.3 Industrial OT vs. IT Deployment Boundary (Cloud Exclusion)
While cloud compute offers abundant TOPS, Public Cloud execution is mathematically and operationally rejected for inline closed-loop inspection:
1. **Network Jitter & Round-Trip Latency:** Typical enterprise WAN round-trip latency exhibits $15-50\,\text{ms}$ latency with unhedged tail variance ($>150\,\text{ms}$ jitter), exceeding deterministic conveyor budgets.
2. **Gigabit Bandwidth Saturation:** A standard industrial $12\,\text{MP}$ camera at $30\,\text{fps}$ generates $\approx 3\,\text{Gbps}$ uncompressed payload. Multi-camera lines saturate plant uplinks immediately.
3. **Plant Autonomy:** Strict OT segregation (IEC 62443 Purdue Level 1/2) mandates that loss of WAN connectivity must never cause line-stoppage ($99.99\%$ local autonomy).

---

## 6. Multi-Criteria Decision Making (MCDM) & Pareto Scoring

Valid permutations of $(\text{Camera } c, \text{Model } m, \text{Hardware } h)$ are scored across four normalized metrics $\in [0, 100]$:

1. **Latency Margin Score ($S_{\text{lat}}$):**
   $$S_{\text{lat}} = \max\left(0, \min\left(100, \left(1 - \frac{t_{\text{total}}}{T_{\text{cycle}}}\right) \cdot 100\right)\right)$$

2. **Accuracy & Task Score ($S_{\text{acc}}$):**
   Derived from benchmark mAP / IoU / 6-DoF ADD-S metrics on standard industrial inspection datasets.

3. **Investment Cost Score ($S_{\text{cost}}$):**
   $$S_{\text{cost}} = \max\left(0, \min\left(100, \left(1 - \frac{C_{\text{total}} - C_{\text{min}}}{C_{\text{max}} - C_{\text{min}}}\right) \cdot 100\right)\right)$$

4. **Thermal / Power Dissipation Score ($S_{\text{pwr}}$):**
   $$S_{\text{pwr}} = \max\left(0, \min\left(100, \left(1 - \frac{P_{\text{total}} - P_{\text{min}}}{P_{\text{max}} - P_{\text{min}}}\right) \cdot 100\right)\right)$$

The global composite score is computed via user-weighted linear combination:

$$\mathbf{S_{\text{global}}} = w_{\text{lat}} \cdot S_{\text{lat}} + w_{\text{acc}} \cdot S_{\text{acc}} + w_{\text{cost}} \cdot S_{\text{cost}} + w_{\text{pwr}} \cdot S_{\text{pwr}}$$

Where $\sum w_i = 1.0$.
