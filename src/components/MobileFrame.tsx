import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  isMobileFrame: boolean;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ isMobileFrame, children }) => {
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  if (!isMobileFrame) {
    return (
      <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-between max-w-2xl mx-auto border-x border-white/[0.06] shadow-2xl">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02050b] py-6 px-2 flex items-center justify-center">
      {/* Smartphone Bezel */}
      <div className="relative w-full max-w-[400px] h-[860px] max-h-[92vh] rounded-[48px] bg-slate-950 p-3 shadow-[0_0_60px_rgba(0,0,0,0.9)] border-[6px] border-slate-800 ring-1 ring-white/10 flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-slate-900 border border-slate-800/80 z-50 flex items-center justify-center">
          <div className="w-10 h-1 rounded-full bg-slate-700/60"></div>
          <div className="w-2 h-2 rounded-full bg-slate-800 ml-2"></div>
        </div>

        {/* Mobile Phone Status Bar */}
        <div className="h-6 w-full flex items-center justify-between px-6 text-[11px] font-mono text-slate-300 font-semibold z-40 shrink-0">
          <span>{currentTime}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <div className="flex items-center gap-0.5">
              <span>98%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Inner Screen Container */}
        <div className="relative flex-1 rounded-[36px] overflow-hidden bg-[#060913] flex flex-col">
          {children}

          {/* Home Bar Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-white/20 pointer-events-none z-50"></div>
        </div>
      </div>
    </div>
  );
};
