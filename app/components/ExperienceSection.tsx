import SectionHeader from "./SectionHeader";
import GitHubContributionGraphWrapper from "./GitHubContributionGraphWrapper";
import YearNavigation from "./YearNavigation";

async function getGitHubContributions(username: string, year: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/github-contributions?username=${username}&year=${year}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch contribution data');
    }
    
    const data = await response.json();
    return data.contributions;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return null;
  }
}

interface ExperienceSectionProps {
  searchParams?: { year?: string };
}

export default async function ExperienceSection({ searchParams }: ExperienceSectionProps) {
  const currentYear = new Date().getFullYear();
  const selectedYear = searchParams?.year ? parseInt(searchParams.year) : currentYear;
  
  // Validate year is within range
  const validYear = selectedYear >= 2019 && selectedYear <= currentYear ? selectedYear : currentYear;
  
  const contributionData = await getGitHubContributions('shottah', validYear);
  
  return (
    <section id="experience" className="h-screen bg-white flex flex-col items-center justify-center p-4 relative">
      {/* Year breadcrumbs in top left */}
      <YearNavigation selectedYear={validYear} />
      
      <SectionHeader title="EXPERIENCE" />
      
      <div className="w-full mt-8">
        <p className="text-center text-gray-600 mb-8">
          GitHub Contributions in {validYear}
        </p>
        
        {contributionData === null ? (
          <div className="w-full h-[600px] flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
              <svg 
                className="w-16 h-16 mx-auto text-gray-300 mb-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Contribution Data Unavailable
              </h3>
              <p className="text-gray-600">
                Unable to fetch GitHub contributions for {validYear}.
              </p>
            </div>
          </div>
        ) : (
          <GitHubContributionGraphWrapper 
            username="shottah" 
            year={validYear}
            initialData={contributionData}
          />
        )}
      </div>
    </section>
  );
}