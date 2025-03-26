
import React, { useEffect } from "react";

interface TourEventListenersProps {
  handleNext: () => void;
  handlePrev?: () => void;
  handleClose: () => void;
}

export const TourEventListeners: React.FC<TourEventListenersProps> = ({
  handleNext,
  handlePrev,
  handleClose
}) => {
  useEffect(() => {
    const handleNextEvent = () => handleNext();
    const handlePrevEvent = () => handlePrev && handlePrev();
    const handleCloseEvent = () => handleClose();
    
    document.addEventListener('tour:next', handleNextEvent);
    document.addEventListener('tour:previous', handlePrevEvent);
    document.addEventListener('tour:escape', handleCloseEvent);
    
    return () => {
      document.removeEventListener('tour:next', handleNextEvent);
      document.removeEventListener('tour:previous', handlePrevEvent);
      document.removeEventListener('tour:escape', handleCloseEvent);
    };
  }, [handleNext, handlePrev, handleClose]);

  return null;
};
