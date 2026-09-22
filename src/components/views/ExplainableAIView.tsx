import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  BrainCircuit,
  Award,
  Layers
} from 'lucide-react';
import { ForecastSnapshot } from '../../types/weather';

interface ExplainableAIViewProps {
  snapshot: ForecastSnapshot;
}

export const ExplainableAIView: React.FC<ExplainableAIViewProps> = ({ snapshot }) => {
  const { explainability, location, leadTime, confidenceScore } = snapshot;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <div className="text-xs font-mono text-slate-400 uppercase">
          Explainable AI (XAI)
        </div>
        <h2 className="text-2xl font-bold text-white font-['Outfit']">
          Why This Forecast? Transparent Model Reasoning
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Algorithmic attribution justifying model weight allocations for {location.name} ({leadTime} horizon)
        </p>
      </div>

      {/* Rationale Card */}
      <div className="rounded-2xl p-5 mild-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 uppercase">
            Selection Rationale
          </span>
          <span className="text-xs font-mono font-medium text-emerald-400">
            Confidence: {confidenceScore}%
          </span>
        </div>

        <h3 className="text-base font-semibold text-white leading-relaxed font-['Outfit']">
          {explainability.summaryReason}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800">
          {explainability.driverFactors.map((factor, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <h4 className="text-xs font-semibold text-white">{factor.title}</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed pl-5">
                {factor.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmark Table & Lead-Time Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: RMSE Table (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl p-5 mild-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Empirical Skill Benchmark (Precipitation RMSE)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">Lower = Better</span>
          </div>

          <div className="space-y-2">
            {explainability.rmseComparison.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl text-xs transition-all ${
                  item.isBlended
                    ? 'bg-slate-800 border border-sky-500/30 text-white font-semibold'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.isBlended ? (
                    <Sparkles className="w-4 h-4 text-sky-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                  )}
                  <span className="font-medium">{item.model}</span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <span className={`text-sm ${item.isBlended ? 'text-sky-300 font-bold' : 'text-slate-200'}`}>
                    {item.rmse} <span className="text-[10px] text-slate-400 font-normal">mm</span>
                  </span>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                      item.isBlended
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'text-slate-400 bg-slate-800'
                    }`}
                  >
                    {item.reduction}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>Total Error Reduction vs Global GFS:</span>
            <span className="font-mono font-bold text-sm text-emerald-300">-35.4%</span>
          </div>
        </div>

        {/* Right: Lead Decay (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl p-5 mild-card space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Lead-Time Decay Function
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
              <div className="flex items-center justify-between font-mono font-semibold text-purple-300">
                <span>0 – 6h Horizon (Nowcasting)</span>
                <span>AI: 45%</span>
              </div>
              <p className="text-[11px] text-slate-400">
                AI / LSTM models assimilate real-time satellite & radar echoes.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
              <div className="flex items-center justify-between font-mono font-semibold text-sky-300">
                <span>12 – 24h Horizon (Mesoscale)</span>
                <span>WRF: 45%</span>
              </div>
              <p className="text-[11px] text-slate-400">
                WRF 3km microphysics accurately resolves convective storm boundaries.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
              <div className="flex items-center justify-between font-mono font-semibold text-emerald-300">
                <span>48 – 72h+ Horizon (Synoptic)</span>
                <span>ENS / GFS: 75%</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Global synoptic models and ensemble spread dominate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
