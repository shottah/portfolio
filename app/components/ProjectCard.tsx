"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { Project } from "../data/projects";
import WebsitePreview from "./WebsitePreview";
import MobilePreview from "./MobilePreview";

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  scrollDirection?: 'left' | 'right' | null;
}

// Sub-components
const ProjectAccent = ({ color }: { color: string }) => (
  <div 
    className="w-16 md:w-20 h-1 mb-3 md:mb-4 lg:mb-6"
    style={{ backgroundColor: color === '#FFFFFF' ? '#000000' : color }}
  />
);

const ProjectTitle = ({ title }: { title: string }) => (
  <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#f5f5f5] mb-1 md:mb-2">
    {title}
  </h3>
);

const ProjectSubtitle = ({ subtitle }: { subtitle: string }) => (
  <p className="text-base md:text-lg lg:text-xl text-[#f5f5f5]/70 mb-3 md:mb-4 lg:mb-6">
    {subtitle}
  </p>
);

const ProjectDescription = ({ description }: { description: string }) => (
  <p className="text-sm md:text-base text-[#f5f5f5]/80 mb-4 md:mb-6 lg:mb-8 leading-relaxed line-clamp-3 md:line-clamp-4 lg:line-clamp-none">
    {description}
  </p>
);

const ProjectTechnologies = ({ technologies, color }: { technologies: string[], color: string }) => (
  <div className="mb-4 md:mb-6 lg:mb-8 overflow-x-auto">
    <div className="flex gap-1.5 md:gap-2 md:flex-wrap overflow-x-auto md:overflow-x-visible scrollbar-hide">
      {technologies.map((tech) => (
        <span 
          key={tech}
          className="px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm font-medium rounded-full whitespace-nowrap flex-shrink-0"
          style={{ 
            backgroundColor: color === '#FFFFFF' ? 'rgba(0,0,0,0.1)' : `${color}20`,
            color: color === '#FFFFFF' ? '#000000' : color,
            border: `1px solid ${color === '#FFFFFF' ? 'rgba(0,0,0,0.2)' : `${color}40`}`
          }}
        >
          {tech}
        </span>
      ))}
    </div>
  </div>
);

interface ProjectLinksProps {
  websiteLink?: string;
  githubLink?: string;
  color: string;
}

const ProjectLinks = ({ websiteLink, githubLink, color }: ProjectLinksProps) => (
  <div className="flex gap-2 md:gap-3 lg:gap-4">
    {websiteLink && (
      <a
        href={websiteLink}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 md:px-4 lg:px-6 py-3 md:py-2.5 lg:py-3 text-sm md:text-sm lg:text-base font-bold transition-all duration-300 hover:scale-105"
        style={{ 
          backgroundColor: color === '#FFFFFF' ? '#000000' : color,
          color: color === '#FFFFFF' ? '#FFFFFF' : '#0a0a0a'
        }}
      >
        VIEW PROJECT
      </a>
    )}
    {githubLink && (
      <a
        href={githubLink}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3 text-xs md:text-sm lg:text-base font-medium border transition-all duration-300 hover:scale-105"
        style={{ 
          borderColor: color === '#FFFFFF' ? '#000000' : color,
          color: color === '#FFFFFF' ? '#000000' : color
        }}
      >
        VIEW CODE
      </a>
    )}
  </div>
);

interface ProjectPreviewProps {
  projectUrl?: string;
  appUrl?: string;
  color: string;
  isContentVisible: boolean;
  imageRef: React.RefObject<HTMLDivElement | null>;
}

const ProjectPreview = ({ projectUrl, appUrl, color, isContentVisible, imageRef }: ProjectPreviewProps) => {
  // Only render if at least one URL exists
  if (!projectUrl && !appUrl) return null;

  return (
    <div 
      ref={imageRef}
      className="w-full aspect-square rounded-lg relative max-w-[300px] md:max-w-[400px] lg:max-w-none mx-auto"
      style={{ 
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        opacity: isContentVisible ? 1 : 0,
        overflow: 'visible'
      }}
    >
      <div className="relative w-full h-full transform scale-75 md:scale-90 lg:scale-100">
        {projectUrl && <WebsitePreview url={projectUrl} color={color} />}
        {appUrl && <MobilePreview color={color} appUrl={appUrl} />}
      </div>
    </div>
  );
};

export default function ProjectCard({ project, isActive, scrollDirection }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    if (!cardRef.current || !contentRef.current) return;

    if (isActive && !hasAnimated.current) {
      // Only animate once
      hasAnimated.current = true;
      
      // Show content and animate in
      setIsContentVisible(true);
      animate(cardRef.current, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.6, ease: "easeOut" });
      animate(contentRef.current, { y: [50, 0], opacity: [0, 1] }, { duration: 0.8, delay: 0.2, ease: "easeOut" });
    } else if (isActive && hasAnimated.current) {
      // If already animated, just ensure content is visible
      setIsContentVisible(true);
    }
  }, [isActive]);

  useEffect(() => {
    if (!imageRef.current || !scrollDirection) return;

    if (isActive && scrollDirection && !hasAnimated.current) {
      // 3D flip animation only on first view
      const rotationAxis = scrollDirection === 'right' ? 'rotateY' : 'rotateY';
      const startRotation = scrollDirection === 'right' ? -180 : 180;
      
      // Set initial state
      imageRef.current.style.transform = `perspective(1000px) ${rotationAxis}(${startRotation}deg)`;
      imageRef.current.style.opacity = '0';
      
      // Animate to final state
      animate(
        imageRef.current,
        {
          transform: [`perspective(1000px) ${rotationAxis}(${startRotation}deg)`, `perspective(1000px) ${rotationAxis}(0deg)`],
          opacity: [0, 1]
        },
        {
          duration: 0.8,
          ease: "easeOut"
        }
      );
    }
  }, [isActive, scrollDirection]);

  return (
    <div 
      ref={cardRef}
      className="w-full h-full flex items-center justify-center p-4 sm:p-4 md:p-8 lg:p-16"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:gap-16">
        {/* Left side - Project info */}
        <div 
          ref={contentRef} 
          className="flex flex-col justify-center order-2 md:order-1"
          style={{ opacity: isContentVisible ? 1 : 0 }}
        >
          <ProjectAccent color={project.color} />
          <ProjectTitle title={project.title} />
          <ProjectSubtitle subtitle={project.subtitle} />
          <ProjectDescription description={project.description} />
          <ProjectTechnologies technologies={project.technologies} color={project.color} />
          <ProjectLinks 
            websiteLink={project.link} 
            githubLink={project.github} 
            color={project.color} 
          />
        </div>

        {/* Right side - Visual representation */}
        <div className="flex items-center justify-center order-1 md:order-2 mb-4 md:mb-0" style={{ perspective: '1000px' }}>
          <ProjectPreview 
            projectUrl={project.link}
            appUrl={project.appUrl}
            color={project.color}
            isContentVisible={isContentVisible}
            imageRef={imageRef}
          />
        </div>
      </div>
    </div>
  );
}