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
  CheckCircle2,
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
    icon: <Sun className="w-4 h-4 text-amber-400" />,
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    desc: 'Quiescent synoptic conditions'
  },
  CONVECTIVE: {
    label: 'Convective Storm',
    icon: <CloudLightning className="w-4 h-4 text-purple-400" />,
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
    desc: 'Localized updrafts & lightning'
  },
  MONSOON: {
    label: 'Monsoon Depr.',
    icon: <CloudRain className="w-4 h-4 text-sky-400" />,
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
    desc: 'Widespread orographic precipitation'
  },
  HEAVY_RAIN: {
    label: 'Heavy Rain Band',
    icon: <CloudRain className="w-4 h-4 text-blue-400" />,
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    desc: 'Intense mesoscale rain bands'
  },
  EXTREME: {
    label: 'Extreme Cyclonic',
    icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]',
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
  onUseGPS,
  isLiveMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showRegimeMenu, setShowRegimeMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced live city search
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

  // Close search dropdown when clicking outside
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
    <header className="sticky top-0 z-50 w-full bg-[#040813]/95 backdrop-blur-2xl border-b border-sky-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      {/* Top Banner: Status & Search */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Logo & Live Stream Status */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-blue-700 p-0.5 shadow-[0_0_25px_rgba(56,189,248,0.5)]">
                <div className="w-full h-full rounded-[10px] bg-[#060b18] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-sky-400 animate-pulse" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white font-['Outfit']">
                    HYBRID<span className="text-sky-400">CAST</span> <span className="text-cyan-400">AI</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    OPERATIONAL V2.4
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-semibold text-[11px]">
                    <Radio className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                    LIVE OPEN-METEO & NWP STREAM
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
                className="p-2 rounded-xl bg-slate-800 border border-white/10 text-sky-400 hover:text-white"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLive ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search Any City & GPS Controls */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            {/* Live Search Bar */}
            <div ref={searchRef} className="relative flex-1 lg:w-80">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-sky-400" />
                <input
                  type="text"
                  placeholder="Search any city (e.g. Chennai, Delhi, London)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowSearchDropdown(true);
                  }}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900/90 border border-sky-500/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-inner"
                />
                {isSearching && (
                  <RefreshCw className="absolute right-3 w-3.5 h-3.5 text-sky-400 animate-spin" />
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-[#0b1329] border border-sky-500/30 shadow-2xl p-1.5 z-50 max-h-72 overflow-y-auto backdrop-blur-xl">
                  <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider border-b border-white/10">
                    Live Geocoding Stations
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
                            climateZone: 'Real-Time Dynamic Coordinates'
                          });
                          setSearchQuery('');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs hover:bg-sky-500/20 transition-all text-slate-200 group"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="font-bold text-white">{city.name}</span>
                            <span className="text-[11px] text-slate-400 ml-1.5">
                              {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* GPS Location Button */}
            <button
              onClick={onUseGPS}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-sky-950/60 border border-sky-500/30 text-xs font-semibold text-sky-300 hover:text-white transition-all shadow-sm shrink-0"
              title="Detect Live GPS Weather"
            >
              <MapPin className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">My GPS</span>
            </button>

            {/* Live Refresh Button */}
            <button
              onClick={onRefreshLive}
              disabled={isLoadingLive}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-xs font-bold text-white transition-all shadow-lg shadow-sky-600/30 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
              <span>{isLoadingLive ? 'Syncing...' : 'Sync Live'}</span>
            </button>
          </div>

          {/* Regime Controller & Station Display */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {/* Active Station Display */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10">
              <Globe className="w-4 h-4 text-sky-400" />
              <div className="text-left">
                <div className="text-xs font-bold text-white truncate max-w-[120px] sm:max-w-[160px]">
                  {currentLocation.name}
                </div>
                <div className="text-[10px] text-slate-400">{currentLocation.state}</div>
              </div>
            </div>

            {/* Regime Badge & Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRegimeMenu(!showRegimeMenu)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${regimeInfo.badgeClass}`}
              >
                {regimeInfo.icon}
                <span>{regimeInfo.label}</span>
                {isAutoRegime && (
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-sky-400/20 text-sky-200 rounded font-bold">
                    AUTO
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showRegimeMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0b1329] border border-sky-500/30 shadow-2xl p-2 z-50 backdrop-blur-xl">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/10 text-xs font-bold text-slate-300">
                    <span>Weather Regime Classifier</span>
                    <button
                      onClick={onToggleAutoRegime}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold transition-all ${
                        isAutoRegime ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isAutoRegime ? 'AUTO (Active)' : 'MANUAL'}
                    </button>
                  </div>
                  <div className="mt-1.5 space-y-1">
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
                          className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all ${
                            isSelected ? 'bg-sky-500/20 border border-sky-500/40 text-white' : 'hover:bg-white/5 text-slate-300'
                          }`}
                        >
                          <div className="mt-0.5">{item.icon}</div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-white flex items-center justify-between">
                              {item.label}
                              {isSelected && <span className="text-[10px] font-mono text-sky-400 font-bold">ACTIVE</span>}
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

      {/* Main Navigation Bar */}
      <div className="bg-[#030712]/90 border-t border-white/5 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 py-1.5">
          {navTabs.map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectView(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? tab.isHero
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 shadow-lg shadow-sky-500/30'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
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
