import React, { useState } from 'react';
import {
  MapPin,
  ChevronDown,
  Layers,
  Smartphone,
  Monitor,
  Activity,
  Zap,
  CloudRain,
  Sun,
  CloudLightning,
  AlertTriangle
} from 'lucide-react';
import { LocationOption, WeatherRegime } from '../types/weather';
import { INDIAN_LOCATIONS } from '../services/blendingEngine';

interface HeaderProps {
  currentLocation: LocationOption;
  onSelectLocation: (loc: LocationOption) => void;
  currentRegime: WeatherRegime;
  onSelectRegime: (regime: WeatherRegime) => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  lastUpdated: string;
}

const REGIME_META: Record<
  WeatherRegime,
  { label: string; icon: React.ReactNode; color: string; badgeClass: string; desc: string }
> = {
  NORMAL: {
    label: 'Normal Regime',
    icon: <Sun className="w-3.5 h-3.5 text-amber-400" />,
    color: '#f59e0b',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    desc: 'Quiescent synoptic conditions'
  },
  CONVECTIVE: {
    label: 'Convective Storm',
    icon: <CloudLightning className="w-3.5 h-3.5 text-purple-400" />,
    color: '#a855f7',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    desc: 'Localized updrafts & lightning'
  },
  MONSOON: {
    label: 'Monsoon Depr.',
    icon: <CloudRain className="w-3.5 h-3.5 text-sky-400" />,
    color: '#38bdf8',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    desc: 'Widespread orographic precipitation'
  },
  HEAVY_RAIN: {
    label: 'Heavy Rain Band',
    icon: <CloudRain className="w-3.5 h-3.5 text-blue-400" />,
    color: '#3b82f6',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    desc: 'Intense mesoscale rain bands'
  },
  EXTREME: {
    label: 'Extreme Cyclonic',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
    color: '#f43f5e',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse',
    desc: 'High-impact cyclonic squall event'
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  currentRegime,
  onSelectRegime,
  isMobileFrame,
  onToggleFrame,
  lastUpdated
}) => {
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showRegimeMenu, setShowRegimeMenu] = useState(false);

  const regimeInfo = REGIME_META[currentRegime];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080d1a]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Brand & Live Pulse */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-600/30 border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
            <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
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
              <span>Updated {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Weather Regime Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRegimeMenu(!showRegimeMenu);
                setShowLocationMenu(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${regimeInfo.badgeClass}`}
              title="Change Weather Regime"
            >
              {regimeInfo.icon}
              <span className="hidden sm:inline font-semibold">{regimeInfo.label.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showRegimeMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
                  Select Weather Regime
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
                        className={`w-full flex items-start gap-2 px-2.5 py-2 rounded-lg text-left transition-all ${
                          isSelected ? 'bg-sky-500/15 border border-sky-500/30' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="mt-0.5">{item.icon}</div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-slate-100 flex items-center justify-between">
                            {item.label}
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
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs text-slate-200 transition-all font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span className="truncate max-w-[85px] sm:max-w-[120px] font-medium">{currentLocation.name}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showLocationMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl p-1.5 z-50 max-h-72 overflow-y-auto">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
                  Select Weather Station
                </div>
                <div className="mt-1 space-y-0.5">
                  {INDIAN_LOCATIONS.map((loc) => {
                    const isSelected = loc.id === currentLocation.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => {
                          onSelectLocation(loc);
                          setShowLocationMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-all ${
                          isSelected ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div>{loc.name}</div>
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

          {/* Viewport Frame Toggle (Mobile Frame vs Full Width) */}
          <button
            onClick={onToggleFrame}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-white/10 text-slate-300 hover:text-sky-300 transition-all"
            title={isMobileFrame ? 'Switch to Full Screen View' : 'Switch to Mobile Phone Frame'}
          >
            {isMobileFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
