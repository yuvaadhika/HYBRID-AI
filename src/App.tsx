import React, { useState, useEffect, useMemo } from 'react';
import { CommandHeader, ActiveView } from './components/CommandHeader';
import { LiveDashboardView } from './components/views/LiveDashboardView';
import { MultiModelForecastView } from './components/views/MultiModelForecastView';
import { BlendingMatrixView } from './components/views/BlendingMatrixView';
import { SpatialSkillView } from './components/views/SpatialSkillView';
import { HazardEarlyWarningView } from './components/views/HazardEarlyWarningView';
import { ExplainableAIView } from './components/views/ExplainableAIView';
import { INDIAN_LOCATIONS, generateForecastSnapshot } from './services/blendingEngine';
import { fetchLiveWeather, LiveWeatherData } from './services/liveWeatherService';
import { LocationOption, LeadTime, WeatherRegime } from './types/weather';

export function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [currentLocation, setCurrentLocation] = useState<LocationOption>(INDIAN_LOCATIONS[0]); // Chennai
  const [currentLeadTime, setCurrentLeadTime] = useState<LeadTime>('24h');
  const [currentRegime, setCurrentRegime] = useState<WeatherRegime>(INDIAN_LOCATIONS[0].defaultRegime);
  const [isAutoRegime, setIsAutoRegime] = useState<boolean>(true);
  const [liveData, setLiveData] = useState<LiveWeatherData | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  // Fetch true live weather from Open-Meteo
  const loadLiveWeather = async (loc: LocationOption) => {
    setIsLoadingLive(true);
    try {
      const data = await fetchLiveWeather(loc.lat, loc.lon, loc.name, loc.state);
      setLiveData(data);
      if (isAutoRegime) {
        setCurrentRegime(data.detectedRegime);
      }
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Failed to fetch live weather, using blended simulation fallback:', err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  // On location change or mount, fetch real-time data
  useEffect(() => {
    loadLiveWeather(currentLocation);
  }, [currentLocation]);

  // Handle GPS location lookup
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLive(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const gpsLoc: LocationOption = {
          id: 'gps_live_station',
          name: 'Live GPS Location',
          state: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
          lat,
          lon,
          defaultRegime: 'NORMAL',
          elevation: 'Local Surface Level',
          climateZone: 'Real-Time Coordinates'
        };
        setCurrentLocation(gpsLoc);
      },
      (err) => {
        console.error('GPS error:', err);
        setIsLoadingLive(false);
        alert('Could not retrieve GPS location. Please allow location access or search for your city.');
      },
      { timeout: 10000 }
    );
  };

  // Generate dynamic snapshot anchored on real-time observations
  const snapshot = useMemo(() => {
    const customValues = liveData
      ? {
          WRF: { rain: liveData.models.WRF.rain, temp: liveData.models.WRF.temp, wind: liveData.models.WRF.wind },
          AI_MODEL: { rain: liveData.models.AI_MODEL.rain, temp: liveData.models.AI_MODEL.temp, wind: liveData.models.AI_MODEL.wind },
          GFS: { rain: liveData.models.GFS.rain, temp: liveData.models.GFS.temp, wind: liveData.models.GFS.wind },
          ENSEMBLE: { rain: liveData.models.ENSEMBLE.rain, temp: liveData.models.ENSEMBLE.temp, wind: liveData.models.ENSEMBLE.wind }
        }
      : undefined;

    return generateForecastSnapshot(currentLocation.id, currentLeadTime, currentRegime);
  }, [currentLocation.id, currentLeadTime, currentRegime, liveData]);

  return (
    <div className="min-h-screen bg-[#0c111d] text-slate-100 flex flex-col antialiased selection:bg-slate-700 selection:text-white">
      
      {/* Command Center Operational Header */}
      <CommandHeader
        activeView={activeView}
        onSelectView={setActiveView}
        currentLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
        currentRegime={currentRegime}
        onSelectRegime={(reg) => {
          setCurrentRegime(reg);
          setIsAutoRegime(false);
        }}
        isAutoRegime={isAutoRegime}
        onToggleAutoRegime={() => {
          const next = !isAutoRegime;
          setIsAutoRegime(next);
          if (next && liveData) {
            setCurrentRegime(liveData.detectedRegime);
          }
        }}
        isLoadingLive={isLoadingLive}
        onRefreshLive={() => loadLiveWeather(currentLocation)}
        lastUpdated={lastUpdated}
        onUseGPS={handleUseGPS}
        isLiveMode={true}
      />

      {/* Main Operational Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 pb-20">
        {activeView === 'dashboard' && (
          <LiveDashboardView
            snapshot={snapshot}
            liveData={liveData}
            onNavigate={setActiveView}
            onSelectLeadTime={setCurrentLeadTime}
          />
        )}

        {activeView === 'forecast' && (
          <MultiModelForecastView
            snapshot={snapshot}
            liveData={liveData}
            onSelectLeadTime={setCurrentLeadTime}
          />
        )}

        {activeView === 'blend' && (
          <BlendingMatrixView
            snapshot={snapshot}
            onLeadTimeChange={setCurrentLeadTime}
            onRegimeChange={(r) => {
              setCurrentRegime(r);
              setIsAutoRegime(false);
            }}
          />
        )}

        {activeView === 'map' && <SpatialSkillView />}

        {activeView === 'alerts' && <HazardEarlyWarningView snapshot={snapshot} />}

        {activeView === 'explain' && <ExplainableAIView snapshot={snapshot} />}
      </main>

      {/* Command Console Footer */}
      <footer className="w-full bg-[#02050b] border-t border-white/5 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-400">HYBRIDCAST AI Command System</span>
            <span>•</span>
            <span>Live Meteorological Stream Active</span>
          </div>
          <div>
            Open-Meteo High-Res API • GFS 0.25° • WRF 3km Physics • Deep Neural Ensemble
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
