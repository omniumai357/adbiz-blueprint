
import React, { useEffect } from "react";
import { TourStep } from "@/contexts/tour/types";
import { TourTooltip } from "./TourTooltip";
import { MobileTourView } from "../../mobile/MobileTourView";
import { TourSpotlight } from "./TourSpotlight";
import { Position } from "@/lib/tour/types";
import { logger } from "@/lib/utils/logging";

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
  preferredViewMode: "tooltip" | "drawer" | "compact" | "fullscreen";
  isOrientationChanging?: boolean;
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
  preferredViewMode,
  isOrientationChanging = false
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

  // Log view selection for debugging
  useEffect(() => {
    logger.debug('Tour view selection', {
      context: 'TourViewRenderer',
      data: {
        preferredViewMode,
        useDrawer,
        useCompactView,
        isOrientationChanging,
        deviceInfo: {
          isMobile,
          isTablet,
          isLandscape
        }
      }
    });
  }, [preferredViewMode, useDrawer, useCompactView, isOrientationChanging, isMobile, isTablet, isLandscape]);

  // Improved view mode selection logic with clearer rules
  const determineViewMode = (): 'tooltip' | 'mobile' => {
    // During orientation changes, return the current mode to prevent flickering
    if (isOrientationChanging) {
      return preferredViewMode === 'fullscreen' ? 'mobile' : 
             (preferredViewMode === 'drawer' || preferredViewMode === 'compact') ? 'mobile' : 'tooltip';
    }
    
    // On mobile, use mobile views
    if (isMobile) {
      return 'mobile';
    }
    
    // On tablets, consider orientation
    if (isTablet) {
      return isLandscape ? 'tooltip' : 'mobile';
    }
    
    // For larger screens, default to tooltip
    return 'tooltip';
  };
  
  // If there's an explicit preference, use it, otherwise determine automatically
  const viewMode = preferredViewMode !== 'fullscreen' 
    ? (preferredViewMode === 'drawer' || preferredViewMode === 'compact' ? 'mobile' : 'tooltip')
    : determineViewMode();
  
  // During orientation changes, use a stable view to prevent flickering
  const isTransitioning = isOrientationChanging;

  // Extract extended properties from step
  const mediaContent = step.media ? {
    type: step.media.type,
    url: step.media.url,
    alt: step.media.alt || "",
    animation: step.media.animation
  } : undefined;

  const transitionEffect = step.transition;
  const spotlightConfig = step.spotlight;
  
  // Create responsive class based on device
  const responsiveClass = isMobile 
    ? "tour-mobile" 
    : isTablet 
      ? "tour-tablet" 
      : "tour-desktop";
  
  // Touch-specific classes
  const touchClass = isMobile || isTablet 
    ? "touch-optimized" 
    : "";

  if (isTransitioning) {
    // During transition, show a simplified placeholder to prevent flickering
    return (
      <div className="tour-transition-placeholder">
        {/* Simple loading indicator during orientation change */}
        <div className="tour-loading-indicator"></div>
      </div>
    );
  }

  return (
    <div className={`tour-view-container ${responsiveClass} ${touchClass}`} data-testid="tour-view-container">
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

      {/* Render the appropriate view based on viewMode */}
      {viewMode === 'tooltip' && (
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

      {viewMode === 'mobile' && (
        <MobileTourView
          step={step}
          isOpen={true}
          isLandscape={isLandscape}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={onNext}
          onPrev={onPrev}
          onClose={onClose}
          isLastStep={isLastStep}
          direction={direction}
        />
      )}
    </div>
  );
}
