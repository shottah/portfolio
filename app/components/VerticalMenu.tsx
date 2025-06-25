"use client";

import { useState, useEffect } from "react";
import { animate } from "motion";

const menuItems = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "PROJECTS", href: "#projects" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "CONTACT", href: "#contact" },
];

const colorPairs = [
  { bg: "rgb(59, 130, 246)", text: "#ffffff" }, // Blue
  { bg: "rgb(168, 85, 247)", text: "#ffffff" }, // Purple
  { bg: "rgb(236, 72, 153)", text: "#ffffff" }, // Pink
  { bg: "rgb(34, 197, 94)", text: "#ffffff" }, // Green
  { bg: "rgb(251, 146, 60)", text: "#ffffff" }, // Orange
  { bg: "rgb(250, 204, 21)", text: "#000000" }, // Yellow
];

export default function VerticalMenu() {
  const [, setHoveredIndex] = useState<number | null>(null);
  const [itemColors, setItemColors] = useState<string[]>(Array(menuItems.length).fill("#f5f5f5"));
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const menuTop = 24; // 6 * 4px (top-6 in tailwind)
      
      // Calculate color for each menu item
      const newColors = menuItems.map((_, index) => {
        // Calculate the Y position of this specific menu item
        // Assuming each item is about 28px tall (text-sm + py-1 + spacing)
        const itemHeight = 28;
        const itemY = menuTop + (index * itemHeight);
        
        // Calculate which section this item is over
        const itemPositionRelativeToPage = scrollY + itemY;
        const currentSectionIndex = Math.floor(itemPositionRelativeToPage / viewportHeight);
        
        // Determine color based on section background
        if (currentSectionIndex % 2 === 0) {
          // Item is over black background
          return "#f5f5f5";
        } else {
          // Item is over white background
          return "#000000";
        }
      });
      
      setItemColors(newColors);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (index: number, element: HTMLElement) => {
    setHoveredIndex(index);
    const color = colorPairs[index % colorPairs.length];
    
    // Animate the element
    animate(element, {
      x: -10,
      scale: 1.1,
      backgroundColor: color.bg,
      color: color.text,
    }, {
      duration: 0.3,
      ease: "easeOut"
    });
  };

  const handleMouseLeave = (index: number, element: HTMLElement) => {
    setHoveredIndex(null);
    
    // Animate back to original state with the specific item's color
    animate(element, {
      x: 0,
      scale: 1,
      backgroundColor: "transparent",
      color: itemColors[index],
    }, {
      duration: 0.3,
      ease: "easeOut"
    });
  };

  return (
    <nav className="fixed top-6 right-6 z-50">
      <ul className="space-y-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              className="block text-right text-sm font-bold tracking-wider px-3 py-1 cursor-pointer transition-colors duration-300"
              style={{ color: itemColors[index] }}
              onMouseEnter={(e) => handleMouseEnter(index, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(index, e.currentTarget)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}