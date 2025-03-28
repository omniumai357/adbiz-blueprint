
import { useState, useEffect, useCallback } from "react";

interface UseAnimatedMountOptions {
  mountDelay?: number;
  confettiDelay?: number;
  stepInterval?: number;
  steps?: string[];
  onAllStepsCompleted?: () => void;
}

/**
 * Enhanced hook for managing mount animations with customizable timing and steps
 */
export function useAnimatedMount({
  mountDelay = 100,
  confettiDelay = 300,
  stepInterval = 600,
  steps = ["Order processing", "Payment confirmation", "Invoice generation", "Order completion"],
  onAllStepsCompleted
}: UseAnimatedMountOptions = {}) {
  const [mounted, setMounted] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  const resetAnimation = useCallback(() => {
    setMounted(false);
    setConfettiActive(false);
    setCompletedSteps([]);
  }, []);
  
  useEffect(() => {
    // Trigger mount animation
    const mountTimer = setTimeout(() => setMounted(true), mountDelay);
    
    // Trigger confetti animation
    const confettiTimer = setTimeout(() => setConfettiActive(true), confettiDelay);
    
    // Simulate completion steps
    let currentStep = 0;
    
    const stepTimer = setInterval(() => {
      if (currentStep < steps.length) {
        setCompletedSteps(prev => [...prev, steps[currentStep]]);
        currentStep++;
        
        // Call callback when all steps are completed
        if (currentStep === steps.length && onAllStepsCompleted) {
          onAllStepsCompleted();
        }
      } else {
        clearInterval(stepTimer);
      }
    }, stepInterval);
    
    return () => {
      clearTimeout(mountTimer);
      clearTimeout(confettiTimer);
      clearInterval(stepTimer);
    };
  }, [mountDelay, confettiDelay, stepInterval, steps, onAllStepsCompleted]);
  
  return { 
    mounted, 
    confettiActive, 
    completedSteps,
    resetAnimation
  };
}
