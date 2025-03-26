/**
 * Scrolls an element into view with options for smooth animation
 * 
 * @param elementId The id of the element to scroll to
 * @param behavior The scroll behavior ('auto' or 'smooth')
 * @param options Additional options for scrolling
 */
export const scrollToElement = (
  elementId: string, 
  behavior: 'auto' | 'smooth' = 'smooth',
  options?: {
    offsetY?: number;
    offsetX?: number;
    block?: ScrollLogicalPosition; 
    inline?: ScrollLogicalPosition;
  }
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const {
    offsetY = 0,
    offsetX = 0,
    block = 'center',
    inline = 'nearest'
  } = options || {};
  
  // If offsets are provided, use scrollTo with calculation
  if (offsetY !== 0 || offsetX !== 0) {
    const rect = element.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - offsetY;
    const targetX = window.scrollX + rect.left - offsetX;
    
    window.scrollTo({
      top: targetY,
      left: targetX,
      behavior
    });
  } else {
    // Otherwise use the standard scrollIntoView
    element.scrollIntoView({
      behavior,
      block,
      inline
    });
  }
};

/**
 * Determines if an element is currently visible in the viewport
 * 
 * @param element The element to check visibility for
 * @param partiallyVisible Whether to count partially visible elements
 * @returns Boolean indicating if the element is visible
 */
export const isElementInViewport = (
  element: HTMLElement,
  partiallyVisible = false
): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const vertInView = partiallyVisible
    ? rect.top <= windowHeight && rect.bottom >= 0
    : rect.top >= 0 && rect.bottom <= windowHeight;
    
  const horizInView = partiallyVisible
    ? rect.left <= windowWidth && rect.right >= 0
    : rect.left >= 0 && rect.right <= windowWidth;
    
  return vertInView && horizInView;
};

/**
 * Gets the best position for a tooltip based on available space
 * 
 * @param element The target element
 * @param preferredPosition The preferred position
 * @returns The optimal position based on available space
 */
export const getBestTooltipPosition = (
  element: HTMLElement,
  preferredPosition: 'top' | 'right' | 'bottom' | 'left' = 'bottom'
): 'top' | 'right' | 'bottom' | 'left' => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  
  // Minimum space needed in pixels
  const minSpace = 150;
  
  // Available space in each direction
  const spaceTop = rect.top;
  const spaceRight = windowWidth - rect.right;
  const spaceBottom = windowHeight - rect.bottom;
  const spaceLeft = rect.left;
  
  // Check if preferred position has enough space
  switch (preferredPosition) {
    case 'top':
      if (spaceTop >= minSpace) return 'top';
      break;
    case 'right':
      if (spaceRight >= minSpace) return 'right';
      break;
    case 'bottom':
      if (spaceBottom >= minSpace) return 'bottom';
      break;
    case 'left':
      if (spaceLeft >= minSpace) return 'left';
      break;
  }
  
  // Find the direction with maximum space
  const maxSpace = Math.max(spaceTop, spaceRight, spaceBottom, spaceLeft);
  
  if (maxSpace === spaceTop) return 'top';
  if (maxSpace === spaceRight) return 'right';
  if (maxSpace === spaceBottom) return 'bottom';
  return 'left';
};
