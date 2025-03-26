
import { 
  createTourPath, 
  createStep,
  enhanceStep,
  animatedStep, 
  dynamicContentStep, 
  conditionalStep, 
  roleRestrictedStep 
} from './index';

export const homeTourPath = createTourPath(
  "home-tour",
  "Home Page Tour",
  [
    enhanceStep(
      createStep(
        "welcome",
        "hero-section",
        "Welcome to Our Platform",
        "This is our homepage where you can learn about our services and get started with our platform.",
        "bottom"
      ),
      animatedStep()
    ),
    
    enhanceStep(
      createStep(
        "services",
        "services-section",
        "Our Services",
        "Browse through our service categories to find the perfect fit for your business needs.",
        "bottom"
      ),
      dynamicContentStep(() => {
        // Example of dynamic content that could be personalized
        const username = localStorage.getItem('username');
        return username 
          ? `Hello ${username}! Browse through our service categories to find the perfect fit for your business needs.`
          : "Browse through our service categories to find the perfect fit for your business needs.";
      })
    ),
    
    enhanceStep(
      createStep(
        "testimonials",
        "testimonials-section",
        "Customer Testimonials",
        "Read what our satisfied customers have to say about our services.",
        "top"
      ),
      conditionalStep(() => {
        // Only show this step to users who have scrolled past the services section
        const servicesSection = document.getElementById('services-section');
        if (!servicesSection) return true;
        
        const rect = servicesSection.getBoundingClientRect();
        return rect.top < window.innerHeight;
      })
    ),
    
    enhanceStep(
      createStep(
        "cta",
        "cta-section",
        "Get Started Today",
        "Ready to boost your business? Click here to explore our service packages.",
        "top"
      ),
      roleRestrictedStep(["user", "admin"])
    )
  ]
);
