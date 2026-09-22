import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  TrendingDown,
  BrainCircuit,
  Award,
  ShieldCheck,
  Zap,
  Layers,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { ForecastSnapshot } from '../../types/weather';

interface ExplainabilityScreenProps {
  snapshot: ForecastSnapshot;
}

export const ExplainabilityScreen: React.FC<ExplainabilityScreenProps> = ({ snapshot }) => {
  const { explainability, location, leadTime, regime, confidenceScore } = snapshot;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold tracking-wider text-purple-400 uppercase">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Explainable Forecasting</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
          Why This Forecast?
        </h2>
        <p className="text-xs text-slate-400">
          Transparent AI-driven reasoning for weight allocation and skill optimization
        </p>
      </div>

      {/* Primary Rationale Card */}
      <div className="glass-card rounded-3xl p-5 border-purple-500/30 bg-gradient-to-b from-slate-900/90 via-purple-950/30 to-[#0c1630]/90 space-y-3 purple-glow">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
            Model Selection Intelligence
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            Confidence {confidenceScore}%
          </span>
        </div>

        <h3 className="text-base font-extrabold text-white leading-snug font-['Outfit']">
          {explainability.summaryReason}
        </h3>

        {/* Dynamic Driver Factors */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          {explainability.driverFactors.map((factor, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200">{factor.title}: </span>
                <span className="text-slate-300 leading-relaxed">{factor.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Time Adaptive Dynamics Visual */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-400" />
            Lead-Time Weight Adaptation Curve
          </h3>
          <span className="text-[10px] font-mono text-sky-400">0h → 120h</span>
        </div>

        <div className="space-y-2 text-xs">
          {/* 0-6h */}
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex items-center justify-between">
            <div>
              <div className="font-bold text-purple-300 font-mono">0 – 6 Hours (Nowcasting)</div>
              <div className="text-[10px] text-slate-400">AI / LSTM dominates with real-time radar fusion</div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-bold text-purple-400">AI: 45%</span>
              <span className="text-[10px] text-slate-500 block">NWP: 40%</span>
            </div>
          </div>

          {/* 12-24h */}
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex items-center justify-between">
            <div>
              <div className="font-bold text-sky-300 font-mono">12 – 24 Hours (Mesoscale)</div>
              <div className="text-[10px] text-slate-400">WRF cloud microphysics dominates intense precipitation</div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-bold text-sky-400">WRF: 45%</span>
              <span className="text-[10px] text-slate-500 block">AI: 25%</span>
            </div>
          </div>

          {/* 48-72h */}
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex items-center justify-between">
            <div>
              <div className="font-bold text-emerald-300 font-mono">48 – 72+ Hours (Synoptic)</div>
              <div className="text-[10px] text-slate-400">Global NWP + Ensemble dispersion controls uncertainty</div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-bold text-emerald-400">ENS: 35%</span>
              <span className="text-[10px] text-slate-500 block">GFS: 40%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Verification Scorecard (RMSE Comparison Table) */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Empirical Skill Benchmark (RMSE)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">Lower is Better</span>
        </div>

        <div className="space-y-2">
          {explainability.rmseComparison.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                  item.isBlended
                    ? 'bg-gradient-to-r from-sky-500/20 to-emerald-500/20 border border-sky-400/40 text-white font-bold shadow-md'
                    : 'bg-slate-900/60 border border-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.isBlended ? (
                    <Sparkles className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                  )}
                  <span>{item.model}</span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <span className={`text-sm ${item.isBlended ? 'text-sky-300 font-black' : 'text-slate-200'}`}>
                    {item.rmse} <span className="text-[10px] font-normal text-slate-400">RMSE</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.isBlended
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 bg-slate-800'
                    }`}
                  >
                    {item.reduction}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-xs text-emerald-200 flex items-center justify-between">
          <span className="font-semibold">HYBRIDCAST Error Reduction vs GFS:</span>
          <span className="font-mono font-extrabold text-sm text-emerald-300">-35.4%</span>
        </div>
      </div>
    </div>
  );
};
