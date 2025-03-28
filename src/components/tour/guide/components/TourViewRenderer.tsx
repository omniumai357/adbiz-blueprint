
import React from "react";
import { TourStep } from "@/contexts/tour/types";
import { TourTooltip } from "./TourTooltip";
import { TourDrawer } from "./TourDrawer";
import { TourCompactView } from "./TourCompactView";
import { TourSpotlight } from "./TourSpotlight";
import { Position } from "@/lib/tour/types";

interface TourViewRendererProps {
  step: TourStep;
  targetElement: HTMLElement | null;
  isRTL: boolean;
  direction: "ltr" | "rtl";
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  isLastStep: boolean;
  stepInfo: string;
  tooltipRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  useDrawer: boolean;
  useCompactView: boolean;
  preferredViewMode?: "tooltip" | "drawer" | "compact" | "auto";
}

/**
 * TourViewRenderer component
 * 
 * This component determines which view to render based on device and configuration.
 * It can render either:
 * - Tooltip: Default desktop view that positions near elements
 * - Drawer: Mobile-optimized view that slides up from bottom
 * - Compact: Space-efficient view for smaller screens
 */
export const TourViewRenderer: React.FC<TourViewRendererProps> = ({
  step,
  targetElement,
  isRTL,
  direction,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
  isLastStep,
  stepInfo,
  tooltipRef,
  isMobile,
  isTablet,
  isLandscape,
  useDrawer,
  useCompactView,
  preferredViewMode = "auto"
}) => {
  // Determine the position of the tooltip
  const position = step.position || "bottom";

  // Convert position to take RTL into account if needed
  const getAdjustedPosition = (pos: Position): Position => {
    if (!isRTL) return pos;
    
    // In RTL mode, flip left/right positions
    if (pos === "left") return "right";
    if (pos === "right") return "left";
    return pos;
  };

  const adjustedPosition = getAdjustedPosition(position as Position);

  // Choose the view to render based on device and preferences
  const shouldRenderTooltip = 
    (preferredViewMode === "tooltip") || 
    (preferredViewMode === "auto" && !useDrawer && !useCompactView);
  
  const shouldRenderDrawer = 
    (preferredViewMode === "drawer") || 
    (preferredViewMode === "auto" && useDrawer);
  
  const shouldRenderCompact = 
    (preferredViewMode === "compact") || 
    (preferredViewMode === "auto" && useCompactView);

  // Extract extended properties from step
  const mediaContent = step.media ? {
    type: step.media.type,
    url: step.media.url,
    alt: step.media.alt || "",
    animation: step.media.animation
  } : undefined;

  const transitionEffect = step.transition;
  const spotlightConfig = step.spotlight;

  return (
    <>
      {/* Render spotlight effect if configured */}
      {spotlightConfig && targetElement && (
        <TourSpotlight 
          targetElement={targetElement}
          intensity={spotlightConfig.intensity || "medium"}
          color={spotlightConfig.color}
          pulseEffect={spotlightConfig.pulseEffect}
          fadeBackground={spotlightConfig.fadeBackground}
        />
      )}

      {/* Render the appropriate view based on device and configuration */}
      {shouldRenderTooltip && (
        <TourTooltip
          title={step.title}
          content={step.content}
          targetElement={targetElement}
          position={adjustedPosition}
          onNext={onNext}
          onPrev={onPrev}
          onClose={onClose}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isLastStep={isLastStep}
          stepInfo={stepInfo}
          media={mediaContent}
          tooltipRef={tooltipRef}
          isRTL={isRTL}
          transition={transitionEffect}
        />
      )}

      {shouldRenderDrawer && (
        <TourDrawer
          title={step.title}
          content={step.content}
          onNext={onNext}
          onPrev={onPrev}
          onClose={onClose}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isLastStep={isLastStep}
          stepInfo={stepInfo}
          media={mediaContent}
          isLandscape={isLandscape}
          isRTL={isRTL}
        />
      )}

      {shouldRenderCompact && (
        <TourCompactView
          title={step.title}
          content={step.content}
          onNext={onNext}
          onPrev={onPrev}
          onClose={onClose}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isLastStep={isLastStep}
          stepInfo={stepInfo}
          media={mediaContent}
          isRTL={isRTL}
        />
      )}
    </>
  );
};
