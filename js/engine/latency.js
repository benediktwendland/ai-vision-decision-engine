/**
 * Latency Waterfall & Real-Time Timing Engine
 * Adapts to timing archetype (Continuous Conveyor Throughput, Robot Guidance Loop, or Discrete Station Takt),
 * and models Parallel / Pipelined Processing (decoupled acquisition and inference ring-buffer).
 */

const LatencyEngine = {
  /**
   * Calculates timing limits and net inference budget.
   * @param {Object} timingParams
   *   - timingMode: "conveyor_throughput" | "robot_response" | "discrete_takt"
   *   - throughputPartsPerSec: number (if conveyor_throughput)
   *   - robotResponseTimeMs: number (if robot_response)
   *   - stationTaktTimeMs: number (if discrete_takt)
   *   - parallelProcessing: boolean (whether pipelined multi-threading is active)
   *   - exposureTimeMs: number
   *   - cameraInterface: string
   *   - imageSizeMb: number
   */
  calculateBudget(timingParams) {
    const {
      timingMode = "discrete_takt",
      throughputPartsPerSec = 5.0,
      robotResponseTimeMs = 300,
      stationTaktTimeMs = 500,
      parallelProcessing = true,
      exposureTimeMs = 5.0,
      cameraInterface = "GigE Vision",
      imageSizeMb = 15.0
    } = timingParams;

    // Determine target cycle time T_target (ms)
    let targetTimeMs = 500;
    let timingLabel = "Station Takt Time";

    if (timingMode === "conveyor_throughput") {
      const partsPerSec = Math.max(0.1, throughputPartsPerSec);
      targetTimeMs = Math.round(1000 / partsPerSec);
      timingLabel = `Conveyor Throughput Period (${partsPerSec} parts/s)`;
    } else if (timingMode === "robot_response") {
      targetTimeMs = Math.max(10, robotResponseTimeMs);
      timingLabel = `Robot Guidance Response Limit (${targetTimeMs} ms)`;
    } else {
      targetTimeMs = Math.max(10, stationTaktTimeMs);
      timingLabel = `Discrete Station Takt Time (${targetTimeMs} ms)`;
    }

    const tTriggerMs = 1.0;
    const tExposureMs = Math.max(0.01, exposureTimeMs);

    let busBandwidthMbps = 1000;
    if (cameraInterface.includes("USB3")) busBandwidthMbps = 3500;
    if (cameraInterface.includes("5GigE")) busBandwidthMbps = 4500;
    if (cameraInterface.includes("10GigE")) busBandwidthMbps = 9000;
    if (cameraInterface.includes("Integrated")) busBandwidthMbps = 20000;

    const tTransferMs = parseFloat(((imageSizeMb * 8 * 1024) / busBandwidthMbps).toFixed(2));
    const tPreprocMs = 4.0;
    const tPlcCommMs = 3.0;

    const tOpticalAcquisitionMs = parseFloat((tTriggerMs + tExposureMs + tTransferMs).toFixed(2));
    const tOverheadSerialMs = parseFloat((tOpticalAcquisitionMs + tPreprocMs + tPlcCommMs).toFixed(2));

    let maxInferenceBudgetMs = 0;

    if (parallelProcessing) {
      // With pipelining (Frame N+1 is exposed & transferred while Frame N is processed on GPU):
      // The system throughput is bounded by max(t_optical, t_inference) + PLC output.
      // Net inference budget equals the target time minus PLC sync and slight pipeline thread sync (~3ms)
      maxInferenceBudgetMs = parseFloat((targetTimeMs - tPlcCommMs - 3.0).toFixed(2));
    } else {
      // Pure serial: T_target >= t_trigger + t_exp + t_transfer + t_preproc + t_infer + t_plc
      maxInferenceBudgetMs = parseFloat((targetTimeMs - tOverheadSerialMs).toFixed(2));
    }

    const isFeasible = maxInferenceBudgetMs > 2.0;

    return {
      timingMode,
      timingLabel,
      targetTimeMs,
      parallelProcessing,
      tTriggerMs,
      tExposureMs,
      tTransferMs,
      tPreprocMs,
      tPlcCommMs,
      tOpticalAcquisitionMs,
      tOverheadSerialMs,
      maxInferenceBudgetMs: Math.max(0, maxInferenceBudgetMs),
      isFeasible,
      alertMessage: !isFeasible
        ? `Timing budget (${targetTimeMs} ms) is too tight! In serial mode, optical transfer consumes ${tOverheadSerialMs} ms. Enable Parallel Processing or increase budget.`
        : null
    };
  },

  /**
   * Estimates model inference execution time on hardware target.
   */
  estimateInference(model, hardware, precision = "INT8") {
    if (!model || !hardware) return { estimatedMs: 0, isWithinBudget: false, fps: 0, vramSufficient: true };

    let baseMs = 25.0;
    if (hardware.id.includes("cognex") || hardware.id.includes("smart-camera")) {
      baseMs = model.latencyMs.cpuOnly * 0.9;
    } else if (hardware.id.includes("rpi5") || hardware.id.includes("hailo8")) {
      baseMs = model.latencyMs.hailo8;
    } else if (hardware.id.includes("orin-nano")) {
      baseMs = model.latencyMs.jetsonNano;
    } else if (hardware.id.includes("ipc-520a") || hardware.id.includes("agx-orin")) {
      baseMs = model.latencyMs.jetsonOrin;
    } else if (hardware.id.includes("mic-770") || hardware.id.includes("rtx4000")) {
      baseMs = model.latencyMs.jetsonOrin * 0.45;
    } else if (hardware.id.includes("poweredge") || hardware.id.includes("l40s")) {
      baseMs = model.latencyMs.jetsonOrin * 0.20;
    } else {
      baseMs = model.latencyMs.jetsonOrin;
    }

    let speedupFactor = 1.0;
    if (precision === "FP16") speedupFactor = 1.6;
    if (precision === "INT8") speedupFactor = 2.4;

    if (model.id === "rule-based-metrology") speedupFactor = 1.0;

    const estimatedMs = parseFloat((baseMs / speedupFactor).toFixed(1));
    const vramSufficient = (hardware.vramGb >= (model.vramMinGb || 0.1));

    return {
      estimatedMs,
      precisionUsed: precision,
      fps: parseFloat((1000 / Math.max(1, estimatedMs)).toFixed(1)),
      vramSufficient,
      vramDeficitGb: Math.max(0, ((model.vramMinGb || 0.1) - hardware.vramGb).toFixed(1))
    };
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LatencyEngine };
}
