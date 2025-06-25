"use client";

import { useEffect, useRef } from "react";

export default function ScrollSnap() {
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return;

      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Set a timeout to detect when scrolling has stopped
      scrollTimeout.current = setTimeout(() => {
        const sections = document.querySelectorAll('section');
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Find the section that's most in view
        let closestSection: HTMLElement | null = null;
        let closestDistance = Infinity;
        
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top;
          const sectionMiddle = sectionTop + rect.height / 2;
          const viewportMiddle = windowHeight / 2;
          
          // Calculate distance from section middle to viewport middle
          const distance = Math.abs(sectionMiddle - viewportMiddle);
          
          // Check if this section is closer to center than previous ones
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section as HTMLElement;
          }
        });
        
        // Snap to the closest section if it's not already perfectly aligned
        if (closestSection) {
          const targetScrollY = closestSection.offsetTop;
          const currentScrollY = window.scrollY;
          
          // Only snap if we're not already perfectly aligned (within 5px)
          if (Math.abs(targetScrollY - currentScrollY) > 5) {
            isScrolling.current = true;
            
            window.scrollTo({
              top: targetScrollY,
              behavior: 'smooth'
            });
            
            // Reset scrolling flag after animation
            setTimeout(() => {
              isScrolling.current = false;
            }, 600);
          }
        }
      }, 150); // Wait 150ms after scroll stops before snapping
    };

    // Add passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return null;
}