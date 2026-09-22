import React, { useState } from 'react';
import {
  Map,
  Compass,
  Award,
  Activity,
  Layers,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { REGIONAL_SKILL_DATABASE } from '../../services/blendingEngine';
import { RegionalSkillData } from '../../types/weather';

export const SpatialSkillView: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionalSkillData>(REGIONAL_SKILL_DATABASE[0]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>India Meteorological Subdivision Verification</span>
        </div>
        <h2 className="text-3xl font-black text-white font-['Outfit'] tracking-tight">
          Spatial Model Dominance & Skill Radar
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Empirical regional verification database indicating dominant model architectures across Indian climatic zones
        </p>
      </div>

      {/* Grid of All Meteorological Zones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {REGIONAL_SKILL_DATABASE.map((reg) => {
          const isSelected = reg.id === selectedRegion.id;
          return (
            <div
              key={reg.id}
              onClick={() => setSelectedRegion(reg)}
              className={`cursor-pointer rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 hover:scale-[1.02] shadow-xl ${
                isSelected
                  ? 'bg-gradient-to-b from-[#0e2147]/95 to-[#08122a]/95 border-sky-400 ring-2 ring-sky-400/40 shadow-sky-500/20'
                  : 'bg-[#0c1427]/90 border-white/10 hover:border-sky-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                    {reg.zone} Zone
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-black ${
                      reg.dominantType === 'NWP'
                        ? 'bg-blue-500/20 text-blue-300'
                        : reg.dominantType === 'AI/ML'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {reg.dominantType} DOMINANT
                  </span>
                </div>

                <h3 className="text-base font-black text-white mt-2 font-['Outfit']">
                  {reg.name}
                </h3>
                <p className="text-xs text-slate-400">{reg.state}</p>
              </div>

              {/* Weight Distribution Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Model Ratios</span>
                  <span className="font-mono font-bold text-white text-[11px]">{reg.dominantModel}</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800 gap-0.5">
                  <div className="h-full bg-sky-400" style={{ width: `${reg.nwpWeight}%` }}></div>
                  <div className="h-full bg-purple-500" style={{ width: `${reg.aiWeight}%` }}></div>
                  <div className="h-full bg-emerald-400" style={{ width: `${reg.ensembleWeight}%` }}></div>
                </div>
              </div>

              {/* Skill Gain */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
                <span className="text-slate-400">Skill Improvement:</span>
                <span className="text-emerald-400 font-black">+{reg.skillGainPercentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Region In-Depth Inspector */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-[#0c1836]/95 via-[#081024]/95 to-[#040813]/98 border border-sky-400/40 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-sky-400 uppercase">
              In-Depth Subdivision Skill Dossier
            </div>
            <h3 className="text-2xl font-black text-white font-['Outfit']">
              {selectedRegion.name} ({selectedRegion.state})
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-black font-mono text-emerald-400">
                {selectedRegion.reliabilityGrade}
              </div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Operational Grade</div>
            </div>
          </div>
        </div>

        {/* Detailed Verification Scorecard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="text-xs font-mono text-slate-400 uppercase font-bold">Blended Error (RMSE)</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-emerald-400">
                {selectedRegion.rmseBlended}
              </span>
              <span className="text-xs text-slate-400">mm vs baseline {selectedRegion.rmseBaseline}mm</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="text-xs font-mono text-slate-400 uppercase font-bold">Error Reduction</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-sky-400">
                +{selectedRegion.skillGainPercentage}%
              </span>
              <span className="text-xs text-slate-400">vs Standard GFS</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="text-xs font-mono text-slate-400 uppercase font-bold">Dominant Architecture</div>
            <div className="text-base font-bold text-white mt-1">
              {selectedRegion.dominantModel}
            </div>
          </div>
        </div>

        {/* Meteorological Rationale */}
        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/30 text-xs text-slate-200 flex items-start gap-3">
          <Activity className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-sky-300">Meteorological Physics Justification: </strong>
            {selectedRegion.keyAdvantage}
          </div>
        </div>
      </div>
    </div>
  );
};
