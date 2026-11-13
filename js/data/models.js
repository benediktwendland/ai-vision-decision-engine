/**
 * AI Model Taxonomy & Benchmark Catalog
 * Empirical metrics for Vision topologies on modern edge accelerators.
 */
const MODEL_CATALOG = [
  {
    id: "rule-based-metrology",
    name: "Classical Rule-Based CV (Halcon/OpenCV Metrology)",
    category: "Classical Computer Vision",
    task: "Sub-pixel measurement, caliper, template matching",
    paramsM: 0,
    gflops: 0.1,
    vramMinGb: 0.1,
    baseAccuracyMvp: 99.0, // Repeatability
    trainingDataNeeded: "0 images (CAD/Recipe parameterization only)",
    latencyMs: {
      cpuOnly: 4.5,
      jetsonNano: 4.2,
      jetsonOrin: 2.1,
      hailo8: 2.5
    },
    productUrl: "https://www.mvtec.com/products/halcon",
    quantizationSupport: ["N/A (C++ Deterministic)"],
    bestFor: "Dimensional tolerance verification, gauge checks, 2D orientation"
  },
  {
    id: "yolov8n-detect",
    name: "YOLOv8 Nano (YOLOv8n)",
    category: "Lightweight 2D Detection",
    task: "Object detection, coarse bounding boxes",
    paramsM: 3.2,
    gflops: 8.7,
    vramMinGb: 0.8,
    mAP50: 37.3,
    trainingDataNeeded: "150 - 500 annotated images",
    latencyMs: {
      cpuOnly: 28.0,
      jetsonNano: 11.2,
      jetsonOrin: 2.8,
      hailo8: 3.1
    },
    productUrl: "https://docs.ultralytics.com/models/yolov8/",
    quantizationSupport: ["FP32", "FP16", "INT8"],
    bestFor: "High-speed part presence check, rapid sorting, simple packaging"
  },
  {
    id: "yolov8s-seg",
    name: "YOLOv8 Small Instance Segmentation (YOLOv8s-Seg)",
    category: "Pixel-Level 2D Segmentation",
    task: "Instance segmentation, defect polygon contouring",
    paramsM: 11.8,
    gflops: 28.6,
    vramMinGb: 1.5,
    mAP50: 44.6,
    trainingDataNeeded: "300 - 1,000 annotated mask images",
    latencyMs: {
      cpuOnly: 75.0,
      jetsonNano: 32.0,
      jetsonOrin: 8.4,
      hailo8: 9.5
    },
    productUrl: "https://docs.ultralytics.com/models/yolov8/",
    quantizationSupport: ["FP16", "INT8"],
    bestFor: "Irregular surface cracks, weld seam voids, cosmetic scratches"
  },
  {
    id: "patchcore-anomaly",
    name: "PatchCore (Unsupervised Anomaly AI)",
    category: "Unsupervised Anomaly Detection",
    task: "Pixel-level defect localization and anomaly heatmaps",
    paramsM: 25.6,
    gflops: 35.0,
    vramMinGb: 3.5,
    mAP50: 99.2, // Image-level AUROC on MVTec AD
    trainingDataNeeded: "Only Good (OK) Images Needed (50-200 normal parts)!",
    latencyMs: {
      cpuOnly: 160.0,
      jetsonNano: 48.0,
      jetsonOrin: 14.2,
      hailo8: 18.0
    },
    productUrl: "https://github.com/openvinotoolkit/anomalib",
    quantizationSupport: ["FP16", "INT8 (OpenVINO / TensorRT)"],
    bestFor: "New product rollouts without historical defect samples, unseen anomaly discovery"
  },
  {
    id: "foundation-pose-6dof",
    name: "FoundationPose (Dense 6-DoF 3D PoseNet)",
    category: "3D Spatial Pose Estimation",
    task: "6-DoF position and rotation matrix calculation (X,Y,Z, Roll,Pitch,Yaw)",
    paramsM: 45.0,
    gflops: 180.0,
    vramMinGb: 8.0,
    mAP50: 89.2, // ADD-S < 0.1d metric
    trainingDataNeeded: "CAD 3D model + synthetic render domain randomization",
    latencyMs: {
      cpuOnly: 1200.0,
      jetsonNano: 680.0,
      jetsonOrin: 75.0,
      hailo8: 95.0
    },
    productUrl: "https://github.com/NVlabs/FoundationPose",
    quantizationSupport: ["FP16", "TensorRT"],
    bestFor: "Robotic bin-picking, automated mechanical assembly, fixture alignment"
  },
  {
    id: "openvla-robotics",
    name: "OpenVLA / Vision-Language-Action (7B VLM)",
    category: "Vision-Language-Action Robotics",
    task: "Natural language prompt + visual scene -> 7-DoF robot joint actions",
    paramsM: 7000.0,
    gflops: 1200.0,
    vramMinGb: 16.0,
    mAP50: 85.0, // Multi-task robotics success rate
    trainingDataNeeded: "Zero-Shot Generalization / Pretrained Web & Robot Data",
    latencyMs: {
      cpuOnly: 15000.0,
      jetsonNano: 8000.0,
      jetsonOrin: 450.0,
      hailo8: 900.0
    },
    productUrl: "https://openvla.github.io/",
    quantizationSupport: ["INT8", "FP16 (vLLM / TensorRT-LLM)"],
    bestFor: "Flexible high-mix lot-size-1 manipulation, semantic grasping, natural language robot guidance"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { MODEL_CATALOG };
}
