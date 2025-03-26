/**
 * Path utilities for creating animated guides between tour elements
 */

/**
 * Calculate a path between two elements
 */
export function calculatePath(
  sourceElement: HTMLElement,
  targetElement: HTMLElement,
  style: PathStyle = "curved"
): string {
  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  // Calculate optimal path points instead of just centers
  const { start, end } = calculateOptimalPathPoints(sourceElement, targetElement);
  
  // Generate different path types
  switch (style) {
    case "direct":
      // Straight line from source to target
      return `M ${start.x},${start.y} L ${end.x},${end.y}`;
    
    case "angled":
      // Right-angle path with intelligent routing
      return createAngledPath(start, end);
    
    case "curved":
    default:
      // Bezier curve for a more natural path
      return createCurvedPath(start, end);
  }
}

/**
 * Calculate optimal path start/end points at element edges instead of centers
 */
export function calculateOptimalPathPoints(
  sourceElement: HTMLElement,
  targetElement: HTMLElement
): { start: Point; end: Point } {
  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  
  // Determine which points on the elements' perimeters to use
  // For simplicity, we'll use the center of the closest edges
  
  // Calculate centers
  const sourceCenter = {
    x: sourceRect.left + sourceRect.width / 2,
    y: sourceRect.top + sourceRect.height / 2
  };
  
  const targetCenter = {
    x: targetRect.left + targetRect.width / 2,
    y: targetRect.top + targetRect.height / 2
  };
  
  // Determine source anchor point
  const sourcePoint = findEdgePoint(sourceRect, targetCenter);
  
  // Determine target anchor point
  const targetPoint = findEdgePoint(targetRect, sourceCenter);
  
  return {
    start: {
      x: sourcePoint.x + window.scrollX,
      y: sourcePoint.y + window.scrollY
    },
    end: {
      x: targetPoint.x + window.scrollX,
      y: targetPoint.y + window.scrollY
    }
  };
}

/**
 * Create an angled path with intelligent routing
 */
function createAngledPath(start: Point, end: Point): string {
  // Determine if we should go horizontal first or vertical first
  // based on the relative positions and distances
  const deltaX = Math.abs(end.x - start.x);
  const deltaY = Math.abs(end.y - start.y);
  
  // If elements are more separated horizontally, go horizontal first
  if (deltaX > deltaY) {
    return `M ${start.x},${start.y} H ${end.x} V ${end.y}`;
  } else {
    // Otherwise go vertical first
    return `M ${start.x},${start.y} V ${end.y} H ${end.x}`;
  }
}

/**
 * Create a curved path with dynamic control points based on distance
 */
function createCurvedPath(start: Point, end: Point): string {
  const distance = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );
  
  // Adjust curve strength based on distance
  const curveOffset = Math.min(
    200,
    Math.max(50, distance / 2.5)
  );
  
  // Determine primary direction
  const isHorizontal = Math.abs(end.x - start.x) > Math.abs(end.y - start.y);
  
  // Create control points based on direction
  if (isHorizontal) {
    return `M ${start.x},${start.y} 
            C ${start.x + curveOffset},${start.y} 
              ${end.x - curveOffset},${end.y} 
              ${end.x},${end.y}`;
  } else {
    return `M ${start.x},${start.y} 
            C ${start.x},${start.y + curveOffset} 
              ${end.x},${end.y - curveOffset} 
              ${end.x},${end.y}`;
  }
}

/**
 * Find the best point on an element's edge to start/end a path
 */
function findEdgePoint(
  rect: DOMRect, 
  targetPoint: Point
): Point {
  const center = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
  
  // Calculate angle to target
  const dx = targetPoint.x - center.x;
  const dy = targetPoint.y - center.y;
  const angle = Math.atan2(dy, dx);
  
  // Normalized direction vector
  const direction = {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };
  
  // Calculate intersection with rectangle
  let t1 = Infinity, t2 = Infinity;
  
  if (Math.abs(direction.x) > 0.001) {
    // Time to intersect with vertical edges
    const tx1 = (rect.left - center.x) / direction.x;
    const tx2 = (rect.right - center.x) / direction.x;
    t1 = (tx1 > 0) ? tx1 : t1;
    t2 = (tx2 > 0) ? tx2 : t2;
  }
  
  if (Math.abs(direction.y) > 0.001) {
    // Time to intersect with horizontal edges
    const ty1 = (rect.top - center.y) / direction.y;
    const ty2 = (rect.bottom - center.y) / direction.y;
    t1 = (ty1 > 0 && ty1 < t1) ? ty1 : t1;
    t2 = (ty2 > 0 && ty2 < t2) ? ty2 : t2;
  }
  
  // Use the closest intersection point
  const t = Math.min(t1, t2);
  
  return {
    x: center.x + direction.x * t,
    y: center.y + direction.y * t
  };
}

/**
 * Find path clearance to avoid obstacles
 * @param start Starting point
 * @param end Ending point
 * @returns Modified path that avoids obstacles
 */
export function findClearPath(start: Point, end: Point): Point[] {
  // In a real implementation, this would check for DOM elements in the way
  // and calculate a path around them. For now, we'll return a simple path.
  return [start, end];
}

// Types for path utilities
export type PathStyle = "direct" | "curved" | "angled" | "obstacle-avoiding";

export interface Point {
  x: number;
  y: number;
}

export interface PathOptions {
  style: PathStyle;
  color?: string;
  width?: number;
  dashArray?: string;
  animationDuration?: number;
  showArrow?: boolean;
  arrowSize?: number;
  avoidObstacles?: boolean;
  tensionFactor?: number;
  animationEasing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

/**
 * Default path animation options
 */
export const defaultPathOptions: PathOptions = {
  style: "curved",
  color: "rgba(99, 102, 241, 0.7)", // Indigo color
  width: 3,
  dashArray: "5,5",
  animationDuration: 1000,
  showArrow: true,
  arrowSize: 6,
  avoidObstacles: false,
  tensionFactor: 0.5,
  animationEasing: 'ease-in-out'
};
