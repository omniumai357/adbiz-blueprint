
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Update import to use the correct path
import { useAuth } from '@/features/auth';
import { TourPath, TourStep } from './types';
import { loadTourPath } from '@/hooks/tour/controller/tour-loader';

export interface TourContextProps {
  isActive: boolean;
  currentStep: number;
  currentPath: string | null;
  currentPathData: TourPath | undefined;
  currentStepData: TourStep | null;
  totalSteps: number;
  visibleSteps: TourStep[];
  tourPaths: TourPath[];
  startTour: (pathId: string) => void;
  endTour: () => void;
  goToStep: (stepIndex: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  registerTour: (path: TourPath) => void;
  unregisterTour: (pathId: string) => void;
  setTourPaths: React.Dispatch<React.SetStateAction<TourPath[]>>;
  setVisibleSteps: React.Dispatch<React.SetStateAction<TourStep[]>>;
}

const TourContext = createContext<TourContextProps | undefined>(undefined);

interface TourProviderProps {
  children: React.ReactNode;
  currentPathname?: string;
}

export const TourProvider: React.FC<TourProviderProps> = ({
  children,
  currentPathname
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [tourPaths, setTourPaths] = useState<TourPath[]>([]);
  const [visibleSteps, setVisibleSteps] = useState<TourStep[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Load tour paths on component mount
  useEffect(() => {
    const loadInitialTours = async () => {
      // Example: Load a tour based on the current pathname
      if (currentPathname) {
        const pathId = `${currentPathname.replace(/\//g, '-')}-tour`.replace(/^-/, '');
        const loadedPath = await loadTourPath(pathId);
        if (loadedPath) {
          setTourPaths(prev => [...prev, loadedPath]);
        }
      }
      
      // Example: Load a default demo tour
      const demoTour = await loadTourPath('demo-tour');
      if (demoTour) {
        setTourPaths(prev => [...prev, demoTour]);
      }
    };
    
    loadInitialTours();
  }, [currentPathname]);

  // Find current path data
  const currentPathData = useMemo(() => {
    return tourPaths.find(path => path.id === currentPath) || undefined;
  }, [currentPath, tourPaths]);

  // Find current step data
  const currentStepData = useMemo(() => {
    return visibleSteps[currentStep] || null;
  }, [currentStep, visibleSteps]);

  const totalSteps = useMemo(() => {
    return visibleSteps.length;
  }, [visibleSteps]);

  // Start tour function
  const startTour = useCallback((pathId: string) => {
    const path = tourPaths.find(p => p.id === pathId);
    if (!path) {
      console.warn(`Tour path with id "${pathId}" not found.`);
      return;
    }

    setIsActive(true);
    setCurrentPath(pathId);
    setCurrentStep(0);
    setVisibleSteps(path.steps);
    
    // Navigate to the tour route if it exists
    if (path.route) {
      navigate(path.route);
    }
  }, [tourPaths, navigate]);

  // End tour function
  const endTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setCurrentPath(null);
    setVisibleSteps([]);
  }, []);

  // Go to step function
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
    }
  }, [totalSteps]);

  // Next step function
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endTour();
    }
  }, [currentStep, totalSteps, endTour]);

  // Previous step function
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);
  
  // Register tour function
  const registerTour = useCallback((path: TourPath) => {
    setTourPaths(prev => [...prev, path]);
  }, []);
  
  // Unregister tour function
  const unregisterTour = useCallback((pathId: string) => {
    setTourPaths(prev => prev.filter(path => path.id !== pathId));
  }, []);

  const value = useMemo(() => ({
    isActive,
    currentStep,
    currentPath,
    currentPathData,
    currentStepData,
    totalSteps,
    visibleSteps,
    tourPaths,
    startTour,
    endTour,
    goToStep,
    nextStep,
    prevStep,
    registerTour: registerTour,
    unregisterTour: unregisterTour,
    setTourPaths,
    setVisibleSteps
  }), [
    isActive,
    currentStep,
    currentPath,
    currentPathData,
    currentStepData,
    totalSteps,
    visibleSteps,
    tourPaths,
    startTour,
    endTour,
    goToStep,
    nextStep,
    prevStep,
    registerTour,
    unregisterTour,
    setTourPaths,
    setVisibleSteps
  ]);

  // Reset tour when location changes
  useEffect(() => {
    if (isActive && currentPathData?.route !== location.pathname) {
      endTour();
    }
  }, [location.pathname, isActive, endTour, currentPathData?.route]);

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = React.useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
