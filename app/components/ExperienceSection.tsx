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
        
        <GitHubContributionGraphWrapper 
          username="shottah" 
          year={validYear}
          initialData={contributionData}
        />
      </div>
    </section>
  );
}