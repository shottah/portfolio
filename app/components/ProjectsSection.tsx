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
    if (!isInView) return;

    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isInSection = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;

      if (isInSection) {
        e.preventDefault();
        
        const delta = e.deltaY;
        const scrollSpeed = 1; // Adjust for sensitivity
        const projectWidth = window.innerWidth;
        const maxScroll = (projects.length - 1) * projectWidth;
        
        // Calculate new scroll position
        const newScrollPosition = scrollPosition + (delta * scrollSpeed);
        
        // Check bounds
        if (newScrollPosition < 0 && delta < 0) {
          // At beginning, allow scrolling to previous section
          const prevSection = document.querySelector('#about');
          if (prevSection) {
            prevSection.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        } else if (newScrollPosition > maxScroll && delta > 0) {
          // At end, allow scrolling to next section
          const nextSection = document.querySelector('#experience');
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }
        
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
  }, [currentProject, isInView, scrollPosition]);

  // Add touch support for mobile
  useEffect(() => {
    if (!isInView) return;
    
    let startX = 0;
    let startScrollPosition = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startScrollPosition = scrollPosition;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentX = e.touches[0].clientX;
      const diffX = startX - currentX;
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
  }, [currentProject, isInView, scrollPosition]);

  // Add keyboard navigation
  useEffect(() => {
    if (!isInView) return;

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
  }, [currentProject, isInView]);

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="h-screen bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Project counter and instructions */}
      <div className="absolute top-8 left-8 z-10">
        <p className="text-[#f5f5f5] text-sm font-bold tracking-wider mb-2">
          PROJECT {currentProject + 1} OF {projects.length}
        </p>
        <p className="text-[#f5f5f5]/50 text-xs">
          Scroll or use arrow keys to navigate
        </p>
      </div>
      
      {/* Scroll indicator */}
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

      {/* Horizontal scroll container */}
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

      {/* Navigation dots */}
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
    </section>
  );
}