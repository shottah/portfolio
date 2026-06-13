"use client";

import { useEffect, useState } from "react";

export interface SectionLink {
  id: string;
  label: string;
}

interface SideNavProps {
  sections: SectionLink[];
}

export function SideNav({ sections }: SideNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top of the viewport that is visible
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0% 0% -70% 0%" }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Article sections" className="text-sm">
      <p className="text-[var(--heading)] mb-2">contents</p>
      <ul className="space-y-1">
        {sections.map(({ id, label }) => {
          const isActive = id === activeId;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={
                  isActive
                    ? "text-[var(--link)]"
                    : "text-[var(--foreground)] opacity-70 hover:opacity-100"
                }
              >
                <span className="text-[var(--bullet)]">{isActive ? ">" : " "}</span>{" "}
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileToc({ sections }: SideNavProps) {
  return (
    <details className="lg:hidden mb-8 border border-[var(--foreground)]/20 px-4 py-3 text-sm">
      <summary className="cursor-pointer text-[var(--heading)]">contents</summary>
      <ul className="mt-2 space-y-1">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`} className="text-[var(--link)]">
              <span className="text-[var(--bullet)]">*</span> {label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
