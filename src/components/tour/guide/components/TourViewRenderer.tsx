
import React from "react";
import { TourStep } from "@/contexts/tour/types";
import { TourTooltip } from "../../tooltip/TourTooltip";
import { TourBottomSheetView } from "../../mobile/TourBottomSheetView";
import { TourMobileCompactView } from "../../mobile/TourMobileCompactView";
import { TourDrawerView } from "../../drawer/TourDrawerView";

interface TourViewRendererProps {
  step: TourStep;
  targetElement: HTMLElement | null;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
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
  preferredViewMode: 'tooltip' | 'drawer' | 'compact' | 'fullscreen';
}

/**
 * Component that renders the appropriate tour view based on device and viewport
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
  preferredViewMode
}) => {
  // For very small screens or when drawer mode is preferred
  if (useDrawer && !useCompactView) {
    return (
      <TourDrawerView
        step={step}
        isOpen={true}
        onClose={onClose}
        onNext={onNext}
        onPrev={onPrev}
        currentStep={currentStep}
        totalSteps={totalSteps}
        isLastStep={isLastStep}
        isTablet={isTablet}
        isLandscape={isLandscape}
        direction={direction}
      />
    );
  }
  
  // For landscape mode on mobile or very short screens
  if (useCompactView) {
    return (
      <TourMobileCompactView
        title={step.title}
        content={step.content}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={onNext}
        onPrev={onPrev}
        onClose={onClose}
        nextLabel={step.actions?.next?.text}
        prevLabel={step.actions?.prev?.text}
      />
    );
  }
  
  // For fullscreen presentation mode (not implemented yet)
  if (preferredViewMode === 'fullscreen') {
    // Fallback to drawer view until fullscreen is implemented
    return (
      <TourBottomSheetView
        step={step}
        isOpen={true}
        onClose={onClose}
        onNext={onNext}
        onPrev={onPrev}
        currentStep={currentStep}
        totalSteps={totalSteps}
        isLastStep={isLastStep}
        direction={direction}
      />
    );
  }
  
  // Default desktop tooltip view
  return targetElement ? (
    <TourTooltip
      ref={tooltipRef}
      targetElement={targetElement}
      position={step.position || 'bottom'}
      title={step.title}
      content={step.content}
      stepInfo={stepInfo}
      onNext={onNext}
      onPrev={currentStep > 0 ? onPrev : undefined}
      onClose={onClose}
      isLastStep={isLastStep}
      animation={step.animation}
      media={step.media ? {
        type: step.media.type,
        url: step.media.source, // Map 'source' to expected 'url' property
        alt: step.media.alt,
        animation: step.media.animation
      } : undefined}
      nextLabel={step.actions?.next?.text}
      prevLabel={step.actions?.prev?.text}
      skipLabel={step.actions?.skip?.text}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isRTL={isRTL}
      direction={direction}
    />
  ) : null;
};
