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
    className="w-20 h-1 mb-6"
    style={{ backgroundColor: color === '#FFFFFF' ? '#000000' : color }}
  />
);

const ProjectTitle = ({ title }: { title: string }) => (
  <h3 className="text-4xl lg:text-5xl font-bold text-[#f5f5f5] mb-2">
    {title}
  </h3>
);

const ProjectSubtitle = ({ subtitle }: { subtitle: string }) => (
  <p className="text-xl text-[#f5f5f5]/70 mb-6">
    {subtitle}
  </p>
);

const ProjectDescription = ({ description }: { description: string }) => (
  <p className="text-[#f5f5f5]/80 mb-8 leading-relaxed">
    {description}
  </p>
);

const ProjectTechnologies = ({ technologies, color }: { technologies: string[], color: string }) => (
  <div className="flex flex-wrap gap-2 mb-8">
    {technologies.map((tech) => (
      <span 
        key={tech}
        className="px-3 py-1 text-sm font-medium rounded-full"
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
);

interface ProjectLinksProps {
  websiteLink?: string;
  githubLink?: string;
  color: string;
}

const ProjectLinks = ({ websiteLink, githubLink, color }: ProjectLinksProps) => (
  <div className="flex gap-4">
    {websiteLink && (
      <a
        href={websiteLink}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 font-medium transition-all duration-300 hover:scale-105"
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
        className="px-6 py-3 font-medium border transition-all duration-300 hover:scale-105"
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
      className="w-full aspect-square rounded-lg relative"
      style={{ 
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        opacity: isContentVisible ? 1 : 0,
        overflow: 'visible'
      }}
    >
      <div className="relative w-full h-full">
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
      className="w-full h-full flex items-center justify-center p-8 lg:p-16"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left side - Project info */}
        <div 
          ref={contentRef} 
          className="flex flex-col justify-center"
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
        <div className="flex items-center justify-center" style={{ perspective: '1000px' }}>
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