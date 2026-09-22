import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  BrainCircuit,
  Award,
  Layers,
} from 'lucide-react';
import { ForecastSnapshot } from '../../types/weather';

interface ExplainabilityScreenProps {
  snapshot: ForecastSnapshot;
}

export const ExplainabilityScreen: React.FC<ExplainabilityScreenProps> = ({ snapshot }) => {
  const { explainability, confidenceScore } = snapshot;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-purple-700 uppercase">
          <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
          <span>Explainable Forecasting</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">
          Why This Forecast?
        </h2>
        <p className="text-xs text-slate-600">
          Transparent AI-driven reasoning for weight allocation and skill optimization
        </p>
      </div>

      {/* Primary Rationale Card */}
      <div className="glass-card rounded-3xl p-5 border-purple-200 bg-gradient-to-br from-purple-50/40 via-white to-sky-50/30 space-y-3.5 purple-glow">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 uppercase">
            Model Selection Intelligence
          </span>
          <span className="text-xs font-mono font-bold text-emerald-700">
            Confidence {confidenceScore}%
          </span>
        </div>

        <h3 className="text-base font-extrabold text-slate-900 leading-snug font-['Outfit']">
          {explainability.summaryReason}
        </h3>

        {/* Dynamic Driver Factors */}
        <div className="space-y-2 pt-2.5 border-t border-slate-200">
          {explainability.driverFactors.map((factor, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">{factor.title}: </span>
                <span className="text-slate-600 leading-relaxed">{factor.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Time Adaptive Dynamics Visual */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-600" />
            Lead-Time Weight Adaptation Curve
          </h3>
          <span className="text-[10px] font-mono font-bold text-sky-700">0h → 120h</span>
        </div>

        <div className="space-y-2 text-xs">
          {/* 0-6h */}
          <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-purple-900 font-mono">0 – 6 Hours (Nowcasting)</div>
              <div className="text-[10px] text-slate-600">AI / LSTM dominates with real-time radar fusion</div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-black text-purple-700">AI: 45%</span>
              <span className="text-[10px] text-slate-500 block">NWP: 40%</span>
            </div>
          </div>

          {/* 12-24h */}
          <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-sky-900 font-mono">12 – 24 Hours (Mesoscale)</div>
              <div className="text-[10px] text-slate-600">WRF cloud microphysics dominates intense precipitation</div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-black text-sky-700">WRF: 45%</span>
              <span className="text-[10px] text-slate-500 block">AI: 25%</span>
            </div>
          </div>

          {/* 48-72h */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-emerald-900 font-mono">48 – 72+ Hours (Synoptic)</div>
              <div className="text-[10px] text-slate-600">Global NWP + Ensemble dispersion controls uncertainty</div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-black text-emerald-700">ENS: 35%</span>
              <span className="text-[10px] text-slate-500 block">GFS: 40%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Verification Scorecard (RMSE Comparison Table) */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Empirical Skill Benchmark (RMSE)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-bold">Lower is Better</span>
        </div>

        <div className="space-y-2">
          {explainability.rmseComparison.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl text-xs transition-all ${
                  item.isBlended
                    ? 'bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-300 text-slate-900 font-bold shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.isBlended ? (
                    <Sparkles className="w-4 h-4 text-sky-600 animate-spin" style={{ animationDuration: '6s' }} />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  )}
                  <span className="font-semibold">{item.model}</span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <span className={`text-sm ${item.isBlended ? 'text-sky-800 font-black' : 'text-slate-800'}`}>
                    {item.rmse} <span className="text-[10px] font-normal text-slate-500">RMSE</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.isBlended
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'text-slate-600 bg-slate-200'
                    }`}
                  >
                    {item.reduction}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
          <span className="font-semibold">HYBRIDCAST Error Reduction vs GFS:</span>
          <span className="font-mono font-black text-sm text-emerald-800">-35.4%</span>
        </div>
      </div>
    </div>
  );
};
