import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { ForecastSnapshot, LeadTime, WeatherRegime, ForecastModelId } from '../../types/weather';
import { calculateAdaptiveWeights } from '../../services/blendingEngine';

interface BlendingMatrixViewProps {
  snapshot: ForecastSnapshot;
  onLeadTimeChange: (lt: LeadTime) => void;
  onRegimeChange: (regime: WeatherRegime) => void;
}

export const BlendingMatrixView: React.FC<BlendingMatrixViewProps> = ({
  snapshot,
  onLeadTimeChange,
  onRegimeChange
}) => {
  const { location, leadTime, regime } = snapshot;

  const [sandboxLeadTime, setSandboxLeadTime] = useState<LeadTime>(leadTime);
  const [sandboxRegime, setSandboxRegime] = useState<WeatherRegime>(regime);
  const [customRawRain, setCustomRawRain] = useState<Record<ForecastModelId, number>>({
    WRF: snapshot.models.find((m) => m.id === 'WRF')?.rawForecastValue || 84,
    AI_MODEL: snapshot.models.find((m) => m.id === 'AI_MODEL')?.rawForecastValue || 76,
    GFS: snapshot.models.find((m) => m.id === 'GFS')?.rawForecastValue || 68,
    ENSEMBLE: snapshot.models.find((m) => m.id === 'ENSEMBLE')?.rawForecastValue || 72
  });

  const liveCalc = calculateAdaptiveWeights(location.id, sandboxLeadTime, sandboxRegime, {
    WRF: { rain: customRawRain.WRF, temp: 27, wind: 30 },
    AI_MODEL: { rain: customRawRain.AI_MODEL, temp: 27, wind: 30 },
    GFS: { rain: customRawRain.GFS, temp: 27, wind: 30 },
    ENSEMBLE: { rain: customRawRain.ENSEMBLE, temp: 27, wind: 30 }
  });

  const handleSliderChange = (modelId: ForecastModelId, val: number) => {
    setCustomRawRain((prev) => ({ ...prev, [modelId]: val }));
  };

  const handleResetSandbox = () => {
    setSandboxLeadTime(leadTime);
    setSandboxRegime(regime);
    setCustomRawRain({
      WRF: snapshot.models.find((m) => m.id === 'WRF')?.rawForecastValue || 84,
      AI_MODEL: snapshot.models.find((m) => m.id === 'AI_MODEL')?.rawForecastValue || 76,
      GFS: snapshot.models.find((m) => m.id === 'GFS')?.rawForecastValue || 68,
      ENSEMBLE: snapshot.models.find((m) => m.id === 'ENSEMBLE')?.rawForecastValue || 72
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-slate-400 uppercase">
            Blending Engine
          </div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            Dynamic Model Weighting & Sandbox
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Adaptive weight distribution based on Lead Time, Regime, and Regional Historical Skill
          </p>
        </div>

        <button
          onClick={handleResetSandbox}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Sandbox
        </button>
      </div>

      {/* Hero Blended Outcome Card */}
      <div className="rounded-2xl p-5 mild-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                Blended Target
              </span>
              <span className="text-xs font-mono font-medium text-emerald-400">
                Confidence: {liveCalc.confidenceScore}%
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-5xl font-black text-white font-['Outfit']">
                {liveCalc.blendedRainfall}
              </span>
              <span className="text-xl font-medium text-slate-400">mm / {sandboxLeadTime}</span>
            </div>

            <p className="text-xs text-slate-400">
              Station: <span className="text-slate-200 font-medium">{location.name}</span> • Regime: <span className="text-slate-200 font-medium">{sandboxRegime}</span>
            </p>
          </div>

          <div className="lg:col-span-6 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
              Blending Formula
            </div>
            <div className="font-mono text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 break-all leading-relaxed">
              F<sub className="text-[9px]">AI</sub> = ({liveCalc.weights.WRF}% × WRF) + ({liveCalc.weights.AI_MODEL}% × AI) + ({liveCalc.weights.GFS}% × GFS) + ({liveCalc.weights.ENSEMBLE}% × ENS)
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-0.5">
              <span>Agreement: <span className="text-slate-200 font-medium">{liveCalc.agreementLevel}</span></span>
              <span>Variance: <span className="text-slate-200 font-medium">σ = {liveCalc.variance}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: What-If Controls (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl p-5 mild-card space-y-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Sliders className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">
              What-If Simulation Sandbox
            </h3>
          </div>

          {/* Lead Time */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300">Lead Time Horizon</span>
              <span className="font-mono font-semibold text-sky-400">{sandboxLeadTime}</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {(['6h', '12h', '24h', '48h', '72h'] as LeadTime[]).map((lt) => (
                <button
                  key={lt}
                  onClick={() => {
                    setSandboxLeadTime(lt);
                    onLeadTimeChange(lt);
                  }}
                  className={`py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    sandboxLeadTime === lt
                      ? 'bg-slate-700 text-white font-semibold'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {lt}
                </button>
              ))}
            </div>
          </div>

          {/* Regime */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300">Weather Regime</span>
              <span className="font-mono font-semibold text-purple-400">{sandboxRegime}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['NORMAL', 'CONVECTIVE', 'MONSOON', 'HEAVY_RAIN', 'EXTREME'] as WeatherRegime[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSandboxRegime(r);
                    onRegimeChange(r);
                  }}
                  className={`py-1.5 px-1 rounded-lg text-xs font-medium truncate transition-all ${
                    sandboxRegime === r
                      ? 'bg-slate-700 text-white font-semibold'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Raw Sliders */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <div className="text-xs font-medium text-slate-300">
              Simulate Raw Model Inputs (mm)
            </div>

            {(['WRF', 'AI_MODEL', 'GFS', 'ENSEMBLE'] as ForecastModelId[]).map((mId) => {
              const m = liveCalc.models.find((x) => x.id === mId)!;
              return (
                <div key={mId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{m.name}</span>
                    <span className="font-mono font-semibold text-white">{customRawRain[mId]} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    step="2"
                    value={customRawRain[mId]}
                    onChange={(e) => handleSliderChange(mId, Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Model Breakdown (6 Cols) */}
        <div className="lg:col-span-6 space-y-2.5">
          <div className="text-xs text-slate-400 uppercase flex items-center justify-between px-1">
            <span>Model Weight Allocation</span>
            <span className="font-mono text-slate-400">Total = 100%</span>
          </div>

          {liveCalc.models.map((m) => {
            const isHighest = m.id === liveCalc.primaryModel;
            return (
              <div
                key={m.id}
                className={`rounded-2xl p-4 transition-all ${
                  isHighest
                    ? 'mild-card border-slate-600 bg-slate-800/60'
                    : 'mild-card'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }}></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-white">{m.name}</h4>
                        {isHighest && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-sky-300 font-medium">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{m.subCategory}</div>
                    </div>
                  </div>

                  <span className="text-lg font-bold font-mono text-white">{m.weight}%</span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1.5 my-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${m.weight}%`, backgroundColor: m.color }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>{m.description}</span>
                  <span className="text-emerald-400 font-mono font-medium shrink-0 ml-2">
                    Skill: {m.historicalSkillScore}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
