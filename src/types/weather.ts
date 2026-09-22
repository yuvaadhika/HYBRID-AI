export type ForecastModelId = 'GFS' | 'WRF' | 'AI_MODEL' | 'ENSEMBLE';

export type WeatherRegime = 'NORMAL' | 'CONVECTIVE' | 'MONSOON' | 'HEAVY_RAIN' | 'EXTREME';

export type LeadTime = '6h' | '12h' | '24h' | '48h' | '72h' | '120h';

export interface ModelContribution {
  id: ForecastModelId;
  name: string;
  category: 'NWP' | 'AI/ML' | 'Ensemble';
  subCategory: string; // e.g. "Global Synoptic 13km", "High-Res 3km Physics", "XGBoost + Temporal LSTM", "GEFS 31-Member"
  weight: number; // percentage e.g. 45
  rawForecastValue: number; // value in parameter unit
  historicalSkillScore: number; // 0-100
  rmse: number; // e.g. 3.2
  color: string;
  badgeColor: string;
  biasCorrection: number; // e.g. -1.2mm
  description: string;
}

export interface ParameterForecast {
  key: 'rainfall' | 'temperature' | 'wind' | 'humidity' | 'pressure' | 'uvIndex';
  label: string;
  unit: string;
  iconName: string;
  blendedValue: number;
  deterministicValue: number;
  uncertaintyRange: [number, number]; // [min, max]
  models: Record<ForecastModelId, number>;
  trend: 'increasing' | 'stable' | 'decreasing';
  statusTag?: string;
  statusSeverity?: 'normal' | 'caution' | 'warning' | 'critical';
}

export interface ExtremeHazardRisk {
  id: string;
  hazardName: string;
  iconName: string;
  riskPercentage: number;
  severityLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  currentMetric: string;
  thresholdWarning: string;
  impactDescription: string;
  actionableAdvisory: string;
  color: string;
}

export interface RegionalSkillData {
  id: string;
  name: string;
  state: string;
  zone: 'South' | 'West' | 'North' | 'East' | 'Central' | 'Northeast';
  dominantModel: string;
  dominantType: 'NWP' | 'AI/ML' | 'Ensemble';
  nwpWeight: number;
  aiWeight: number;
  ensembleWeight: number;
  activeRegime: WeatherRegime;
  rmseBlended: number;
  rmseBaseline: number;
  skillGainPercentage: number;
  reliabilityGrade: 'A+' | 'A' | 'B+' | 'B';
  keyAdvantage: string;
  coordinates: [number, number]; // [lat, lon]
}

export interface ExplainabilityReport {
  primaryModelId: ForecastModelId;
  primaryModelName: string;
  primaryWeight: number;
  summaryReason: string;
  driverFactors: {
    title: string;
    description: string;
    impact: 'HIGH' | 'MEDIUM' | 'SUPPORTING';
  }[];
  leadTimeBehavior: string;
  regimeBehavior: string;
  modelDisagreementStatus: 'HIGH_AGREEMENT' | 'MODERATE_AGREEMENT' | 'HIGH_UNCERTAINTY';
  disagreementIndex: number; // 0 to 10
  rmseComparison: {
    model: string;
    rmse: number;
    reduction: string;
    isBlended?: boolean;
  }[];
}

export interface LocationOption {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  defaultRegime: WeatherRegime;
  elevation: string;
  climateZone: string;
}

export interface ForecastSnapshot {
  location: LocationOption;
  timestamp: string;
  leadTime: LeadTime;
  regime: WeatherRegime;
  blendedRainfall: number;
  blendedTemp: number;
  blendedWind: number;
  blendedHumidity: number;
  confidenceScore: number; // percentage 0 - 100
  agreementLevel: 'HIGH' | 'MODERATE' | 'LOW';
  agreementVariance: number;
  headlineSummary: string;
  riskLevel: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'SEVERE';
  models: ModelContribution[];
  parameters: Record<string, ParameterForecast>;
  extremeHazards: ExtremeHazardRisk[];
  explainability: ExplainabilityReport;
}
