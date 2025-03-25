
import React, { useEffect, useState } from "react";

interface TourOverlayProps {
  targetElement: HTMLElement | null;
}

export const TourOverlay: React.FC<TourOverlayProps> = ({ targetElement }) => {
  const [dimensions, setDimensions] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (targetElement) {
      const updateDimensions = () => {
        const rect = targetElement.getBoundingClientRect();
        setDimensions({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      window.addEventListener('scroll', updateDimensions);

      return () => {
        window.removeEventListener('resize', updateDimensions);
        window.removeEventListener('scroll', updateDimensions);
      };
    }
  }, [targetElement]);

  if (!targetElement) return null;

  // Create an SVG mask with a hole for the target element
  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none animate-fade-in"
      style={{ backdropFilter: 'brightness(70%)', zIndex: 9998 }}
    >
      {/* Cutout area */}
      <div
        className="absolute bg-transparent border-2 border-primary pointer-events-none transition-all duration-300 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
        style={{
          top: dimensions.top,
          left: dimensions.left,
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: '4px',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          animation: 'pulse 2s infinite',
        }}
      />
    </div>
  );
};
