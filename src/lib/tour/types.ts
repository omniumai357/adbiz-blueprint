
import { TourStep } from "@/contexts/tour/types";

export type Position = 'top' | 'right' | 'bottom' | 'left';

export type TourStepEnhancer = (step: TourStep) => TourStep;

export interface TourTheme {
  id: string;
  name: string;
  colors: {
    background: string;
    text: string;
    accent: string;
    border: string;
  };
  borderRadius?: string;
  shadow?: string;
  transitions?: {
    duration: string;
    timing: string;
  };
}
