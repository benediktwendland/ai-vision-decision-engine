# Contributing to the Industrial AI Vision Selection Tool

We welcome contributions from academic researchers, manufacturing engineers, students, and industrial camera/hardware vendors!

---

## How to Add New Hardware to the Catalogs

All component specifications are stored as modular JavaScript arrays in the `js/data/` folder.

### 1. Adding a New Camera Sensor (`js/data/cameras.js`)
To add a 2D or 3D camera, append an object following this schema:

```javascript
{
  id: "vendor-model-name",
  name: "Official Camera Name",
  manufacturer: "Vendor AG",
  type: "2D Area Scan" | "3D Structured Light" | "Time-of-Flight",
  dimensionality: "2D" | "3D",
  shutter: "global" | "rolling",
  resolutionMP: 12.0,
  widthPx: 4000,
  heightPx: 3000,
  pixelSizeUm: 3.45,
  maxFps: 60,
  interface: "GigE Vision" | "USB3 Vision" | "10GigE",
  dynamicRangeDb: 72,
  unitCostEuro: 1200,
  ipRating: "IP67",
  typicalUse: "High-speed surface flaw inspection"
}
```

### 2. Adding a New AI Model Topology (`js/data/models.js`)
To add a neural network architecture:

```javascript
{
  id: "model-architecture-name",
  name: "Model Full Title",
  category: "Lightweight 2D Detection" | "Pixel-Level 2D Segmentation" | "3D Spatial Pose",
  task: "Description of industrial task",
  paramsM: 15.2,
  gflops: 34.0,
  trainingDataNeeded: "Typical annotation requirement",
  latencyMs: {
    cpuOnly: 80.0,
    jetsonNano: 35.0,
    jetsonOrin: 7.5,
    hailo8: 8.2
  },
  quantizationSupport: ["FP16", "INT8"],
  bestFor: "Specific industrial defect archetype"
}
```

### 3. Adding an Edge AI Compute Platform (`js/data/hardware.js`)
To add an industrial edge PC, module, or smart camera:

```javascript
{
  id: "hardware-platform-id",
  name: "Official Hardware Name",
  manufacturer: "Manufacturer",
  tier: "Industrial PC" | "Embedded Edge AI Module" | "Smart Camera",
  cpu: "Processor description",
  accelerator: "NPU / GPU details",
  aiPerfTops: 50.0,
  tdpWatt: 20.0,
  cooling: "Passive Fanless" | "Active Fan",
  ipRating: "IP65",
  tempRangeC: [-20, 55],
  interfaces: ["PROFINET", "GigE", "OPC UA"],
  unitCostEuro: 1500,
  supportedRuntimes: ["TensorRT", "OpenVINO", "ONNX Runtime"],
  idealRole: "Industrial application role"
}
```

---

## Coding Standards & Testing
* **Zero build step required:** Core files use standard modern JavaScript (ES6+), compatible with modern evergreen browsers.
* **Pure calculation functions:** All formulas in `js/engine/` must remain pure functions without side effects.
