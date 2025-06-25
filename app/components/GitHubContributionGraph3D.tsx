"use client";

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface GitHubContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface ContributionBoxProps {
  position: [number, number, number];
  contributions: number;
  date: string;
}

// GitHub's contribution color levels
const GITHUB_COLORS = {
  0: 'transparent',  // No contributions
  1: '#0e4429',  // Level 1
  2: '#006d32',  // Level 2
  3: '#26a641',  // Level 3
  4: '#39d353',  // Level 4
};

function ContributionBox({ position, contributions }: ContributionBoxProps) {
  // Skip rendering if no contributions
  if (contributions === 0) return null;
  
  // Calculate height based on contributions (0.2 to 4 units) - doubled
  const height = Math.max(0.2, Math.min(contributions * 0.2, 4));
  
  // Determine color based on contribution level
  const getColor = (count: number) => {
    if (count <= 2) return GITHUB_COLORS[1];
    if (count <= 5) return GITHUB_COLORS[2];
    if (count <= 10) return GITHUB_COLORS[3];
    return GITHUB_COLORS[4];
  };

  // Adjust position to grow upward from the same floor
  const adjustedPosition: [number, number, number] = [
    position[0],
    position[1] + height / 2, // Move up by half the height so bottom stays at y=0
    position[2]
  ];

  return (
    <RoundedBox
      args={[0.8, height, 0.8]}
      radius={0.05}
      smoothness={4}
      position={adjustedPosition}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial 
        color={getColor(contributions)}
        metalness={0}
        roughness={0.9}
        envMapIntensity={0.2}
      />
    </RoundedBox>
  );
}

function CameraController({ key }: { key: string }) {
  const { camera } = useThree();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHijacking, setIsHijacking] = useState(false);
  const animationProgress = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const experienceSection = document.getElementById('experience');
      if (!experienceSection) return;

      const rect = experienceSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const tolerance = windowHeight * 0.05; // 5% tolerance
      
      // Check if the experience section fills the viewport with tolerance
      const sectionFillsViewport = rect.top <= tolerance && rect.bottom >= windowHeight - tolerance;
      
      if (sectionFillsViewport) {
        const delta = e.deltaY;
        
        // Check if we should hijack based on direction and current progress
        const shouldHijack = (delta > 0 && animationProgress.current < 1) || 
                           (delta < 0 && animationProgress.current > 0);
        
        if (shouldHijack) {
          // Hijack scroll
          e.preventDefault();
          e.stopPropagation();
          
          // Update animation progress based on scroll delta
          const scrollSpeed = 0.002; // Increased for smoother animation
          const newProgress = Math.max(0, Math.min(1, animationProgress.current + delta * scrollSpeed));
          animationProgress.current = newProgress;
          setScrollProgress(newProgress);
          setIsHijacking(true);
        } else {
          // Release hijacking when at bounds
          setIsHijacking(false);
        }
      } else {
        setIsHijacking(false);
      }
    };

    const handleScroll = () => {
      const experienceSection = document.getElementById('experience');
      if (!experienceSection) return;

      const rect = experienceSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const tolerance = windowHeight * 0.05;
      
      // Check if section fills viewport with tolerance
      const sectionFillsViewport = rect.top <= tolerance && rect.bottom >= windowHeight - tolerance;
      
      if (!sectionFillsViewport && !isHijacking) {
        // Calculate progress based on section position when not hijacking
        if (rect.top > tolerance) {
          // Section is below viewport - set to bird's eye view
          animationProgress.current = 0;
          setScrollProgress(0);
        } else if (rect.bottom < windowHeight - tolerance) {
          // Section is above viewport - maintain front view
          animationProgress.current = 1;
          setScrollProgress(1);
        }
      }
      
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHijacking]);

  useFrame(() => {
    // Interpolate camera position based on scroll
    // Bird's eye view: [0, 30, 0] - closer for more zoom
    // Front view: [0, 8, 25] - closer for more zoom
    const startPos = { x: 0, y: 30, z: 0 };
    const endPos = { x: 0, y: 8, z: 25 };
    
    camera.position.x = startPos.x + (endPos.x - startPos.x) * scrollProgress;
    camera.position.y = startPos.y + (endPos.y - startPos.y) * scrollProgress;
    camera.position.z = startPos.z + (endPos.z - startPos.z) * scrollProgress;
    
    // Always look at the center of the contribution graph
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function ContributionGraph({ data, year }: { data: GitHubContributionData; year: number }) {
  return (
    <>
      <CameraController key={`camera-${year}`} />
      <group key={`graph-${year}`}>
        {data.weeks.map((week, weekIndex) => (
          week.contributionDays.map((day, dayIndex) => (
            <ContributionBox
              key={`${weekIndex}-${dayIndex}`}
              position={[weekIndex - data.weeks.length / 2, 0, dayIndex - 3.5]}
              contributions={day.contributionCount}
              date={day.date}
            />
          ))
        ))}
      </group>
    </>
  );
}

interface GitHubContributionGraph3DProps {
  username: string;
  year: number;
  initialData?: GitHubContributionData | null;
}

export default function GitHubContributionGraph3D({ username, year, initialData }: GitHubContributionGraph3DProps) {
  const [contributionData, setContributionData] = React.useState<GitHubContributionData | null>(initialData || null);
  const [loading, setLoading] = React.useState(!initialData);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // Update data when initialData changes (year changes)
    if (initialData) {
      setContributionData(initialData);
      setLoading(false);
      setError(null);
    } else {
      // Fetch if no initial data provided
      const fetchContributions = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/github-contributions?username=${username}&year=${year}`);
          if (!response.ok) {
            throw new Error('Failed to fetch contribution data');
          }
          const data = await response.json();
          setContributionData(data.contributions);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchContributions();
    }
  }, [username, year, initialData]);

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <p className="text-gray-500">Loading contribution data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!contributionData) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <p className="text-gray-500">No contribution data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px]">
      <Canvas
        camera={{ position: [0, 30, 0], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <ContributionGraph data={contributionData} year={year} />
      </Canvas>
    </div>
  );
}