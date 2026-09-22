import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CloudRain,
  Flame,
  Wind,
  Zap,
  BellRing,
  Clock
} from 'lucide-react';
import { ForecastSnapshot } from '../../types/weather';

interface HazardEarlyWarningViewProps {
  snapshot: ForecastSnapshot;
}

export const HazardEarlyWarningView: React.FC<HazardEarlyWarningViewProps> = ({ snapshot }) => {
  const { extremeHazards, location, regime } = snapshot;

  const getHazardIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-sky-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-purple-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <div className="text-xs font-mono text-slate-400 uppercase">
          Early Warning Protocol
        </div>
        <h2 className="text-2xl font-bold text-white font-['Outfit']">
          Multi-Hazard Threat & Vulnerability Radar
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Severe weather threshold monitoring for {location.name} station
        </p>
      </div>

      {/* Main Alert Banner */}
      <div className="rounded-2xl p-5 mild-card space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                Active Operational Advisory
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                {regime === 'EXTREME'
                  ? 'Severe Cyclonic Storm Alert'
                  : regime === 'HEAVY_RAIN'
                  ? 'Intense Precipitation & Waterlogging Watch'
                  : regime === 'CONVECTIVE'
                  ? 'Convective Thunderstorm Warning'
                  : 'Normal Weather Operational Status'}
              </h3>
            </div>
          </div>

          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            Advisory: {snapshot.riskLevel}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {snapshot.headlineSummary}
        </p>
      </div>

      {/* Hazard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {extremeHazards.map((hazard) => (
          <div
            key={hazard.id}
            className="rounded-2xl p-4.5 mild-card space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  {getHazardIcon(hazard.iconName)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{hazard.hazardName}</h4>
                  <div className="text-[11px] font-mono text-slate-400">{hazard.currentMetric}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold font-mono text-white">{hazard.riskPercentage}%</div>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                  {hazard.severityLevel}
                </span>
              </div>
            </div>

            {/* Gauge */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${hazard.riskPercentage}%`,
                  backgroundColor:
                    hazard.severityLevel === 'CRITICAL' || hazard.severityLevel === 'HIGH'
                      ? '#f87171'
                      : hazard.severityLevel === 'MODERATE'
                      ? '#fbbf24'
                      : '#34d399'
                }}
              ></div>
            </div>

            {/* Impact & Action */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
              <div className="text-slate-300 text-[11px]">
                <strong className="text-slate-400">Impact: </strong>
                {hazard.impactDescription}
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-[11px] flex items-start gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sky-300">Action: </strong>
                  {hazard.actionableAdvisory}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Protocol */}
      <div className="rounded-2xl p-5 mild-card space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Operational Early Warning Multi-Stage Protocol
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-center">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
            <div className="text-xs font-mono font-medium text-slate-400">72h Out</div>
            <div className="text-sm font-semibold text-slate-200">Ensemble Watch</div>
            <p className="text-[10px] text-slate-400">Synoptic track tracking</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
            <div className="text-xs font-mono font-medium text-amber-300">48h Out</div>
            <div className="text-sm font-semibold text-slate-200">Consensus Alert</div>
            <p className="text-[10px] text-slate-400">Model convergence check</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
            <div className="text-xs font-mono font-medium text-rose-300">24h Out</div>
            <div className="text-sm font-semibold text-slate-200">Action Warning</div>
            <p className="text-[10px] text-slate-400">WRF microphysics targeting</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-0.5">
            <div className="text-xs font-mono font-medium text-sky-400">0–6h (Nowcast)</div>
            <div className="text-sm font-semibold text-white">AI Radar Fusion</div>
            <p className="text-[10px] text-slate-300">Doppler radar assimilation</p>
          </div>
        </div>
      </div>
    </div>
  );
};
