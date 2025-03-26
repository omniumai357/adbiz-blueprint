
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

  // Calculate source and target center points
  const sourceX = sourceRect.left + sourceRect.width / 2 + window.scrollX;
  const sourceY = sourceRect.top + sourceRect.height / 2 + window.scrollY;
  const targetX = targetRect.left + targetRect.width / 2 + window.scrollX;
  const targetY = targetRect.top + targetRect.height / 2 + window.scrollY;

  // Generate different path types
  switch (style) {
    case "direct":
      // Straight line from source to target
      return `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
    
    case "angled":
      // Right-angle path (horizontal then vertical)
      return `M ${sourceX},${sourceY} H ${targetX} V ${targetY}`;
    
    case "curved":
    default:
      // Bezier curve for a more natural path
      const curveOffset = Math.min(
        100,
        Math.max(50, Math.abs(targetX - sourceX) / 3)
      );
      return `M ${sourceX},${sourceY} 
              C ${sourceX + curveOffset},${sourceY} 
                ${targetX - curveOffset},${targetY} 
                ${targetX},${targetY}`;
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

// Types for path utilities
export type PathStyle = "direct" | "curved" | "angled";

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
  arrowSize: 6
};
