
/**
 * Scrolls to an element if the href is an anchor link
 */
export const scrollToElementIfAnchor = (href: string): void => {
  if (href.startsWith('#')) {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
