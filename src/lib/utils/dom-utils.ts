
/**
 * Safely scrolls to an element by ID
 */
export const scrollToElement = (elementId: string, behavior: ScrollBehavior = 'smooth'): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior, block: 'start' });
  }
};

/**
 * Adds a class to an element if it doesn't already have it
 */
export const addClass = (element: HTMLElement, className: string): void => {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
};

/**
 * Removes a class from an element if it has it
 */
export const removeClass = (element: HTMLElement, className: string): void => {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
};
