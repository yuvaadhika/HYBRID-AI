import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Sparkles,
  Layers,
  RotateCcw,
  Zap,
  Activity,
  CheckCircle2,
  HelpCircle
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

  // Sandbox State
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
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>AI–NWP Multi-Model Blending Engine</span>
          </div>
          <h2 className="text-3xl font-black text-white font-['Outfit'] tracking-tight">
            Dynamic Ensemble Weighting & Sandbox
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time adaptive weight optimization parameterized by Lead Time (L), Regime (R) and Regional Skill (S)
          </p>
        </div>

        <button
          onClick={handleResetSandbox}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-white/10 transition-all shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Parameters
        </button>
      </div>

      {/* Hero Blended Outcome Card with Live Equation */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-[#0c1a36]/95 via-[#081228]/95 to-[#040813]/98 border border-sky-400/40 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase">
                Optimized Blended Forecast Target
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Confidence: {liveCalc.confidenceScore}%
              </span>
            </div>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-6xl font-black text-white font-['Outfit']">
                {liveCalc.blendedRainfall}
              </span>
              <span className="text-2xl font-bold text-sky-400">mm / {sandboxLeadTime}</span>
            </div>

            <p className="text-xs text-slate-300">
              Station: <strong className="text-white">{location.name}</strong> • Regime: <strong className="text-sky-300">{sandboxRegime}</strong>
            </p>
          </div>

          <div className="lg:col-span-6 p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
              Dynamic Blending Mathematical Derivation
            </div>
            <div className="font-mono text-xs text-sky-300 bg-slate-900/90 p-3 rounded-xl border border-sky-500/20 break-all leading-relaxed">
              F<sub className="text-[10px]">AI</sub> = ({liveCalc.weights.WRF}% × WRF) + ({liveCalc.weights.AI_MODEL}% × AI) + ({liveCalc.weights.GFS}% × GFS) + ({liveCalc.weights.ENSEMBLE}% × ENS)
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
              <span>Model Agreement: <strong className="text-emerald-300">{liveCalc.agreementLevel}</strong></span>
              <span>Variance: <strong className="text-sky-300">σ = {liveCalc.variance}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive What-If Simulation Sandbox Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: What-If Controls (6 Cols) */}
        <div className="lg:col-span-6 rounded-3xl p-6 bg-[#0c1427]/95 border border-purple-500/30 shadow-2xl space-y-5">
          <div className="flex items-center gap-2 text-purple-400">
            <Sliders className="w-5 h-5" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Interactive What-If Simulation
            </h3>
          </div>

          {/* Lead-Time Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-200 font-bold">Forecast Horizon (Lead-Time)</span>
              <span className="font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/20">
                {sandboxLeadTime}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {(['6h', '12h', '24h', '48h', '72h'] as LeadTime[]).map((lt) => (
                <button
                  key={lt}
                  onClick={() => {
                    setSandboxLeadTime(lt);
                    onLeadTimeChange(lt);
                  }}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    sandboxLeadTime === lt
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {lt}
                </button>
              ))}
            </div>
          </div>

          {/* Regime Switcher */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-200 font-bold">Atmospheric Weather Regime</span>
              <span className="font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/20">
                {sandboxRegime}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['NORMAL', 'CONVECTIVE', 'MONSOON', 'HEAVY_RAIN', 'EXTREME'] as WeatherRegime[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSandboxRegime(r);
                    onRegimeChange(r);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold truncate transition-all ${
                    sandboxRegime === r
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Model Raw Input Sliders */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="text-xs font-bold text-slate-200 uppercase">
              Simulate Raw Forecast Inputs (mm)
            </div>

            {(['WRF', 'AI_MODEL', 'GFS', 'ENSEMBLE'] as ForecastModelId[]).map((mId) => {
              const m = liveCalc.models.find((x) => x.id === mId)!;
              return (
                <div key={mId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{m.name}</span>
                    <span className="font-mono font-black text-white">{customRawRain[mId]} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="160"
                    step="2"
                    value={customRawRain[mId]}
                    onChange={(e) => handleSliderChange(mId, Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Dynamic Weights & Skill Matrix (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between px-1">
            <span>Dynamic Model Weight Breakdown</span>
            <span className="text-xs font-mono text-sky-400">Sum = 100%</span>
          </div>

          {liveCalc.models.map((m) => {
            const isHighest = m.id === liveCalc.primaryModel;
            return (
              <div
                key={m.id}
                className={`rounded-3xl p-5 border transition-all ${
                  isHighest
                    ? 'bg-[#0e1d3d]/95 border-sky-400/50 shadow-xl'
                    : 'bg-[#0c1427]/95 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: m.color }}></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{m.name}</h4>
                        {isHighest && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30">
                            LEAD WEIGHT
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{m.subCategory}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black font-mono text-white">{m.weight}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2.5 my-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${m.weight}%`, backgroundColor: m.color }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{m.description}</span>
                  <span className="text-emerald-400 font-mono font-bold shrink-0 ml-3">
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
