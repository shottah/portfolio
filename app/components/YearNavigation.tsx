"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface YearNavigationProps {
  selectedYear: number;
  isMobile?: boolean;
}

export default function YearNavigation({ selectedYear, isMobile = false }: YearNavigationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Dynamically generate years from 2019 to current year
  const currentYear = new Date().getFullYear();
  const startYear = 2019;
  const years = [];
  
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }
  
  const handleYearChange = (year: number) => {
    // Store current scroll position
    const currentScrollY = window.scrollY;
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('year', year.toString());
      
      // Use router.replace to update URL
      router.replace(`?${params.toString()}`, { scroll: false });
      
      // Trigger revalidation
      router.refresh();
      
      // Restore scroll position after navigation
      setTimeout(() => {
        window.scrollTo({ top: currentScrollY, behavior: 'instant' });
      }, 100);
    });
  };
  
  return (
    <div className={`${
      isMobile 
        ? 'flex flex-wrap justify-center gap-3' 
        : 'absolute top-8 left-8 grid grid-cols-3 gap-x-4 gap-y-2'
    }`}>
      {years.map((year) => (
        <button
          key={year}
          onClick={() => handleYearChange(year)}
          disabled={isPending}
          className={`text-sm font-medium transition-colors ${
            isMobile ? 'px-3 py-1' : 'text-left'
          } ${
            selectedYear === year
              ? 'text-[#0a0a0a]'
              : 'text-gray-400 hover:text-gray-600'
          } ${isPending ? 'opacity-50' : ''}`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}