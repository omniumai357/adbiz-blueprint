
import { useCallback, useMemo } from 'react';
import { TourPath, TourStep } from '@/contexts/tour/types';
import { TourDependencyManager } from '@/lib/tour/core/tourDependencyManager';

/**
 * Hook for managing tour step dependencies
 */
export function useTourDependencies(
  currentPath: string | null,
  availablePaths: TourPath[],
  visibleSteps: TourStep[],
  completedStepIds: string[]
) {
  // Get the current path data
  const currentPathData = useMemo(() => {
    if (!currentPath) return null;
    return availablePaths.find(path => path.id === currentPath) || null;
  }, [currentPath, availablePaths]);
  
  // Create a dependency manager for the current path
  const dependencyManager = useMemo(() => {
    if (!currentPathData) return new TourDependencyManager();
    return TourDependencyManager.fromTourPath(currentPathData);
  }, [currentPathData]);
  
  // Check for circular dependencies
  const circularDependencies = useMemo(() => {
    return dependencyManager.validateDependencies();
  }, [dependencyManager]);
  
  // Get available next steps based on dependencies
  const availableNextSteps = useMemo(() => {
    if (!currentPathData) return [];
    return dependencyManager.getNextAvailableSteps(completedStepIds, visibleSteps);
  }, [dependencyManager, completedStepIds, visibleSteps, currentPathData]);
  
  // Check if a specific step can be accessed
  const canAccessStep = useCallback((stepId: string) => {
    return dependencyManager.canAccessStep(stepId, completedStepIds);
  }, [dependencyManager, completedStepIds]);
  
  // Get direct dependencies for a step
  const getStepDependencies = useCallback((stepId: string) => {
    return dependencyManager.getDependencies(stepId);
  }, [dependencyManager]);
  
  // Get steps that depend on a given step
  const getStepDependents = useCallback((stepId: string) => {
    return dependencyManager.getDependentSteps(stepId);
  }, [dependencyManager]);
  
  // Resolve the next step based on branching logic
  const resolveNextStep = useCallback((currentStepId: string) => {
    const currentStep = visibleSteps.find(step => step.id === currentStepId);
    if (!currentStep) return null;
    
    // Check if this step has branching logic
    const branches = currentStep.metadata?.branches as {
      condition: () => boolean;
      targetStepId: string;
    }[] | undefined;
    
    if (!branches || branches.length === 0) return null;
    
    // Find the first branch with a satisfied condition
    const matchedBranch = branches.find(branch => branch.condition());
    return matchedBranch?.targetStepId || null;
  }, [visibleSteps]);
  
  return {
    circularDependencies,
    availableNextSteps,
    canAccessStep,
    getStepDependencies,
    getStepDependents,
    resolveNextStep,
    dependencyManager
  };
}
