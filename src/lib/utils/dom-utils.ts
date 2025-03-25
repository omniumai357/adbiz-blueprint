
/**
 * DOM manipulation utility functions
 */

/**
 * Safely scrolls to an element by ID
 * 
 * @param {string} elementId - The ID of the element to scroll to
 * @param {ScrollBehavior} [behavior='smooth'] - The scroll behavior to use
 */
export const scrollToElement = (elementId: string, behavior: ScrollBehavior = 'smooth'): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior, block: 'start' });
  }
};

/**
 * Adds a class to an element if it doesn't already have it
 * 
 * @param {HTMLElement} element - The element to add the class to
 * @param {string} className - The class to add
 */
export const addClass = (element: HTMLElement, className: string): void => {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
};

/**
 * Removes a class from an element if it has it
 * 
 * @param {HTMLElement} element - The element to remove the class from
 * @param {string} className - The class to remove
 */
export const removeClass = (element: HTMLElement, className: string): void => {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
};
