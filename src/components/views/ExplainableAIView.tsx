import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  BrainCircuit,
  Award,
  ShieldCheck,
  TrendingDown,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ForecastSnapshot } from '../../types/weather';

interface ExplainableAIViewProps {
  snapshot: ForecastSnapshot;
}

export const ExplainableAIView: React.FC<ExplainableAIViewProps> = ({ snapshot }) => {
  const { explainability, location, leadTime, regime, confidenceScore } = snapshot;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4" />
          <span>Explainable Meteorological AI (XAI)</span>
        </div>
        <h2 className="text-3xl font-black text-white font-['Outfit'] tracking-tight">
          Why This Forecast? Transparent Model Reasoning
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Algorithmic attribution justifying model weight allocations for {location.name} ({leadTime} horizon)
        </p>
      </div>

      {/* Primary Rationale Hero Card */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-[#130f33]/95 via-[#0c142b]/95 to-[#040813]/98 border border-purple-500/40 shadow-2xl purple-glow space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
            Model Selection Rationale
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            System Confidence: {confidenceScore}%
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-white leading-relaxed font-['Outfit']">
          {explainability.summaryReason}
        </h3>

        {/* 4 Core Verification Drivers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/10">
          {explainability.driverFactors.map((factor, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <h4 className="text-xs font-bold text-white">{factor.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                {factor.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Benchmark Table & Lead-Time Curve Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Empirical RMSE Comparison Table (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-[#0c1427]/95 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Empirical Skill Benchmark (Precipitation RMSE)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">Lower RMSE = Better</span>
          </div>

          <div className="space-y-2.5">
            {explainability.rmseComparison.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3.5 rounded-2xl text-xs transition-all ${
                  item.isBlended
                    ? 'bg-gradient-to-r from-sky-500/20 via-emerald-500/20 to-teal-500/20 border border-sky-400/50 text-white font-bold shadow-lg'
                    : 'bg-slate-900/70 border border-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.isBlended ? (
                    <Sparkles className="w-5 h-5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                  )}
                  <span className="text-sm font-semibold">{item.model}</span>
                </div>

                <div className="flex items-center gap-4 font-mono">
                  <span className={`text-base ${item.isBlended ? 'text-sky-300 font-black' : 'text-slate-200'}`}>
                    {item.rmse} <span className="text-xs text-slate-400 font-normal">mm</span>
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                      item.isBlended
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 bg-slate-800'
                    }`}
                  >
                    {item.reduction}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
            <span className="font-bold">Total Error Reduction vs Global GFS:</span>
            <span className="font-mono font-black text-lg text-emerald-300">-35.4% Error Reduction</span>
          </div>
        </div>

        {/* Right: Lead-Time Weight Adaptation Dynamics (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-[#0c1427]/95 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Lead-Time Decay Function
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <div className="flex items-center justify-between font-mono font-bold text-purple-300">
                <span>0 – 6h Horizon (Nowcasting)</span>
                <span>AI: 45%</span>
              </div>
              <p className="text-[11px] text-slate-400">
                AI / LSTM models assimilate real-time satellite & Doppler radar echoes with near-zero latency.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <div className="flex items-center justify-between font-mono font-bold text-sky-300">
                <span>12 – 24h Horizon (Mesoscale)</span>
                <span>WRF: 45%</span>
              </div>
              <p className="text-[11px] text-slate-400">
                WRF 3km microphysics accurately resolves convective storms and terrain precipitation boundaries.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
              <div className="flex items-center justify-between font-mono font-bold text-emerald-300">
                <span>48 – 72h+ Horizon (Synoptic)</span>
                <span>ENS / GFS: 75%</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Global synoptic models and ensemble spread dominate to handle long-range circulation uncertainty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
