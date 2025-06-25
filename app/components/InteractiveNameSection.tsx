"use client";

import { useRef, useEffect, useState } from "react";
import NameHeader from "./NameHeader";
import AnimatedAdjectives from "./AnimatedAdjectives";

interface InteractiveNameSectionProps {
  adjectives: string[];
}

export default function InteractiveNameSection({ adjectives }: InteractiveNameSectionProps) {
  const [nameWidth, setNameWidth] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [initialMouseX, setInitialMouseX] = useState(0);
  const nameRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (nameRef.current) {
        setNameWidth(nameRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const normalizedX = (relativeX / rect.width) * 2 - 1; // -1 to 1
    
    setInitialMouseX(normalizedX);
    setMouseX(0); // Start with no offset
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseX(0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current || !isHovered) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const normalizedX = (relativeX / rect.width) * 2 - 1; // -1 to 1
    
    // Calculate relative movement from initial hover position
    const relativeMovement = normalizedX - initialMouseX;
    setMouseX(relativeMovement);
  };

  return (
    <div 
      ref={sectionRef}
      className="flex flex-col items-center cursor-pointer min-h-[200px] relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div ref={nameRef}>
        <NameHeader />
      </div>
      <AnimatedAdjectives 
        adjectives={adjectives} 
        width={nameWidth || 800} 
        isPaused={isHovered}
        mousePosition={mouseX}
      />
    </div>
  );
}