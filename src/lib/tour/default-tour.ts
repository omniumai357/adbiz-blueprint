
export const defaultTourPath = {
  id: "default-tour",
  name: "Site Tour",
  steps: [
    {
      id: "welcome",
      elementId: "header",
      title: "Welcome to Our Platform",
      content: "Let us show you around our site to help you get familiar with its features.",
      position: "bottom" as const
    },
    {
      id: "navigation",
      elementId: "main-nav",
      title: "Site Navigation",
      content: "Use these links to navigate to different sections of our site.",
      position: "bottom" as const
    },
    {
      id: "services-link",
      elementId: "services-nav-link",
      title: "Services Page",
      content: "Click here to explore our range of advertising packages.",
      position: "bottom" as const
    },
    {
      id: "contact-link",
      elementId: "contact-nav-link",
      title: "Contact Us",
      content: "Need help? Click here to reach our support team.",
      position: "bottom" as const
    }
  ]
};
