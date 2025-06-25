"use client";

import dynamic from 'next/dynamic';

const GitHubContributionGraph3D = dynamic(
  () => import('./GitHubContributionGraph3D'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] flex items-center justify-center">
        <p className="text-gray-500">Loading 3D visualization...</p>
      </div>
    )
  }
);

interface GitHubContributionGraphWrapperProps {
  username: string;
  year: number;
  initialData: any;
}

export default function GitHubContributionGraphWrapper({ username, year, initialData }: GitHubContributionGraphWrapperProps) {
  return (
    <GitHubContributionGraph3D 
      username={username} 
      year={year}
      initialData={initialData}
    />
  );
}