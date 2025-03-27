
// If this file exists, we'll extend it. 
// If it doesn't exist, we'll create a basic version here

export interface TourPathVisualization {
  enabled: boolean;
  targetElementId: string;
  style?: string;
  waypoints?: any[];
  color?: string;
  animationDuration?: number;
  showArrow?: boolean;
}

export interface TourStepAction {
  text?: string;
  hidden?: boolean;
  callback?: () => void;
}

export interface TourStepActions {
  next?: TourStepAction;
  prev?: TourStepAction;
  skip?: TourStepAction;
  finish?: TourStepAction;
  close?: TourStepAction;
}

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  placement?: "top" | "right" | "bottom" | "left";
  actions?: TourStepActions;
  condition?: (state: any) => boolean;
  priority?: number;
  triggers?: string[];
  triggerData?: any[];
  pathVisualization?: TourPathVisualization;
}

export interface TourPath {
  id: string;
  name: string;
  description?: string;
  steps: TourStep[];
}

export interface TourStepData {
  stepId: string;
  pathId: string;
  tourId: string;
  tourName: string;
  stepIndex: number;
  totalSteps: number;
  userId: string;
  userType: string;
}

export interface TourStartData extends Omit<TourStepData, 'stepId'> {}

export interface TourCompleteData extends Omit<TourStepData, 'stepId'> {}

export type TourStepEnhancer = (step: TourStep) => TourStep;
