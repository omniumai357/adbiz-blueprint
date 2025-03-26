
import React, { createContext, useContext, useEffect, useRef } from "react";
import { useTourController } from "@/hooks/tour/useTourController";
import { useLocation } from "react-router-dom";
import { useAuthUser } from "@/hooks/queries/useAuthUser";
import { useAuth } from "@/contexts/auth-context";
import { DynamicContentProvider } from "@/hooks/tour/analytics/types";
import { PathOptions } from "@/lib/utils/path-utils";

export type StepConditionFn = () => boolean | Promise<boolean>;

export type StepAnimation = {
  entry?: string;
  exit?: string;
  highlight?: string;
  transition?: string;
  duration?: number;
};

export type StepTrigger = {
  event?: string;
  elementId?: string;
  action?: string;
  delay?: number;
};

export type StepUserRole = "anonymous" | "user" | "admin" | string;

export type TourStep = {
  id: string;
  elementId: string;
  title: string;
  content: string;
  position?: "top" | "right" | "bottom" | "left";
  condition?: StepConditionFn;
  animation?: StepAnimation;
  isOptional?: boolean;
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  };
  actions?: {
    next?: {
      label?: string;
      onClick?: () => void;
    };
    prev?: {
      label?: string;
      onClick?: () => void;
    };
    skip?: {
      label?: string;
      onClick?: () => void;
    };
  };
  userRoles?: StepUserRole[];
  triggers?: StepTrigger[];
  priority?: number;
  metadata?: Record<string, any>;
  spotlight?: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
  transition?: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  };
  path?: {
    enabled?: boolean;
    targetElementId?: string;
    style?: "direct" | "curved" | "angled";
    color?: string;
    width?: number;
    dashArray?: string;
    animationDuration?: number;
    showArrow?: boolean;
    arrowSize?: number;
  } & Partial<PathOptions>;
  // Accessibility properties
  ariaLive?: "off" | "polite" | "assertive";
  focusOnOpen?: boolean;
  keyboardShortcuts?: {
    next?: string;
    previous?: string;
    close?: string;
  };
};

export type TourPath = {
  id: string;
  name: string;
  steps: TourStep[];
  allowSkip?: boolean;
  showProgress?: boolean;
  autoStart?: boolean;
  requiredUserRoles?: StepUserRole[];
  completionCallback?: () => void;
  metadata?: Record<string, any>;
  accessibility?: {
    announceSteps?: boolean;
    keyboardNavigation?: boolean;
    restoreFocus?: boolean;
    focusTrap?: boolean;
  };
};

type TourContextType = {
  isActive: boolean;
  currentPath: string | null;
  currentStep: number;
  totalSteps: number;
  startTour: (pathId: string) => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  currentStepData: TourStep | null;
  availablePaths: TourPath[];
  handleKeyNavigation: (event: React.KeyboardEvent) => void;
  visibleSteps: TourStep[];
  setDynamicContent: (stepId: string, content: string) => void;
};

const defaultContext: TourContextType = {
  isActive: false,
  currentPath: null,
  currentStep: 0,
  totalSteps: 0,
  startTour: () => {},
  endTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  currentStepData: null,
  availablePaths: [],
  handleKeyNavigation: () => {},
  visibleSteps: [],
  setDynamicContent: () => {},
};

const TourContext = createContext<TourContextType>(defaultContext);

export const useTour = () => useContext(TourContext);

export const TourProvider: React.FC<{ 
  children: React.ReactNode;
  currentPathname?: string;
}> = ({ children, currentPathname }) => {
  const location = useLocation();
  const pathname = currentPathname || location.pathname;
  const announcerRef = useRef<HTMLDivElement | null>(null);
  
  // Create screen reader announcer
  useEffect(() => {
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.id = 'tour-sr-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }
    
    return () => {
      if (announcerRef.current && document.body.contains(announcerRef.current)) {
        document.body.removeChild(announcerRef.current);
      }
    };
  }, []);
  
  // Try to get user information from the auth context first
  let userId: string | undefined;
  let userType: string | undefined;
  
  try {
    // Use the auth context if available
    const { user, profile } = useAuth();
    userId = user?.id;
    userType = profile?.role || 'anonymous';
  } catch (error) {
    // Fallback to useAuthUser if auth context isn't available
    const { data: authData } = useAuthUser();
    userId = authData?.user?.id;
    userType = 'anonymous'; // Default user type when profile isn't available
  }
  
  // Use our hook to manage tour state with user context for analytics
  const tourController = useTourController([], pathname, userId, userType);
  
  // Announce tour changes to screen readers
  useEffect(() => {
    if (tourController.isActive && tourController.currentStepData && announcerRef.current) {
      const { title, content } = tourController.currentStepData;
      const stepNumber = tourController.currentStep + 1;
      const announcement = `Step ${stepNumber} of ${tourController.totalSteps}: ${title}`;
      
      // Clear it first (hack to ensure it re-announces even if the text is the same)
      announcerRef.current.textContent = '';
      
      // Schedule the announcement for the next tick
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = announcement;
        }
      }, 50);
    }
  }, [tourController.isActive, tourController.currentStep, tourController.currentStepData]);

  return <TourContext.Provider value={tourController}>{children}</TourContext.Provider>;
};
