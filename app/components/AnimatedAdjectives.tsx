"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion";

interface AnimatedAdjectivesProps {
  adjectives: string[];
  width: number | null;
  isPaused?: boolean;
  mousePosition?: number;
}

const colorPairs = [
  { bg: "rgb(59, 130, 246, 0.15)", text: "#3b82f6" }, // Blue
  { bg: "rgb(168, 85, 247, 0.15)", text: "#a855f7" }, // Purple
  { bg: "rgb(236, 72, 153, 0.15)", text: "#ec4899" }, // Pink
  { bg: "rgb(34, 197, 94, 0.15)", text: "#22c55e" }, // Green
  { bg: "rgb(251, 146, 60, 0.15)", text: "#fb923c" }, // Orange
  { bg: "rgb(250, 204, 21, 0.15)", text: "#facc15" }, // Yellow
  { bg: "rgb(14, 165, 233, 0.15)", text: "#0ea5e9" }, // Sky
  { bg: "rgb(139, 92, 246, 0.15)", text: "#8b5cf6" }, // Violet
];

export default function AnimatedAdjectives({ adjectives, width, isPaused = false, mousePosition = 0 }: AnimatedAdjectivesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animationRef = useRef<any>(null);
  const currentXRef = useRef(0);
  const isInitializedRef = useRef(false);
  
  // Duplicate adjectives for seamless loop
  const duplicatedAdjectives = [...adjectives, ...adjectives];
  
  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return;
    
    const scrollContainer = scrollRef.current;
    
    // Calculate the width of the first set of adjectives
    const children = scrollContainer.children;
    let totalWidth = 0;
    for (let i = 0; i < adjectives.length; i++) {
      totalWidth += (children[i] as HTMLElement).offsetWidth;
    }
    
    // Start position - off screen to the left
    // const containerWidth = containerRef.current.offsetWidth;
    const startX = -totalWidth - 100;
    
    // Set initial position
    scrollContainer.style.transform = `translateX(${startX}px)`;
    
    // Initial animation from left to right
    const initialAnimation = animate(
      scrollContainer,
      { 
        x: [startX, 0],
        opacity: [0, 1]
      },
      { 
        duration: 1.5,
        ease: "easeOut"
      }
    );
    
    // After initial animation, start the continuous scroll
    initialAnimation.then(() => {
      // Store initial position
      currentXRef.current = 0;
      isInitializedRef.current = true;
      
      const continuousAnimation = animate(
        scrollContainer,
        { x: [0, -totalWidth] },
        { 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }
      );
      
      animationRef.current = continuousAnimation;
    });
    
    return () => {
      initialAnimation.stop();
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [adjectives, width]);

  // Handle pause/resume
  useEffect(() => {
    if (!isInitializedRef.current || !scrollRef.current) return;
    
    if (isPaused) {
      // Get current position before pausing
      const currentTransform = window.getComputedStyle(scrollRef.current).transform;
      const matrix = new DOMMatrix(currentTransform);
      currentXRef.current = matrix.m41; // Get X translation from transform matrix
      
      if (animationRef.current) {
        animationRef.current.stop();
      }
    } else {
      // Resume animation from current position
      if (scrollRef.current && adjectives.length > 0) {
        // Calculate total width again
        const children = scrollRef.current.children;
        let totalWidth = 0;
        for (let i = 0; i < adjectives.length; i++) {
          totalWidth += (children[i] as HTMLElement).offsetWidth;
        }
        
        // Get current position
        const currentTransform = window.getComputedStyle(scrollRef.current).transform;
        const matrix = new DOMMatrix(currentTransform);
        const currentX = matrix.m41;
        
        // Stop any existing animation
        if (animationRef.current) {
          animationRef.current.stop();
        }
        
        // Create new animation from current position
        const newAnimation = animate(
          scrollRef.current,
          { x: [currentX, -totalWidth] },
          { 
            duration: 20 * ((-totalWidth - currentX) / -totalWidth), // Adjust duration based on remaining distance
            ease: "linear"
          }
        );
        
        // When this animation completes, start the full loop
        newAnimation.then(() => {
          if (!scrollRef.current) return;
          
          const loopAnimation = animate(
            scrollRef.current,
            { x: [0, -totalWidth] },
            { 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }
          );
          
          animationRef.current = loopAnimation;
        });
        
        animationRef.current = newAnimation;
      }
    }
  }, [isPaused, adjectives]);

  // Handle mouse movement when paused
  useEffect(() => {
    if (!scrollRef.current || !isPaused || !isInitializedRef.current) return;
    
    // Calculate the range of movement based on content width
    const scrollWidth = scrollRef.current.scrollWidth / 2; // Half because we duplicated
    const moveRange = Math.min(scrollWidth * 0.3, 400); // Limit movement range
    
    // Apply mouse-controlled position
    const targetX = currentXRef.current + (mousePosition * moveRange);
    
    // Use motion's animate for smooth transitions
    animate(scrollRef.current, { x: targetX }, { duration: 0.1 });
  }, [mousePosition, isPaused]);
  
  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden mt-2 min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem] lg:min-h-[7rem] xl:min-h-[8rem]"
      style={{ 
        width: width ? `${width}px` : '800px',
        maxWidth: '100vw'
      }}
    >
      <div ref={scrollRef} className="flex opacity-0 absolute">
        {duplicatedAdjectives.map((adjective, index) => {
          const colorPair = colorPairs[index % colorPairs.length];
          return (
            <span
              key={index}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wider mx-4 sm:mx-6 md:mx-8 whitespace-nowrap px-4 py-2"
              style={{ 
                backgroundColor: colorPair.bg,
                color: colorPair.text
              }}
            >
              {adjective.toUpperCase()}
            </span>
          );
        })}
      </div>
    </div>
  );
}