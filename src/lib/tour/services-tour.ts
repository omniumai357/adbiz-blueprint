
import { ArrowDown, Package, Sparkles } from "lucide-react";
import { Position } from "@/lib/tour/types";

export const servicesTourPath = {
  id: "services-tour",
  name: "Services Page Tour",
  steps: [
    {
      id: "welcome",
      elementId: "services-title",
      title: "Welcome to Our Services",
      content: "This page showcases our advertising packages. Let's walk through the different options available to you.",
      position: "bottom" as Position
    },
    {
      id: "categories",
      elementId: "category-selection",
      title: "Service Categories",
      content: "You can switch between different service types here. Each category offers unique benefits for your business.",
      position: "bottom" as Position
    },
    {
      id: "packages",
      elementId: "packages-grid",
      title: "Service Packages",
      content: "Browse through our available packages. Each one includes different features tailored to specific business needs.",
      position: "top" as Position
    },
    {
      id: "package-details",
      elementId: "package-features",
      title: "Package Features",
      content: "Each package includes a set of features. Look for the checkmarks to see what's included in each option.",
      position: "right" as Position
    },
    {
      id: "contact-cta",
      elementId: "contact-cta",
      title: "Need Assistance?",
      content: "If you have questions or need custom solutions, our team is ready to help. Click here to get in touch.",
      position: "top" as Position
    }
  ]
};
