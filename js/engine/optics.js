/**
 * Optical Sizing & Physics Engine
 * Implements deterministic calculations for resolution, motion blur, focal length,
 * Line Scan (Zeilenkamera) line rates, and NIR/Visible illumination.
 */

const OpticsEngine = {
  /**
   * Calculates minimum required sensor resolution or line scan width.
   * @param {string} sensorGeometry - "area_scan" or "line_scan"
   * @param {number} fovX - Field of view width in mm
   * @param {number} fovY - Field of view height in mm (ignored if line_scan)
   * @param {number} dMin - Smallest defect or feature to detect in mm
   * @param {number} velocityMps - Object velocity in m/s (used for line rate calculation)
   * @param {number} [nyquistFactor=3.0] - Safety sampling pixels per minimum defect (typically 2.5 - 4.0)
   * @returns {Object} Resolution details (minWidthPx, minHeightPx, minTotalMP, requiredLineRateKhz)
   */
  calculateResolution(sensorGeometry, fovX, fovY, dMin, velocityMps = 0, nyquistFactor = 3.0) {
    if (!fovX || !dMin || dMin <= 0) {
      return { minWidthPx: 0, minHeightPx: 0, minTotalMP: 0, requiredLineRateKhz: 0 };
    }

    const pixelResolutionMm = dMin / nyquistFactor; // mm per pixel
    const minWidthPx = Math.ceil(fovX / pixelResolutionMm);

    if (sensorGeometry === "line_scan") {
      // In Line Scan, height is continuous.
      // Required Line Rate f_line (Hz) = v_object (mm/s) / pixelResolutionMm (mm)
      const vMmPerSec = Math.max(0.01, velocityMps) * 1000;
      const lineRateHz = vMmPerSec / pixelResolutionMm;
      const requiredLineRateKhz = parseFloat((lineRateHz / 1000).toFixed(2));

      return {
        pixelResolutionMm: parseFloat(pixelResolutionMm.toFixed(4)),
        minWidthPx,
        minHeightPx: 1, // Continuous
        minTotalMP: parseFloat(((minWidthPx * 1) / 1000000).toFixed(4)),
        isLineScan: true,
        requiredLineRateKhz
      };
    }

    // Standard Area Scan
    const effectiveFovY = fovY && fovY > 0 ? fovY : fovX * 0.75;
    const minHeightPx = Math.ceil(effectiveFovY / pixelResolutionMm);
    const minTotalMP = parseFloat(((minWidthPx * minHeightPx) / 1000000).toFixed(2));

    return {
      pixelResolutionMm: parseFloat(pixelResolutionMm.toFixed(4)),
      minWidthPx,
      minHeightPx,
      minTotalMP,
      isLineScan: false,
      requiredLineRateKhz: 0
    };
  },

  /**
   * Calculates maximum allowable exposure time to prevent motion blur.
   * Blur must not exceed 0.5 * d_min (or 1 pixel pitch).
   * @param {number} dMin - Minimum defect size in mm
   * @param {number} velocityMps - Object velocity in meters per second (m/s)
   * @param {number} [blurFraction=0.5] - Allowable fraction of dMin for motion smear
   * @returns {Object} Exposure limit in microseconds and seconds, plus shutter requirement
   */
  calculateExposureTime(dMin, velocityMps, blurFraction = 0.5) {
    if (!velocityMps || velocityMps <= 0) {
      return {
        maxExposureUs: 20000, // 20 ms static default
        maxExposureMs: 20.0,
        shutterRequired: "Rolling or Global Shutter",
        motionBlurAlert: false,
        strobeRequired: false
      };
    }

    const deltaSBlurMaxMm = dMin * blurFraction;
    const maxExposureSec = deltaSBlurMaxMm / (velocityMps * 1000);
    const maxExposureUs = Math.round(maxExposureSec * 1000000);
    const maxExposureMs = parseFloat((maxExposureSec * 1000).toFixed(3));

    const strobeRequired = maxExposureUs < 100;
    const shutterRequired = maxExposureUs < 1000 ? "Strictly Global Shutter" : "Global or Rolling Shutter";

    return {
      deltaSBlurMaxMm: parseFloat(deltaSBlurMaxMm.toFixed(4)),
      maxExposureUs,
      maxExposureMs,
      shutterRequired,
      motionBlurAlert: maxExposureUs < 50,
      strobeRequired
    };
  },

  /**
   * Calculates standard lens focal length (f) using thin-lens approximation.
   * f = WorkingDistance * (SensorDimension / (FoV + SensorDimension))
   */
  calculateFocalLength(workingDistanceMm, fovMm, sensorDimMm = 8.8) {
    if (!workingDistanceMm || !fovMm || fovMm <= 0) {
      return { exactFocalLengthMm: 0, standardLensMm: 16 };
    }
    const exact = workingDistanceMm * (sensorDimMm / (fovMm + sensorDimMm));
    const exactFocalLengthMm = parseFloat(exact.toFixed(2));

    const STANDARD_LENSES = [6, 8, 12, 16, 25, 35, 50, 75, 100];
    let closest = STANDARD_LENSES[0];
    let minDiff = Math.abs(exact - closest);

    for (let i = 1; i < STANDARD_LENSES.length; i++) {
      const diff = Math.abs(exact - STANDARD_LENSES[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closest = STANDARD_LENSES[i];
      }
    }

    return {
      exactFocalLengthMm,
      standardLensMm: closest
    };
  },

  /**
   * Recommends optical illumination and filters based on spectral band and surface.
   */
  recommendIllumination(spectralBand, surfaceType, defectType) {
    if (spectralBand === "nir") {
      return {
        illuminationType: "Active Infrared LED Matrix (850 nm / 940 nm)",
        rationale: "Near-Infrared penetrates surface inks/packaging foils, highlights moisture/organic defects in food sorting, and separates polymer types (PET/PVC/PE) without causing worker eye fatigue.",
        filter: "NIR Bandpass Filter (CWL 850nm / FWHM 40nm)",
        colorSpectrum: "Infrared 850 nm or 940 nm (Invisible)"
      };
    }

    if (spectralBand === "swir") {
      return {
        illuminationType: "Short-Wave Infrared Halogen or SWIR LED (1050 - 1550 nm)",
        rationale: "Allows transmission through silicon wafers, detection of moisture absorption bands, and identification of opaque plastics.",
        filter: "SWIR Longpass Filter",
        colorSpectrum: "SWIR (1450 nm moisture band)"
      };
    }

    switch (surfaceType) {
      case "specular_metal":
        return {
          illuminationType: "Diffuse On-Axis / Coaxial or Polarized Dome Light",
          rationale: "Suppresses direct hot-spot reflections and glare while highlighting surface topography scratches as dark scattering lines.",
          filter: "Linear/Circular Polarizing Filter matched to lens",
          colorSpectrum: "Monochrome Blue (470nm) for higher scratch diffraction and oil penetration"
        };
      case "transparent_glass":
        return {
          illuminationType: "Backlight (Telecentric or High-Uniformity Diffuse)",
          rationale: "Creates maximum contrast silhouettes of edges, inclusions, and air bubbles inside clear media.",
          filter: "Bandpass Filter matching LED wavelength",
          colorSpectrum: "Infrared (850nm) or UV (365nm) for edge fluorescence"
        };
      case "dark_absorbent":
        return {
          illuminationType: "High-Intensity Direct Ring Light or Dark-Field Grazing Light",
          rationale: "Low-angle dark-field grazing illumination highlights shallow scratches on black rubber or plastic as bright edges.",
          filter: "None / Clear protective sapphire window",
          colorSpectrum: "High-power White or Red (630nm)"
        };
      default:
        return {
          illuminationType: "Standard Direct Bar Light or Low-Angle Ring Light",
          rationale: "Provides uniform Lambertian scatter with minimum shadowing across the inspection envelope.",
          filter: "Standard UV/IR cut filter",
          colorSpectrum: "Broadband White (5700K)"
        };
    }
  },

  /**
   * Automatically derives whether Area Scan or Line Scan is optimal based on motion mode, speed, and 3D needs.
   */
  deriveScanGeometry(timingMode, velocityMps, fovX, dMin, is3D) {
    if (timingMode === "endless_web") {
      return {
        geometry: "line_scan",
        ruleId: "R21_WEB",
        reason: "Endless web / continuous bulk stream (no discrete part gaps) mandates continuous Line Scan acquisition."
      };
    }
    if (timingMode === "discrete_takt" || timingMode === "robot_response" || velocityMps <= 0) {
      return {
        geometry: "area_scan",
        ruleId: "R21_STATIC",
        reason: "Stationary / indexed part capture (v = 0 m/s) uses full-frame 2D Area Scan (or 3D snapshot)."
      };
    }
    // Moving conveyor with discrete parts: switch to Line Scan if belt speed > 1.5 m/s (and not 6-DoF snapshot)
    const minWidthPx = (fovX && dMin) ? Math.ceil((fovX / dMin) * 3.0) : 1000;
    if (!is3D && (velocityMps > 1.5 || minWidthPx > 4500)) {
      return {
        geometry: "line_scan",
        ruleId: "R21_FAST_LINE",
        reason: `High belt speed (v = ${velocityMps} m/s > 1.5 m/s) or ultra-wide resolution (${minWidthPx} px) favors continuous Line Scan.`
      };
    }
    return {
      geometry: "area_scan",
      ruleId: "R21_MOVING_AREA",
      reason: `Singulated parts at moderate speed (v = ${velocityMps} m/s ≤ 1.5 m/s) captured via Global Shutter Area Scan + Strobe.`
    };
  },

  /**
   * Evaluates if 2D is sufficient or which 3D camera technology (Stereo, ToF/LiDAR, Structured Light, Laser Triangulation) is required.
   */
  evaluateDimensionality(needsZHeight, needs6DoFPose, texture, velocityMps, workingDistanceMm = 600, dMinMm = 0.2) {
    const is3DRequired = needsZHeight || needs6DoFPose;
    if (!is3DRequired) {
      return {
        dimension: "2D",
        ruleId: "R23_2D",
        reason: "Neither 3D object pose nor Z-depth topography is required → 2D Planar Camera suffices.",
        recommendedSensorFamily: "2D Area Scan or Line Scan Camera",
        rationale: "Lowest hardware cost and highest frame rate for planar surface, print, or presence inspection."
      };
    }

    // Case 1: 3D Object Position / 6-DoF Robotic Picking (needs6DoFPose = true)
    if (needs6DoFPose) {
      if (workingDistanceMm >= 1200 || dMinMm >= 1.5) {
        return {
          dimension: "3D",
          ruleId: "R23_TOF_LIDAR",
          reason: "3D object position at large working distance (WD ≥ 1200 mm) or coarse feature scale (≥ 1.5 mm).",
          recommendedSensorFamily: "Time-of-Flight (iToF / dToF) or 3D LiDAR Camera",
          rationale: "Single-shot 3D depth map over large workspace/palletizing volume with high ambient light immunity."
        };
      }
      if (velocityMps === 0 && (texture === "specular_metal" || dMinMm < 0.25)) {
        return {
          dimension: "3D",
          ruleId: "R23_STRUCTURED_LIGHT",
          reason: "Stationary 6-DoF picking (v = 0 m/s) of shiny metal or sub-0.25 mm precision features.",
          recommendedSensorFamily: "3D Structured Light (Fringe Projection) / Active Stereo",
          rationale: "Coded fringe projection overcomes metallic glare and delivers highest sub-millimeter 6-DoF point cloud accuracy."
        };
      }
      return {
        dimension: "3D",
        ruleId: "R23_STEREO",
        reason: "3D object position (6-DoF robotic picking / guidance) at standard working distance.",
        recommendedSensorFamily: "Active IR Stereo Camera (or High-Res ToF)",
        rationale: "Fast single-frame 3D capture suitable for robot-mounted (Eye-in-Hand) or overhead bin-picking even with motion."
      };
    }

    // Case 2: Only Depth / Z-Height Topography is checked (needsZHeight = true, needs6DoFPose = false)
    if (velocityMps > 0.1) {
      return {
        dimension: "3D",
        ruleId: "R23_LASER",
        reason: `Continuous Z-height topography on moving belt (v = ${velocityMps} m/s > 0.1 m/s).`,
        recommendedSensorFamily: "3D Laser Line Triangulation (Sheet-of-Light Profiler)",
        rationale: "Uses conveyor motion to scan high-precision 3D height profiles line-by-line without multi-shot motion blur."
      };
    }

    if (workingDistanceMm >= 1200) {
      return {
        dimension: "3D",
        ruleId: "R23_TOF_LIDAR",
        reason: "Stationary depth/volume measurement at large stand-off distance (WD ≥ 1200 mm).",
        recommendedSensorFamily: "Time-of-Flight (ToF) or 3D LiDAR Camera",
        rationale: "Covers large fields of view (boxes, pallets, intralogistics) in a single snapshot."
      };
    }

    return {
      dimension: "3D",
      ruleId: "R23_STRUCTURED_LIGHT",
      reason: "Stationary Z-height / surface topography measurement (v = 0 m/s, WD < 1200 mm).",
      recommendedSensorFamily: "3D Structured Light (Fringe Projection Scanner)",
      rationale: "Delivers micron-level Z-height repeatability on stationary parts."
    };
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { OpticsEngine };
}
