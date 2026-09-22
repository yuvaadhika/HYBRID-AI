import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CloudRain,
  Flame,
  Wind,
  Zap,
  ShieldAlert,
  BellRing,
  Clock,
} from 'lucide-react';
import { ForecastSnapshot } from '../../types/weather';

interface ExtremeRiskScreenProps {
  snapshot: ForecastSnapshot;
}

export const ExtremeRiskScreen: React.FC<ExtremeRiskScreenProps> = ({ snapshot }) => {
  const { extremeHazards, location, regime } = snapshot;

  const getHazardIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-sky-600" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-600" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-purple-600" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
    }
  };

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'MODERATE':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-rose-700 uppercase">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Early Warning Radar</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">
          Extreme Weather Risk
        </h2>
        <p className="text-xs text-slate-600">
          Multi-hazard threat detection & early warning guidance for {location.name}
        </p>
      </div>

      {/* Overall Risk Headline Banner */}
      <div className="rounded-3xl p-5 bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-200 shadow-sm rose-glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-700 border border-rose-200">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-rose-800 uppercase font-bold tracking-wider">
                Active Weather Advisory
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-['Outfit']">
                {regime === 'EXTREME'
                  ? 'Severe Cyclonic Storm Alert'
                  : regime === 'HEAVY_RAIN'
                  ? 'Heavy Precipitation Watch'
                  : regime === 'CONVECTIVE'
                  ? 'Severe Convective Thunderstorm'
                  : 'Standard Weather Operational Level'}
              </div>
            </div>
          </div>

          <span className="text-xs font-mono font-black px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-300">
            {snapshot.riskLevel}
          </span>
        </div>

        <p className="text-xs text-slate-700 mt-3 leading-relaxed">
          {snapshot.headlineSummary}
        </p>
      </div>

      {/* Multi-Hazard Risk Cards */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between px-1">
          <span>Hazard Vulnerability Matrix</span>
          <span className="text-[10px] font-mono font-semibold text-slate-500">IMD Thresholds</span>
        </div>

        {extremeHazards.map((hazard) => (
          <div
            key={hazard.id}
            className="glass-card rounded-2xl p-4 transition-all glass-card-hover space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  {getHazardIcon(hazard.iconName)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{hazard.hazardName}</h4>
                  <div className="text-[10px] font-mono text-slate-500">{hazard.currentMetric}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black font-mono text-slate-900">{hazard.riskPercentage}%</span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold border ${getSeverityBadge(
                    hazard.severityLevel
                  )}`}
                >
                  {hazard.severityLevel}
                </span>
              </div>
            </div>

            {/* Risk Gauge Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${hazard.riskPercentage}%`,
                  backgroundColor:
                    hazard.severityLevel === 'CRITICAL' || hazard.severityLevel === 'HIGH'
                      ? '#e11d48'
                      : hazard.severityLevel === 'MODERATE'
                      ? '#d97706'
                      : '#10b981'
                }}
              ></div>
            </div>

            {/* Impact & Action Advisory */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="text-slate-700 text-[11px] leading-snug">
                <span className="font-semibold text-slate-900">Impact: </span>
                {hazard.impactDescription}
              </div>
              <div className="text-sky-900 bg-sky-50/70 p-2.5 rounded-xl border border-sky-200 text-[11px] leading-snug flex items-start gap-2">
                <BellRing className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sky-600" />
                <span>
                  <strong className="text-sky-950 font-bold">Advisory: </strong>
                  {hazard.actionableAdvisory}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Early Warning Trigger Timeline */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-sky-600" />
          Early Warning Lead Time Protocol
        </h3>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 font-semibold">72h Out</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">Watch</div>
            <div className="text-[9px] text-slate-500 mt-1">Ensemble Scan</div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
            <div className="text-[10px] font-mono text-amber-700 font-semibold">48h Out</div>
            <div className="text-xs font-bold text-amber-800 mt-0.5">Alert</div>
            <div className="text-[9px] text-amber-700/80 mt-1">NWP Consensus</div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
            <div className="text-[10px] font-mono text-rose-700 font-semibold">24h Out</div>
            <div className="text-xs font-bold text-rose-800 mt-0.5">Warning</div>
            <div className="text-[9px] text-rose-700/80 mt-1">WRF Physics</div>
          </div>

          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-300">
            <div className="text-[10px] font-mono text-sky-700 font-semibold">0–6h</div>
            <div className="text-xs font-bold text-sky-900 mt-0.5">Nowcast</div>
            <div className="text-[9px] text-sky-700 mt-1">AI Radar Fusion</div>
          </div>
        </div>
      </div>
    </div>
  );
};
