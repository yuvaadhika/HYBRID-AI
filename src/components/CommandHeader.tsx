import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Search,
  MapPin,
  RefreshCw,
  Zap,
  CloudRain,
  Sun,
  CloudLightning,
  AlertTriangle,
  Globe,
  Sliders,
  Sparkles,
  Layers,
  Map,
  ShieldAlert,
  Radio,
  ChevronDown
} from 'lucide-react';
import { WeatherRegime, LocationOption } from '../types/weather';
import { searchCities, GeocodingResult } from '../services/liveWeatherService';

export type ActiveView = 'dashboard' | 'forecast' | 'blend' | 'map' | 'alerts' | 'explain';

interface CommandHeaderProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  currentLocation: LocationOption;
  onSelectLocation: (loc: LocationOption) => void;
  currentRegime: WeatherRegime;
  onSelectRegime: (regime: WeatherRegime) => void;
  isAutoRegime: boolean;
  onToggleAutoRegime: () => void;
  isLoadingLive: boolean;
  onRefreshLive: () => void;
  lastUpdated: string;
  onUseGPS: () => void;
  isLiveMode: boolean;
}

const REGIME_META: Record<
  WeatherRegime,
  { label: string; icon: React.ReactNode; badgeClass: string; desc: string }
> = {
  NORMAL: {
    label: 'Normal Regime',
    icon: <Sun className="w-3.5 h-3.5 text-amber-300" />,
    badgeClass: 'bg-amber-500/10 text-amber-200 border-amber-500/20',
    desc: 'Quiescent synoptic conditions'
  },
  CONVECTIVE: {
    label: 'Convective Storm',
    icon: <CloudLightning className="w-3.5 h-3.5 text-purple-300" />,
    badgeClass: 'bg-purple-500/10 text-purple-200 border-purple-500/20',
    desc: 'Localized updrafts & lightning'
  },
  MONSOON: {
    label: 'Monsoon Depr.',
    icon: <CloudRain className="w-3.5 h-3.5 text-sky-300" />,
    badgeClass: 'bg-sky-500/10 text-sky-200 border-sky-500/20',
    desc: 'Widespread orographic precipitation'
  },
  HEAVY_RAIN: {
    label: 'Heavy Rain Band',
    icon: <CloudRain className="w-3.5 h-3.5 text-blue-300" />,
    badgeClass: 'bg-blue-500/15 text-blue-200 border-blue-500/30',
    desc: 'Intense mesoscale rain bands'
  },
  EXTREME: {
    label: 'Extreme Cyclonic',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />,
    badgeClass: 'bg-rose-500/15 text-rose-200 border-rose-500/30',
    desc: 'High-impact cyclonic squall event'
  }
};

export const CommandHeader: React.FC<CommandHeaderProps> = ({
  activeView,
  onSelectView,
  currentLocation,
  onSelectLocation,
  currentRegime,
  onSelectRegime,
  isAutoRegime,
  onToggleAutoRegime,
  isLoadingLive,
  onRefreshLive,
  lastUpdated,
  onUseGPS
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showRegimeMenu, setShowRegimeMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchCities(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setShowSearchDropdown(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const regimeInfo = REGIME_META[currentRegime];

  const navTabs: { id: ActiveView; label: string; icon: React.ReactNode; isHero?: boolean }[] = [
    { id: 'dashboard', label: 'Operational Console', icon: <Activity className="w-4 h-4" /> },
    { id: 'forecast', label: 'Multi-Model Forecast', icon: <Layers className="w-4 h-4" /> },
    { id: 'blend', label: 'AI Blending Engine', icon: <Sliders className="w-4 h-4" />, isHero: true },
    { id: 'map', label: 'Spatial Skill Radar', icon: <Map className="w-4 h-4" /> },
    { id: 'alerts', label: 'Early Warning Radar', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'explain', label: 'Explainable AI', icon: <Sparkles className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0e1424]/90 backdrop-blur-xl border-b border-slate-800 shadow-sm">
      {/* Top Banner: Status & Search */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Logo & Live Status */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 shadow-sm">
                <Activity className="w-4 h-4 text-sky-400" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-white font-['Outfit']">
                    HYBRID<span className="text-sky-400">CAST</span> <span className="text-slate-400 font-medium">AI</span>
                  </span>
                  <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    ADAPTIVE V2.4
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-emerald-400/90 font-medium">
                    <Radio className="w-2.5 h-2.5" />
                    Live Data Stream
                  </span>
                  <span>•</span>
                  <span>Synced {lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={onRefreshLive}
                disabled={isLoadingLive}
                className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search Any City & GPS Controls */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            {/* Live Search Bar */}
            <div ref={searchRef} className="relative flex-1 lg:w-72">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search city (e.g. Chennai, Delhi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowSearchDropdown(true);
                  }}
                  className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-all"
                />
                {isSearching && (
                  <RefreshCw className="absolute right-3 w-3 h-3 text-slate-400 animate-spin" />
                )}
              </div>

              {/* Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-[#131b2e] border border-slate-700 shadow-xl p-1.5 z-50 max-h-64 overflow-y-auto">
                  <div className="px-2.5 py-1 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Stations
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {searchResults.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          onSelectLocation({
                            id: city.name.toLowerCase().replace(/\s+/g, '_'),
                            name: city.name,
                            state: city.admin1 || city.country || 'Region',
                            lat: city.latitude,
                            lon: city.longitude,
                            defaultRegime: 'NORMAL',
                            elevation: city.elevation ? `${city.elevation}m` : 'Sea Level',
                            climateZone: 'Real-Time Coordinates'
                          });
                          setSearchQuery('');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs hover:bg-slate-800 transition-all text-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-sky-400" />
                          <div>
                            <span className="font-semibold text-white">{city.name}</span>
                            <span className="text-[11px] text-slate-400 ml-1.5">
                              {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {city.latitude.toFixed(1)}°, {city.longitude.toFixed(1)}°
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* GPS Button */}
            <button
              onClick={onUseGPS}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all shrink-0"
              title="Detect Live GPS Weather"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">My GPS</span>
            </button>

            {/* Sync Button */}
            <button
              onClick={onRefreshLive}
              disabled={isLoadingLive}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-sky-300 hover:text-white transition-all shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingLive ? 'animate-spin' : ''}`} />
              <span>{isLoadingLive ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>

          {/* Location & Regime Controller */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <div className="text-left">
                <div className="text-xs font-semibold text-white truncate max-w-[110px] sm:max-w-[150px]">
                  {currentLocation.name}
                </div>
                <div className="text-[10px] text-slate-400">{currentLocation.state}</div>
              </div>
            </div>

            {/* Regime Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRegimeMenu(!showRegimeMenu)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${regimeInfo.badgeClass}`}
              >
                {regimeInfo.icon}
                <span>{regimeInfo.label.split(' ')[0]}</span>
                {isAutoRegime && (
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-800 text-slate-300 rounded">
                    AUTO
                  </span>
                )}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showRegimeMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#131b2e] border border-slate-700 shadow-xl p-2 z-50">
                  <div className="flex items-center justify-between px-2 py-1 border-b border-slate-800 text-xs font-semibold text-slate-300">
                    <span>Regime Mode</span>
                    <button
                      onClick={onToggleAutoRegime}
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-semibold transition-all ${
                        isAutoRegime ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isAutoRegime ? 'AUTO' : 'MANUAL'}
                    </button>
                  </div>
                  <div className="mt-1 space-y-0.5">
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
                          className={`w-full flex items-start gap-2 p-2 rounded-xl text-left transition-all ${
                            isSelected ? 'bg-slate-800 border border-slate-700 text-white' : 'hover:bg-slate-800/60 text-slate-300'
                          }`}
                        >
                          <div className="mt-0.5">{item.icon}</div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-white flex items-center justify-between">
                              {item.label}
                              {isSelected && <span className="text-[9px] font-mono text-sky-400">ACTIVE</span>}
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
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#0a0f1d] border-t border-slate-800/80 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1 py-1.5">
          {navTabs.map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectView(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-sky-300 border border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
