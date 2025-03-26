
import { 
  createStep, 
  createStepGroup, 
  enhanceStep,
  animatedStep,
  conditionalStep,
  stepInGroup,
  spotlightStep,
  positionStep,
  roleRestrictedStep
} from '@/lib/tour/index';

/**
 * Home welcome steps group - introductory steps for the home page
 */
export const homeWelcomeStepGroup = createStepGroup(
  'home-welcome',
  'Home Welcome',
  [
    // Main welcome step
    enhanceStep(
      createStep(
        "welcome",
        "hero-section",
        "Welcome to the Tour!",
        "This guided tour will help you explore our site features. Let's start with the home page.",
        "bottom"
      ),
      step => animatedStep({ highlight: "pulse", entry: "fade-up" })(
        stepInGroup('home-welcome')(step)
      )
    ),
    
    // Header navigation step
    enhanceStep(
      createStep(
        "navigation",
        "main-navigation",
        "Site Navigation",
        "Use this navigation menu to explore different sections of our website.",
        "bottom"
      ),
      step => {
        const withAnimation = animatedStep({ 
          highlight: "glow", 
          entry: "fade-in"
        })(step);
        return stepInGroup('home-welcome')(withAnimation);
      }
    ),
  ],
  'Welcome steps for the home page tour'
);

/**
 * Features steps group - explaining main site features
 */
export const featureStepsGroup = createStepGroup(
  'home-features',
  'Home Features',
  [
    // Features section intro
    enhanceStep(
      createStep(
        "features-intro",
        "features-section",
        "Our Key Features",
        "Here you can see our core offerings and what makes us stand out.",
        "left"
      ),
      step => {
        const withAnimation = animatedStep({ 
          highlight: "solid", 
          entry: "scale-in" 
        })(step);
        const withPosition = positionStep("left")(withAnimation);
        return stepInGroup('home-features')(withPosition);
      }
    ),
    
    // Feature detail step with spotlight
    enhanceStep(
      createStep(
        "feature-detail",
        "feature-card-1",
        "Feature Details",
        "Click on any feature to learn more about our solutions.",
        "top"
      ),
      step => {
        const withAnimation = animatedStep({ 
          highlight: "pulse", 
          entry: "slide-in" 
        })(step);
        const withSpotlight = spotlightStep({
          intensity: "medium",
          pulseEffect: true
        })(withAnimation);
        return stepInGroup('home-features')(withSpotlight);
      }
    ),
  ],
  'Steps explaining the main features on the home page'
);

/**
 * Call-to-action steps group - guide users toward conversion
 */
export const ctaStepsGroup = createStepGroup(
  'home-cta',
  'Home CTAs',
  [
    // Packages section intro
    enhanceStep(
      createStep(
        "packages-intro",
        "packages-section",
        "Service Packages",
        "Browse our service packages and select one that fits your needs.",
        "right"
      ),
      step => {
        const withAnimation = animatedStep({ 
          highlight: "spotlight", 
          entry: "fade-up" 
        })(step);
        return stepInGroup('home-cta')(withAnimation);
      }
    ),
    
    // CTA button highlight
    enhanceStep(
      createStep(
        "main-cta",
        "main-cta-button",
        "Ready to Get Started?",
        "Click here to start your journey with us!",
        "bottom"
      ),
      step => {
        const withAnimation = animatedStep({ 
          highlight: "focus-ring", 
          entry: "bounce" 
        })(step);
        const withSpotlight = spotlightStep({
          intensity: "high",
          pulseEffect: true
        })(withAnimation);
        return stepInGroup('home-cta')(withSpotlight);
      }
    ),
  ],
  'Steps guiding users toward conversion actions'
);

/**
 * Admin-only steps group - only shown to administrators
 */
export const adminStepsGroup = createStepGroup(
  'home-admin',
  'Admin Features',
  [
    // Admin dashboard access
    enhanceStep(
      createStep(
        "admin-access",
        "admin-link",
        "Admin Dashboard",
        "As an administrator, you have access to the admin dashboard. Click here to manage site content and users.",
        "left"
      ),
      step => {
        const withAnimation = animatedStep({ 
          highlight: "bounce", 
          entry: "slide-in" 
        })(step);
        const withRole = roleRestrictedStep(["admin"])(withAnimation);
        return stepInGroup('home-admin')(withRole);
      }
    ),
  ],
  'Steps only visible to site administrators'
);
