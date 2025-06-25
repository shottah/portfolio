"use client";

import { useState } from 'react';
import SSBPortalPreview from './previews/SSBPortalPreview';
import KolektivoPreview from './previews/KolektivoPreview';
import WAMPreview from './previews/WAMPreview';
import AmericanaPreview from './previews/AmericanaPreview';
import DefaultPreview from './previews/DefaultPreview';

interface WebsitePreviewProps {
  url: string;
  color: string;
}

const getPreviewComponent = (url: string, color: string) => {
  if (url.includes('ssbportal.org.bz')) {
    return <SSBPortalPreview color={color} goldColor="rgb(255, 193, 7)" />;
  }
  if (url.includes('kolektivo.network')) {
    return <KolektivoPreview color={color} secondaryColor="#ededed" />;
  }
  if (url.includes('wam.money')) {
    return <WAMPreview color={color} yellowColor="#FCD34D" />;
  }
  if (url.includes('americana.io')) {
    return <AmericanaPreview color={color} />;
  }
  return <DefaultPreview color={color} />;
};

export default function WebsitePreview({ url, color }: WebsitePreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract domain for display
  const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-full rounded-lg overflow-hidden relative bg-white cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        border: `1px solid rgba(255, 255, 255, 0.2)`,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.2s ease-out',
        willChange: 'transform'
      }}
    >
      {/* Browser chrome */}
      <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded px-3 py-0.5 text-xs text-gray-600 font-medium">
            {domain}
          </div>
        </div>
      </div>
      
      {/* Website preview mockup */}
      <div className="p-4 bg-white">
        {getPreviewComponent(url, color)}
      </div>
      
      {/* Overlay gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent opacity-10"
        style={{ backgroundColor: color }}
      />
    </a>
  );
}