import React from 'react';
import {
  Home,
  CloudSun,
  Sliders,
  Map,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { SupportedLanguage, getTranslation } from '../services/i18n';

export type TabType = 'home' | 'forecast' | 'blend' | 'map' | 'alerts' | 'insights';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentLanguage?: SupportedLanguage;
  extremeRiskCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  currentLanguage = 'en',
  extremeRiskCount = 1
}) => {
  const t = (key: string) => getTranslation(currentLanguage, key);

  const tabs: { id: TabType; label: string; icon: React.ReactNode; isHero?: boolean; badge?: number }[] = [
    {
      id: 'home',
      label: t('home'),
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'forecast',
      label: t('forecast'),
      icon: <CloudSun className="w-5 h-5" />
    },
    {
      id: 'blend',
      label: t('blend'),
      icon: <Sliders className="w-5 h-5" />,
      isHero: true
    },
    {
      id: 'map',
      label: t('map'),
      icon: <Map className="w-5 h-5" />
    },
    {
      id: 'alerts',
      label: t('alerts'),
      icon: <AlertOctagon className="w-5 h-5" />,
      badge: extremeRiskCount
    },
    {
      id: 'insights',
      label: t('insights'),
      icon: <Sparkles className="w-5 h-5" />
    }
  ];

  return (
    <nav className="sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-2xl border-t border-slate-200/90 px-2 py-1.5 shadow-lg transition-all">
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
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                    isActive
                      ? 'bg-gradient-to-tr from-sky-600 to-blue-600 text-white shadow-sky-600/30 scale-105 ring-2 ring-sky-300'
                      : 'bg-slate-100 text-sky-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <Sliders className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] mt-1 font-semibold transition-colors ${
                    isActive ? 'text-sky-700 font-bold' : 'text-slate-600 group-hover:text-slate-900'
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
                isActive ? 'text-sky-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-sm ring-1 ring-white animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-sky-700 font-bold' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-sky-600"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
