
import { useState, useEffect } from 'react';
import { useResponsiveTour } from '@/contexts/tour/ResponsiveTourContext';
import { Position } from '@/lib/tour/types';

interface PositionOutput {
  position: Position;
  arrowPosition: {
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
  };
}

/**
 * Hook to calculate the optimal position of a tour tooltip relative to a target element
 * based on available space and device constraints
 * 
 * @param targetRect The bounding rectangle of the target element
 * @param preferredPosition The preferred position for the tooltip
 * @returns The optimal position and arrow positioning information
 */
export function useTourPosition(
  targetRect: DOMRect | null,
  preferredPosition: Position = 'bottom'
): PositionOutput {
  const { 
    screenWidth, 
    screenHeight, 
    isMobile, 
    isLandscape,
    getOptimalPosition
  } = useResponsiveTour();
  
  const [position, setPosition] = useState<Position>(preferredPosition);
  const [arrowPosition, setArrowPosition] = useState<{
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
  }>({});

  useEffect(() => {
    if (!targetRect) {
      return;
    }

    // Set a default tooltip size (can be adjusted based on actual tooltip size)
    const tooltipWidth = isMobile ? 280 : 320;
    const tooltipHeight = 200;
    
    // Calculate available space in each direction
    const spaceAbove = targetRect.top;
    const spaceBelow = screenHeight - (targetRect.top + targetRect.height);
    const spaceToLeft = targetRect.left;
    const spaceToRight = screenWidth - (targetRect.left + targetRect.width);
    
    // Determine best position based on available space and preferred position
    let bestPosition: Position = preferredPosition;
    
    // For mobile devices in landscape, prefer top or bottom positioning
    if (isMobile && isLandscape) {
      bestPosition = spaceBelow >= tooltipHeight ? 'bottom' : 'top';
    } else {
      // Override preferred position if there's not enough space
      if (preferredPosition === 'top' && spaceAbove < tooltipHeight) {
        bestPosition = spaceBelow >= tooltipHeight ? 'bottom' : 
                      spaceToRight >= tooltipWidth ? 'right' : 'left';
      } else if (preferredPosition === 'bottom' && spaceBelow < tooltipHeight) {
        bestPosition = spaceAbove >= tooltipHeight ? 'top' : 
                      spaceToRight >= tooltipWidth ? 'right' : 'left';
      } else if (preferredPosition === 'left' && spaceToLeft < tooltipWidth) {
        bestPosition = spaceToRight >= tooltipWidth ? 'right' : 
                      spaceBelow >= tooltipHeight ? 'bottom' : 'top';
      } else if (preferredPosition === 'right' && spaceToRight < tooltipWidth) {
        bestPosition = spaceToLeft >= tooltipWidth ? 'left' : 
                      spaceBelow >= tooltipHeight ? 'bottom' : 'top';
      }
    }
    
    // Calculate arrow position based on final tooltip position
    const newArrowPosition: {
      top?: string | number;
      left?: string | number;
      right?: string | number;
      bottom?: string | number;
    } = {};
    
    // Center of the target element
    const targetCenterX = targetRect.width / 2;
    const targetCenterY = targetRect.height / 2;
    
    switch (bestPosition) {
      case 'top':
        newArrowPosition.bottom = 0;
        newArrowPosition.left = targetCenterX;
        break;
      case 'bottom':
        newArrowPosition.top = 0;
        newArrowPosition.left = targetCenterX;
        break;
      case 'left':
        newArrowPosition.right = 0;
        newArrowPosition.top = targetCenterY;
        break;
      case 'right':
        newArrowPosition.left = 0;
        newArrowPosition.top = targetCenterY;
        break;
    }
    
    setPosition(bestPosition);
    setArrowPosition(newArrowPosition);
  }, [targetRect, preferredPosition, screenWidth, screenHeight, isMobile, isLandscape]);

  return { position, arrowPosition };
}
