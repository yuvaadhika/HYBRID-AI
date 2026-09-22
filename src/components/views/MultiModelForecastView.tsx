import React, { useState } from 'react';
import {
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Layers,
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  Info
} from 'lucide-react';
import { ForecastSnapshot, LeadTime } from '../../types/weather';
import { LiveWeatherData } from '../../services/liveWeatherService';

interface MultiModelForecastViewProps {
  snapshot: ForecastSnapshot;
  liveData: LiveWeatherData | null;
  onSelectLeadTime: (lt: LeadTime) => void;
}

export const MultiModelForecastView: React.FC<MultiModelForecastViewProps> = ({
  snapshot,
  liveData,
  onSelectLeadTime
}) => {
  const { leadTime, location, parameters, models } = snapshot;
  const [selectedTab, setSelectedTab] = useState<'hourly' | 'daily'>('hourly');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
            Operational Model Horizon
          </div>
          <h2 className="text-3xl font-black text-white font-['Outfit'] tracking-tight">
            Multi-Parameter Meteorological Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous adaptive blending across {location.name} ({location.state})
          </p>
        </div>

        {/* Lead Horizon Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-sky-500/30">
          {(['6h', '12h', '24h', '48h', '72h', '120h'] as LeadTime[]).map((lt) => (
            <button
              key={lt}
              onClick={() => onSelectLeadTime(lt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                leadTime === lt
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {lt}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Core Parameter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Rainfall */}
        <div className="rounded-3xl p-5 bg-[#0c152a]/95 border border-sky-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400">
              <CloudRain className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold">
              {parameters.rainfall.statusTag}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400">Rainfall Accumulation</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white font-['Outfit']">
                {parameters.rainfall.blendedValue}
              </span>
              <span className="text-sm font-bold text-sky-400">mm</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Uncertainty: {parameters.rainfall.uncertaintyRange[0]} – {parameters.rainfall.uncertaintyRange[1]} mm
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className="rounded-3xl p-5 bg-[#0c152a]/95 border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
              <Thermometer className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
              {parameters.temperature.statusTag}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400">Surface Temperature</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white font-['Outfit']">
                {parameters.temperature.blendedValue}
              </span>
              <span className="text-sm font-bold text-amber-400">°C</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Feels like ~{Math.round(parameters.temperature.blendedValue + 3.5)}°C
            </div>
          </div>
        </div>

        {/* Wind */}
        <div className="rounded-3xl p-5 bg-[#0c152a]/95 border border-purple-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400">
              <Wind className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
              {parameters.wind.statusTag}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400">Wind Velocity & Gusts</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white font-['Outfit']">
                {parameters.wind.blendedValue}
              </span>
              <span className="text-sm font-bold text-purple-400">km/h</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Peak gusts: {Math.round(parameters.wind.blendedValue * 1.45)} km/h
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div className="rounded-3xl p-5 bg-[#0c152a]/95 border border-cyan-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
              {parameters.humidity.statusTag?.split('/')[0]}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400">Relative Humidity</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white font-['Outfit']">
                {parameters.humidity.blendedValue}
              </span>
              <span className="text-sm font-bold text-cyan-400">%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Dew Point ~24.4°C
            </div>
          </div>
        </div>
      </div>

      {/* Hourly / 7-Day Live Forecast Timeline */}
      {liveData && liveData.hourly.times.length > 0 && (
        <div className="rounded-3xl p-6 bg-[#0c1427]/95 border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Live 24-Hour Timeline Stream (Open-Meteo Synced)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              24-Hour Horizon Step
            </span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="grid grid-flow-col auto-cols-[100px] gap-2 min-w-full">
              {liveData.hourly.times.slice(0, 12).map((timeStr, idx) => {
                const date = new Date(timeStr);
                const hour = date.getHours().toString().padStart(2, '0') + ':00';
                const rain = liveData.hourly.precipitations[idx] ?? 0;
                const prob = liveData.hourly.precipitationProbabilities[idx] ?? 0;
                const temp = liveData.hourly.temperatures[idx] ?? 28;

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-white/5 text-center space-y-2 hover:border-sky-500/40 transition-all"
                  >
                    <span className="text-xs font-mono font-bold text-slate-400">{hour}</span>
                    <CloudRain className={`w-5 h-5 ${rain > 0 ? 'text-sky-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-sm font-black font-mono text-white">{temp}°C</div>
                      <div className="text-[10px] font-mono text-sky-300 font-bold">{rain}mm ({prob}%)</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
