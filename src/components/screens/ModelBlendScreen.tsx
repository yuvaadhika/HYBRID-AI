import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Sparkles,
  Layers,
  ShieldCheck,
  RotateCcw,
  Zap,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ForecastSnapshot, LeadTime, WeatherRegime, ForecastModelId } from '../../types/weather';
import { calculateAdaptiveWeights } from '../../services/blendingEngine';

interface ModelBlendScreenProps {
  snapshot: ForecastSnapshot;
  onLeadTimeChange: (lt: LeadTime) => void;
  onRegimeChange: (regime: WeatherRegime) => void;
}

export const ModelBlendScreen: React.FC<ModelBlendScreenProps> = ({
  snapshot,
  onLeadTimeChange,
  onRegimeChange
}) => {
  const { location, leadTime, regime } = snapshot;

  // What-If Sandbox State
  const [sandboxLeadTime, setSandboxLeadTime] = useState<LeadTime>(leadTime);
  const [sandboxRegime, setSandboxRegime] = useState<WeatherRegime>(regime);
  const [customRawRain, setCustomRawRain] = useState<Record<ForecastModelId, number>>({
    WRF: snapshot.models.find((m) => m.id === 'WRF')?.rawForecastValue || 84,
    AI_MODEL: snapshot.models.find((m) => m.id === 'AI_MODEL')?.rawForecastValue || 76,
    GFS: snapshot.models.find((m) => m.id === 'GFS')?.rawForecastValue || 68,
    ENSEMBLE: snapshot.models.find((m) => m.id === 'ENSEMBLE')?.rawForecastValue || 72
  });

  // Calculate live dynamic blend in sandbox
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
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Title & Badge */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold tracking-wider text-sky-400 uppercase">
          <Cpu className="w-3.5 h-3.5" />
          <span>Dynamic Ensemble Engine</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
          Adaptive Model Blend
        </h2>
        <p className="text-xs text-slate-400">
          Optimal weight distribution based on regime, lead time & regional skill
        </p>
      </div>

      {/* Hero Blended Outcome Card with Live Equation */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0e1c38]/90 to-[#070e20]/95 border border-sky-400/30 p-5 shadow-2xl radar-glow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-semibold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            Blended Target Forecast
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
            Confidence {liveCalc.confidenceScore}%
          </span>
        </div>

        <div className="my-3 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white font-['Outfit']">
                {liveCalc.blendedRainfall}
              </span>
              <span className="text-2xl font-bold text-sky-400">mm</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Optimal blended rainfall for {location.name} ({sandboxLeadTime})
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Agreement</div>
            <div
              className={`text-sm font-bold font-mono ${
                liveCalc.agreementLevel === 'HIGH'
                  ? 'text-emerald-400'
                  : liveCalc.agreementLevel === 'MODERATE'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {liveCalc.agreementLevel} (σ={liveCalc.variance})
            </div>
          </div>
        </div>

        {/* Live Mathematical Formula */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-white/5 font-mono text-[11px] text-slate-300">
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">
            Live Blending Formula
          </div>
          <div className="text-sky-300 truncate">
            F<sub className="text-[9px]">AI</sub> = ({liveCalc.weights.WRF}% × WRF) + ({liveCalc.weights.AI_MODEL}% × AI) + ({liveCalc.weights.GFS}% × GFS) + ({liveCalc.weights.ENSEMBLE}% × ENS)
          </div>
        </div>
      </div>

      {/* Model Weights Breakdown Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Model Contributions & Weight Allocation
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Σ = 100%</span>
        </div>

        {liveCalc.models.map((m) => {
          const isHighest = m.id === liveCalc.primaryModel;
          return (
            <div
              key={m.id}
              className={`rounded-2xl p-3.5 border transition-all ${
                isHighest ? 'glass-card border-sky-400/40 bg-sky-950/20' : 'glass-card'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }}></div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{m.name}</span>
                      {isHighest && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-bold">
                          PRIMARY SKILL
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">{m.subCategory}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold font-mono text-white">{m.weight}%</div>
                  <div className="text-[10px] font-mono text-slate-400">Raw: {m.rawForecastValue}mm</div>
                </div>
              </div>

              {/* Progress Weight Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 my-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${m.weight}%`, backgroundColor: m.color }}
                ></div>
              </div>

              <div className="text-[11px] text-slate-300 leading-snug flex items-center justify-between">
                <span>{m.description}</span>
                <span className="text-[10px] font-mono text-emerald-400 shrink-0 ml-2">
                  Skill: {m.historicalSkillScore}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive What-If Simulation Sandbox */}
      <div className="rounded-3xl p-4 bg-gradient-to-b from-slate-900/90 to-purple-950/30 border border-purple-500/30 shadow-xl purple-glow space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                What-If Forecast Sandbox
              </h3>
              <div className="text-[10px] text-slate-400">Test how weights adapt to changing variables</div>
            </div>
          </div>

          <button
            onClick={handleResetSandbox}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-[10px] font-mono text-slate-300 transition-all border border-white/10"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        {/* Lead Time Slider in Sandbox */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Lead Time Horizon</span>
            <span className="font-mono font-bold text-sky-400">{sandboxLeadTime}</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {(['6h', '12h', '24h', '48h', '72h'] as LeadTime[]).map((lt) => (
              <button
                key={lt}
                onClick={() => {
                  setSandboxLeadTime(lt);
                  onLeadTimeChange(lt);
                }}
                className={`py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  sandboxLeadTime === lt
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {lt}
              </button>
            ))}
          </div>
        </div>

        {/* Regime Switcher in Sandbox */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Weather Regime</span>
            <span className="font-mono font-bold text-purple-400">{sandboxRegime}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {(['NORMAL', 'CONVECTIVE', 'MONSOON', 'HEAVY_RAIN', 'EXTREME'] as WeatherRegime[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSandboxRegime(r);
                  onRegimeChange(r);
                }}
                className={`py-1 px-1 rounded-lg text-[10px] font-bold truncate transition-all ${
                  sandboxRegime === r
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Raw Model Input Sliders */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="text-[11px] font-semibold text-slate-300">
            Simulate Raw Model Prediction Outputs (mm)
          </div>

          {(['WRF', 'AI_MODEL', 'GFS', 'ENSEMBLE'] as ForecastModelId[]).map((mId) => {
            const m = liveCalc.models.find((x) => x.id === mId)!;
            return (
              <div key={mId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{m.name}</span>
                  <span className="font-mono font-bold text-white">{customRawRain[mId]} mm</span>
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
    </div>
  );
};
