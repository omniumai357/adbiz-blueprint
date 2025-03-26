
import { 
  createStep, 
  createStepGroup, 
  enhanceStep,
  stepInGroup
} from '@/lib/tour/core/tourPathFactory';

import { 
  animatedStep,
  mediaEnhancedStep,
  optionalStep,
  visuallyEnhancedStep,
  transitionStep,
  spotlightStep,
  positionStep
} from '@/lib/tour/enhancers/visualEnhancers';

/**
 * Welcome step group for home page tour
 */
export const homeWelcomeStepGroup = createStepGroup(
  'home-welcome',
  'Home Welcome',
  [
    // Welcome step
    enhanceStep(
      createStep(
        "welcome",
        "header-welcome",
        "Welcome to Our Application",
        "This tour will guide you through the main features of our application.",
        "bottom"
      ),
      step => {
        const withAnimation = animatedStep({ highlight: "glow", entry: "fade-up" })(step);
        return stepInGroup('home-welcome')(withAnimation);
      }
    ),
    
    // Overview step
    enhanceStep(
      createStep(
        "app-overview",
        "overview-section",
        "Application Overview",
        "Here's a high-level overview of what our application can do for you.",
        "right"
      ),
      step => {
        const withAnimation = animatedStep({ highlight: "pulse", entry: "slide-in" })(step);
        const withMedia = mediaEnhancedStep(
          "/images/overview.png",
          "image",
          "Application overview diagram"
        )(withAnimation);
        return stepInGroup('home-welcome')(withMedia);
      }
    ),
  ],
  'Welcome steps for the home page tour'
);

/**
 * Features step group for home page tour
 */
export const homeFeaturesStepGroup = createStepGroup(
  'home-features',
  'Feature Highlights',
  [
    // Feature 1
    enhanceStep(
      createStep(
        "feature-1",
        "feature-section-1",
        "Key Feature 1",
        "Our first key feature helps you accomplish important tasks quickly.",
        "left"
      ),
      step => {
        const withVisualEnhancements = visuallyEnhancedStep({
          animation: { highlight: "bounce", entry: "scale-in" },
          spotlight: { intensity: "medium", pulseEffect: true },
          transition: { type: "slide", direction: "right" }
        })(step);
        return stepInGroup('home-features')(withVisualEnhancements);
      }
    ),
    
    // Feature 2
    enhanceStep(
      createStep(
        "feature-2",
        "feature-section-2",
        "Key Feature 2",
        "Our second key feature provides in-depth analytics and insights.",
        "top"
      ),
      step => {
        const withSpotlight = spotlightStep({
          intensity: "high",
          color: "#8b5cf6",
          fadeBackground: true
        })(step);
        const withTransition = transitionStep("zoom", { 
          duration: 500 
        })(withSpotlight);
        return stepInGroup('home-features')(withTransition);
      }
    ),
    
    // Optional feature
    enhanceStep(
      createStep(
        "optional-feature",
        "premium-feature-section",
        "Premium Features",
        "Explore our premium features available with paid plans.",
        "bottom-right"
      ),
      step => {
        const withPosition = positionStep("bottom-right")(step);
        const asOptional = optionalStep()(withPosition);
        return stepInGroup('home-features')(asOptional);
      }
    ),
  ],
  'Feature highlight steps for the home page tour'
);
