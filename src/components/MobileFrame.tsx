import React from 'react';

interface MobileFrameProps {
  isMobileFrame?: boolean;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-between w-full max-w-xl mx-auto shadow-2xl relative">
      {children}
    </div>
  );
};
