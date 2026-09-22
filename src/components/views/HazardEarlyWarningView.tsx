import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CloudRain,
  Flame,
  Wind,
  Zap,
  BellRing,
  Clock,
  CheckCircle2,
  Radio
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
        return <CloudRain className="w-6 h-6 text-sky-400" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-400" />;
      case 'Wind':
        return <Wind className="w-6 h-6 text-purple-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>MoES & NDMA Disaster Early Warning Protocol</span>
        </div>
        <h2 className="text-3xl font-black text-white font-['Outfit'] tracking-tight">
          Multi-Hazard Threat & Vulnerability Radar
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Automated severe weather threshold monitoring for {location.name} station
        </p>
      </div>

      {/* Main Alert Headline Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-rose-950/60 via-slate-900/90 to-[#0c1427]/95 border border-rose-500/50 shadow-2xl rose-glow space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-rose-300 uppercase">
                Active Operational Weather Advisory
              </div>
              <h3 className="text-xl font-black text-white font-['Outfit']">
                {regime === 'EXTREME'
                  ? 'Severe Cyclonic Wind & Precipitation Surge Alert'
                  : regime === 'HEAVY_RAIN'
                  ? 'Intense Precipitation & Localized Waterlogging Watch'
                  : regime === 'CONVECTIVE'
                  ? 'Severe Convective Thunderstorm & Microburst Warning'
                  : 'Normal Operational Weather Status'}
              </h3>
            </div>
          </div>

          <span className="text-xs font-mono font-black px-3.5 py-1.5 rounded-xl bg-rose-500/30 text-rose-200 border border-rose-400/50">
            ADVISORY LEVEL: {snapshot.riskLevel}
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed max-w-4xl">
          {snapshot.headlineSummary} Multi-model ensemble consensus indicates elevated localized hazards requiring civic operational readiness.
        </p>
      </div>

      {/* Hazard Vulnerability Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {extremeHazards.map((hazard) => (
          <div
            key={hazard.id}
            className="rounded-3xl p-5 bg-[#0c1427]/95 border border-white/10 shadow-xl space-y-4 hover:border-sky-500/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-slate-900 border border-white/5">
                  {getHazardIcon(hazard.iconName)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{hazard.hazardName}</h4>
                  <div className="text-xs font-mono text-slate-400">{hazard.currentMetric}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black font-mono text-white">{hazard.riskPercentage}%</div>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-black ${
                    hazard.severityLevel === 'CRITICAL' || hazard.severityLevel === 'HIGH'
                      ? 'bg-rose-500/20 text-rose-300'
                      : hazard.severityLevel === 'MODERATE'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {hazard.severityLevel}
                </span>
              </div>
            </div>

            {/* Gauge Bar */}
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
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

            {/* Impact & Action */}
            <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
              <div className="text-slate-300">
                <strong className="text-slate-400">Potential Impact: </strong>
                {hazard.impactDescription}
              </div>
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-200 flex items-start gap-2">
                <BellRing className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sky-300">Actionable Protocol: </strong>
                  {hazard.actionableAdvisory}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Early Warning Lead Time Timeline */}
      <div className="rounded-3xl p-6 bg-[#0c1427]/95 border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Operational Early Warning Multi-Stage Protocol
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <div className="text-xs font-mono font-bold text-slate-400">72 Hours Prior</div>
            <div className="text-base font-black text-slate-200">Ensemble Watch</div>
            <p className="text-[11px] text-slate-400">Global dispersion scan & synoptic track tracking</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <div className="text-xs font-mono font-bold text-amber-400">48 Hours Prior</div>
            <div className="text-base font-black text-amber-300">Consensus Alert</div>
            <p className="text-[11px] text-slate-400">Multi-NWP model convergence verification</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <div className="text-xs font-mono font-bold text-rose-400">24 Hours Prior</div>
            <div className="text-base font-black text-rose-300">Action Warning</div>
            <p className="text-[11px] text-slate-400">WRF 3km high-res cloud microphysics targeting</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-400/40 space-y-1">
            <div className="text-xs font-mono font-bold text-sky-400">0–6 Hours (Nowcast)</div>
            <div className="text-base font-black text-sky-300">AI Radar Rapid Blend</div>
            <p className="text-[11px] text-sky-200/80">Real-time Doppler radar & lightning neural assimilation</p>
          </div>
        </div>
      </div>
    </div>
  );
};
