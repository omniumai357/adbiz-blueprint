
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { calculatePath, PathOptions } from "@/lib/utils/path-utils";
import { TourPathDot } from "./TourPathDot";

interface TourPathProps {
  sourceElement: HTMLElement;
  targetElement: HTMLElement;
  isActive: boolean;
  options?: Partial<PathOptions>;
  ariaHidden?: boolean;
}

export const TourPath: React.FC<TourPathProps> = ({
  sourceElement,
  targetElement,
  isActive,
  options = {},
  ariaHidden = true
}) => {
  const [svgPath, setSvgPath] = useState<string>("");
  const pathId = useRef(`path-${Math.random().toString(36).substring(2, 9)}`).current;
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Merge with default options
  const pathOptions: PathOptions = {
    style: options.style || "curved",
    color: options.color || "rgba(99, 102, 241, 0.7)",
    width: options.width || 3,
    dashArray: options.dashArray || "5,5",
    animationDuration: options.animationDuration || 1000,
    showArrow: options.showArrow !== undefined ? options.showArrow : true,
    arrowSize: options.arrowSize || 6,
    avoidObstacles: options.avoidObstacles || false,
    tensionFactor: options.tensionFactor || 0.5,
    animationEasing: options.animationEasing || 'ease-in-out'
  };
  
  // Calculate and update path when elements or options change
  useEffect(() => {
    if (!isActive || !sourceElement || !targetElement) return;
    
    // Calculate the path
    const path = calculatePath(sourceElement, targetElement, pathOptions.style);
    setSvgPath(path);
    
    // Position the SVG to cover the entire viewport
    if (svgRef.current) {
      svgRef.current.style.position = "fixed";
      svgRef.current.style.top = "0";
      svgRef.current.style.left = "0";
      svgRef.current.style.width = "100%";
      svgRef.current.style.height = "100%";
      svgRef.current.style.pointerEvents = "none";
      svgRef.current.style.zIndex = "9999";
    }
    
    // Update the path when window is resized or scrolled
    const handleResize = () => {
      const updatedPath = calculatePath(sourceElement, targetElement, pathOptions.style);
      setSvgPath(updatedPath);
    };
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [isActive, sourceElement, targetElement, pathOptions.style]);
  
  // Don't render anything if not active or elements are missing
  if (!isActive || !sourceElement || !targetElement || !svgPath) {
    return null;
  }
  
  // Create the SVG in a portal to ensure it's positioned correctly
  return createPortal(
    <svg 
      ref={svgRef} 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
      role={!ariaHidden ? "graphics-symbol" : undefined}
      aria-label={!ariaHidden ? "Path connecting tour elements" : undefined}
    >
      <defs>
        {pathOptions.showArrow && (
          <marker
            id="arrowhead"
            markerWidth={pathOptions.arrowSize}
            markerHeight={pathOptions.arrowSize}
            refX={pathOptions.arrowSize - 2}
            refY={pathOptions.arrowSize / 2}
            orient="auto"
          >
            <polygon
              points={`0 0, ${pathOptions.arrowSize} ${pathOptions.arrowSize / 2}, 0 ${pathOptions.arrowSize}`}
              fill={pathOptions.color}
            />
          </marker>
        )}
      </defs>
      
      <path
        id={pathId}
        d={svgPath}
        fill="none"
        stroke={pathOptions.color}
        strokeWidth={pathOptions.width}
        strokeDasharray={pathOptions.dashArray}
        strokeDashoffset="0"
        markerEnd={pathOptions.showArrow ? "url(#arrowhead)" : undefined}
        aria-hidden="true"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="1000"
          to="0"
          dur={`${pathOptions.animationDuration}ms`}
          calcMode={pathOptions.animationEasing === 'linear' ? 'linear' : 'spline'}
          keySplines={
            pathOptions.animationEasing === 'ease-in' ? "0.42 0 1 1" :
            pathOptions.animationEasing === 'ease-out' ? "0 0 0.58 1" :
            pathOptions.animationEasing === 'ease-in-out' ? "0.42 0 0.58 1" :
            "0.25 0.1 0.25 1"
          }
          begin="0s"
          fill="freeze"
        />
      </path>
      
      <TourPathDot
        pathId={pathId}
        color={pathOptions.color}
        duration={pathOptions.animationDuration * 2}
        ariaHidden={ariaHidden}
      />
    </svg>,
    document.body
  );
};
