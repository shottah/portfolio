import VerticalMenu from "./components/VerticalMenu";
import HomeSection from "./components/HomeSection";
import PageSections from "./components/PageSections";

interface HomeProps {
	searchParams?: { year?: string };
}

// This is a server component by default - optimized for SSR
export default function Home({ searchParams }: HomeProps) {
	// Static data that can be rendered on the server
	const adjectives = [
		"Lead",
		"Front End",
		"Back End",
		"Mobile",
		"Problem Solver",
		"Software Architect",
		"Builder"
	];

	return (
		<>
			<VerticalMenu />
			
			{/* HOME section with proper loading state */}
			<HomeSection adjectives={adjectives} />
			
			{/* Static sections are server-rendered */}
			<PageSections searchParams={searchParams} />
		</>
	);
}