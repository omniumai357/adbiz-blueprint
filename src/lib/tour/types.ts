
import { TourStep } from "@/contexts/tour/types";

// Define TourStepEnhancer type which was missing
export type TourStepEnhancer = (step: TourStep) => TourStep;

// Define TourStepAction interface to include label property
export interface TourStepAction {
  text?: string;
  label?: string; // Added to support legacy code
  callback?: () => void;
  hidden?: boolean;
}
