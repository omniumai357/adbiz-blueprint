
import { useState, useEffect } from 'react';

type Position = 'top' | 'right' | 'bottom' | 'left';

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
 * Hook to calculate the position of a tour tooltip relative to a target element
 */
export function useTourPosition(
  targetRect: DOMRect | null,
  preferredPosition: Position = 'bottom'
): PositionOutput {
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

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Set a default tooltip size (can be adjusted based on actual tooltip size)
    const tooltipWidth = 280;
    const tooltipHeight = 200;
    
    // Calculate available space in each direction
    const spaceAbove = targetRect.top;
    const spaceBelow = viewportHeight - (targetRect.top + targetRect.height);
    const spaceToLeft = targetRect.left;
    const spaceToRight = viewportWidth - (targetRect.left + targetRect.width);
    
    // Determine best position based on available space and preferred position
    let bestPosition: Position = preferredPosition;
    
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
  }, [targetRect, preferredPosition]);

  return { position, arrowPosition };
}
