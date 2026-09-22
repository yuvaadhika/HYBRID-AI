import React, { useState } from 'react';
import {
  Compass,
  Activity
} from 'lucide-react';
import { REGIONAL_SKILL_DATABASE } from '../../services/blendingEngine';
import { RegionalSkillData } from '../../types/weather';

export const SpatialSkillView: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionalSkillData>(REGIONAL_SKILL_DATABASE[0]);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <div className="text-xs font-mono text-slate-400 uppercase">
          Spatial Verification
        </div>
        <h2 className="text-2xl font-bold text-white font-['Outfit']">
          Regional Model Dominance & Skill Radar
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Empirical regional verification database across Indian climatic zones
        </p>
      </div>

      {/* Grid of Zones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {REGIONAL_SKILL_DATABASE.map((reg) => {
          const isSelected = reg.id === selectedRegion.id;
          return (
            <div
              key={reg.id}
              onClick={() => setSelectedRegion(reg)}
              className={`cursor-pointer rounded-2xl p-4.5 border transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-slate-800/90 border-slate-600 ring-1 ring-slate-500/40'
                  : 'mild-card hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {reg.zone} Zone
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {reg.dominantType}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-1.5 font-['Outfit']">
                  {reg.name}
                </h3>
                <p className="text-[11px] text-slate-400">{reg.state}</p>
              </div>

              {/* Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Ratios</span>
                  <span className="font-mono text-slate-300">{reg.dominantModel}</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-slate-800 gap-0.5">
                  <div className="h-full bg-sky-400" style={{ width: `${reg.nwpWeight}%` }}></div>
                  <div className="h-full bg-purple-400" style={{ width: `${reg.aiWeight}%` }}></div>
                  <div className="h-full bg-emerald-400" style={{ width: `${reg.ensembleWeight}%` }}></div>
                </div>
              </div>

              {/* Skill */}
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Skill Gain:</span>
                <span className="text-emerald-400 font-semibold">+{reg.skillGainPercentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Region Detail */}
      <div className="rounded-2xl p-5 mild-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">
              Subdivision Dossier
            </div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">
              {selectedRegion.name} ({selectedRegion.state})
            </h3>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {selectedRegion.reliabilityGrade}
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Operational Grade</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 uppercase">Blended Error (RMSE)</div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {selectedRegion.rmseBlended}
              </span>
              <span className="text-xs text-slate-400">mm vs baseline {selectedRegion.rmseBaseline}mm</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 uppercase">Error Reduction</div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold font-mono text-sky-400">
                +{selectedRegion.skillGainPercentage}%
              </span>
              <span className="text-xs text-slate-400">vs Standard GFS</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 uppercase">Dominant Model</div>
            <div className="text-sm font-semibold text-white mt-1">
              {selectedRegion.dominantModel}
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Activity className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200">Meteorological Rationale: </strong>
            <span>{selectedRegion.keyAdvantage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
