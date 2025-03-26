
import { createStepGroup, experienceLevelStep, featureAreaStep, stepInGroup, taggedStep } from "../core/tourStepGroups";
import { createStep, enhanceStep } from "../core/tourPathFactory";
// Import the visual enhancers
import { 
  animatedStep, 
  mediaEnhancedStep, 
  optionalStep,
  visuallyEnhancedStep,
  transitionStep,
  spotlightStep,
  positionStep
} from "../enhancers/visualEnhancers";

export const featureStepsGroup = createStepGroup(
  "home-features",
  "Feature Highlights",
  [
    enhanceStep(
      createStep(
        "features-overview",
        "features-section",
        "Feature Overview",
        "Discover all the key features that make our platform stand out from the competition."
      ),
      visuallyEnhancedStep({
        position: "bottom",
        animation: {
          entry: "fade-in",
          highlight: "pulse"
        },
        spotlight: {
          intensity: "medium",
          pulseEffect: true
        }
      })
    ),
    enhanceStep(
      createStep(
        "responsive-design",
        "feature-responsive",
        "Responsive Design",
        "Our platform looks great on any device, from desktops to smartphones."
      ),
      visuallyEnhancedStep({
        position: "right",
        animation: {
          entry: "slide-in",
          highlight: "pulse"
        }
      })
    ),
    enhanceStep(
      createStep(
        "easy-customization",
        "feature-customization",
        "Easy Customization",
        "Tailor the platform to your exact needs without any coding required."
      ),
      visuallyEnhancedStep({
        position: "top",
        animation: {
          entry: "fade-up",
          highlight: "bounce"
        },
        media: {
          type: "image",
          url: "/images/customization.jpg",
          alt: "Customization example"
        }
      })
    )
  ],
  "Highlights the key features of our platform for new users",
  {
    tags: ["features", "onboarding", "welcome"],
    experienceLevel: "beginner",
    featureArea: "home"
  }
);

export const welcomeStepsGroup = createStepGroup(
  "home-welcome",
  "Welcome Tour",
  [
    enhanceStep(
      createStep(
        "welcome-intro",
        "hero-section",
        "Welcome to Our Platform",
        "We're excited to have you here! Let's take a quick tour to help you get started."
      ),
      visuallyEnhancedStep({
        position: "bottom",
        animation: {
          entry: "fade-in",
          highlight: "glow"
        },
        spotlight: {
          intensity: "high",
          color: "rgba(99, 102, 241, 0.7)",
          pulseEffect: true
        }
      })
    ),
    enhanceStep(
      createStep(
        "navigation-overview",
        "main-navigation",
        "Easy Navigation",
        "Our intuitive navigation makes it simple to find what you're looking for."
      ),
      visuallyEnhancedStep({
        position: "bottom",
        animation: {
          entry: "slide-in",
          highlight: "pulse"
        }
      })
    )
  ],
  "Initial welcome tour for first-time visitors",
  {
    tags: ["welcome", "onboarding"],
    experienceLevel: "beginner",
    featureArea: "home"
  }
);
