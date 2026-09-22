import React from 'react';
import {
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Cpu,
  BarChart2,
  AlertTriangle
} from 'lucide-react';
import { ForecastSnapshot } from '../../types/weather';
import { TabType } from '../BottomNav';
import { SupportedLanguage, getTranslation } from '../../services/i18n';

interface HomeScreenProps {
  snapshot: ForecastSnapshot;
  onNavigate: (tab: TabType) => void;
  currentLanguage?: SupportedLanguage;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ snapshot, onNavigate, currentLanguage = 'en' }) => {
  const { location, leadTime, regime, blendedRainfall, blendedTemp, blendedWind, blendedHumidity, confidenceScore, agreementLevel, models, extremeHazards } = snapshot;

  const t = (key: string) => getTranslation(currentLanguage, key);
  const topHazard = extremeHazards.find((h) => h.severityLevel === 'HIGH' || h.severityLevel === 'CRITICAL') || extremeHazards[0];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Location & Time Headline */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono font-bold tracking-wider text-sky-400 uppercase">
            {t('subTitle')}
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
            {location.name}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {location.state} • {leadTime} {t('leadHorizon')}
          </p>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111e38] border border-sky-500/20 text-[11px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Sync</span>
          </div>
        </div>
      </div>

      {/* Hero Blended Weather Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111e38]/95 via-[#0e1930]/95 to-[#091122]/98 border border-sky-500/25 p-5 shadow-2xl radar-glow">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-semibold">
              <CloudRain className="w-3.5 h-3.5" />
              <span>{t('rainfallPrediction')}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">{leadTime}</span>
          </div>

          {/* Primary Metric */}
          <div className="my-4 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-white tracking-tight font-['Outfit']">
                  {blendedRainfall}
                </span>
                <span className="text-xl font-bold text-sky-400">mm</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>{t('uncertaintyEnvelope')}:</span>
                <span className="font-mono text-slate-300 font-semibold">
                  {Math.round(blendedRainfall * 0.82)} – {Math.round(blendedRainfall * 1.24)} mm
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-500/10 border border-sky-400/20">
              <CloudRain className="w-8 h-8 text-sky-400 animate-bounce" style={{ animationDuration: '3s' }} />
              <span className="text-[10px] font-semibold text-sky-300 mt-1 uppercase tracking-wider">
                {regime.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Secondary Metric Strips */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.08]">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#091122]/80 border border-white/5">
              <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">{t('temp')}</div>
                <div className="text-sm font-bold text-slate-100">{blendedTemp}°C</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#091122]/80 border border-white/5">
              <Wind className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">{t('wind')}</div>
                <div className="text-sm font-bold text-slate-100">{blendedWind} <span className="text-[10px]">km/h</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#091122]/80 border border-white/5">
              <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">{t('humidity')}</div>
                <div className="text-sm font-bold text-slate-100">{blendedHumidity}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence & Model Agreement */}
      <div className="grid grid-cols-2 gap-3">
        {/* Confidence */}
        <div className="glass-card rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {t('confidence')}
            </span>
            <span className="text-xs font-bold font-mono text-emerald-400">{confidenceScore}%</span>
          </div>

          <div className="my-2.5">
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden p-0.5 border border-white/5">
              <div
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-emerald-300">{t('highConfidence')}</span>
            <span>±{snapshot.explainability.rmseComparison.find((m) => m.isBlended)?.rmse}mm</span>
          </div>
        </div>

        {/* Model Agreement */}
        <div className="glass-card rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
              {t('agreement')}
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                agreementLevel === 'HIGH'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : agreementLevel === 'MODERATE'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {agreementLevel}
            </span>
          </div>

          <div className="my-2 flex items-center justify-between">
            <div className="text-[11px] text-slate-300">
              <span className="font-bold text-white">4 / 4</span> {t('modelsConverged')}
            </div>
            <span className="text-[10px] font-mono text-slate-400">σ = {snapshot.agreementVariance}</span>
          </div>

          <div className="text-[10px] text-slate-400 truncate">
            {agreementLevel === 'HIGH'
              ? 'Low variance across NWP & AI'
              : 'Ensemble dampens spread'}
          </div>
        </div>
      </div>

      {/* Model Weight Contribution Strip */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {t('dynamicModelContribution')}
            </h3>
          </div>
          <button
            onClick={() => onNavigate('blend')}
            className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
          >
            {t('viewDetails')} <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-900 p-0.5 gap-0.5 border border-white/5">
          {models.map((m) => (
            <div
              key={m.id}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
              style={{ width: `${m.weight}%`, backgroundColor: m.color }}
              title={`${m.name}: ${m.weight}%`}
            ></div>
          ))}
        </div>

        {/* Individual model pill stats */}
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          {models.map((m) => (
            <div key={m.id} className="text-center p-1.5 rounded-xl bg-[#091122]/70 border border-white/5">
              <div className="text-[10px] font-semibold text-slate-400 truncate">{m.id}</div>
              <div className="text-xs font-bold font-mono text-slate-100">{m.weight}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Extreme Weather Risk Banner */}
      {topHazard && (
        <div
          onClick={() => onNavigate('alerts')}
          className={`cursor-pointer rounded-2xl p-3.5 border transition-all glass-card-hover flex items-center justify-between ${
            topHazard.severityLevel === 'CRITICAL' || topHazard.severityLevel === 'HIGH'
              ? 'bg-rose-950/30 border-rose-500/30'
              : 'bg-amber-950/25 border-amber-500/25'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                topHazard.severityLevel === 'CRITICAL' || topHazard.severityLevel === 'HIGH'
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{topHazard.hazardName}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 font-bold">
                  {topHazard.riskPercentage}% RISK
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{topHazard.thresholdWarning}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        </div>
      )}

      {/* Explainable AI Teaser */}
      <div className="glass-card rounded-2xl p-4 border-sky-500/20 bg-gradient-to-r from-sky-950/20 to-purple-950/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-slate-200">{t('whyThisForecast')}</div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              {snapshot.explainability.summaryReason}
            </p>
            <button
              onClick={() => onNavigate('insights')}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
            >
              <span>{t('viewDetails')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
