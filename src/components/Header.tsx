import React, { useState } from 'react';
import {
  MapPin,
  ChevronDown,
  Activity,
  CloudRain,
  Sun,
  CloudLightning,
  AlertTriangle,
  Languages,
  Navigation,
  RefreshCw,
  Globe
} from 'lucide-react';
import { LocationOption, WeatherRegime } from '../types/weather';
import { INDIAN_LOCATIONS } from '../services/blendingEngine';
import { SupportedLanguage, LANGUAGES, getTranslation } from '../services/i18n';

interface HeaderProps {
  currentLocation: LocationOption;
  onSelectLocation: (loc: LocationOption) => void;
  currentRegime: WeatherRegime;
  onSelectRegime: (regime: WeatherRegime) => void;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onDetectGPS: () => void;
  isLocatingGPS: boolean;
  lastUpdated: string;
}

const REGIME_META: Record<
  WeatherRegime,
  { key: string; icon: React.ReactNode; badgeClass: string; desc: string }
> = {
  NORMAL: {
    key: 'normal',
    icon: <Sun className="w-3.5 h-3.5 text-amber-400" />,
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    desc: 'Quiescent synoptic conditions'
  },
  CONVECTIVE: {
    key: 'convective',
    icon: <CloudLightning className="w-3.5 h-3.5 text-purple-400" />,
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    desc: 'Localized updrafts & lightning'
  },
  MONSOON: {
    key: 'monsoon',
    icon: <CloudRain className="w-3.5 h-3.5 text-sky-400" />,
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    desc: 'Widespread orographic precipitation'
  },
  HEAVY_RAIN: {
    key: 'heavyRain',
    icon: <CloudRain className="w-3.5 h-3.5 text-blue-400" />,
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    desc: 'Intense mesoscale rain bands'
  },
  EXTREME: {
    key: 'extreme',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse',
    desc: 'High-impact cyclonic squall event'
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  currentRegime,
  onSelectRegime,
  currentLanguage,
  onSelectLanguage,
  onDetectGPS,
  isLocatingGPS,
  lastUpdated
}) => {
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showRegimeMenu, setShowRegimeMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const t = (key: string) => getTranslation(currentLanguage, key);
  const regimeInfo = REGIME_META[currentRegime];
  const activeLang = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b1326]/95 backdrop-blur-xl border-b border-sky-500/15 px-3 sm:px-4 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Brand & Live Pulse */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/30 border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.2)] shrink-0">
            <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white font-['Outfit']">
                HYBRID<span className="text-sky-400">CAST</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold tracking-wider">
                AI–NWP
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{t('updated')} {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          
          {/* 10-Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLanguageMenu(!showLanguageMenu);
                setShowLocationMenu(false);
                setShowRegimeMenu(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold text-slate-200 transition-all"
              title="Change Language"
            >
              <span className="text-xs">{activeLang.flag}</span>
              <span className="hidden sm:inline text-[11px] font-mono">{activeLang.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0e1830] border border-sky-500/20 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 max-h-80 overflow-y-auto">
                <div className="px-2.5 py-1 text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider border-b border-white/5">
                  10 Languages
                </div>
                <div className="mt-1 space-y-0.5">
                  {LANGUAGES.map((lang) => {
                    const isSelected = lang.code === currentLanguage;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onSelectLanguage(lang.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                          isSelected
                            ? 'bg-sky-500/20 text-sky-300 font-bold'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">({lang.name})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Real GPS Location Button */}
          <button
            onClick={onDetectGPS}
            disabled={isLocatingGPS}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all shadow-sm ${
              isLocatingGPS
                ? 'bg-sky-500/20 border-sky-400/40 text-sky-300'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/80 text-sky-300 hover:text-white'
            }`}
            title={t('detectMyGPS')}
          >
            {isLocatingGPS ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
            )}
            <span className="hidden sm:inline">{isLocatingGPS ? t('detectingLocation') : 'GPS'}</span>
          </button>

          {/* Weather Regime Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRegimeMenu(!showRegimeMenu);
                setShowLocationMenu(false);
                setShowLanguageMenu(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${regimeInfo.badgeClass}`}
              title={t('selectRegime')}
            >
              {regimeInfo.icon}
              <span className="hidden sm:inline font-bold">{t(regimeInfo.key)}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showRegimeMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0e1830] border border-sky-500/20 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
                  {t('selectRegime')}
                </div>
                <div className="mt-1 space-y-1">
                  {(Object.keys(REGIME_META) as WeatherRegime[]).map((key) => {
                    const item = REGIME_META[key];
                    const isSelected = key === currentRegime;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onSelectRegime(key);
                          setShowRegimeMenu(false);
                        }}
                        className={`w-full flex items-start gap-2 px-2.5 py-2 rounded-xl text-left transition-all ${
                          isSelected ? 'bg-sky-500/20 border border-sky-500/40 text-white' : 'hover:bg-white/5 text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5">{item.icon}</div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-slate-100 flex items-center justify-between">
                            {t(item.key)}
                            {isSelected && <span className="text-[10px] text-sky-400 font-mono">ACTIVE</span>}
                          </div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Location Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLocationMenu(!showLocationMenu);
                setShowRegimeMenu(false);
                setShowLanguageMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-xs text-slate-200 transition-all font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span className="truncate max-w-[85px] sm:max-w-[120px] font-medium">{currentLocation.name}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showLocationMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0e1830] border border-sky-500/20 shadow-2xl p-1.5 z-50 max-h-72 overflow-y-auto">
                <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
                  {t('selectStation')}
                </div>
                <div className="mt-1 space-y-0.5">
                  {/* GPS Option */}
                  <button
                    onClick={() => {
                      onDetectGPS();
                      setShowLocationMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold mb-1 hover:bg-sky-500/25 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                    <span>{t('detectMyGPS')}</span>
                  </button>

                  {INDIAN_LOCATIONS.map((loc) => {
                    const isSelected = loc.id === currentLocation.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => {
                          onSelectLocation(loc);
                          setShowLocationMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-all ${
                          isSelected ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-white">{loc.name}</div>
                          <div className="text-[10px] text-slate-400">{loc.state}</div>
                        </div>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
