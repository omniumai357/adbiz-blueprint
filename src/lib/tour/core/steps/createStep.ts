
import { TourStep } from "@/contexts/tour/types";

/**
 * Creates a basic tour step with required fields
 * 
 * @param id Unique step identifier
 * @param elementId Target DOM element ID
 * @param title Step title
 * @param content Step content
 * @param position Position relative to target element
 * @returns A basic TourStep
 */
export function createStep(
  id: string,
  elementId: string,
  title: string,
  content: string,
  position: "top" | "right" | "bottom" | "left" = "bottom"
): TourStep {
  return {
    id,
    elementId,
    title,
    content,
    position
  };
}
