/**
 * Application State Manager & Shared Navigation
 * Connects the multi-page wizard, persists configuration in localStorage,
 * and provides preset case studies for high-speed inspection, 3D bin-picking, and conveyor sorting.
 */

const STORAGE_KEY = "mv_selection_tool_state_v1";

const DEFAULT_STATE = {
  // Step 1: Use Case & Business Case
  business: {
    projectName: "New Industrial Vision Project",
    useCaseType: "quality_inspection", // quality_inspection, sorting_logistics, robot_assembly
    primaryDriver: "scrap_reduction",
    maxBudgetEuro: 30000
  },

  // Multi-Year Economic Model
  economicModel: {
    horizonYears: 3,
    discountRatePct: 6.0,
    expenses: [
      { id: 1, year: "Year 0", category: "Hardware (Camera, Optics, Edge Compute)", amount: 12500 },
      { id: 2, year: "Year 0", category: "Mechanical Integration & Electrical Cabinet", amount: 8000 },
      { id: 3, year: "Year 0", category: "Software Setup, AI Training & Commissioning", amount: 9500 },
      { id: 4, year: "Year 1+", category: "Annual Maintenance, Sensor Cleaning & SLA", amount: 1800 },
      { id: 5, year: "Year 1+", category: "Electricity", amount: 1200 }
    ],
    incomes: [
      { id: 101, year: "Year 1+", category: "Labor Cost Reduction & Automation", amount: 36000 },
      { id: 102, year: "Year 1+", category: "Avoided Scrap & Rework / Quality Improvement", amount: 14000 }
    ],
    summary: {
      capex: 30000,
      netAnnualSavings: 47000,
      paybackMonths: 7.7,
      npv: 95630,
      amortized: true
    }
  },

  // Step 2: Requirement Definition & Process Constraints
  requirements: {
    sensorGeometry: "area_scan", // area_scan, line_scan
    spectralBand: "visible",     // visible, nir, swir
    timingMode: "conveyor_throughput", // conveyor_throughput, robot_response, discrete_takt
    conveyorThroughput: 6.0,    // parts/s
    velocityMps: 2.0,
    robotResponseTimeMs: 300,
    stationTaktTimeMs: 500,
    parallelProcessing: true,
    taktTimeMs: 167,            // 1000 / 6.0
    fovXMm: 400,
    fovYMm: 300,
    workingDistanceMm: 600,
    minDefectMm: 0.2,
    needsZHeight: false,
    needs6DoFPose: false,
    needs3D: false,
    surfaceType: "matte",
    defectType: "crack_scratch",
    ipRatingNeeded: "IP65"
  },

  // Step 3: Optics & Sensors
  optics: {
    selectedCameraId: "basler-ace2-a2A5328-15gmBAS",
    lensFocalLengthMm: 25,
    selectedIllumination: "Standard Direct Bar Light",
    filterType: "Standard UV/IR cut filter"
  },

  // Step 4: Software Stack & AI Model
  software: {
    selectedModelId: "yolov8s-seg",
    precision: "INT8",
    runtimeEngine: "TensorRT"
  },

  // Step 5: Edge Hardware & Integration
  integration: {
    selectedHardwareId: "siemens-ipc-227g",
    fieldbusProtocol: "PROFINET",
    mountingType: "static_overhead"
  },

  // Weights for MCDM Pareto scoring
  weights: {
    latency: 0.35,
    accuracy: 0.30,
    cost: 0.20,
    power: 0.15
  },

  // Calculated intermediate values
  opticsCalculations: {
    minWidthPx: 6000,
    minHeightPx: 4500,
    minTotalMP: 27.0,
    isLineScan: false,
    requiredLineRateKhz: 0,
    maxExposureUs: 50,
    maxExposureMs: 0.05,
    shutterRequired: "Strictly Global Shutter",
    strobeRequired: true,
    exactFocalLengthMm: 24.5,
    standardLensMm: 25,
    maxInferenceBudgetMs: 160.0
  }
};

const AppState = {
  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return Object.assign({}, DEFAULT_STATE, JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not read localStorage:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  },

  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Could not write to localStorage:", e);
    }
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  },

  /**
   * Preset 1: High-Speed Inline Quality Inspection (Sheet Metal Stamping)
   */
  loadPresetCase1() {
    const s = JSON.parse(JSON.stringify(DEFAULT_STATE));
    s.business.projectName = "Automotive Sheet Metal Stamping - Inline Flaw Inspection";
    s.business.useCaseType = "quality_inspection";
    s.business.primaryDriver = "scrap_reduction";
    s.business.maxBudgetEuro = 30000;

    s.requirements.sensorGeometry = "area_scan";
    s.requirements.spectralBand = "visible";
    s.requirements.timingMode = "conveyor_throughput";
    s.requirements.conveyorThroughput = 6.67; // 150 ms period
    s.requirements.velocityMps = 2.0;
    s.requirements.fovXMm = 250;
    s.requirements.fovYMm = 200;
    s.requirements.workingDistanceMm = 450;
    s.requirements.minDefectMm = 0.05; // 50 µm
    s.requirements.surfaceType = "specular_metal";
    s.requirements.defectType = "crack_scratch";
    s.requirements.needsZHeight = false;
    s.requirements.needs6DoFPose = false;
    s.requirements.needs3D = false;
    s.requirements.parallelProcessing = true;
    s.requirements.taktTimeMs = 150;

    s.optics.selectedCameraId = "basler-ace2-a2A5328-15gmBAS"; // 20.4 MP Global Shutter
    s.optics.lensFocalLengthMm = 25;
    s.software.selectedModelId = "yolov8s-seg";
    s.software.precision = "INT8";
    s.integration.selectedHardwareId = "nvidia-jetson-agx-orin-ind";
    s.integration.fieldbusProtocol = "PROFINET";

    // Dynamic Capital Budgeting Model for Inline Sheet Metal Inspection (No Robot / No Tooling)
    s.economicModel = {
      horizonYears: 3,
      discountRatePct: 6.0,
      expenses: [
        { id: 1, year: "Year 0", category: "Industrial Camera Sensor (Basler ace 2 Pro)", amount: 1290 },
        { id: 2, year: "Year 0", category: "Industrial Optical Lens (C-Mount 25mm)", amount: 320 },
        { id: 3, year: "Year 0", category: "Industrial Edge Compute Platform (NVIDIA Jetson AGX Orin Ind)", amount: 3800 },
        { id: 4, year: "Year 0", category: "Industrial Fieldbus & Cabling", amount: 180 },
        { id: 5, year: "Year 0", category: "Mechanical Assembly & Setup", amount: 1000 },
        { id: 6, year: "Year 0", category: "Operator Training & Guidelines", amount: 5000 },
        { id: 7, year: "Year 1+", category: "Annual Maintenance & SLA", amount: 1500 },
        { id: 8, year: "Year 1+", category: "Electricity", amount: 800 }
      ],
      incomes: [
        { id: 101, year: "Year 1+", category: "Avoided Scrap & Rework / Defect Reduction", amount: 28000 },
        { id: 102, year: "Year 1+", category: "Throughput & Capacity Gain (Zero Line Stops)", amount: 14000 }
      ],
      summary: {
        capex: 11590,
        netAnnualSavings: 39700,
        paybackMonths: 3.5,
        npv: 94500,
        amortized: true
      }
    };

    this.recomputeOptics(s);
    this.save(s);
    return s;
  },

  /**
   * Preset 2: Robotic 3D Bin-Picking & Guidance
   */
  loadPresetCase2() {
    const s = JSON.parse(JSON.stringify(DEFAULT_STATE));
    s.business.projectName = "Robotic 3D Bin-Picking of Cast-Iron Pump Housings";
    s.business.useCaseType = "robot_assembly";
    s.business.primaryDriver = "labor_savings";
    s.business.maxBudgetEuro = 45000;

    s.requirements.sensorGeometry = "area_scan";
    s.requirements.spectralBand = "visible";
    s.requirements.timingMode = "robot_response";
    s.requirements.robotResponseTimeMs = 600; // 600 ms pose planning window
    s.requirements.velocityMps = 0.0;
    s.requirements.fovXMm = 1000;
    s.requirements.fovYMm = 800;
    s.requirements.workingDistanceMm = 1200;
    s.requirements.minDefectMm = 1.0;
    s.requirements.surfaceType = "matte";
    s.requirements.defectType = "3d_geometry";
    s.requirements.needsZHeight = true;
    s.requirements.needs6DoFPose = true;
    s.requirements.needs3D = true;
    s.requirements.parallelProcessing = false; // Synchronous robot hold
    s.requirements.taktTimeMs = 2500;

    s.optics.selectedCameraId = "photoneo-phoxi-scanner-l";
    s.software.selectedModelId = "foundation-pose-6dof";
    s.software.precision = "FP16";
    s.integration.selectedHardwareId = "nvidia-jetson-orin-nano";
    s.integration.fieldbusProtocol = "OPC UA";

    // Dynamic Capital Budgeting Model: Matches 1:1 with Summary BOM Table
    s.business.useCaseType = "robotic_bin_picking";
    s.business.maxBudgetEuro = 90000;
    s.economicModel = {
      horizonYears: 3,
      discountRatePct: 6.0,
      expenses: [
        { id: 1, year: "Year 0", category: "Industrial Robot (6-Axis Articulated Robot Arm)", amount: 40000 },
        { id: 2, year: "Year 0", category: "Mechanical Tooling (Gripper, EOAT & Part Bins)", amount: 8000 },
        { id: 3, year: "Year 0", category: "Industrial 3D Sensor Scanner (Photoneo PhoXi 3D L)", amount: 14500 },
        { id: 4, year: "Year 0", category: "Industrial Edge Compute Platform (NVIDIA Jetson Orin Nano)", amount: 750 },
        { id: 5, year: "Year 0", category: "Industrial Fieldbus & Cabling", amount: 180 },
        { id: 6, year: "Year 0", category: "Mechanical Assembly & Setup", amount: 1000 },
        { id: 7, year: "Year 0", category: "Operator Training & Guidelines", amount: 5000 },
        { id: 8, year: "Year 1+", category: "Annual Maintenance & SLA", amount: 3500 },
        { id: 9, year: "Year 1+", category: "Electricity", amount: 1500 }
      ],
      incomes: [
        { id: 101, year: "Year 1+", category: "Labor Cost Reduction (3-Shift Automated Picking)", amount: 72000 },
        { id: 102, year: "Year 1+", category: "Throughput & Capacity Gain (Zero Unplanned Stops)", amount: 18000 }
      ],
      summary: {
        capex: 69430,
        netAnnualSavings: 85000,
        paybackMonths: 9.8,
        npv: 157800,
        amortized: true
      }
    };
    s.business.maxBudgetEuro = 61430;

    this.recomputeOptics(s);
    this.save(s);
    return s;
  },

  /**
   * Preset 3: Conveyor Sorting with Line Scan & NIR (Organic / Polymer Sorting)
   */
  loadPresetCase3() {
    const s = JSON.parse(JSON.stringify(DEFAULT_STATE));
    s.business.projectName = "Continuous Conveyor Polymer & Waste Sorting";
    s.business.useCaseType = "sorting_logistics";
    s.business.primaryDriver = "throughput_capacity";
    s.business.maxBudgetEuro = 28000;

    s.requirements.sensorGeometry = "line_scan";
    s.requirements.spectralBand = "nir"; // Near-Infrared
    s.requirements.timingMode = "conveyor_throughput";
    s.requirements.conveyorThroughput = 15.0; // 15 items/sec
    s.requirements.velocityMps = 2.5;
    s.requirements.fovXMm = 600; // 600 mm conveyor width
    s.requirements.fovYMm = 0;   // Continuous
    s.requirements.workingDistanceMm = 800;
    s.requirements.minDefectMm = 0.5; // 0.5 mm grain/flake size
    s.requirements.surfaceType = "matte";
    s.requirements.defectType = "presence_absence";
    s.requirements.needsZHeight = false;
    s.requirements.needs6DoFPose = false;
    s.requirements.needs3D = false;
    s.requirements.parallelProcessing = true;
    s.requirements.taktTimeMs = 67; // 1000 / 15

    s.optics.selectedCameraId = "basler-racer-raL2048-48gm"; // 2048 px Line Scan
    s.optics.lensFocalLengthMm = 35;
    s.software.selectedModelId = "yolov8n-detect";
    s.software.precision = "INT8";
    s.integration.selectedHardwareId = "nvidia-jetson-orin-nano";
    s.integration.fieldbusProtocol = "Discrete_IO"; // Instant air-jet ejection

    // Dynamic Capital Budgeting Model for Conveyor Sorting (No Robot / No Tooling)
    s.economicModel = {
      horizonYears: 3,
      discountRatePct: 6.0,
      expenses: [
        { id: 1, year: "Year 0", category: "Industrial Camera Sensor (Basler racer Line Scan)", amount: 1450 },
        { id: 2, year: "Year 0", category: "Industrial Optical Lens (C-Mount 25/35mm)", amount: 320 },
        { id: 3, year: "Year 0", category: "Industrial Edge Compute Platform (NVIDIA Jetson Orin Nano)", amount: 750 },
        { id: 4, year: "Year 0", category: "Industrial Fieldbus & Cabling", amount: 180 },
        { id: 5, year: "Year 0", category: "Mechanical Assembly & Setup", amount: 1000 },
        { id: 6, year: "Year 0", category: "Operator Training & Guidelines", amount: 5000 },
        { id: 7, year: "Year 1+", category: "Annual Maintenance & SLA", amount: 1800 },
        { id: 8, year: "Year 1+", category: "Electricity", amount: 1200 }
      ],
      incomes: [
        { id: 101, year: "Year 1+", category: "Labor Cost Reduction & High-Speed Singulation", amount: 34000 },
        { id: 102, year: "Year 1+", category: "Throughput & Material Purity Gain", amount: 12000 }
      ],
      summary: {
        capex: 8700,
        netAnnualSavings: 43000,
        paybackMonths: 2.6,
        npv: 106200,
        amortized: true
      }
    };

    this.recomputeOptics(s);
    this.save(s);
    return s;
  },

  recomputeOptics(state) {
    if (typeof OpticsEngine === "undefined") return;
    const req = state.requirements;
    const res = OpticsEngine.calculateResolution(req.sensorGeometry, req.fovXMm, req.fovYMm, req.minDefectMm, req.velocityMps, 3.0);
    const exp = OpticsEngine.calculateExposureTime(req.minDefectMm, req.velocityMps);
    const fl = OpticsEngine.calculateFocalLength(req.workingDistanceMm, req.fovXMm, 8.8);

    state.opticsCalculations = {
      minWidthPx: res.minWidthPx,
      minHeightPx: res.minHeightPx,
      minTotalMP: res.minTotalMP,
      isLineScan: res.isLineScan,
      requiredLineRateKhz: res.requiredLineRateKhz,
      maxExposureUs: exp.maxExposureUs,
      maxExposureMs: exp.maxExposureMs,
      shutterRequired: exp.shutterRequired,
      strobeRequired: exp.strobeRequired,
      exactFocalLengthMm: fl.exactFocalLengthMm,
      standardLensMm: fl.standardLensMm,
      maxInferenceBudgetMs: req.taktTimeMs - 8.0
    };
  }
};

/**
 * European / German CSV Database Manager (Semicolon ';' separated, comma ',' decimal support)
 * Allows loading edited Excel .csv files on the start page (index.html) and persists them
 * across all steps via localStorage.
 */
const CSVDatabase = {
  KEYS: {
    CAMERAS: "mv_custom_cameras_v1",
    LENSES: "mv_custom_lenses_v1",
    MODELS: "mv_custom_models_v1",
    HARDWARE: "mv_custom_hardware_v1"
  },

  parseNum(val, fallback = 0) {
    if (val === undefined || val === null || val === "") return fallback;
    const normalized = String(val).trim().replace(",", ".");
    const num = parseFloat(normalized);
    return isNaN(num) ? fallback : num;
  },

  parseSemicolonCSV(text) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return [];
    const headers = lines[0].split(";").map(h => h.trim().replace(/^"|"$/g, ""));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(";").map(c => c.trim().replace(/^"|"$/g, ""));
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = cols[idx] !== undefined ? cols[idx] : "";
      });
      rows.push(obj);
    }
    return rows;
  },

  importCamerasCSV(csvText) {
    const raw = this.parseSemicolonCSV(csvText);
    const parsed = raw.map(r => ({
      id: r.id,
      name: r.name,
      partNumber: r.partNumber,
      manufacturer: r.manufacturer,
      technology: r.technology,
      dimensionality: r.dimensionality,
      sensorModel: r.sensorModel,
      spectrum: r.spectrum,
      shutter: (r.shutter || "global").toLowerCase(),
      resolutionMP: this.parseNum(r.resolutionMP, 2.0),
      widthPx: Math.round(this.parseNum(r.widthPx, 1920)),
      heightPx: Math.round(this.parseNum(r.heightPx, 1080)),
      sensorFormat: r.sensorFormat || "2/3\"",
      sensorWidthMm: this.parseNum(r.sensorWidthMm, 8.8),
      sensorHeightMm: this.parseNum(r.sensorHeightMm, 6.6),
      pixelSizeUm: this.parseNum(r.pixelSizeUm, 3.45),
      maxFps: Math.round(this.parseNum(r.maxFps, 30)),
      maxLineRateKhz: this.parseNum(r.maxLineRateKhz, 0),
      zAccuracyMm: this.parseNum(r.zAccuracyMm, 0.1),
      workingDistanceRangeMm: [
        Math.round(this.parseNum(r.wdMinMm, 300)),
        Math.round(this.parseNum(r.wdMaxMm, 2000))
      ],
      interface: r.interface || "GigE Vision",
      unitCostEuro: Math.round(this.parseNum(r.unitCostEuro, 800)),
      ipRating: r.ipRating || "IP65",
      typicalUse: r.typicalUse || "",
      productUrl: r.productUrl || ""
    }));
    localStorage.setItem(this.KEYS.CAMERAS, JSON.stringify(parsed));
    this.applySavedCatalogs();
    return parsed;
  },

  importLensesCSV(csvText) {
    const raw = this.parseSemicolonCSV(csvText);
    const parsed = raw.map(r => ({
      focalMm: Math.round(this.parseNum(r.focalMm, 16)),
      name: r.name,
      aperture: r.aperture || "F1.8 – F16",
      format: r.format || "1.1\"",
      minWdMm: Math.round(this.parseNum(r.minWdMm, 100)),
      priceEuro: Math.round(this.parseNum(r.priceEuro, 320)),
      typicalUse: r.typicalUse || "",
      productUrl: r.productUrl || ""
    }));
    localStorage.setItem(this.KEYS.LENSES, JSON.stringify(parsed));
    this.applySavedCatalogs();
    return parsed;
  },

  importModelsCSV(csvText) {
    const raw = this.parseSemicolonCSV(csvText);
    const parsed = raw.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      task: r.task,
      paramsM: this.parseNum(r.paramsM, 0),
      gflops: this.parseNum(r.gflops, 1.0),
      vramMinGb: this.parseNum(r.vramMinGb, 0.8),
      mAP50: this.parseNum(r.mAP50, 0) || undefined,
      baseAccuracyMvp: this.parseNum(r.baseAccuracyMvp, 99.0),
      trainingDataNeeded: r.trainingDataNeeded || "",
      latencyMs: {
        cpuOnly: this.parseNum(r.latencyCpuMs, 25),
        jetsonNano: this.parseNum(r.latencyJetsonNanoMs, 12),
        jetsonOrin: this.parseNum(r.latencyJetsonOrinMs, 4),
        hailo8: this.parseNum(r.latencyHailo8Ms, 5)
      },
      quantizationSupport: ["FP32", "FP16", "INT8"],
      productUrl: r.productUrl || "",
      bestFor: r.bestFor || ""
    }));
    localStorage.setItem(this.KEYS.MODELS, JSON.stringify(parsed));
    this.applySavedCatalogs();
    return parsed;
  },

  importHardwareCSV(csvText) {
    const raw = this.parseSemicolonCSV(csvText);
    const parsed = raw.map(r => ({
      id: r.id,
      name: r.name,
      manufacturer: r.manufacturer,
      tier: r.tier,
      cpu: r.cpu,
      accelerator: r.accelerator,
      aiPerfTops: this.parseNum(r.aiPerfTops, 10),
      vramGb: this.parseNum(r.vramGb, 8.0),
      tdpWatt: this.parseNum(r.tdpWatt, 15),
      cooling: r.cooling || "Passive Fanless",
      ipRating: r.ipRating || "IP40",
      tempRangeC: [
        Math.round(this.parseNum(r.tempMinC, -20)),
        Math.round(this.parseNum(r.tempMaxC, 55))
      ],
      interfaces: ["GigE Vision", "PROFINET / OPC UA"],
      unitCostEuro: Math.round(this.parseNum(r.unitCostEuro, 1200)),
      supportedRuntimes: ["TensorRT", "OpenVINO", "ONNX Runtime"],
      productUrl: r.productUrl || "",
      idealRole: r.idealRole || ""
    }));
    localStorage.setItem(this.KEYS.HARDWARE, JSON.stringify(parsed));
    this.applySavedCatalogs();
    return parsed;
  },

  getLensesCatalog(defaultLenses) {
    try {
      const saved = localStorage.getItem(this.KEYS.LENSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultLenses;
  },

  applySavedCatalogs() {
    try {
      const savedCams = localStorage.getItem(this.KEYS.CAMERAS);
      if (savedCams && typeof CAMERA_CATALOG !== "undefined") {
        const parsed = JSON.parse(savedCams);
        CAMERA_CATALOG.splice(0, CAMERA_CATALOG.length, ...parsed);
      }
      const savedModels = localStorage.getItem(this.KEYS.MODELS);
      if (savedModels && typeof MODEL_CATALOG !== "undefined") {
        const parsed = JSON.parse(savedModels);
        parsed.forEach(m => {
          if (m.vramMinGb === undefined || isNaN(m.vramMinGb)) {
            const def = MODEL_CATALOG.find(x => x.id === m.id);
            m.vramMinGb = def && def.vramMinGb !== undefined ? def.vramMinGb : 0.8;
          }
        });
        MODEL_CATALOG.splice(0, MODEL_CATALOG.length, ...parsed);
      }
      const savedHw = localStorage.getItem(this.KEYS.HARDWARE);
      if (savedHw && typeof HARDWARE_CATALOG !== "undefined") {
        const parsed = JSON.parse(savedHw);
        parsed.forEach(h => {
          if (h.vramGb === undefined || isNaN(h.vramGb)) {
            const def = HARDWARE_CATALOG.find(x => x.id === h.id);
            h.vramGb = def && def.vramGb !== undefined ? def.vramGb : 8.0;
          }
        });
        HARDWARE_CATALOG.splice(0, HARDWARE_CATALOG.length, ...parsed);
      }
    } catch (e) {
      console.warn("Could not apply custom CSV catalogs:", e);
    }
  },

  resetAllCustomCSV() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
  }
};

// Automatically apply any imported CSV databases on every page load
CSVDatabase.applySavedCatalogs();
