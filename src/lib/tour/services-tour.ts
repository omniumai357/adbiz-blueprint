
import { ArrowDown, Package, Sparkles } from "lucide-react";

export const servicesTourPath = {
  id: "services-tour",
  name: "Services Page Tour",
  steps: [
    {
      id: "welcome",
      elementId: "services-title", // This should be an ID on the services page title
      title: "Welcome to Our Services",
      content: "This page showcases our advertising packages. Let's walk through the different options available to you.",
      position: "bottom"
    },
    {
      id: "categories",
      elementId: "category-selection", // This should be an ID on the category selection section
      title: "Service Categories",
      content: "You can switch between different service types here. Each category offers unique benefits for your business.",
      position: "bottom"
    },
    {
      id: "packages",
      elementId: "packages-grid", // This should be an ID on the packages grid
      title: "Service Packages",
      content: "Browse through our available packages. Each one includes different features tailored to specific business needs.",
      position: "top"
    },
    {
      id: "package-details",
      elementId: "package-features", // This should be an ID on a package's features list
      title: "Package Features",
      content: "Each package includes a set of features. Look for the checkmarks to see what's included in each option.",
      position: "right"
    },
    {
      id: "contact-cta",
      elementId: "contact-cta", // This should be an ID on the contact CTA
      title: "Need Assistance?",
      content: "If you have questions or need custom solutions, our team is ready to help. Click here to get in touch.",
      position: "top"
    }
  ]
};
