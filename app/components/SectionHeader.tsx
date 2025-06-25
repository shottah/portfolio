interface SectionHeaderProps {
  title: string;
  isDark?: boolean;
}

export default function SectionHeader({ title, isDark = false }: SectionHeaderProps) {
  return (
    <h2 className={`text-6xl font-bold ${isDark ? 'text-[#f5f5f5]' : 'text-black'}`}>
      {title}
    </h2>
  );
}