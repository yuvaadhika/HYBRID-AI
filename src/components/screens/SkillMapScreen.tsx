import React, { useState } from 'react';
import {
  Map,
  Compass,
  Award,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Shield,
  Activity
} from 'lucide-react';
import { REGIONAL_SKILL_DATABASE } from '../../services/blendingEngine';
import { RegionalSkillData } from '../../types/weather';

export const SkillMapScreen: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionalSkillData>(REGIONAL_SKILL_DATABASE[0]);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold tracking-wider text-sky-400 uppercase">
          <Compass className="w-3.5 h-3.5" />
          <span>Spatial Verification</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
          Regional Model Skill Map
        </h2>
        <p className="text-xs text-slate-400">
          Geographic model dominance and historical verification index across India
        </p>
      </div>

      {/* Interactive India Map / Visual Zone Selector */}
      <div className="glass-card rounded-3xl p-4 relative overflow-hidden radar-glow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-sky-400" />
            Meteorological Zones of India
          </span>
          <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 font-bold">
            Live Spatial Grid
          </span>
        </div>

        {/* Visual Map Layout with Interactive Pins */}
        <div className="relative w-full h-48 rounded-2xl bg-gradient-to-b from-slate-950 to-[#0c172d] border border-white/10 flex items-center justify-center p-3 overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

          {/* Interactive Geo Zone Pills over map */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-sm">
            {REGIONAL_SKILL_DATABASE.map((reg) => {
              const isSelected = reg.id === selectedRegion.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg)}
                  className={`p-2 rounded-xl text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-500/25 border border-sky-400 text-white shadow-lg shadow-sky-500/30 ring-1 ring-sky-300/40'
                      : 'bg-slate-900/80 border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-sky-400 uppercase font-bold">{reg.zone}</span>
                    <span
                      className={`text-[8px] font-mono px-1 rounded font-bold ${
                        reg.dominantType === 'NWP'
                          ? 'bg-blue-500/30 text-blue-300'
                          : reg.dominantType === 'AI/ML'
                          ? 'bg-purple-500/30 text-purple-300'
                          : 'bg-emerald-500/30 text-emerald-300'
                      }`}
                    >
                      {reg.dominantType}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-100 truncate mt-1">{reg.name.split('&')[0]}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Region Detailed Reliability Card */}
      <div className="glass-card rounded-3xl p-5 border-sky-500/30 bg-gradient-to-b from-slate-900/90 to-[#0c1833]/90 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-mono text-sky-400 uppercase font-semibold">
              Selected Region Analysis
            </div>
            <h3 className="text-xl font-extrabold text-white font-['Outfit']">
              {selectedRegion.name}
            </h3>
            <div className="text-xs text-slate-400">{selectedRegion.state} • {selectedRegion.zone} Zone</div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-2xl font-black font-mono text-emerald-400">
              {selectedRegion.reliabilityGrade}
            </span>
            <span className="text-[10px] font-mono text-slate-400">Reliability Grade</span>
          </div>
        </div>

        {/* Model Weight Breakdown Bar for Region */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Regional Model Weight Matrix</span>
            <span className="text-sky-300 font-mono font-bold">{selectedRegion.dominantModel}</span>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800 p-0.5 gap-0.5">
            <div
              className="h-full bg-sky-400 rounded-l-full transition-all duration-500"
              style={{ width: `${selectedRegion.nwpWeight}%` }}
              title={`NWP: ${selectedRegion.nwpWeight}%`}
            ></div>
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${selectedRegion.aiWeight}%` }}
              title={`AI/ML: ${selectedRegion.aiWeight}%`}
            ></div>
            <div
              className="h-full bg-emerald-400 rounded-r-full transition-all duration-500"
              style={{ width: `${selectedRegion.ensembleWeight}%` }}
              title={`Ensemble: ${selectedRegion.ensembleWeight}%`}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span className="text-sky-400">NWP: {selectedRegion.nwpWeight}%</span>
            <span className="text-purple-400">AI: {selectedRegion.aiWeight}%</span>
            <span className="text-emerald-400">ENS: {selectedRegion.ensembleWeight}%</span>
          </div>
        </div>

        {/* Skill Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Blended RMSE</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-emerald-400">
                {selectedRegion.rmseBlended}
              </span>
              <span className="text-xs text-slate-400">mm</span>
              <span className="text-[10px] text-slate-500 line-through ml-1">
                {selectedRegion.rmseBaseline}mm
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Skill Improvement</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-sky-400">
                +{selectedRegion.skillGainPercentage}%
              </span>
              <span className="text-[10px] text-slate-400">Error Reduction</span>
            </div>
          </div>
        </div>

        {/* Meteorological Rationale */}
        <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-xs text-slate-200 flex items-start gap-2">
          <Activity className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sky-300">Why this model dominates: </span>
            <span>{selectedRegion.keyAdvantage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
