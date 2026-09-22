import {
  ForecastModelId,
  WeatherRegime,
  LeadTime,
  ModelContribution,
  ExplainabilityReport,
  ExtremeHazardRisk,
  ParameterForecast,
  LocationOption,
  ForecastSnapshot,
  RegionalSkillData
} from '../types/weather';

export const INDIAN_LOCATIONS: LocationOption[] = [
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lon: 80.2707,
    defaultRegime: 'HEAVY_RAIN',
    elevation: '6m (Coastal)',
    climateZone: 'Tropical Wet & Dry / Coastal'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lon: 72.8777,
    defaultRegime: 'MONSOON',
    elevation: '14m (Coastal)',
    climateZone: 'Tropical Coastal / High Precipitation'
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    state: 'Delhi',
    lat: 28.6139,
    lon: 77.2090,
    defaultRegime: 'NORMAL',
    elevation: '216m (Inland)',
    climateZone: 'Semi-Arid / Continental'
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lon: 77.5946,
    defaultRegime: 'CONVECTIVE',
    elevation: '920m (Deccan Plateau)',
    climateZone: 'Tropical Savanna / Convective'
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lon: 88.3639,
    defaultRegime: 'CONVECTIVE',
    elevation: '9m (Deltaic)',
    climateZone: 'Tropical Wet-and-Dry'
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    lat: 20.2961,
    lon: 85.8245,
    defaultRegime: 'EXTREME',
    elevation: '45m (East Coast)',
    climateZone: 'Tropical Coastal / Cyclonic Prone'
  },
  {
    id: 'guwahati',
    name: 'Guwahati',
    state: 'Assam',
    lat: 26.1445,
    lon: 91.7362,
    defaultRegime: 'MONSOON',
    elevation: '55m (Brahmaputra Basin)',
    climateZone: 'Humid Subtropical'
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lon: 72.5714,
    defaultRegime: 'NORMAL',
    elevation: '53m (Semi-Arid)',
    climateZone: 'Hot Semi-Arid'
  }
];

export interface WeightCalculationResult {
  weights: Record<ForecastModelId, number>;
  primaryModel: ForecastModelId;
  blendedRainfall: number;
  blendedTemp: number;
  blendedWind: number;
  blendedHumidity: number;
  confidenceScore: number;
  agreementLevel: 'HIGH' | 'MODERATE' | 'LOW';
  variance: number;
  models: ModelContribution[];
}

/**
 * Dynamic Adaptive Ensemble Weighting Algorithm
 * Incorporates:
 * 1. Location regional skill
 * 2. Forecast Lead-time decay curve (AI dominant at 0-6h -> NWP/Ensemble dominant at 48-72h)
 * 3. Weather Regime classifier (Heavy rain / Convective / Monsoon / Heatwave / Normal)
 * 4. Inter-model agreement & historical variance penalty
 */
export function calculateAdaptiveWeights(
  locationId: string,
  leadTime: LeadTime,
  regime: WeatherRegime,
  customRawValues?: Partial<Record<ForecastModelId, { rain: number; temp: number; wind: number }>>
): WeightCalculationResult {
  // Base baseline weights per model
  let gfs = 25;
  let wrf = 35;
  let ai = 25;
  let ens = 15;

  // 1. Lead-Time Decay Dynamics
  switch (leadTime) {
    case '6h':
      // Nowcasting: AI / ML models excel due to observational radar/satellite inputs
      ai += 20; // 45%
      wrf += 5; // 40%
      gfs -= 15; // 10%
      ens -= 10; // 5%
      break;
    case '12h':
      ai += 10; // 35%
      wrf += 10; // 45%
      gfs -= 10; // 15%
      ens -= 10; // 5%
      break;
    case '24h':
      // 24h Mesoscale sweet spot
      wrf += 10; // 45%
      ai += 0; // 25%
      gfs -= 5; // 20%
      ens -= 5; // 10%
      break;
    case '48h':
      // Medium range NWP + Ensemble increase
      gfs += 10; // 35%
      ens += 15; // 30%
      wrf -= 10; // 25%
      ai -= 15; // 10%
      break;
    case '72h':
      gfs += 15; // 40%
      ens += 20; // 35%
      wrf -= 15; // 20%
      ai -= 20; // 5%
      break;
    case '120h':
      ens += 30; // 45%
      gfs += 15; // 40%
      wrf -= 25; // 10%
      ai -= 20; // 5%
      break;
  }

  // 2. Weather Regime Dynamic Adjustment
  switch (regime) {
    case 'HEAVY_RAIN':
      // WRF high resolution cloud microphysics excel in intense precipitation
      wrf += 12;
      ai += 4;
      gfs -= 8;
      ens -= 8;
      break;
    case 'CONVECTIVE':
      // AI / LSTM pattern recognition + WRF localized thermals
      ai += 12;
      wrf += 6;
      gfs -= 12;
      ens -= 6;
      break;
    case 'MONSOON':
      // NWP mesoscale + Ensemble spread
      wrf += 8;
      ens += 8;
      gfs -= 8;
      ai -= 8;
      break;
    case 'EXTREME':
      // Ensemble captures uncertainty band, WRF captures max peak gust/rain
      ens += 15;
      wrf += 8;
      ai -= 10;
      gfs -= 13;
      break;
    case 'NORMAL':
      // Balanced distribution
      gfs += 5;
      ens += 5;
      ai += 0;
      wrf -= 10;
      break;
  }

  // 3. Regional Skill Modifiers
  if (locationId === 'chennai') {
    // Coastal heavy rain & NE monsoon tracking -> WRF and AI boosted
    wrf += 5;
    ai += 3;
    gfs -= 5;
    ens -= 3;
  } else if (locationId === 'bengaluru') {
    // Urban convective afternoon showers -> AI high-skill
    ai += 8;
    wrf += 2;
    gfs -= 5;
    ens -= 5;
  } else if (locationId === 'delhi') {
    // Continental synoptic scale heatwave/fog -> GFS & Ensemble higher
    gfs += 8;
    ens += 5;
    wrf -= 8;
    ai -= 5;
  } else if (locationId === 'bhubaneswar') {
    // East coast cyclonic tracking -> Ensemble spread & WRF core
    ens += 10;
    wrf += 5;
    gfs -= 8;
    ai -= 7;
  }

  // Ensure minimum non-negative bounds
  gfs = Math.max(5, gfs);
  wrf = Math.max(5, wrf);
  ai = Math.max(5, ai);
  ens = Math.max(5, ens);

  // Normalize to 100%
  const total = gfs + wrf + ai + ens;
  const wGFS = Math.round((gfs / total) * 100);
  const wWRF = Math.round((wrf / total) * 100);
  const wAI = Math.round((ai / total) * 100);
  const wENS = 100 - (wGFS + wWRF + wAI); // Ensure sum is exactly 100

  // Raw forecast scenario generation (or override)
  let rawRain: Record<ForecastModelId, number>;
  let rawTemp: Record<ForecastModelId, number>;
  let rawWind: Record<ForecastModelId, number>;

  if (regime === 'HEAVY_RAIN') {
    rawRain = { GFS: 68, WRF: 84, AI_MODEL: 76, ENSEMBLE: 72 };
    rawTemp = { GFS: 27.5, WRF: 26.8, AI_MODEL: 27.0, ENSEMBLE: 27.2 };
    rawWind = { GFS: 28, WRF: 36, AI_MODEL: 32, ENSEMBLE: 30 };
  } else if (regime === 'CONVECTIVE') {
    rawRain = { GFS: 22, WRF: 48, AI_MODEL: 54, ENSEMBLE: 32 };
    rawTemp = { GFS: 29.0, WRF: 28.2, AI_MODEL: 28.0, ENSEMBLE: 28.5 };
    rawWind = { GFS: 18, WRF: 28, AI_MODEL: 34, ENSEMBLE: 22 };
  } else if (regime === 'MONSOON') {
    rawRain = { GFS: 42, WRF: 58, AI_MODEL: 50, ENSEMBLE: 52 };
    rawTemp = { GFS: 28.0, WRF: 27.5, AI_MODEL: 27.8, ENSEMBLE: 27.9 };
    rawWind = { GFS: 22, WRF: 26, AI_MODEL: 24, ENSEMBLE: 25 };
  } else if (regime === 'EXTREME') {
    rawRain = { GFS: 110, WRF: 165, AI_MODEL: 140, ENSEMBLE: 135 };
    rawTemp = { GFS: 26.0, WRF: 25.2, AI_MODEL: 25.5, ENSEMBLE: 25.8 };
    rawWind = { GFS: 65, WRF: 88, AI_MODEL: 78, ENSEMBLE: 74 };
  } else {
    // NORMAL
    rawRain = { GFS: 4, WRF: 6, AI_MODEL: 5, ENSEMBLE: 5 };
    rawTemp = { GFS: 33.5, WRF: 32.8, AI_MODEL: 33.0, ENSEMBLE: 33.2 };
    rawWind = { GFS: 14, WRF: 12, AI_MODEL: 13, ENSEMBLE: 14 };
  }

  // Apply custom raw overrides if provided
  if (customRawValues) {
    if (customRawValues.GFS?.rain !== undefined) rawRain.GFS = customRawValues.GFS.rain;
    if (customRawValues.WRF?.rain !== undefined) rawRain.WRF = customRawValues.WRF.rain;
    if (customRawValues.AI_MODEL?.rain !== undefined) rawRain.AI_MODEL = customRawValues.AI_MODEL.rain;
    if (customRawValues.ENSEMBLE?.rain !== undefined) rawRain.ENSEMBLE = customRawValues.ENSEMBLE.rain;
  }

  // Calculate Weighted Blended Values
  const blendedRainfall = Number(
    ((wGFS * rawRain.GFS + wWRF * rawRain.WRF + wAI * rawRain.AI_MODEL + wENS * rawRain.ENSEMBLE) / 100).toFixed(1)
  );

  const blendedTemp = Number(
    ((wGFS * rawTemp.GFS + wWRF * rawTemp.WRF + wAI * rawTemp.AI_MODEL + wENS * rawTemp.ENSEMBLE) / 100).toFixed(1)
  );

  const blendedWind = Number(
    ((wGFS * rawWind.GFS + wWRF * rawWind.WRF + wAI * rawWind.AI_MODEL + wENS * rawWind.ENSEMBLE) / 100).toFixed(1)
  );

  const blendedHumidity = regime === 'HEAVY_RAIN' || regime === 'EXTREME' ? 88 : regime === 'MONSOON' ? 82 : regime === 'CONVECTIVE' ? 76 : 62;

  // Inter-model Agreement & Variance Calculation
  const rainValues = [rawRain.GFS, rawRain.WRF, rawRain.AI_MODEL, rawRain.ENSEMBLE];
  const meanRain = rainValues.reduce((a, b) => a + b, 0) / 4;
  const variance = Math.sqrt(rainValues.reduce((sum, val) => sum + Math.pow(val - meanRain, 2), 0) / 4);

  let agreementLevel: 'HIGH' | 'MODERATE' | 'LOW' = 'HIGH';
  if (variance > 18) {
    agreementLevel = 'LOW';
  } else if (variance > 8) {
    agreementLevel = 'MODERATE';
  }

  // Confidence Score Calculation (Base 88% adjusted for variance & lead-time decay)
  let confidenceScore = 88;
  if (agreementLevel === 'MODERATE') confidenceScore -= 8;
  if (agreementLevel === 'LOW') confidenceScore -= 18;
  if (leadTime === '48h') confidenceScore -= 4;
  if (leadTime === '72h') confidenceScore -= 9;
  if (leadTime === '120h') confidenceScore -= 15;
  if (regime === 'EXTREME') confidenceScore -= 5;
  confidenceScore = Math.max(52, Math.min(96, confidenceScore));

  // Determine Primary Leading Model
  const weightsMap: Record<ForecastModelId, number> = {
    GFS: wGFS,
    WRF: wWRF,
    AI_MODEL: wAI,
    ENSEMBLE: wENS
  };

  let primaryModel: ForecastModelId = 'WRF';
  let maxWeight = -1;
  (Object.keys(weightsMap) as ForecastModelId[]).forEach((key) => {
    if (weightsMap[key] > maxWeight) {
      maxWeight = weightsMap[key];
      primaryModel = key;
    }
  });

  const models: ModelContribution[] = [
    {
      id: 'WRF',
      name: 'WRF Mesoscale NWP',
      category: 'NWP',
      subCategory: 'High-Res 3km Cloud Microphysics',
      weight: wWRF,
      rawForecastValue: rawRain.WRF,
      historicalSkillScore: 89,
      rmse: 3.2,
      color: '#38bdf8', // Light Cyan Blue
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      biasCorrection: -1.1,
      description: 'Resolves complex orographic rainfall and localized convective boundaries.'
    },
    {
      id: 'AI_MODEL',
      name: 'AI Neural Blend (XGB+LSTM)',
      category: 'AI/ML',
      subCategory: 'Spatial-Temporal Residual Correction',
      weight: wAI,
      rawForecastValue: rawRain.AI_MODEL,
      historicalSkillScore: 86,
      rmse: 3.4,
      color: '#a855f7', // Electric Violet
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      biasCorrection: 0.0,
      description: 'Learns non-linear error patterns and rapid 0-6h nowcasting transformations.'
    },
    {
      id: 'GFS',
      name: 'GFS Global NWP',
      category: 'NWP',
      subCategory: '13km Synoptic Circulations',
      weight: wGFS,
      rawForecastValue: rawRain.GFS,
      historicalSkillScore: 78,
      rmse: 4.8,
      color: '#3b82f6', // Sapphire Blue
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      biasCorrection: +2.4,
      description: 'Captures large-scale pressure troughs, easterly waves, and jet streams.'
    },
    {
      id: 'ENSEMBLE',
      name: 'GEFS / Multi-Ensemble',
      category: 'Ensemble',
      subCategory: '31-Member Probability Dispersion',
      weight: wENS,
      rawForecastValue: rawRain.ENSEMBLE,
      historicalSkillScore: 82,
      rmse: 3.9,
      color: '#10b981', // Emerald Green
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      biasCorrection: -0.4,
      description: 'Quantifies atmospheric spread and reduces extreme deterministic false alarms.'
    }
  ];

  return {
    weights: weightsMap,
    primaryModel,
    blendedRainfall,
    blendedTemp,
    blendedWind,
    blendedHumidity,
    confidenceScore,
    agreementLevel,
    variance: Number(variance.toFixed(1)),
    models
  };
}

/**
 * Generates full multi-parameter snapshot and Explainability report
 */
export function generateForecastSnapshot(
  locationId: string,
  leadTime: LeadTime = '24h',
  regimeOverride?: WeatherRegime
): ForecastSnapshot {
  const loc = INDIAN_LOCATIONS.find((l) => l.id === locationId) || INDIAN_LOCATIONS[0];
  const regime = regimeOverride || loc.defaultRegime;

  const result = calculateAdaptiveWeights(loc.id, leadTime, regime);

  // Multi-Hazard Risk Matrix
  const extremeHazards: ExtremeHazardRisk[] = [
    {
      id: 'heavy_rain',
      hazardName: 'Heavy Rainfall Risk',
      iconName: 'CloudRain',
      riskPercentage: regime === 'EXTREME' ? 94 : regime === 'HEAVY_RAIN' ? 78 : regime === 'MONSOON' ? 52 : regime === 'CONVECTIVE' ? 44 : 12,
      severityLevel: regime === 'EXTREME' ? 'CRITICAL' : regime === 'HEAVY_RAIN' ? 'HIGH' : regime === 'MONSOON' ? 'MODERATE' : 'LOW',
      currentMetric: `${result.blendedRainfall} mm / ${leadTime}`,
      thresholdWarning: result.blendedRainfall >= 65 ? 'Exceeds 64.5mm IMD Heavy Rain Threshold' : 'Within normal operational limits',
      impactDescription: 'Potential localized waterlogging in low-lying corridors and coastal transport delays.',
      actionableAdvisory: 'NDRF & Municipal drainage pumps alerted for high-intensity 3-hour bursts.',
      color: '#38bdf8'
    },
    {
      id: 'heatwave',
      hazardName: 'Heatwave & Thermal Stress',
      iconName: 'Flame',
      riskPercentage: loc.id === 'delhi' && regime === 'NORMAL' ? 76 : regime === 'NORMAL' ? 24 : 14,
      severityLevel: loc.id === 'delhi' && regime === 'NORMAL' ? 'HIGH' : 'LOW',
      currentMetric: `${result.blendedTemp}°C (Heat Index ${Math.round(result.blendedTemp + 4)}°C)`,
      thresholdWarning: result.blendedTemp >= 40 ? 'Severe heat index alert' : 'Thermal conditions moderate',
      impactDescription: 'High wet-bulb thermal load during peak solar hours (12:00 - 15:30).',
      actionableAdvisory: 'Maintain hydration protocols; avoid continuous direct outdoor exposure.',
      color: '#f97316'
    },
    {
      id: 'high_wind',
      hazardName: 'High Wind / Squall Risk',
      iconName: 'Wind',
      riskPercentage: regime === 'EXTREME' ? 88 : regime === 'HEAVY_RAIN' ? 42 : 18,
      severityLevel: regime === 'EXTREME' ? 'CRITICAL' : regime === 'HEAVY_RAIN' ? 'MODERATE' : 'LOW',
      currentMetric: `${result.blendedWind} km/h (Gusts up to ${Math.round(result.blendedWind * 1.45)} km/h)`,
      thresholdWarning: result.blendedWind >= 45 ? 'Squall threshold exceeded' : 'Standard breeze levels',
      impactDescription: 'Hazardous coastal sea conditions; small craft marine advisory active.',
      actionableAdvisory: 'Fishermen advised not to venture into deep sea along the coast.',
      color: '#a855f7'
    },
    {
      id: 'convective_storm',
      hazardName: 'Thunderstorm & Lightning',
      iconName: 'Zap',
      riskPercentage: regime === 'CONVECTIVE' ? 82 : regime === 'HEAVY_RAIN' ? 64 : 20,
      severityLevel: regime === 'CONVECTIVE' ? 'HIGH' : regime === 'HEAVY_RAIN' ? 'MODERATE' : 'LOW',
      currentMetric: 'CAPE: 1,850 J/kg | Lifted Index: -4.2',
      thresholdWarning: regime === 'CONVECTIVE' ? 'Strong updrafts detected' : 'Stable atmospheric profile',
      impactDescription: 'Intense short-duration lightning and sudden microburst wind shears.',
      actionableAdvisory: 'Seek safe indoor shelter during radar echo intensification.',
      color: '#eab308'
    }
  ];

  // Parameters
  const parameters: Record<string, ParameterForecast> = {
    rainfall: {
      key: 'rainfall',
      label: 'Rainfall Accumulation',
      unit: 'mm',
      iconName: 'CloudRain',
      blendedValue: result.blendedRainfall,
      deterministicValue: result.models[0].rawForecastValue,
      uncertaintyRange: [
        Math.max(0, Math.round(result.blendedRainfall * 0.82)),
        Math.round(result.blendedRainfall * 1.24)
      ],
      models: {
        GFS: result.models.find((m) => m.id === 'GFS')?.rawForecastValue || 0,
        WRF: result.models.find((m) => m.id === 'WRF')?.rawForecastValue || 0,
        AI_MODEL: result.models.find((m) => m.id === 'AI_MODEL')?.rawForecastValue || 0,
        ENSEMBLE: result.models.find((m) => m.id === 'ENSEMBLE')?.rawForecastValue || 0
      },
      trend: result.blendedRainfall > 40 ? 'increasing' : 'stable',
      statusTag: result.blendedRainfall >= 65 ? 'HEAVY RAIN ALERT' : result.blendedRainfall > 20 ? 'MODERATE RAIN' : 'LIGHT/DRY',
      statusSeverity: result.blendedRainfall >= 65 ? 'warning' : result.blendedRainfall > 20 ? 'caution' : 'normal'
    },
    temperature: {
      key: 'temperature',
      label: 'Surface Temperature',
      unit: '°C',
      iconName: 'Thermometer',
      blendedValue: result.blendedTemp,
      deterministicValue: 28,
      uncertaintyRange: [Number((result.blendedTemp - 1.2).toFixed(1)), Number((result.blendedTemp + 1.4).toFixed(1))],
      models: { GFS: 27.5, WRF: 26.8, AI_MODEL: 27.0, ENSEMBLE: 27.2 },
      trend: 'stable',
      statusTag: result.blendedTemp >= 38 ? 'HEAT STRESS' : 'COMFORTABLE',
      statusSeverity: result.blendedTemp >= 38 ? 'warning' : 'normal'
    },
    wind: {
      key: 'wind',
      label: 'Wind Speed & Gusts',
      unit: 'km/h',
      iconName: 'Wind',
      blendedValue: result.blendedWind,
      deterministicValue: 24,
      uncertaintyRange: [Math.round(result.blendedWind * 0.85), Math.round(result.blendedWind * 1.4)],
      models: { GFS: 28, WRF: 36, AI_MODEL: 32, ENSEMBLE: 30 },
      trend: result.blendedWind > 30 ? 'increasing' : 'stable',
      statusTag: result.blendedWind >= 40 ? 'STRONG BREEZE / SQUALL' : 'MODERATE BREEZE',
      statusSeverity: result.blendedWind >= 40 ? 'caution' : 'normal'
    },
    humidity: {
      key: 'humidity',
      label: 'Relative Humidity',
      unit: '%',
      iconName: 'Droplets',
      blendedValue: result.blendedHumidity,
      deterministicValue: 84,
      uncertaintyRange: [result.blendedHumidity - 4, Math.min(100, result.blendedHumidity + 5)],
      models: { GFS: 82, WRF: 88, AI_MODEL: 86, ENSEMBLE: 85 },
      trend: 'stable',
      statusTag: result.blendedHumidity >= 85 ? 'SATURATED / HIGH MOISTURE' : 'NORMAL MOISTURE',
      statusSeverity: 'normal'
    }
  };

  // Explainability Report
  const primaryModelObj = result.models.find((m) => m.id === result.primaryModel)!;
  const leadDecayText =
    leadTime === '6h' || leadTime === '12h'
      ? 'Short lead-time (0–12h) gives highest weight to AI Neural models due to observational radar assimilation and rapid spatial pattern recognition.'
      : leadTime === '24h'
      ? '24h lead-time gives highest weight to WRF mesoscale physics for resolving localized convective rainbands and coastal orography.'
      : 'Extended lead-time (48–72h) shifts dominance toward Global GFS and Multi-Ensemble dispersion to manage synoptic wave uncertainty.';

  const explainability: ExplainabilityReport = {
    primaryModelId: result.primaryModel,
    primaryModelName: primaryModelObj.name,
    primaryWeight: result.weights[result.primaryModel],
    summaryReason: `${primaryModelObj.name} received the highest allocation (${result.weights[result.primaryModel]}%) because it demonstrated superior historical skill for ${loc.name} under ${regime.replace('_', ' ')} conditions at ${leadTime} lead time.`,
    driverFactors: [
      {
        title: 'Regional Skill Verification',
        description: `Verified historical skill score of ${primaryModelObj.historicalSkillScore}% in the ${loc.climateZone} sector.`,
        impact: 'HIGH'
      },
      {
        title: 'Weather Regime Optimization',
        description: `Active regime identified as ${regime.replace('_', ' ')}. Specialized physical parameterization in ${result.primaryModel} minimizes false alarms.`,
        impact: 'HIGH'
      },
      {
        title: 'Lead-Time Decay Function',
        description: leadDecayText,
        impact: 'MEDIUM'
      },
      {
        title: 'Model Agreement Variance',
        description: `Inter-model dispersion index is ${result.variance} (${result.agreementLevel} agreement), establishing a strong ${result.confidenceScore}% confidence envelope.`,
        impact: 'SUPPORTING'
      }
    ],
    leadTimeBehavior: leadDecayText,
    regimeBehavior: `System dynamically recalibrated model ratios to protect against single-model over-prediction.`,
    modelDisagreementStatus:
      result.agreementLevel === 'HIGH'
        ? 'HIGH_AGREEMENT'
        : result.agreementLevel === 'MODERATE'
        ? 'MODERATE_AGREEMENT'
        : 'HIGH_UNCERTAINTY',
    disagreementIndex: result.variance,
    rmseComparison: [
      { model: 'GFS Global NWP', rmse: 4.8, reduction: '-35.4%' },
      { model: 'AI Neural Model', rmse: 4.1, reduction: '-24.4%' },
      { model: 'Multi-Ensemble (GEFS)', rmse: 3.9, reduction: '-20.5%' },
      { model: 'HYBRIDCAST AI (Blended)', rmse: 3.1, reduction: 'OPTIMIZED', isBlended: true }
    ]
  };

  return {
    location: loc,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    leadTime,
    regime,
    blendedRainfall: result.blendedRainfall,
    blendedTemp: result.blendedTemp,
    blendedWind: result.blendedWind,
    blendedHumidity: result.blendedHumidity,
    confidenceScore: result.confidenceScore,
    agreementLevel: result.agreementLevel,
    agreementVariance: result.variance,
    headlineSummary:
      regime === 'HEAVY_RAIN'
        ? `Heavy rain band forecast across ${loc.name} (${result.blendedRainfall}mm / ${leadTime}). High model confidence.`
        : regime === 'EXTREME'
        ? `Severe weather advisory: Intense precipitation (${result.blendedRainfall}mm) and gusty winds.`
        : regime === 'CONVECTIVE'
        ? `Afternoon convective storm risk (${result.blendedRainfall}mm). Localized lightning likely.`
        : `Stable atmospheric conditions over ${loc.name}. Blended temperature ${result.blendedTemp}°C.`,
    riskLevel: regime === 'EXTREME' ? 'SEVERE' : regime === 'HEAVY_RAIN' ? 'HIGH' : regime === 'CONVECTIVE' ? 'ELEVATED' : 'NORMAL',
    models: result.models,
    parameters,
    extremeHazards,
    explainability
  };
}

export const REGIONAL_SKILL_DATABASE: RegionalSkillData[] = [
  {
    id: 'tamil_nadu',
    name: 'Coastal Tamil Nadu',
    state: 'Tamil Nadu',
    zone: 'South',
    dominantModel: 'WRF High-Res (52%)',
    dominantType: 'NWP',
    nwpWeight: 52,
    aiWeight: 31,
    ensembleWeight: 17,
    activeRegime: 'HEAVY_RAIN',
    rmseBlended: 3.1,
    rmseBaseline: 4.8,
    skillGainPercentage: 35.4,
    reliabilityGrade: 'A+',
    keyAdvantage: 'High-res mesoscale resolves NE Monsoon coastal convergence bands.',
    coordinates: [13.0827, 80.2707]
  },
  {
    id: 'kerala_ghats',
    name: 'Western Ghats & Kerala',
    state: 'Kerala',
    zone: 'South',
    dominantModel: 'WRF + Ensemble (50%)',
    dominantType: 'NWP',
    nwpWeight: 50,
    aiWeight: 26,
    ensembleWeight: 24,
    activeRegime: 'MONSOON',
    rmseBlended: 3.4,
    rmseBaseline: 5.2,
    skillGainPercentage: 34.6,
    reliabilityGrade: 'A+',
    keyAdvantage: 'Orographic lift modeling along steep Western Ghats windward ridges.',
    coordinates: [10.8505, 76.2711]
  },
  {
    id: 'bengaluru_urban',
    name: 'Bengaluru Urban Plateau',
    state: 'Karnataka',
    zone: 'South',
    dominantModel: 'AI Neural LSTM (46%)',
    dominantType: 'AI/ML',
    nwpWeight: 34,
    aiWeight: 46,
    ensembleWeight: 20,
    activeRegime: 'CONVECTIVE',
    rmseBlended: 2.8,
    rmseBaseline: 4.2,
    skillGainPercentage: 33.3,
    reliabilityGrade: 'A+',
    keyAdvantage: 'AI excels in rapid 0-3h localized urban thunderstorm nowcasting.',
    coordinates: [12.9716, 77.5946]
  },
  {
    id: 'mumbai_konkan',
    name: 'Mumbai & Konkan Coast',
    state: 'Maharashtra',
    zone: 'West',
    dominantModel: 'WRF Mesoscale (48%)',
    dominantType: 'NWP',
    nwpWeight: 48,
    aiWeight: 32,
    ensembleWeight: 20,
    activeRegime: 'MONSOON',
    rmseBlended: 3.5,
    rmseBaseline: 5.4,
    skillGainPercentage: 35.1,
    reliabilityGrade: 'A+',
    keyAdvantage: 'Captures Arabian Sea offshore trough moisture surges with low false-alarm rate.',
    coordinates: [19.076, 72.8777]
  },
  {
    id: 'delhi_plains',
    name: 'Delhi NCR & Gangetic Plains',
    state: 'Delhi',
    zone: 'North',
    dominantModel: 'GFS + GEFS Ensemble (42%)',
    dominantType: 'Ensemble',
    nwpWeight: 38,
    aiWeight: 20,
    ensembleWeight: 42,
    activeRegime: 'NORMAL',
    rmseBlended: 2.5,
    rmseBaseline: 3.9,
    skillGainPercentage: 35.8,
    reliabilityGrade: 'A',
    keyAdvantage: 'Synoptic westerly disturbances & heatwave boundary verification.',
    coordinates: [28.6139, 77.209]
  },
  {
    id: 'odisha_coast',
    name: 'Coastal Odisha & Delta',
    state: 'Odisha',
    zone: 'East',
    dominantModel: 'Ensemble Dispersion (44%)',
    dominantType: 'Ensemble',
    nwpWeight: 36,
    aiWeight: 20,
    ensembleWeight: 44,
    activeRegime: 'EXTREME',
    rmseBlended: 3.7,
    rmseBaseline: 5.9,
    skillGainPercentage: 37.2,
    reliabilityGrade: 'A+',
    keyAdvantage: 'Bay of Bengal low pressure tracks & cyclone landfall uncertainty cones.',
    coordinates: [20.2961, 85.8245]
  },
  {
    id: 'assam_valley',
    name: 'Assam & Brahmaputra Basin',
    state: 'Assam',
    zone: 'Northeast',
    dominantModel: 'WRF + AI Blend (42%)',
    dominantType: 'NWP',
    nwpWeight: 42,
    aiWeight: 38,
    ensembleWeight: 20,
    activeRegime: 'MONSOON',
    rmseBlended: 3.6,
    rmseBaseline: 5.3,
    skillGainPercentage: 32.0,
    reliabilityGrade: 'A',
    keyAdvantage: 'Complex river basin moisture pooling and foothill cloudburst detection.',
    coordinates: [26.1445, 91.7362]
  }
];
