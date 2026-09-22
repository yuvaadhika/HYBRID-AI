import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { MobileFrame } from './components/MobileFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { ForecastScreen } from './components/screens/ForecastScreen';
import { ModelBlendScreen } from './components/screens/ModelBlendScreen';
import { SkillMapScreen } from './components/screens/SkillMapScreen';
import { ExtremeRiskScreen } from './components/screens/ExtremeRiskScreen';
import { ExplainabilityScreen } from './components/screens/ExplainabilityScreen';
import { INDIAN_LOCATIONS, generateForecastSnapshot } from './services/blendingEngine';
import { reverseGeocodeLocation, fetchLiveWeather, LiveWeatherData } from './services/liveWeatherService';
import { SupportedLanguage } from './services/i18n';
import { LocationOption, LeadTime, WeatherRegime } from './types/weather';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentLocation, setCurrentLocation] = useState<LocationOption>(INDIAN_LOCATIONS[0]); // Chennai
  const [currentLeadTime, setCurrentLeadTime] = useState<LeadTime>('24h');
  const [currentRegime, setCurrentRegime] = useState<WeatherRegime>(INDIAN_LOCATIONS[0].defaultRegime);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [liveData, setLiveData] = useState<LiveWeatherData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  );

  // Fetch real-time weather from Open-Meteo
  const loadLiveWeather = async (loc: LocationOption) => {
    try {
      const data = await fetchLiveWeather(loc.lat, loc.lon, loc.name, loc.state);
      setLiveData(data);
      if (data.detectedRegime) {
        setCurrentRegime(data.detectedRegime);
      }
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('Using hybrid blending model for station:', err);
    }
  };

  useEffect(() => {
    loadLiveWeather(currentLocation);
  }, [currentLocation]);

  // Real GPS Geolocation & Reverse Geocoding
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const geo = await reverseGeocodeLocation(lat, lon);
          const userStation: LocationOption = {
            id: 'real_gps_station',
            name: geo.name,
            state: geo.state,
            lat,
            lon,
            defaultRegime: 'NORMAL',
            elevation: 'Local Elevation',
            climateZone: 'Real-Time User Coordinates'
          };
          setCurrentLocation(userStation);
        } catch (e) {
          console.error('Reverse geocode error:', e);
        } finally {
          setIsLocatingGPS(false);
        }
      },
      (err) => {
        console.error('GPS error:', err);
        setIsLocatingGPS(false);
        alert('Please allow location permission in your browser/device to detect your real location.');
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  const handleSelectLocation = (loc: LocationOption) => {
    setCurrentLocation(loc);
    setCurrentRegime(loc.defaultRegime);
    setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleSelectRegime = (regime: WeatherRegime) => {
    setCurrentRegime(regime);
    setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  };

  // Generate dynamic snapshot anchored on location and regime
  const snapshot = useMemo(() => {
    return generateForecastSnapshot(currentLocation.id, currentLeadTime, currentRegime);
  }, [currentLocation.id, currentLeadTime, currentRegime, liveData]);

  const extremeRiskCount = snapshot.extremeHazards.filter(
    (h) => h.severityLevel === 'HIGH' || h.severityLevel === 'CRITICAL'
  ).length;

  return (
    <MobileFrame>
      {/* Header with 10 Languages & Real GPS */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        currentRegime={currentRegime}
        onSelectRegime={handleSelectRegime}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onDetectGPS={handleDetectGPS}
        isLocatingGPS={isLocatingGPS}
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto px-3.5 sm:px-4 py-3.5 space-y-4 pb-24">
        {activeTab === 'home' && (
          <HomeScreen
            snapshot={snapshot}
            onNavigate={setActiveTab}
            currentLanguage={currentLanguage}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastScreen
            snapshot={snapshot}
            onSelectLeadTime={setCurrentLeadTime}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'blend' && (
          <ModelBlendScreen
            snapshot={snapshot}
            onLeadTimeChange={setCurrentLeadTime}
            onRegimeChange={setCurrentRegime}
          />
        )}

        {activeTab === 'map' && <SkillMapScreen />}

        {activeTab === 'alerts' && <ExtremeRiskScreen snapshot={snapshot} />}

        {activeTab === 'insights' && <ExplainabilityScreen snapshot={snapshot} />}
      </main>

      {/* Bottom Navigation with Dynamic Language Support */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentLanguage={currentLanguage}
        extremeRiskCount={extremeRiskCount}
      />
    </MobileFrame>
  );
}

export default App;
