import React from 'react';
import {
  Home,
  CloudSun,
  Sliders,
  Map,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

export type TabType = 'home' | 'forecast' | 'blend' | 'map' | 'alerts' | 'insights';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  extremeRiskCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  extremeRiskCount = 1
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; isHero?: boolean; badge?: number }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'forecast',
      label: 'Forecast',
      icon: <CloudSun className="w-5 h-5" />
    },
    {
      id: 'blend',
      label: 'AI Blend',
      icon: <Sliders className="w-5 h-5" />,
      isHero: true
    },
    {
      id: 'map',
      label: 'Skill Map',
      icon: <Map className="w-5 h-5" />
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <AlertOctagon className="w-5 h-5" />,
      badge: extremeRiskCount
    },
    {
      id: 'insights',
      label: 'Why AI?',
      icon: <Sparkles className="w-5 h-5" />
    }
  ];

  return (
    <nav className="sticky bottom-0 z-40 w-full bg-[#080d1a]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-1.5 transition-all">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (tab.isHero) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                    isActive
                      ? 'bg-gradient-to-tr from-sky-500 to-cyan-400 text-slate-950 shadow-sky-500/40 scale-105 ring-2 ring-sky-300/60'
                      : 'bg-slate-800/90 text-sky-400 hover:bg-slate-700/90 border border-sky-500/30 hover:border-sky-400/60'
                  }`}
                >
                  <Sliders className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] mt-1 font-semibold transition-colors ${
                    isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all duration-200 group focus:outline-none ${
                isActive ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-1 ring-slate-950 animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
