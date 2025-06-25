"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentProject, setCurrentProject] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'left' | 'right' | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isInSection = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;

      if (isInSection) {
        // Use horizontal scroll (deltaX) if available, otherwise use vertical scroll (deltaY)
        const horizontalDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        
        // Only prevent default if we're actually scrolling horizontally within bounds
        const projectWidth = window.innerWidth;
        const maxScroll = (projects.length - 1) * projectWidth;
        const newScrollPosition = scrollPosition + horizontalDelta;
        
        // Check if we should handle this scroll event
        if (horizontalDelta === e.deltaY) {
          // Using vertical scroll - check bounds
          // Only allow section transition if we're at the exact edge (current project is 0 or last)
          if (currentProject === 0 && horizontalDelta < 0) {
            // At first project and scrolling left, allow scrolling to previous section
            const prevSection = document.querySelector('#about');
            if (prevSection) {
              prevSection.scrollIntoView({ behavior: 'smooth' });
            }
            return;
          } else if (currentProject === projects.length - 1 && horizontalDelta > 0) {
            // At last project and scrolling right, allow scrolling to next section
            const nextSection = document.querySelector('#experience');
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
            }
            return;
          }
        }
        
        // Prevent default for horizontal scrolling
        e.preventDefault();
        
        // Clamp to valid range
        const clampedPosition = Math.max(0, Math.min(maxScroll, newScrollPosition));
        setScrollPosition(clampedPosition);
        
        // Update current project based on scroll position
        const newProject = Math.round(clampedPosition / projectWidth);
        
        if (newProject !== currentProject && newProject >= 0 && newProject < projects.length) {
          setCurrentProject(newProject);
          setScrollDirection(newProject > currentProject ? 'right' : 'left');
          setTimeout(() => setScrollDirection(null), 800);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentProject, isInView, scrollPosition, isMobile]);

  // Add touch support for mobile horizontal scrolling (tablets)
  useEffect(() => {
    if (!isInView || isMobile) return;
    
    let startX = 0;
    let startY = 0;
    let startScrollPosition = 0;
    let isHorizontalSwipe = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startScrollPosition = scrollPosition;
      isHorizontalSwipe = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;
      
      // Determine if this is a horizontal or vertical swipe
      if (!isHorizontalSwipe && Math.abs(diffX) > 5) {
        isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
      }
      
      // Only handle horizontal swipes
      if (!isHorizontalSwipe) return;
      
      e.preventDefault();
      const projectWidth = window.innerWidth;
      const maxScroll = (projects.length - 1) * projectWidth;
      
      // Calculate new position
      const newPosition = Math.max(0, Math.min(maxScroll, startScrollPosition + diffX));
      setScrollPosition(newPosition);
      
      // Update current project
      const newProject = Math.round(newPosition / projectWidth);
      
      if (newProject !== currentProject && newProject >= 0 && newProject < projects.length) {
        setCurrentProject(newProject);
        setScrollDirection(newProject > currentProject ? 'right' : 'left');
        setTimeout(() => setScrollDirection(null), 800);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [currentProject, isInView, scrollPosition, isMobile]);

  // Add keyboard navigation
  useEffect(() => {
    if (!isInView || isMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentProject < projects.length - 1) {
        e.preventDefault();
        const newProject = currentProject + 1;
        const newPosition = newProject * window.innerWidth;
        setCurrentProject(newProject);
        setScrollDirection('right');
        setScrollPosition(newPosition);
        setTimeout(() => setScrollDirection(null), 800);
      } else if (e.key === 'ArrowLeft' && currentProject > 0) {
        e.preventDefault();
        const newProject = currentProject - 1;
        const newPosition = newProject * window.innerWidth;
        setCurrentProject(newProject);
        setScrollDirection('left');
        setScrollPosition(newPosition);
        setTimeout(() => setScrollDirection(null), 800);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProject, isInView, isMobile]);

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="min-h-screen md:h-screen bg-[#0a0a0a] relative md:overflow-hidden"
    >
      {/* Project counter and instructions - only show on desktop */}
      {!isMobile && (
        <div className="absolute top-8 left-8 z-10">
          <p className="text-[#f5f5f5] text-sm font-bold tracking-wider mb-2">
            PROJECT {currentProject + 1} OF {projects.length}
          </p>
          <p className="text-[#f5f5f5]/50 text-xs">
            Scroll or use arrow keys to navigate
          </p>
        </div>
      )}
      
      {/* Scroll indicators - only show on desktop */}
      {!isMobile && (
        <>
          {currentProject < projects.length - 1 && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 animate-pulse">
              <svg 
                className="w-6 h-6 text-[#f5f5f5]/50" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
          
          {currentProject > 0 && (
            <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 animate-pulse">
              <svg 
                className="w-6 h-6 text-[#f5f5f5]/50" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          )}
        </>
      )}

      {/* Scroll container - vertical on mobile, horizontal on desktop */}
      {isMobile ? (
        <div className="flex flex-col gap-4">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="min-h-[50vh]"
            >
              <ProjectCard 
                project={project} 
                isActive={true}
                scrollDirection={null}
              />
            </div>
          ))}
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateX(-${scrollPosition}px)`
          }}
        >
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="w-screen h-full flex-shrink-0"
            >
              <ProjectCard 
                project={project} 
                isActive={index === currentProject}
                scrollDirection={index === currentProject ? scrollDirection : null}
              />
            </div>
          ))}
        </div>
      )}

      {/* Navigation dots - only show on desktop */}
      {!isMobile && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const direction = index > currentProject ? 'right' : 'left';
                const newPosition = index * window.innerWidth;
                setCurrentProject(index);
                setScrollDirection(direction);
                setScrollPosition(newPosition);
                setTimeout(() => setScrollDirection(null), 800);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentProject 
                  ? 'bg-[#f5f5f5] w-8' 
                  : 'bg-[#f5f5f5]/30 hover:bg-[#f5f5f5]/50'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}