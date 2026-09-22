import React, { useState } from 'react';
import {
  Map,
  Compass,
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
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-sky-700 uppercase">
          <Compass className="w-3.5 h-3.5 text-sky-600" />
          <span>Spatial Verification</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">
          Regional Model Skill Map
        </h2>
        <p className="text-xs text-slate-600">
          Geographic model dominance and historical verification index across India
        </p>
      </div>

      {/* Interactive India Map / Visual Zone Selector */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 relative overflow-hidden radar-glow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-sky-600" />
            Meteorological Zones of India
          </span>
          <span className="text-[10px] font-mono text-emerald-800 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 font-bold">
            Live Spatial Grid
          </span>
        </div>

        {/* Visual Map Layout with Interactive Pins */}
        <div className="relative w-full rounded-2xl bg-gradient-to-b from-sky-50/70 via-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]"></div>

          {/* Interactive Geo Zone Pills over map */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
            {REGIONAL_SKILL_DATABASE.map((reg) => {
              const isSelected = reg.id === selectedRegion.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg)}
                  className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-mono uppercase font-bold ${
                        isSelected ? 'text-sky-100' : 'text-sky-700'
                      }`}
                    >
                      {reg.zone}
                    </span>
                    <span
                      className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : reg.dominantType === 'NWP'
                          ? 'bg-blue-100 text-blue-800'
                          : reg.dominantType === 'AI/ML'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {reg.dominantType}
                    </span>
                  </div>
                  <div
                    className={`text-xs font-bold truncate mt-1.5 ${
                      isSelected ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {reg.name.split('&')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Region Detailed Reliability Card */}
      <div className="glass-card rounded-3xl p-5 border-sky-200 bg-gradient-to-br from-white via-sky-50/30 to-white space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-mono text-sky-700 uppercase font-bold">
              Selected Region Analysis
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
              {selectedRegion.name}
            </h3>
            <div className="text-xs text-slate-600">{selectedRegion.state} • {selectedRegion.zone} Zone</div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-2xl font-black font-mono text-emerald-700">
              {selectedRegion.reliabilityGrade}
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-semibold">Reliability Grade</span>
          </div>
        </div>

        {/* Model Weight Breakdown Bar for Region */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-700 font-medium">Regional Model Weight Matrix</span>
            <span className="text-sky-800 font-mono font-bold">{selectedRegion.dominantModel}</span>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 p-0.5 gap-0.5 border border-slate-200">
            <div
              className="h-full bg-sky-500 rounded-l-full transition-all duration-500"
              style={{ width: `${selectedRegion.nwpWeight}%` }}
              title={`NWP: ${selectedRegion.nwpWeight}%`}
            ></div>
            <div
              className="h-full bg-purple-600 transition-all duration-500"
              style={{ width: `${selectedRegion.aiWeight}%` }}
              title={`AI/ML: ${selectedRegion.aiWeight}%`}
            ></div>
            <div
              className="h-full bg-emerald-500 rounded-r-full transition-all duration-500"
              style={{ width: `${selectedRegion.ensembleWeight}%` }}
              title={`Ensemble: ${selectedRegion.ensembleWeight}%`}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-600 mt-2">
            <span className="text-sky-700">NWP: {selectedRegion.nwpWeight}%</span>
            <span className="text-purple-700">AI: {selectedRegion.aiWeight}%</span>
            <span className="text-emerald-700">ENS: {selectedRegion.ensembleWeight}%</span>
          </div>
        </div>

        {/* Skill Metrics */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Blended RMSE</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black font-mono text-emerald-700">
                {selectedRegion.rmseBlended}
              </span>
              <span className="text-xs text-slate-500">mm</span>
              <span className="text-[10px] text-slate-400 line-through ml-1 font-mono">
                {selectedRegion.rmseBaseline}mm
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Skill Improvement</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black font-mono text-sky-700">
                +{selectedRegion.skillGainPercentage}%
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Error Cut</span>
            </div>
          </div>
        </div>

        {/* Meteorological Rationale */}
        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-slate-800 flex items-start gap-2.5">
          <Activity className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sky-900">Why this model dominates: </span>
            <span className="text-slate-700">{selectedRegion.keyAdvantage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
