/**
 * Multi-Criteria Decision Making (MCDM) & Pareto Scoring Engine
 * Combines hard physical filtering with weighted Pareto scoring across
 * Accuracy, Latency, Thermal/Power Dissipation, and Total System Cost.
 */

const McdmEngine = {
  /**
   * Evaluates all valid permutations of (Camera, Model, Hardware) and ranks them.
   * @param {Object} state - Full configuration state from UI
   * @param {Array} cameras - CAMERA_CATALOG
   * @param {Array} models - MODEL_CATALOG
   * @param {Array} hardwares - HARDWARE_CATALOG
   * @returns {Array} Ranked list of system solutions with Pareto scores and radar metrics
   */
  rankSolutions(state, cameras, models, hardwares) {
    const validCandidates = [];

    // Weights from state or defaults
    const wLatency = state.weights?.latency ?? 0.30;
    const wAccuracy = state.weights?.accuracy ?? 0.30;
    const wCost = state.weights?.cost ?? 0.25;
    const wPower = state.weights?.power ?? 0.15;

    const is3DNeeded = state.requirements?.needs3D ?? false;
    const taktTimeMs = state.requirements?.taktTimeMs ?? 500;
    const minMP = state.opticsCalculations?.minTotalMP ?? 2.0;
    const maxExposureUs = state.opticsCalculations?.maxExposureUs ?? 50000;

    cameras.forEach(cam => {
      // --- Hard Constraint Filter 1: Dimensionality ---
      if (is3DNeeded && cam.dimensionality !== "3D") return;
      if (!is3DNeeded && cam.dimensionality === "3D") return;

      // --- Hard Constraint Filter 2: Resolution (for 2D) ---
      if (!is3DNeeded && cam.resolutionMP < minMP) return;

      // --- Hard Constraint Filter 3: Motion Blur Shutter ---
      if (maxExposureUs < 1000 && cam.shutter === "rolling") return;

      models.forEach(model => {
        // --- Hard Constraint Filter 4: Task Compatibility ---
        if (is3DNeeded && !model.id.includes("6dof") && !model.id.includes("3d")) return;

        hardwares.forEach(hw => {
          // --- Hard Constraint Filter 5: Smart Camera compute coupling ---
          const isSmartCam = (cam.technology && cam.technology.includes("Smart Camera")) || (cam.name && cam.name.includes("In-Sight"));
          if (isSmartCam && !hw.id.includes("smart-camera")) return;
          if (!isSmartCam && hw.id.includes("smart-camera")) return;

          // Latency calculation
          const estInference = LatencyEngine.estimateInference(model, hw, "INT8");
          const busTransferMs = (cam.resolutionMP * 3 * 8) / ((cam.interface && cam.interface.includes("10GigE")) ? 9 : 1);
          const totalEndToEndMs = parseFloat((estInference.estimatedMs + (cam.acquisitionTimeMs || 5) + busTransferMs + 8).toFixed(1));

          // Prune if end-to-end time exceeds plant takt time
          if (totalEndToEndMs > taktTimeMs) return;

          // Cost estimation (Camera + Compute + 500€ Optics/Mounting baseline)
          const totalCostEuro = cam.unitCostEuro + hw.unitCostEuro + 600;

          // Power draw (TDP of compute + ~10W camera & LED)
          const totalPowerWatts = hw.tdpWatt + 12.0;

          // Normalized score metrics (0 to 100 scale)
          // 1. Latency Score (lower is better): 100 at 10ms, 0 at taktTimeMs
          const latencyScore = Math.max(0, Math.min(100, Math.round((1 - (totalEndToEndMs / taktTimeMs)) * 100)));

          // 2. Accuracy Score: derived from model capability
          let accuracyScore = 75;
          if (model.id.includes("seg") || model.id.includes("6dof")) accuracyScore = 92;
          if (model.id.includes("x-detect")) accuracyScore = 95;
          if (model.id.includes("rule-based")) accuracyScore = 88;

          // 3. Cost Score (lower is better): 100 at 1,000€, 0 at 25,000€
          const costScore = Math.max(0, Math.min(100, Math.round((1 - (totalCostEuro - 1000) / 24000) * 100)));

          // 4. Power/Thermal Score (lower is better): 100 at 10W, 0 at 100W
          const powerScore = Math.max(0, Math.min(100, Math.round((1 - (totalPowerWatts - 10) / 90) * 100)));

          // Global Weighted Pareto Score
          const globalScore = Math.round(
            (latencyScore * wLatency) +
            (accuracyScore * wAccuracy) +
            (costScore * wCost) +
            (powerScore * wPower)
          );

          validCandidates.push({
            camera: cam,
            model: model,
            hardware: hw,
            totalEndToEndMs,
            totalCostEuro,
            totalPowerWatts,
            metrics: {
              latencyScore,
              accuracyScore,
              costScore,
              powerScore
            },
            globalScore
          });
        });
      });
    });

    // Sort descending by Global Pareto Score
    validCandidates.sort((a, b) => b.globalScore - a.globalScore);

    return validCandidates;
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { McdmEngine };
}
