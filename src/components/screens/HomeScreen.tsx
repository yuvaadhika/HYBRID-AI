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
          <div className="text-[11px] font-mono font-bold tracking-wider text-sky-700 uppercase">
            {t('subTitle')}
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">
            {location.name}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {location.state} • {leadTime} {t('leadHorizon')}
          </p>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Sync</span>
          </div>
        </div>
      </div>

      {/* Hero Blended Weather Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50/90 via-blue-50/60 to-white border border-sky-200 p-5 shadow-sm">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold">
              <CloudRain className="w-3.5 h-3.5 text-sky-700" />
              <span>{t('rainfallPrediction')}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">{leadTime}</span>
          </div>

          {/* Primary Metric */}
          <div className="my-4 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-slate-950 tracking-tight font-['Outfit']">
                  {blendedRainfall}
                </span>
                <span className="text-xl font-bold text-sky-700">mm</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <span>{t('uncertaintyEnvelope')}:</span>
                <span className="font-mono text-slate-800 font-bold">
                  {Math.round(blendedRainfall * 0.82)} – {Math.round(blendedRainfall * 1.24)} mm
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-sky-200 shadow-sm">
              <CloudRain className="w-8 h-8 text-sky-600 animate-bounce" style={{ animationDuration: '3s' }} />
              <span className="text-[10px] font-bold text-sky-800 mt-1 uppercase tracking-wider">
                {regime.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Secondary Metric Strips */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200/80">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-slate-200 shadow-2xs">
              <Thermometer className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">{t('temp')}</div>
                <div className="text-sm font-bold text-slate-800">{blendedTemp}°C</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-slate-200 shadow-2xs">
              <Wind className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">{t('wind')}</div>
                <div className="text-sm font-bold text-slate-800">{blendedWind} <span className="text-[10px] font-normal">km/h</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-slate-200 shadow-2xs">
              <Droplets className="w-4 h-4 text-cyan-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">{t('humidity')}</div>
                <div className="text-sm font-bold text-slate-800">{blendedHumidity}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence & Model Agreement */}
      <div className="grid grid-cols-2 gap-3">
        {/* Confidence */}
        <div className="glass-card p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t('confidence')}
            </span>
            <span className="text-xs font-bold font-mono text-emerald-700">{confidenceScore}%</span>
          </div>

          <div className="my-2.5">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center justify-between font-medium">
            <span className="text-emerald-700">{t('highConfidence')}</span>
            <span>±{snapshot.explainability.rmseComparison.find((m) => m.isBlended)?.rmse}mm</span>
          </div>
        </div>

        {/* Model Agreement */}
        <div className="glass-card p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5 text-sky-600" />
              {t('agreement')}
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                agreementLevel === 'HIGH'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : agreementLevel === 'MODERATE'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {agreementLevel}
            </span>
          </div>

          <div className="my-2 flex items-center justify-between">
            <div className="text-[11px] text-slate-700">
              <span className="font-bold text-slate-900">4 / 4</span> {t('modelsConverged')}
            </div>
            <span className="text-[10px] font-mono text-slate-500">σ = {snapshot.agreementVariance}</span>
          </div>

          <div className="text-[10px] text-slate-500 truncate">
            {agreementLevel === 'HIGH'
              ? 'Low variance across NWP & AI'
              : 'Ensemble dampens spread'}
          </div>
        </div>
      </div>

      {/* Model Weight Contribution Strip */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('dynamicModelContribution')}
            </h3>
          </div>
          <button
            onClick={() => onNavigate('blend')}
            className="text-[11px] text-sky-700 hover:text-sky-900 flex items-center gap-1 font-bold"
          >
            {t('viewDetails')} <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Stacked Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 p-0.5 gap-0.5 border border-slate-200">
          {models.map((m) => (
            <div
              key={m.id}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
              style={{ width: `${m.weight}%`, backgroundColor: m.color }}
              title={`${m.name}: ${m.weight}%`}
            ></div>
          ))}
        </div>

        {/* Individual Pills */}
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          {models.map((m) => (
            <div key={m.id} className="text-center p-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-semibold text-slate-500 truncate">{m.id}</div>
              <div className="text-xs font-bold font-mono text-slate-900">{m.weight}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Extreme Weather Risk Banner */}
      {topHazard && (
        <div
          onClick={() => onNavigate('alerts')}
          className={`cursor-pointer rounded-2xl p-3.5 border transition-all flex items-center justify-between shadow-xs ${
            topHazard.severityLevel === 'CRITICAL' || topHazard.severityLevel === 'HIGH'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                topHazard.severityLevel === 'CRITICAL' || topHazard.severityLevel === 'HIGH'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{topHazard.hazardName}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-200/80 text-rose-900 font-bold">
                  {topHazard.riskPercentage}% RISK
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{topHazard.thresholdWarning}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        </div>
      )}

      {/* Explainable AI Teaser */}
      <div className="glass-card p-4 border-purple-200 bg-gradient-to-r from-purple-50/50 to-sky-50/50">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-slate-900">{t('whyThisForecast')}</div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              {snapshot.explainability.summaryReason}
            </p>
            <button
              onClick={() => onNavigate('insights')}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900"
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
