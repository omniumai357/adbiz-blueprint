
import React, { useEffect, useRef, useState } from "react";
import { 
  calculateOptimalPathPoints, 
  PathOptions, 
  defaultPathOptions,
  calculatePath,
  PathStyle 
} from "@/lib/utils/path-utils";
import { cn } from "@/lib/utils";

interface TourPathProps {
  sourceElement: HTMLElement | null;
  targetElement: HTMLElement | null;
  isActive: boolean;
  options?: Partial<PathOptions>;
  onAnimationComplete?: () => void;
  className?: string;
}

export const TourPath: React.FC<TourPathProps> = ({
  sourceElement,
  targetElement,
  isActive,
  options = {},
  onAnimationComplete,
  className
}) => {
  const [pathLength, setPathLength] = useState<number>(0);
  const [pathD, setPathD] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [arrowPoints, setArrowPoints] = useState<string>("");
  
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  
  // Merge default options with provided options
  const pathOptions: PathOptions = {
    ...defaultPathOptions,
    ...options
  };
  
  useEffect(() => {
    // Reset state when elements change
    setIsVisible(false);
    setPathLength(0);
    
    const timer = setTimeout(() => {
      if (sourceElement && targetElement && isActive) {
        // Calculate optimal path between elements
        const pathPoints = calculateOptimalPathPoints(sourceElement, targetElement);
        
        // Generate path string
        const pathString = calculatePath(
          sourceElement,
          targetElement,
          pathOptions.style as PathStyle
        );
        
        setPathD(pathString);
        setIsVisible(true);
        
        // Calculate path length for animation
        if (pathRef.current) {
          const length = pathRef.current.getTotalLength();
          setPathLength(length);
        }
        
        // Create arrow marker if needed
        if (pathOptions.showArrow) {
          // For simplicity, we'll use a triangle pointing right
          const size = pathOptions.arrowSize || 6;
          setArrowPoints(`0,0 ${size},${size/2} 0,${size}`);
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [sourceElement, targetElement, isActive, pathOptions.style]);
  
  // Handle animation completion
  useEffect(() => {
    if (isVisible && onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, pathOptions.animationDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete, pathOptions.animationDuration]);
  
  if (!isActive || !sourceElement || !targetElement) {
    return null;
  }
  
  // Calculate SVG viewport to cover the entire document
  const viewBoxWidth = Math.max(document.documentElement.scrollWidth, window.innerWidth);
  const viewBoxHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
  
  return (
    <svg
      ref={svgRef}
      className={cn(
        "fixed top-0 left-0 w-full h-full pointer-events-none z-[59]",
        className
      )}
      style={{ 
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9997, // Just below the tour overlay
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${pathOptions.animationDuration / 2}ms ease-in-out`
      }}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
    >
      {/* Arrow marker definition */}
      {pathOptions.showArrow && (
        <defs>
          <marker
            id="tour-arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <polygon 
              points={arrowPoints} 
              fill={pathOptions.color} 
            />
          </marker>
        </defs>
      )}
      
      {/* The animated path */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={pathOptions.color}
        strokeWidth={pathOptions.width}
        strokeDasharray={pathOptions.dashArray}
        style={{
          strokeDashoffset: isVisible ? 0 : pathLength,
          transition: `stroke-dashoffset ${pathOptions.animationDuration}ms ease-in-out`,
          markerEnd: pathOptions.showArrow ? "url(#tour-arrow)" : undefined
        }}
        strokeDashoffset={isVisible ? 0 : pathLength}
        markerEnd={pathOptions.showArrow ? "url(#tour-arrow)" : undefined}
      />
      
      {/* Optional traveling dot animation */}
      {isVisible && (
        <circle
          r={pathOptions.width * 2}
          fill={pathOptions.color}
          opacity={0.8}
          className="animate-pulse"
        >
          <animateMotion
            dur={`${pathOptions.animationDuration * 1.2}ms`}
            repeatCount="indefinite"
            path={pathD}
          />
        </circle>
      )}
    </svg>
  );
};
