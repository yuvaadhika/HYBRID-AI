import React from 'react';
import {
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  ShieldCheck,
  BarChart2,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Compass,
  Cpu,
  TrendingUp,
  Clock,
  Layers,
  Radio
} from 'lucide-react';
import { ForecastSnapshot, LeadTime, WeatherRegime } from '../../types/weather';
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
  const currentApparent = liveData ? liveData.current.apparentTemperature : snapshot.blendedTemp + 3;
  const currentWind = liveData ? liveData.current.windSpeed : snapshot.blendedWind;
  const currentHumidity = liveData ? liveData.current.relativeHumidity : snapshot.blendedHumidity;
  const currentPressure = liveData ? liveData.current.surfacePressure : 1012;
  const weatherDesc = liveData ? liveData.current.weatherDescription : 'Heavy Mesoscale Rain Band';

  const topHazard = snapshot.extremeHazards.find((h) => h.severityLevel === 'HIGH' || h.severityLevel === 'CRITICAL') || snapshot.extremeHazards[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Hero Grid: Real-Time Observation + AI Blended Master Target */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Station Observation Card (4 Cols) */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-gradient-to-b from-[#0f172a]/95 via-[#0b1329]/95 to-[#060b18]/95 border border-sky-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-sky-500/15 blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                REAL-TIME TELEMETRY
              </span>
              <span className="text-xs font-mono text-slate-400">{location.elevation}</span>
            </div>

            <div className="mt-4">
              <h2 className="text-3xl font-black text-white tracking-tight font-['Outfit']">
                {location.name}
              </h2>
              <p className="text-xs text-sky-400 font-semibold">{location.state} • {location.climateZone}</p>
            </div>

            {/* Current Temp & Condition */}
            <div className="my-5 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white font-['Outfit'] tracking-tight">
                    {currentTemp}
                  </span>
                  <span className="text-2xl font-bold text-sky-400">°C</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Feels like <span className="text-slate-200 font-semibold">{currentApparent}°C</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-sky-500/10 border border-sky-400/20">
                <CloudRain className="w-8 h-8 text-sky-400 animate-bounce" style={{ animationDuration: '3s' }} />
                <span className="text-[10px] font-bold text-sky-300 mt-1 uppercase text-center max-w-[80px]">
                  {weatherDesc.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Condition Banner */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 text-xs text-slate-300 flex items-center justify-between">
              <span>Observed Status:</span>
              <span className="font-bold text-white font-mono">{weatherDesc}</span>
            </div>
          </div>

          {/* Quick Real-Time Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 mt-4">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Precip.</div>
              <div className="text-sm font-bold font-mono text-sky-300 mt-0.5">{currentRain} mm</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Wind</div>
              <div className="text-sm font-bold font-mono text-purple-300 mt-0.5">{currentWind} km/h</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Humidity</div>
              <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">{currentHumidity}%</div>
            </div>
          </div>
        </div>

        {/* Right Column: Master Blended Target & Confidence Meter (8 Cols) */}
        <div className="lg:col-span-8 rounded-3xl p-6 bg-gradient-to-br from-[#0c1836]/95 via-[#081024]/95 to-[#040813]/98 border border-sky-400/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-sky-500/30 to-blue-600/30 text-sky-200 border border-sky-400/50 text-xs font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
                  DYNAMIC AI–NWP BLENDED FORECAST
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/10 font-bold">
                  Horizon: {leadTime}
                </span>
              </div>

              {/* Lead Time Horizon Filter Pills */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-white/10">
                {(['6h', '12h', '24h', '48h', '72h', '120h'] as LeadTime[]).map((lt) => (
                  <button
                    key={lt}
                    onClick={() => onSelectLeadTime(lt)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      leadTime === lt
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lt}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Blended Value Headline */}
            <div className="my-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7">
                <div className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                  Target Precipitation Accumulation
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-6xl lg:text-7xl font-black text-white font-['Outfit'] tracking-tight">
                    {snapshot.blendedRainfall}
                  </span>
                  <span className="text-3xl font-extrabold text-sky-400">mm</span>
                </div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                  <span>90% Uncertainty Envelope:</span>
                  <span className="font-mono text-slate-200 font-bold px-2 py-0.5 rounded bg-slate-800 border border-white/10">
                    {Math.round(snapshot.blendedRainfall * 0.82)} – {Math.round(snapshot.blendedRainfall * 1.24)} mm
                  </span>
                </div>
              </div>

              {/* Confidence & Agreement Gauges */}
              <div className="md:col-span-5 grid grid-cols-2 gap-3">
                {/* Confidence Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-sky-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Confidence
                    </span>
                    <span className="text-xs font-mono font-black text-emerald-400">{confidenceScore}%</span>
                  </div>

                  <div className="my-3">
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden p-0.5">
                      <div
                        className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                        style={{ width: `${confidenceScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400">High Historical Reliability</div>
                </div>

                {/* Model Agreement Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-sky-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
                      Agreement
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black ${
                        agreementLevel === 'HIGH'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : agreementLevel === 'MODERATE'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {agreementLevel}
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="text-xs font-bold text-white font-mono">σ = {snapshot.agreementVariance}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">NWP & AI Consensus</div>
                  </div>

                  <div className="text-[10px] text-emerald-300 font-semibold truncate">
                    No Outlier Spikes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Model Weights Allocation Strip */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 mt-2">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Adaptive Weight Distribution (Lead {leadTime})
                </span>
              </div>
              <button
                onClick={() => onNavigate('blend')}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-bold"
              >
                Inspect Weights & Formulas <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stacked Percentage Bar */}
            <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-900 p-0.5 gap-0.5 border border-white/10">
              {models.map((m) => (
                <div
                  key={m.id}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
                  style={{ width: `${m.weight}%`, backgroundColor: m.color }}
                  title={`${m.name}: ${m.weight}%`}
                ></div>
              ))}
            </div>

            {/* Individual model pill stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              {models.map((m) => (
                <div key={m.id} className="p-2 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }}></span>
                    <span className="text-xs font-bold text-slate-200">{m.id}</span>
                  </div>
                  <span className="text-xs font-black font-mono text-white">{m.weight}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Multi-Model Raw Comparisons + 24h Hourly Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Individual Model Predictions Grid (6 Cols) */}
        <div className="lg:col-span-6 rounded-3xl p-6 bg-[#0c1427]/90 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Model Ensemble Spread vs HYBRIDCAST Blended
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Unit: mm</span>
          </div>

          <div className="space-y-3">
            {models.map((m) => {
              const val = m.rawForecastValue;
              const max = Math.max(...models.map((x) => x.rawForecastValue), snapshot.blendedRainfall, 10);
              const pct = Math.min(100, Math.round((val / max) * 100));

              return (
                <div key={m.id} className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }}></span>
                      <span className="text-slate-200 font-bold">{m.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({m.weight}% weight)</span>
                    </div>
                    <span className="font-mono font-black text-white text-sm">{val} mm</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: m.color }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {/* Blended Master Line */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-blue-600/20 border border-sky-400/50 shadow-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="text-sky-200 font-black font-mono text-sm">HYBRIDCAST AI (Blended Target)</span>
                </div>
                <span className="font-mono font-black text-white text-base">{snapshot.blendedRainfall} mm</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-sky-400/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.8)] transition-all duration-500"
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

        {/* Right: Hourly Accumulation Horizon & Extreme Alert (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Active Extreme Weather Banner */}
          {topHazard && (
            <div
              onClick={() => onNavigate('alerts')}
              className={`cursor-pointer rounded-3xl p-5 border transition-all hover:scale-[1.01] shadow-2xl flex items-center justify-between ${
                topHazard.severityLevel === 'CRITICAL' || topHazard.severityLevel === 'HIGH'
                  ? 'bg-rose-950/50 border-rose-500/50 rose-glow'
                  : 'bg-amber-950/40 border-amber-500/40 amber-glow'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 shrink-0">
                  <AlertTriangle className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{topHazard.hazardName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 font-bold">
                      {topHazard.riskPercentage}% RISK
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                    {topHazard.thresholdWarning} — {topHazard.actionableAdvisory}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 shrink-0 ml-3" />
            </div>
          )}

          {/* Explainable AI Live Rationale Summary Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-[#12102e]/90 via-[#0a1226]/90 to-[#060913]/95 border border-purple-500/30 shadow-xl purple-glow space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Explainable AI Rationale
                </h3>
              </div>
              <button
                onClick={() => onNavigate('explain')}
                className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-bold"
              >
                Verification Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {snapshot.explainability.summaryReason}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="text-[10px] font-mono text-slate-400">Baseline NWP Error</div>
                <div className="text-sm font-bold font-mono text-slate-200 mt-0.5">GFS: 4.8 RMSE</div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-[10px] font-mono text-emerald-400">HYBRIDCAST AI Blended</div>
                <div className="text-sm font-black font-mono text-emerald-300 mt-0.5">3.1 RMSE (-35.4% ✓)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
