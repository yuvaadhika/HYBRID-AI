import React from 'react';
import {
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Clock,
  Layers
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
  const { leadTime, location, parameters } = snapshot;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-slate-400 uppercase">
            Parameters
          </div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            Multi-Parameter Forecast Horizon
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Station: {location.name}, {location.state}
          </p>
        </div>

        {/* Lead Selector */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900/90 border border-slate-800">
          {(['6h', '12h', '24h', '48h', '72h', '120h'] as LeadTime[]).map((lt) => (
            <button
              key={lt}
              onClick={() => onSelectLeadTime(lt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
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

      {/* 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Rainfall */}
        <div className="rounded-2xl p-5 mild-card space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-slate-800 text-sky-400">
              <CloudRain className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {parameters.rainfall.statusTag}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400">Rainfall Accumulation</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-white font-['Outfit']">
                {parameters.rainfall.blendedValue}
              </span>
              <span className="text-sm font-medium text-slate-400">mm</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Range: {parameters.rainfall.uncertaintyRange[0]} – {parameters.rainfall.uncertaintyRange[1]} mm
            </div>
          </div>
        </div>

        {/* Temp */}
        <div className="rounded-2xl p-5 mild-card space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
              <Thermometer className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {parameters.temperature.statusTag}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400">Surface Temperature</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-white font-['Outfit']">
                {parameters.temperature.blendedValue}
              </span>
              <span className="text-sm font-medium text-slate-400">°C</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Feels like ~{Math.round(parameters.temperature.blendedValue + 3)}°C
            </div>
          </div>
        </div>

        {/* Wind */}
        <div className="rounded-2xl p-5 mild-card space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-slate-800 text-purple-400">
              <Wind className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {parameters.wind.statusTag}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400">Wind Velocity</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-white font-['Outfit']">
                {parameters.wind.blendedValue}
              </span>
              <span className="text-sm font-medium text-slate-400">km/h</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Gusts: {Math.round(parameters.wind.blendedValue * 1.4)} km/h
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div className="rounded-2xl p-5 mild-card space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {parameters.humidity.statusTag?.split('/')[0]}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400">Relative Humidity</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-white font-['Outfit']">
                {parameters.humidity.blendedValue}
              </span>
              <span className="text-sm font-medium text-slate-400">%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Dew Point ~24°C
            </div>
          </div>
        </div>
      </div>

      {/* 24-Hour Live Timeline */}
      {liveData && liveData.hourly.times.length > 0 && (
        <div className="rounded-2xl p-5 mild-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-white">
                Live 24-Hour Hourly Trend
              </h3>
            </div>
            <span className="text-xs text-slate-400">Hourly Step</span>
          </div>

          <div className="overflow-x-auto pb-1">
            <div className="grid grid-flow-col auto-cols-[90px] gap-2 min-w-full">
              {liveData.hourly.times.slice(0, 12).map((timeStr, idx) => {
                const date = new Date(timeStr);
                const hour = date.getHours().toString().padStart(2, '0') + ':00';
                const rain = liveData.hourly.precipitations[idx] ?? 0;
                const temp = liveData.hourly.temperatures[idx] ?? 28;

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1.5 hover:border-slate-700 transition-all"
                  >
                    <span className="text-[11px] font-mono text-slate-400">{hour}</span>
                    <CloudRain className={`w-4 h-4 ${rain > 0 ? 'text-sky-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-bold font-mono text-white">{temp}°C</div>
                      <div className="text-[10px] font-mono text-slate-400">{rain}mm</div>
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
