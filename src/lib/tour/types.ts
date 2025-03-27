
import { TourStep } from "@/contexts/tour/types";

// Export TourStep & add TourStepEnhancer type
export type { TourStep } from "@/contexts/tour/types";
export type { TourPath } from "@/contexts/tour/types";
export type { TourStepGroup } from "@/contexts/tour/types";

// Define and export TourStepEnhancer type
export type TourStepEnhancer = (step: TourStep) => TourStep;

// Define TourStepAction interface to include label property
export interface TourStepAction {
  text?: string;
  label?: string; // Added to support legacy code
  callback?: () => void;
  hidden?: boolean;
}
