"use client";

import dynamic from 'next/dynamic';
import ContributionGraphErrorBoundary from './ContributionGraphErrorBoundary';

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

interface GitHubContributionData {
  totalContributions: number;
  weeks: Array<{
    contributionDays: Array<{
      date: string;
      contributionCount: number;
      color: string;
    }>;
  }>;
}

interface GitHubContributionGraphWrapperProps {
  username: string;
  year: number;
  initialData: GitHubContributionData | null;
}

export default function GitHubContributionGraphWrapper({ username, year, initialData }: GitHubContributionGraphWrapperProps) {
  return (
    <ContributionGraphErrorBoundary>
      <GitHubContributionGraph3D 
        username={username} 
        year={year}
        initialData={initialData}
      />
    </ContributionGraphErrorBoundary>
  );
}