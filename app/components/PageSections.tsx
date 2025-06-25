import SectionHeader from "./SectionHeader";
import ProjectsSection from "./ProjectsSection";
import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";
import ExperienceSection from "./ExperienceSection";

interface PageSectionsProps {
  searchParams?: { year?: string };
}

export default function PageSections({ searchParams }: PageSectionsProps) {
  return (
    <>
      {/* ABOUT - White background */}
      <AboutSection />
      
      {/* PROJECTS - Uses custom ProjectsSection component */}
      <ProjectsSection />
      
      {/* EXPERIENCE - White background */}
      <ExperienceSection searchParams={searchParams} />
      
      {/* CONTACT - White background */}
      <ContactSection />
    </>
  );
}