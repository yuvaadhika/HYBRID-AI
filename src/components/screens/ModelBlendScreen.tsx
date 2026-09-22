import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Sparkles,
  Layers,
  RotateCcw,
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
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-sky-700 uppercase">
          <Cpu className="w-3.5 h-3.5 text-sky-600" />
          <span>Dynamic Ensemble Engine</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">
          Adaptive Model Blend
        </h2>
        <p className="text-xs text-slate-600">
          Optimal weight distribution based on regime, lead time & regional skill
        </p>
      </div>

      {/* Hero Blended Outcome Card with Live Equation */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50/50 to-blue-50/30 border border-sky-200 p-5 shadow-sm radar-glow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
            Blended Target Forecast
          </span>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
            Confidence {liveCalc.confidenceScore}%
          </span>
        </div>

        <div className="my-3 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900 font-['Outfit']">
                {liveCalc.blendedRainfall}
              </span>
              <span className="text-2xl font-bold text-sky-600">mm</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Optimal blended rainfall for {location.name} ({sandboxLeadTime})
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-mono font-semibold">Agreement</div>
            <div
              className={`text-sm font-extrabold font-mono ${
                liveCalc.agreementLevel === 'HIGH'
                  ? 'text-emerald-700'
                  : liveCalc.agreementLevel === 'MODERATE'
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {liveCalc.agreementLevel} (σ={liveCalc.variance})
            </div>
          </div>
        </div>

        {/* Live Mathematical Formula */}
        <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700">
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-bold">
            Live Blending Formula
          </div>
          <div className="text-sky-800 font-semibold truncate">
            F<sub className="text-[9px]">AI</sub> = ({liveCalc.weights.WRF}% × WRF) + ({liveCalc.weights.AI_MODEL}% × AI) + ({liveCalc.weights.GFS}% × GFS) + ({liveCalc.weights.ENSEMBLE}% × ENS)
          </div>
        </div>
      </div>

      {/* Model Weights Breakdown Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            Model Contributions & Weight Allocation
          </h3>
          <span className="text-[10px] font-mono font-bold text-slate-500">Σ = 100%</span>
        </div>

        {liveCalc.models.map((m) => {
          const isHighest = m.id === liveCalc.primaryModel;
          return (
            <div
              key={m.id}
              className={`rounded-2xl p-3.5 border transition-all ${
                isHighest
                  ? 'glass-card border-sky-300 bg-sky-50/50 ring-1 ring-sky-200'
                  : 'glass-card'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }}></div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{m.name}</span>
                      {isHighest && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 border border-sky-200 font-bold">
                          PRIMARY SKILL
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">{m.subCategory}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold font-mono text-slate-900">{m.weight}%</div>
                  <div className="text-[10px] font-mono text-slate-500">Raw: {m.rawForecastValue}mm</div>
                </div>
              </div>

              {/* Progress Weight Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 my-2 overflow-hidden border border-slate-200/60">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${m.weight}%`, backgroundColor: m.color }}
                ></div>
              </div>

              <div className="text-[11px] text-slate-600 leading-snug flex items-center justify-between">
                <span>{m.description}</span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold shrink-0 ml-2">
                  Skill: {m.historicalSkillScore}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive What-If Simulation Sandbox */}
      <div className="rounded-3xl p-5 bg-white border border-purple-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                What-If Forecast Sandbox
              </h3>
              <div className="text-[10px] text-slate-500">Test how weights adapt to changing variables</div>
            </div>
          </div>

          <button
            onClick={handleResetSandbox}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-mono font-semibold text-slate-700 transition-all border border-slate-200"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        {/* Lead Time Slider in Sandbox */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-700 font-medium">Lead Time Horizon</span>
            <span className="font-mono font-bold text-sky-700">{sandboxLeadTime}</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {(['6h', '12h', '24h', '48h', '72h'] as LeadTime[]).map((lt) => (
              <button
                key={lt}
                onClick={() => {
                  setSandboxLeadTime(lt);
                  onLeadTimeChange(lt);
                }}
                className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  sandboxLeadTime === lt
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
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
            <span className="text-slate-700 font-medium">Weather Regime</span>
            <span className="font-mono font-bold text-purple-700">{sandboxRegime}</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {(['NORMAL', 'CONVECTIVE', 'MONSOON', 'HEAVY_RAIN', 'EXTREME'] as WeatherRegime[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSandboxRegime(r);
                  onRegimeChange(r);
                }}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold truncate transition-all ${
                  sandboxRegime === r
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Raw Model Input Sliders */}
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div className="text-[11px] font-bold text-slate-800">
            Simulate Raw Model Prediction Outputs (mm)
          </div>

          {(['WRF', 'AI_MODEL', 'GFS', 'ENSEMBLE'] as ForecastModelId[]).map((mId) => {
            const m = liveCalc.models.find((x) => x.id === mId)!;
            return (
              <div key={mId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">{m.name}</span>
                  <span className="font-mono font-bold text-slate-900">{customRawRain[mId]} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="2"
                  value={customRawRain[mId]}
                  onChange={(e) => handleSliderChange(mId, Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
