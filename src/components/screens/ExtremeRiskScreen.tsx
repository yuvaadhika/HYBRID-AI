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
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { ForecastSnapshot } from '../../types/weather';

interface ExtremeRiskScreenProps {
  snapshot: ForecastSnapshot;
}

export const ExtremeRiskScreen: React.FC<ExtremeRiskScreenProps> = ({ snapshot }) => {
  const { extremeHazards, location, leadTime, regime } = snapshot;

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

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/25 text-rose-300 border-rose-500/40 animate-pulse';
      case 'HIGH':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold tracking-wider text-rose-400 uppercase">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Early Warning Radar</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
          Extreme Weather Risk
        </h2>
        <p className="text-xs text-slate-400">
          Multi-hazard threat detection & early warning guidance for {location.name}
        </p>
      </div>

      {/* Overall Risk Headline Banner */}
      <div className="rounded-3xl p-5 bg-gradient-to-r from-rose-950/50 via-slate-900/90 to-amber-950/30 border border-rose-500/40 shadow-xl rose-glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-rose-300 uppercase font-bold tracking-wider">
                Active Weather Advisory
              </div>
              <div className="text-lg font-extrabold text-white font-['Outfit']">
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

          <span className="text-xs font-mono font-black px-2.5 py-1 rounded-xl bg-rose-500/30 text-rose-200 border border-rose-400/50">
            {snapshot.riskLevel}
          </span>
        </div>

        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          {snapshot.headlineSummary}
        </p>
      </div>

      {/* Multi-Hazard Risk Cards */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between px-1">
          <span>Hazard Vulnerability Matrix</span>
          <span className="text-[10px] font-mono text-slate-400">IMD Thresholds</span>
        </div>

        {extremeHazards.map((hazard) => (
          <div
            key={hazard.id}
            className="glass-card rounded-2xl p-4 transition-all glass-card-hover space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-800/90 border border-white/5">
                  {getHazardIcon(hazard.iconName)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{hazard.hazardName}</h4>
                  <div className="text-[10px] font-mono text-slate-400">{hazard.currentMetric}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black font-mono text-white">{hazard.riskPercentage}%</span>
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
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${hazard.riskPercentage}%`,
                  backgroundColor:
                    hazard.severityLevel === 'CRITICAL' || hazard.severityLevel === 'HIGH'
                      ? '#f43f5e'
                      : hazard.severityLevel === 'MODERATE'
                      ? '#f59e0b'
                      : '#10b981'
                }}
              ></div>
            </div>

            {/* Impact & Action Advisory */}
            <div className="pt-2 border-t border-white/5 space-y-1 text-xs">
              <div className="text-slate-300 text-[11px] leading-snug">
                <span className="font-semibold text-slate-400">Impact: </span>
                {hazard.impactDescription}
              </div>
              <div className="text-sky-300 text-[11px] leading-snug flex items-start gap-1">
                <BellRing className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sky-400" />
                <span>
                  <strong className="text-sky-200">Advisory: </strong>
                  {hazard.actionableAdvisory}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Early Warning Trigger Timeline */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-sky-400" />
          Early Warning Lead Time Protocol
        </h3>

        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="text-[10px] font-mono text-slate-400">72h Out</div>
            <div className="text-xs font-bold text-slate-200 mt-0.5">Watch</div>
            <div className="text-[9px] text-slate-500 mt-1">Ensemble Scan</div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="text-[10px] font-mono text-slate-400">48h Out</div>
            <div className="text-xs font-bold text-amber-400 mt-0.5">Alert</div>
            <div className="text-[9px] text-slate-500 mt-1">NWP Consensus</div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5">
            <div className="text-[10px] font-mono text-slate-400">24h Out</div>
            <div className="text-xs font-bold text-rose-400 mt-0.5">Warning</div>
            <div className="text-[9px] text-slate-500 mt-1">WRF Microphysics</div>
          </div>

          <div className="p-2 rounded-xl bg-sky-950/40 border border-sky-400/30">
            <div className="text-[10px] font-mono text-sky-400">0–6h</div>
            <div className="text-xs font-bold text-sky-300 mt-0.5">Nowcast</div>
            <div className="text-[9px] text-sky-400/70 mt-1">AI Radar Fusion</div>
          </div>
        </div>
      </div>
    </div>
  );
};
