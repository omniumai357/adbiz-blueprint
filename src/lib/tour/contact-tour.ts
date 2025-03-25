
export const contactTourPath = {
  id: "contact-tour",
  name: "Contact Page Tour",
  steps: [
    {
      id: "welcome",
      elementId: "contact-banner",
      title: "Contact Us",
      content: "This page provides multiple ways to get in touch with our team.",
      position: "bottom" as const
    },
    {
      id: "contact-methods",
      elementId: "contact-methods",
      title: "Contact Methods",
      content: "Choose your preferred way to reach us - phone, email, or chat.",
      position: "bottom" as const
    },
    {
      id: "contact-form",
      elementId: "contact-form",
      title: "Contact Form",
      content: "Fill out this form to send us a message. We'll respond within 24 hours.",
      position: "left" as const
    },
    {
      id: "faqs",
      elementId: "faqs-section",
      title: "Frequently Asked Questions",
      content: "Find quick answers to common questions before reaching out.",
      position: "top" as const
    }
  ]
};
