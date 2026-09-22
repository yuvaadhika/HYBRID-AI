import React, { useState, useMemo } from 'react';
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
import { LocationOption, LeadTime, WeatherRegime } from './types/weather';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentLocation, setCurrentLocation] = useState<LocationOption>(INDIAN_LOCATIONS[0]); // Chennai
  const [currentLeadTime, setCurrentLeadTime] = useState<LeadTime>('24h');
  const [currentRegime, setCurrentRegime] = useState<WeatherRegime>(INDIAN_LOCATIONS[0].defaultRegime);
  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  );

  // When location changes, update default regime to match the station
  const handleSelectLocation = (loc: LocationOption) => {
    setCurrentLocation(loc);
    setCurrentRegime(loc.defaultRegime);
    setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleSelectRegime = (regime: WeatherRegime) => {
    setCurrentRegime(regime);
    setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  };

  // Generate real-time snapshot
  const snapshot = useMemo(() => {
    return generateForecastSnapshot(currentLocation.id, currentLeadTime, currentRegime);
  }, [currentLocation.id, currentLeadTime, currentRegime]);

  const extremeRiskCount = snapshot.extremeHazards.filter(
    (h) => h.severityLevel === 'HIGH' || h.severityLevel === 'CRITICAL'
  ).length;

  return (
    <MobileFrame>
      {/* Header */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        currentRegime={currentRegime}
        onSelectRegime={handleSelectRegime}
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area - Ergonomic for Android and Mobile Viewports */}
      <main className="flex-1 w-full overflow-y-auto px-3.5 sm:px-4 py-3.5 space-y-4 pb-24">
        {activeTab === 'home' && (
          <HomeScreen snapshot={snapshot} onNavigate={setActiveTab} />
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

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        extremeRiskCount={extremeRiskCount}
      />
    </MobileFrame>
  );
}

export default App;
