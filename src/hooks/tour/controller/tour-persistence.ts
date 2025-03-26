
/**
 * Saves tour progress to localStorage
 * @param pathId The current tour path ID
 * @param step The current step index
 * @param active Whether the tour is active
 */
export const saveTourProgress = (pathId: string, step: number, active: boolean): void => {
  localStorage.setItem(
    "tourProgress",
    JSON.stringify({
      pathId,
      step,
      active,
    })
  );
};

/**
 * Loads saved tour progress from localStorage
 * @returns The saved tour progress or null if not found
 */
export const loadTourProgress = (): { pathId: string; step: number; active: boolean } | null => {
  const savedProgress = localStorage.getItem("tourProgress");
  if (savedProgress) {
    try {
      return JSON.parse(savedProgress);
    } catch (error) {
      console.error("Error restoring tour progress:", error);
      return null;
    }
  }
  return null;
};

/**
 * Clears saved tour progress
 */
export const clearTourProgress = (): void => {
  localStorage.removeItem("tourProgress");
};

/**
 * Marks a tour as completed
 * @param tourId The ID of the completed tour
 */
export const markTourCompleted = (tourId: string): void => {
  try {
    const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
    if (!completedTours.includes(tourId)) {
      completedTours.push(tourId);
      localStorage.setItem('completedTours', JSON.stringify(completedTours));
    }
  } catch (error) {
    console.error("Error marking tour as completed:", error);
  }
};

/**
 * Checks if a tour has been completed
 * @param tourId The tour ID to check
 * @returns True if the tour has been completed
 */
export const isTourCompleted = (tourId: string): boolean => {
  try {
    const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
    return completedTours.includes(tourId);
  } catch (error) {
    console.error("Error checking tour completion status:", error);
    return false;
  }
};
