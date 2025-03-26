export const homeTourPath = {
  id: "home-tour",
  name: "Homepage Tour",
  steps: [
    {
      id: "welcome",
      elementId: "hero-section",
      title: "Welcome to Our Site",
      content: "This tour will guide you through the main features of our homepage.",
      position: "bottom" as const,
      path: {
        style: "dashed",
        targetElementId: "features-section"
      }
    },
    {
      id: "features",
      elementId: "features-section",
      title: "Explore Our Features",
      content: "Discover the key features that make our product unique and valuable.",
      position: "bottom" as const,
      path: {
        style: "solid",
        targetElementId: "testimonials-section"
      }
    },
    {
      id: "testimonials",
      elementId: "testimonials-section",
      title: "What Our Users Say",
      content: "Read testimonials from satisfied customers who have benefited from our product.",
      position: "bottom" as const,
      path: {
        style: "dotted",
        targetElementId: "contact-section"
      }
    },
    {
      id: "contact",
      elementId: "contact-section",
      title: "Get In Touch",
      content: "Contact us with any questions or feedback. We'd love to hear from you!",
      position: "bottom" as const
    }
  ]
};
