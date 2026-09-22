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
  RefreshCw
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
    icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    desc: 'Quiescent synoptic conditions'
  },
  CONVECTIVE: {
    key: 'convective',
    icon: <CloudLightning className="w-3.5 h-3.5 text-purple-600" />,
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    desc: 'Localized updrafts & lightning'
  },
  MONSOON: {
    key: 'monsoon',
    icon: <CloudRain className="w-3.5 h-3.5 text-sky-600" />,
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    desc: 'Widespread orographic precipitation'
  },
  HEAVY_RAIN: {
    key: 'heavyRain',
    icon: <CloudRain className="w-3.5 h-3.5 text-blue-600" />,
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    desc: 'Intense mesoscale rain bands'
  },
  EXTREME: {
    key: 'extreme',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse',
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/90 px-3 sm:px-4 py-2.5 shadow-sm transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Brand & Live Pulse */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 shadow-sm shrink-0">
            <Activity className="w-4 h-4 text-sky-600 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 font-['Outfit']">
                HYBRID<span className="text-sky-600">CAST</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 border border-sky-200 font-semibold tracking-wider">
                AI–NWP
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{t('updated')} {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          
          {/* 10-Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLanguageMenu(!showLanguageMenu);
                setShowLocationMenu(false);
                setShowRegimeMenu(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-all"
              title="Change Language"
            >
              <span className="text-xs">{activeLang.flag}</span>
              <span className="hidden sm:inline text-[11px] font-mono font-bold text-slate-800">{activeLang.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 max-h-80 overflow-y-auto">
                <div className="px-2.5 py-1 text-[10px] font-mono font-bold text-sky-700 uppercase tracking-wider border-b border-slate-100">
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
                            ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">({lang.name})</span>
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
                ? 'bg-sky-50 border-sky-300 text-sky-700'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-sky-700'
            }`}
            title={t('detectMyGPS')}
          >
            {isLocatingGPS ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
            )}
            <span className="hidden sm:inline font-bold">{isLocatingGPS ? t('detectingLocation') : 'GPS'}</span>
          </button>

          {/* Weather Regime Switcher */}
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
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
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
                          isSelected ? 'bg-sky-50 border border-sky-200 text-slate-900 font-medium' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="mt-0.5">{item.icon}</div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                            {t(item.key)}
                            {isSelected && <span className="text-[10px] text-sky-700 font-mono font-bold">ACTIVE</span>}
                          </div>
                          <div className="text-[10px] text-slate-500">{item.desc}</div>
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
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-800 transition-all font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span className="truncate max-w-[85px] sm:max-w-[120px] font-semibold">{currentLocation.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showLocationMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 max-h-72 overflow-y-auto">
                <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  {t('selectStation')}
                </div>
                <div className="mt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      onDetectGPS();
                      setShowLocationMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs bg-sky-50 border border-sky-200 text-sky-800 font-bold mb-1 hover:bg-sky-100 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
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
                          isSelected ? 'bg-sky-50 text-sky-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{loc.name}</div>
                          <div className="text-[10px] text-slate-500">{loc.state}</div>
                        </div>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>}
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
