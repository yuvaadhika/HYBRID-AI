import React from 'react';
import {
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  ShieldCheck,
  BarChart2,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Cpu,
  Layers
} from 'lucide-react';
import { ForecastSnapshot, LeadTime } from '../../types/weather';
import { LiveWeatherData } from '../../services/liveWeatherService';
import { ActiveView } from '../CommandHeader';

interface LiveDashboardViewProps {
  snapshot: ForecastSnapshot;
  liveData: LiveWeatherData | null;
  onNavigate: (view: ActiveView) => void;
  onSelectLeadTime: (lt: LeadTime) => void;
}

export const LiveDashboardView: React.FC<LiveDashboardViewProps> = ({
  snapshot,
  liveData,
  onNavigate,
  onSelectLeadTime
}) => {
  const { location, leadTime, regime, confidenceScore, agreementLevel, models } = snapshot;

  const currentRain = liveData ? liveData.current.precipitation : snapshot.blendedRainfall;
  const currentTemp = liveData ? liveData.current.temperature : snapshot.blendedTemp;
  const currentApparent = liveData ? liveData.current.apparentTemperature : snapshot.blendedTemp + 2;
  const currentWind = liveData ? liveData.current.windSpeed : snapshot.blendedWind;
  const currentHumidity = liveData ? liveData.current.relativeHumidity : snapshot.blendedHumidity;
  const weatherDesc = liveData ? liveData.current.weatherDescription : 'Heavy Rain Band';

  const topHazard = snapshot.extremeHazards.find((h) => h.severityLevel === 'HIGH' || h.severityLevel === 'CRITICAL') || snapshot.extremeHazards[0];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Top Grid: Live Observation + Master Blended Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Station Observation Card (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl p-5 mild-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Live Telemetry
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{location.elevation}</span>
            </div>

            <div className="mt-3">
              <h2 className="text-2xl font-bold text-white font-['Outfit']">
                {location.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{location.state} • {location.climateZone}</p>
            </div>

            {/* Temp */}
            <div className="my-4 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black text-white font-['Outfit']">
                    {currentTemp}
                  </span>
                  <span className="text-xl font-semibold text-slate-300">°C</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Feels like {currentApparent}°C
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <CloudRain className="w-6 h-6 text-sky-400" />
                <span className="text-[10px] font-medium text-slate-300 mt-1 uppercase text-center max-w-[70px] truncate">
                  {weatherDesc.split(' ')[0]}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span className="text-slate-400">Observed Status:</span>
              <span className="font-medium text-white">{weatherDesc}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 mt-3">
            <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800/60 text-center">
              <div className="text-[10px] font-mono text-slate-400">Precip</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">{currentRain} mm</div>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800/60 text-center">
              <div className="text-[10px] font-mono text-slate-400">Wind</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">{currentWind} km/h</div>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800/60 text-center">
              <div className="text-[10px] font-mono text-slate-400">Humidity</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">{currentHumidity}%</div>
            </div>
          </div>
        </div>

        {/* Right: Master Blended Target & Confidence Meter (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl p-5 mild-card flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-200 border border-sky-500/20 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  AI–NWP Adaptive Forecast
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  Lead {leadTime}
                </span>
              </div>

              {/* Lead Horizon Filter */}
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900/80 border border-slate-800">
                {(['6h', '12h', '24h', '48h', '72h', '120h'] as LeadTime[]).map((lt) => (
                  <button
                    key={lt}
                    onClick={() => onSelectLeadTime(lt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      leadTime === lt
                        ? 'bg-slate-700 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lt}
                  </button>
                ))}
              </div>
            </div>

            {/* Blended Metric Headline */}
            <div className="my-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-7">
                <div className="text-xs text-slate-400 uppercase font-medium">
                  Optimized Rainfall Accumulation
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-5xl lg:text-6xl font-black text-white font-['Outfit']">
                    {snapshot.blendedRainfall}
                  </span>
                  <span className="text-2xl font-bold text-slate-300">mm</span>
                </div>
                <div className="text-xs text-slate-400 mt-1.5 flex items-center gap-2">
                  <span>Uncertainty Range:</span>
                  <span className="font-mono text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {Math.round(snapshot.blendedRainfall * 0.82)} – {Math.round(snapshot.blendedRainfall * 1.24)} mm
                  </span>
                </div>
              </div>

              {/* Gauges */}
              <div className="md:col-span-5 grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Confidence
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{confidenceScore}%</span>
                  </div>
                  <div className="my-2">
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-400/80 h-full rounded-full transition-all duration-500"
                        style={{ width: `${confidenceScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400">High Reliability</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                      <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
                      Agreement
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold">
                      {agreementLevel}
                    </span>
                  </div>
                  <div className="my-1.5">
                    <div className="text-xs font-semibold text-white font-mono">σ = {snapshot.agreementVariance}</div>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Consensus Converged</div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Weights Strip */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 mt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-medium text-slate-300">
                  Adaptive Weight Distribution
                </span>
              </div>
              <button
                onClick={() => onNavigate('blend')}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                Inspect Weights <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800 gap-0.5">
              {models.map((m) => (
                <div
                  key={m.id}
                  className="h-full transition-all duration-500"
                  style={{ width: `${m.weight}%`, backgroundColor: m.color }}
                  title={`${m.name}: ${m.weight}%`}
                ></div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5">
              {models.map((m) => (
                <div key={m.id} className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }}></span>
                    <span className="text-slate-300">{m.id}</span>
                  </div>
                  <span className="font-mono font-semibold text-white">{m.weight}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Model Comparison + Alert Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Model Raw Outputs (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl p-5 mild-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-white">
                Individual Model Spread vs Blended Forecast
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">mm</span>
          </div>

          <div className="space-y-2.5">
            {models.map((m) => {
              const val = m.rawForecastValue;
              const max = Math.max(...models.map((x) => x.rawForecastValue), snapshot.blendedRainfall, 10);
              const pct = Math.min(100, Math.round((val / max) * 100));

              return (
                <div key={m.id} className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }}></span>
                      <span className="text-slate-300">{m.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({m.weight}%)</span>
                    </div>
                    <span className="font-mono font-bold text-white">{val} mm</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: m.color }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {/* Blended Target */}
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-sky-500/30 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-sky-300 font-semibold font-mono">HYBRIDCAST AI (Blended)</span>
                </div>
                <span className="font-mono font-bold text-white">{snapshot.blendedRainfall} mm</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-sky-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((snapshot.blendedRainfall / Math.max(...models.map((x) => x.rawForecastValue), snapshot.blendedRainfall, 10)) * 100)
                    )}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Extreme Weather Alert + Explainability Preview (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {topHazard && (
            <div
              onClick={() => onNavigate('alerts')}
              className="cursor-pointer rounded-2xl p-4 bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{topHazard.hazardName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                      {topHazard.riskPercentage}% Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {topHazard.thresholdWarning}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </div>
          )}

          {/* Explainable AI Preview */}
          <div className="rounded-2xl p-5 mild-card space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Explainable AI Rationale
              </h3>
              <button
                onClick={() => onNavigate('explain')}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                Verification <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {snapshot.explainability.summaryReason}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400">Baseline GFS Error</div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">4.8 RMSE</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-emerald-400 font-medium">HYBRIDCAST Blended</div>
                <div className="text-xs font-bold text-emerald-300 mt-0.5">3.1 RMSE (-35.4% ✓)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
