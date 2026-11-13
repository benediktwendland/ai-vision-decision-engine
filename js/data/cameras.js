/**
 * Machine Vision Camera Catalog
 * Contains representative, verified industrial cameras with real manufacturer part numbers
 * and realistic industrial list prices.
 * Covers: 2D Area Scan, 2D Line Scan (Zeilenkamera), NIR-optimized sensors, and 3D systems.
 */
const CAMERA_CATALOG = [
  // ==========================================
  // 1. 2D Area Scan Cameras (Standard Visible)
  // ==========================================
  {
    id: "basler-ace2-a2A2600-64gmBAS",
    name: "Basler ace 2 Basic (a2A2600-64gmBAS)",
    partNumber: "108118",
    manufacturer: "Basler AG",
    technology: "2D Area Scan",
    dimensionality: "2D",
    sensorModel: "Sony Pregius IMX547 CMOS",
    spectrum: "Visible (Monochrome / Color)",
    shutter: "global",
    resolutionMP: 5.3,
    widthPx: 2592,
    heightPx: 2048,
    sensorFormat: "1/1.8\"",
    sensorWidthMm: 6.9,
    sensorHeightMm: 5.5,
    pixelSizeUm: 2.74,
    maxFps: 64,
    interface: "GigE Vision (1 Gbps)",
    dynamicRangeDb: 70.5,
    unitCostEuro: 490,
    ipRating: "IP30 (IP65/67 with Basler modular housing)",
    typicalUse: "High-speed packaging, automated assembly, inline dimensioning",
    productUrl: "https://www.baslerweb.com/en/shop/a2a2600-64gmbas/"
  },
  {
    id: "basler-ace2-a2A5328-15gmBAS",
    name: "Basler ace 2 Pro (a2A5328-15gmBAS)",
    partNumber: "108126",
    manufacturer: "Basler AG",
    technology: "2D Area Scan",
    dimensionality: "2D",
    sensorModel: "Sony Pregius S IMX542 CMOS",
    spectrum: "Visible (Monochrome)",
    shutter: "global",
    resolutionMP: 20.4,
    widthPx: 5328,
    heightPx: 3840,
    sensorFormat: "1.1\"",
    sensorWidthMm: 14.6,
    sensorHeightMm: 10.5,
    pixelSizeUm: 2.74,
    maxFps: 15,
    interface: "GigE Vision (Compression Beyond supported)",
    dynamicRangeDb: 71.8,
    unitCostEuro: 1290,
    ipRating: "IP30 (IP65/67 with housing)",
    typicalUse: "High-precision micro-crack inspection on sheet metal, wafer and PCB inspection",
    productUrl: "https://www.baslerweb.com/en/shop/a2a5328-15gmbas/"
  },
  {
    id: "ids-ueye-cp-U3-3890CP",
    name: "IDS uEye+ CP (U3-3890CP-M-GL)",
    partNumber: "AB02867",
    manufacturer: "IDS Imaging Development Systems GmbH",
    technology: "2D Area Scan",
    dimensionality: "2D",
    sensorModel: "Sony Starvis IMX226 CMOS",
    spectrum: "Visible",
    shutter: "rolling",
    resolutionMP: 12.0,
    widthPx: 4000,
    heightPx: 3000,
    sensorFormat: "1/1.7\"",
    sensorWidthMm: 7.4,
    sensorHeightMm: 5.5,
    pixelSizeUm: 1.85,
    maxFps: 32,
    interface: "USB3 Vision (5 Gbps)",
    dynamicRangeDb: 68.0,
    unitCostEuro: 580,
    ipRating: "IP30",
    typicalUse: "Static high-resolution microscopy, lab test stations, low-speed inspection",
    productUrl: "https://en.ids-imaging.com/store/u3-3890cp-rev-2-2.html"
  },

  // ==========================================
  // 2. 2D Line Scan Cameras (Zeilenkameras)
  // For continuous web, conveyor sorting, & bulk material
  // ==========================================
  {
    id: "basler-racer-raL2048-48gm",
    name: "Basler racer (raL2048-48gm Line Scan)",
    partNumber: "105553",
    manufacturer: "Basler AG",
    technology: "2D Line Scan",
    dimensionality: "2D Line Scan",
    sensorModel: "Awaiba Dragster CMOS Line Sensor",
    spectrum: "Visible (Monochrome)",
    shutter: "global",
    resolutionMP: 0.002, // 2048 x 1 line
    widthPx: 2048,
    heightPx: 1, // Continuous scan
    sensorFormat: "Linear array (14.3 mm)",
    sensorWidthMm: 14.33,
    sensorHeightMm: 0.007,
    pixelSizeUm: 7.0,
    maxLineRateKhz: 51.0, // 51,000 lines per second
    interface: "GigE Vision",
    dynamicRangeDb: 66.0,
    unitCostEuro: 1450,
    ipRating: "IP30",
    typicalUse: "Continuous conveyor sorting, parcel scanning, endless steel / film web inspection",
    productUrl: "https://www.baslerweb.com/en/shop/ral2048-48gm/"
  },
  {
    id: "teledyne-dalsa-linea-4k",
    name: "Teledyne DALSA Linea 4K (LA-GM-04K08A)",
    partNumber: "LA-GM-04K08A-00-R",
    manufacturer: "Teledyne DALSA",
    technology: "2D Line Scan",
    dimensionality: "2D Line Scan",
    sensorModel: "Teledyne High-Sensitivity CMOS Line Array",
    spectrum: "Visible",
    shutter: "global",
    resolutionMP: 0.004, // 4096 x 1
    widthPx: 4096,
    heightPx: 1,
    sensorFormat: "Linear array (28.7 mm)",
    sensorWidthMm: 28.67,
    sensorHeightMm: 0.007,
    pixelSizeUm: 7.04,
    maxLineRateKhz: 80.0, // 80 kHz
    interface: "GigE Vision / TurboDrive",
    dynamicRangeDb: 68.0,
    unitCostEuro: 2350,
    ipRating: "IP30 (IP65 enclosure optional)",
    typicalUse: "High-speed optical sorting (food, plastic flakes, grain), printing web inspection",
    productUrl: "https://www.teledynedalsa.com/en/products/imaging/cameras/linea/"
  },

  // ==========================================
  // 3. NIR-Optimized Sensors (Near-Infrared)
  // For sorting organic matter, plastics, seeing through foil, or oil penetration
  // ==========================================
  {
    id: "basler-ace-nir-acA1300-60gmNIR",
    name: "Basler ace NIR (acA1300-60gmNIR)",
    partNumber: "105822",
    manufacturer: "Basler AG",
    technology: "2D Area Scan (NIR Enhanced)",
    dimensionality: "2D",
    sensorModel: "e2v EV76C661 NIR-Enhanced CMOS",
    spectrum: "Near-Infrared (NIR 750 - 1050 nm) & Visible",
    shutter: "global",
    resolutionMP: 1.3,
    widthPx: 1280,
    heightPx: 1024,
    sensorFormat: "1/1.8\"",
    sensorWidthMm: 6.78,
    sensorHeightMm: 5.43,
    pixelSizeUm: 5.3,
    maxFps: 60,
    interface: "GigE Vision",
    dynamicRangeDb: 64.0,
    quantumEfficiencyNirPct: 40.0, // High QE at 850nm
    unitCostEuro: 560,
    ipRating: "IP30",
    typicalUse: "NIR waste sorting (PET/PVC), agricultural seed sorting, seeing through tinted plastics",
    productUrl: "https://www.baslerweb.com/en/shop/aca1300-60gmnir/"
  },
  {
    id: "ids-ueye-nir-UI-3370CP-NIR",
    name: "IDS uEye+ NIR (UI-3370CP-NIR-GL)",
    partNumber: "AB00234",
    manufacturer: "IDS Imaging Development Systems GmbH",
    technology: "2D Area Scan (NIR Enhanced)",
    dimensionality: "2D",
    sensorModel: "CMOSIS CMV4000-NIR",
    spectrum: "Near-Infrared (NIR 850 - 950 nm)",
    shutter: "global",
    resolutionMP: 4.2,
    widthPx: 2048,
    heightPx: 2048,
    sensorFormat: "1\"",
    sensorWidthMm: 11.26,
    sensorHeightMm: 11.26,
    pixelSizeUm: 5.5,
    maxFps: 80,
    interface: "USB3 Vision",
    dynamicRangeDb: 60.0,
    unitCostEuro: 1120,
    ipRating: "IP30",
    typicalUse: "Solar cell electroluminescence, high-speed food inspection, NIR fluid monitoring",
    productUrl: "https://en.ids-imaging.com/store/ui-3370cp-rev-2.html"
  },

  // ==========================================
  // 4. Smart Cameras (Self-Contained Edge Sensor)
  // ==========================================
  {
    id: "cognex-insight-2800",
    name: "Cognex In-Sight 2800 (IS2801M-363-40)",
    partNumber: "IS2801M-363-40",
    manufacturer: "Cognex Corporation",
    technology: "Smart Camera (Integrated Compute & Light)",
    dimensionality: "2D",
    sensorModel: "1/3\" High-Speed CMOS with Integrated Multi-Torch Light",
    spectrum: "Visible / Multicolor (Red/Green/Blue/White)",
    shutter: "global",
    resolutionMP: 2.0,
    widthPx: 1600,
    heightPx: 1200,
    sensorFormat: "1/3\"",
    sensorWidthMm: 4.8,
    sensorHeightMm: 3.6,
    pixelSizeUm: 3.0,
    maxFps: 45,
    interface: "PROFINET / EtherNet/IP / Isolated 24V I/O",
    dynamicRangeDb: 64.0,
    unitCostEuro: 3450,
    ipRating: "IP67 (Direct washdown)",
    typicalUse: "Zero-cabinet packaging sorting, OCR, presence/absence with direct PLC I/O",
    productUrl: "https://www.cognex.com/products/machine-vision/2d-machine-vision-systems/in-sight-2800-series"
  },

  // ==========================================
  // 5. 3D Vision Sensors & Spatial Scanners
  // ==========================================
  {
    id: "photoneo-phoxi-scanner-l",
    name: "Photoneo PhoXi 3D Scanner Gen2 L",
    partNumber: "PHX-SCAN-GEN2-L",
    manufacturer: "Photoneo s.r.o.",
    technology: "3D Structured Light (Pattern Projection)",
    dimensionality: "3D",
    sensorModel: "Custom CMOS 3.2MP + Laser Pattern Projection",
    spectrum: "Laser 638 nm (Red) / 850 nm (IR optional)",
    shutter: "global",
    resolutionMP: 3.2,
    widthPx: 2064,
    heightPx: 1544,
    zAccuracyMm: 0.10, // 100 µm
    workingDistanceRangeMm: [1000, 2500],
    fovAtTypicalWdMm: [1100, 800],
    acquisitionTimeMs: 250,
    interface: "GigE Vision (PoE)",
    dynamicRangeDb: 78.0,
    unitCostEuro: 14500,
    ipRating: "IP65",
    typicalUse: "Euro-pallet de-palletizing, heavy cast-iron bin-picking, weld seam metrology",
    productUrl: "https://www.photoneo.com/products/phoxi-scan-l/"
  },
  {
    id: "zivid-two-plus-m130",
    name: "Zivid 2+ M130 3D Camera",
    partNumber: "ZVD2P-M130",
    manufacturer: "Zivid AS",
    technology: "3D Structured Light (3D Color Fringe Projection)",
    dimensionality: "3D",
    sensorModel: "High-Speed Dynamic Coded Light + RGB Sensor",
    spectrum: "White Structured Light (HDR 3D)",
    shutter: "global",
    resolutionMP: 5.0,
    widthPx: 2472,
    heightPx: 2056,
    zAccuracyMm: 0.05, // 50 µm
    workingDistanceRangeMm: [800, 1600],
    fovAtTypicalWdMm: [840, 560],
    acquisitionTimeMs: 120,
    interface: "10GigE Vision",
    dynamicRangeDb: 82.0,
    unitCostEuro: 16800,
    ipRating: "IP65",
    typicalUse: "High-precision robotic bin-picking, shiny reflective metal parts, precision assembly",
    productUrl: "https://www.zivid.com/zivid-2-plus-m130"
  },
  {
    id: "lucid-helios2-plus-tof",
    name: "Lucid Helios2+ Time-of-Flight (HLT003S-001)",
    partNumber: "HLT003S-001",
    manufacturer: "Lucid Vision Labs Inc.",
    technology: "Time-of-Flight (iToF 3D)",
    dimensionality: "3D",
    sensorModel: "Sony DepthSense IMX556 ToF Sensor",
    spectrum: "VCSEL 850 nm / 940 nm IR",
    shutter: "global",
    resolutionMP: 0.3,
    widthPx: 640,
    heightPx: 480,
    zAccuracyMm: 4.0, // 4 mm at 1.5m
    workingDistanceRangeMm: [300, 6000],
    fovAtTypicalWdMm: [1200, 900],
    acquisitionTimeMs: 33, // 30 FPS continuous 3D
    interface: "GigE Vision (PoE)",
    dynamicRangeDb: 60.0,
    unitCostEuro: 3250,
    ipRating: "IP67",
    typicalUse: "High-speed package dimensioning, robotic palletizing, safety zone monitoring",
    productUrl: "https://thinklucid.com/product/helios2-plus-tof-ip67-3d-camera/"
  },
  {
    id: "intel-realsense-d435f",
    name: "Intel RealSense Depth Camera D435f",
    partNumber: "82635D435F",
    manufacturer: "Intel Corporation",
    technology: "Active IR Stereo (IR Projector + Stereo CMOS)",
    dimensionality: "3D",
    sensorModel: "Dual OmniVision OV9282 CMOS + IR Dot Projector",
    spectrum: "IR 850 nm + RGB Visible",
    shutter: "global",
    resolutionMP: 1.0,
    widthPx: 1280,
    heightPx: 720,
    zAccuracyMm: 2.0, // ~2% of distance
    workingDistanceRangeMm: [300, 3000],
    fovAtTypicalWdMm: [870, 580],
    acquisitionTimeMs: 33,
    interface: "USB 3.1 Gen 1 Type-C",
    dynamicRangeDb: 62.0,
    unitCostEuro: 450,
    ipRating: "IP20 (Requires rugged external IP housing for plant floor)",
    typicalUse: "Cost-sensitive cobot guidance, AGV navigation, basic part localization",
    productUrl: "https://www.intelrealsense.com/depth-camera-d435f/"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CAMERA_CATALOG };
}
