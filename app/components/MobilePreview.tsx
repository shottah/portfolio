"use client";

import { useState } from 'react';
import KolektivoMobilePreview from './previews/KolektivoMobilePreview';
import WAMMobilePreview from './previews/WAMMobilePreview';

interface MobilePreviewProps {
  color: string;
  appUrl?: string;
}

const getMobilePreviewContent = (color: string) => {
  if (color === "#7C3AED") { // WAM
    return <WAMMobilePreview color={color} yellowColor="#FCD34D" />;
  }
  if (color === "#2aa6a1") { // Kolektivo
    return <KolektivoMobilePreview color={color} secondaryColor="#ededed" />;
  }
  // Default mobile preview (if needed in future)
  return null;
};

export default function MobilePreview({ color, appUrl }: MobilePreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <a
      href={appUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute w-48 h-[400px] md:w-56 md:h-[480px] lg:w-64 lg:h-[540px] bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] p-3 md:p-4 shadow-2xl z-20 block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        filter: 'drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.7))',
        right: '10%',
        bottom: '-10%',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.2s ease-out',
        willChange: 'transform'
      }}
    >
      {/* Phone notch/dynamic island */}
      <div className="absolute top-3 md:top-4 left-1/2 transform -translate-x-1/2 w-16 h-5 md:w-20 md:h-6 lg:w-24 lg:h-7 bg-gray-900 rounded-full z-10" />
      
      {/* Phone screen */}
      <div className="w-full h-full bg-white rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden relative">
        {/* Status bar */}
        <div className="h-6 md:h-7 lg:h-8 bg-white text-black flex items-center justify-between px-4 md:px-5 lg:px-6 pt-1 md:pt-1.5 lg:pt-2 text-[9px] md:text-[10px] lg:text-[11px] font-medium">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-4 h-3 border border-black rounded-sm">
              <div className="w-3 h-2 bg-black rounded-sm m-0.5" />
            </div>
            <div className="w-1 h-3 bg-black rounded-sm" />
          </div>
        </div>
        
        {/* App content */}
        <div className="p-2 md:p-3 lg:p-4 h-full bg-white">
          {getMobilePreviewContent(color)}
        </div>
      </div>
    </a>
  );
}