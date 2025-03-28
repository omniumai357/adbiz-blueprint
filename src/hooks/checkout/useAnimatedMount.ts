
import { useState, useEffect } from "react";

/**
 * Hook for managing mount animations with delayed activation
 */
export function useAnimatedMount() {
  const [mounted, setMounted] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  useEffect(() => {
    // Trigger mount animation
    const mountTimer = setTimeout(() => setMounted(true), 100);
    
    // Trigger confetti animation
    const confettiTimer = setTimeout(() => setConfettiActive(true), 300);
    
    // Simulate completion steps
    const steps = ["Order processing", "Payment confirmation", "Invoice generation", "Order completion"];
    let currentStep = 0;
    
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setCompletedSteps(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(stepInterval);
      }
    }, 600);
    
    return () => {
      clearTimeout(mountTimer);
      clearTimeout(confettiTimer);
      clearInterval(stepInterval);
    };
  }, []);
  
  return { mounted, confettiActive, completedSteps };
}
