import React, { useState } from 'react';
import {
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  Sun,
  TrendingUp,
  Sliders,
  Sparkles,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { ForecastSnapshot, LeadTime } from '../../types/weather';

interface ForecastScreenProps {
  snapshot: ForecastSnapshot;
  onSelectLeadTime: (leadTime: LeadTime) => void;
  onNavigate: (tab: any) => void;
}

export const ForecastScreen: React.FC<ForecastScreenProps> = ({
  snapshot,
  onSelectLeadTime,
  onNavigate
}) => {
  const { leadTime, location, parameters, models, blendedRainfall } = snapshot;

  const [activeParam, setActiveParam] = useState<'rainfall' | 'temperature' | 'wind' | 'humidity'>('rainfall');

  const leadTimes: LeadTime[] = ['6h', '12h', '24h', '48h', '72h', '120h'];

  const hourlyTimeline = [
    { time: '+03h', rain: Math.round(blendedRainfall * 0.15), temp: 27, wind: 18 },
    { time: '+06h', rain: Math.round(blendedRainfall * 0.35), temp: 28, wind: 24 },
    { time: '+12h', rain: Math.round(blendedRainfall * 0.65), temp: 27, wind: 28 },
    { time: '+18h', rain: Math.round(blendedRainfall * 0.85), temp: 26, wind: 22 },
    { time: '+24h', rain: blendedRainfall, temp: 28, wind: 21 },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Screen Header */}
      <div>
        <div className="text-[11px] font-mono font-semibold tracking-wider text-sky-400 uppercase">
          Meteorological Parameters
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
          Multi-Horizon Forecast
        </h2>
        <p className="text-xs text-slate-400">
          Continuous adaptive blending across {location.name} station
        </p>
      </div>

      {/* Lead Time Selector Pills */}
      <div className="flex items-center justify-between gap-1 p-1 rounded-2xl bg-slate-900/80 border border-white/10">
        {leadTimes.map((lt) => {
          const isSelected = lt === leadTime;
          return (
            <button
              key={lt}
              onClick={() => onSelectLeadTime(lt)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {lt}
            </button>
          );
        })}
      </div>

      {/* Primary Parameter Cards Carousel / Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Rainfall Card */}
        <div
          onClick={() => setActiveParam('rainfall')}
          className={`cursor-pointer rounded-2xl p-4 transition-all glass-card-hover ${
            activeParam === 'rainfall'
              ? 'glass-card-active border-sky-400/50'
              : 'glass-card'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <CloudRain className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300">
              {parameters.rainfall.statusTag}
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[11px] text-slate-400">Rainfall Accum.</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-white font-['Outfit']">
                {parameters.rainfall.blendedValue}
              </span>
              <span className="text-xs font-bold text-sky-400">mm</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Band: {parameters.rainfall.uncertaintyRange[0]} - {parameters.rainfall.uncertaintyRange[1]} mm
            </div>
          </div>
        </div>

        {/* Temperature Card */}
        <div
          onClick={() => setActiveParam('temperature')}
          className={`cursor-pointer rounded-2xl p-4 transition-all glass-card-hover ${
            activeParam === 'temperature'
              ? 'glass-card-active border-amber-400/50'
              : 'glass-card'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Thermometer className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300">
              {parameters.temperature.statusTag}
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[11px] text-slate-400">Temperature</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-white font-['Outfit']">
                {parameters.temperature.blendedValue}
              </span>
              <span className="text-xs font-bold text-amber-400">°C</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Feels like {Math.round(parameters.temperature.blendedValue + 3.5)}°C
            </div>
          </div>
        </div>

        {/* Wind Speed Card */}
        <div
          onClick={() => setActiveParam('wind')}
          className={`cursor-pointer rounded-2xl p-4 transition-all glass-card-hover ${
            activeParam === 'wind'
              ? 'glass-card-active border-purple-400/50'
              : 'glass-card'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Wind className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300">
              {parameters.wind.statusTag}
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[11px] text-slate-400">Wind Velocity</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-white font-['Outfit']">
                {parameters.wind.blendedValue}
              </span>
              <span className="text-xs font-bold text-purple-400">km/h</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Gusts to {Math.round(parameters.wind.blendedValue * 1.45)} km/h
            </div>
          </div>
        </div>

        {/* Humidity Card */}
        <div
          onClick={() => setActiveParam('humidity')}
          className={`cursor-pointer rounded-2xl p-4 transition-all glass-card-hover ${
            activeParam === 'humidity'
              ? 'glass-card-active border-cyan-400/50'
              : 'glass-card'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Droplets className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300">
              {parameters.humidity.statusTag?.split('/')[0]}
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[11px] text-slate-400">Relative Humidity</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-white font-['Outfit']">
                {parameters.humidity.blendedValue}
              </span>
              <span className="text-xs font-bold text-cyan-400">%</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Dew Point ~24.2°C
            </div>
          </div>
        </div>
      </div>

      {/* Model Disagreement & Dispersion Breakdown */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Individual Model Predictions vs Blended AI
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Lead: {leadTime}</span>
        </div>

        {/* Model Bar Chart */}
        <div className="space-y-2.5">
          {models.map((m) => {
            const val = m.rawForecastValue;
            const max = Math.max(...models.map((x) => x.rawForecastValue), blendedRainfall, 10);
            const pct = Math.min(100, Math.round((val / max) * 100));

            return (
              <div key={m.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }}></span>
                    <span className="text-slate-300 font-medium">{m.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({m.weight}%)</span>
                  </div>
                  <span className="font-mono font-bold text-white">{val} mm</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: m.color }}
                  ></div>
                </div>
              </div>
            );
          })}

          {/* HYBRIDCAST BLENDED WINNER */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span className="text-sky-300 font-bold font-mono">HYBRIDCAST AI (Blended)</span>
              </div>
              <span className="font-mono font-extrabold text-sky-400 text-sm">{blendedRainfall} mm</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-sky-400/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((blendedRainfall / Math.max(...models.map((x) => x.rawForecastValue), blendedRainfall, 10)) * 100)
                  )}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Timeline Progression */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Accumulation Trend Horizon
          </h3>
          <span className="text-[10px] text-slate-400">Step: 6h</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {hourlyTimeline.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5 text-center"
            >
              <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
              <CloudRain className="w-4 h-4 text-sky-400 my-1.5" />
              <span className="text-xs font-bold font-mono text-white">{item.rain}m</span>
              <span className="text-[9px] text-amber-300 font-mono mt-0.5">{item.temp}°C</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
