import SectionHeader from "./SectionHeader";

export default function PageSections() {
  return (
    <>
      {/* ABOUT - White background */}
      <section id="about" className="h-screen bg-white flex items-center justify-center p-8">
        <SectionHeader title="ABOUT" />
      </section>
      
      {/* PROJECTS - Black background */}
      <section id="projects" className="h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
        <SectionHeader title="PROJECTS" isDark />
      </section>
      
      {/* EXPERIENCE - White background */}
      <section id="experience" className="h-screen bg-white flex items-center justify-center p-8">
        <SectionHeader title="EXPERIENCE" />
      </section>
      
      {/* SKILLS - Black background */}
      <section id="skills" className="h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
        <SectionHeader title="SKILLS" isDark />
      </section>
      
      {/* CONTACT - White background */}
      <section id="contact" className="h-screen bg-white flex items-center justify-center p-8">
        <SectionHeader title="CONTACT" />
      </section>
    </>
  );
}