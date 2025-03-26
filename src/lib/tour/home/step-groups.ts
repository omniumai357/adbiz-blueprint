
import { 
  createStep, 
  createStepGroup, 
  enhanceStep,
  animatedStep,
  dynamicContentStep,
  roleRestrictedStep,
  stepInGroup,
  transitionStep,
  spotlightStep
} from '@/lib/tour/index';

/**
 * Basic introduction step group - suitable for all users
 */
export const introductionStepGroup = createStepGroup(
  'home-introduction',
  'Homepage Introduction',
  [
    enhanceStep(
      createStep(
        'welcome',
        'hero-section',
        'Welcome to Our Platform',
        'This is our homepage where you can learn about our services and get started with our platform.',
        'bottom'
      ),
      step => {
        // Apply stepInGroup first
        const withGroup = stepInGroup('home-introduction')(step);
        // Then apply animation and return the result
        return animatedStep({
          entry: "fade-in",
          highlight: "pulse",
          transition: "slide"
        })(withGroup);
      }
    ),
    
    enhanceStep(
      createStep(
        'services-intro',
        'services-section',
        'Our Services',
        'Browse through our service categories to find the perfect fit for your business needs.',
        'bottom'
      ),
      step => {
        const withGroup = stepInGroup('home-introduction')(step);
        return transitionStep({
          type: "slide",
          direction: "left",
          duration: 400
        })(withGroup);
      }
    ),
  ],
  'Basic introduction steps for all users to learn about the platform',
  {
    tags: ['introduction', 'welcome', 'onboarding'],
    experienceLevel: 'beginner',
    featureArea: 'homepage'
  }
);

/**
 * Feature highlights step group - for showcasing key platform capabilities
 */
export const featureHighlightsStepGroup = createStepGroup(
  'home-features',
  'Feature Highlights',
  [
    enhanceStep(
      createStep(
        'testimonials',
        'testimonials-section',
        'Customer Testimonials',
        'Read what our satisfied customers have to say about our services.',
        'top'
      ),
      step => {
        const withGroup = stepInGroup('home-features')(step);
        return spotlightStep({
          intensity: "medium",
          pulseEffect: true
        })(transitionStep({
          type: "fade",
          duration: 300
        })(withGroup));
      }
    ),
    
    enhanceStep(
      createStep(
        'faq-section',
        'faq-section',
        'Frequently Asked Questions',
        'Find answers to common questions about our services and platform.',
        'top'
      ),
      step => {
        const withGroup = stepInGroup('home-features')(step);
        return spotlightStep({
          intensity: "high",
          color: "rgba(99, 102, 241, 0.7)"
        })(transitionStep({
          type: "zoom",
          duration: 350
        })(withGroup));
      }
    ),
  ],
  'Highlights of key platform features for all users',
  {
    tags: ['features', 'testimonials', 'faq'],
    experienceLevel: 'beginner',
    featureArea: 'homepage'
  }
);

/**
 * Advanced features step group - only for registered users
 */
export const advancedFeaturesStepGroup = createStepGroup(
  'home-advanced',
  'Advanced Features',
  [
    enhanceStep(
      createStep(
        'cta',
        'cta-section',
        'Get Started Today',
        'Ready to boost your business? Click here to explore our service packages.',
        'top'
      ),
      step => {
        // First apply the group
        const withGroup = stepInGroup('home-advanced')(step);
        // Then apply role restriction and return the result
        return roleRestrictedStep(['user', 'admin'])(withGroup);
      }
    ),
    
    enhanceStep(
      createStep(
        'user-dashboard',
        'dashboard-preview',
        'Your Dashboard',
        'Once you sign up, you'll have access to your personalized dashboard with analytics and controls.',
        'bottom'
      ),
      step => {
        // First apply the group
        const withGroup = stepInGroup('home-advanced')(step);
        // Then apply role restriction and return the result
        return roleRestrictedStep(['user', 'admin'])(withGroup);
      }
    ),
  ],
  'Advanced features for registered users',
  {
    tags: ['dashboard', 'advanced-features'],
    experienceLevel: 'intermediate',
    featureArea: 'user-tools'
  }
);

/**
 * Admin features step group - only for admins
 */
export const adminFeaturesStepGroup = createStepGroup(
  'home-admin',
  'Admin Features',
  [
    enhanceStep(
      createStep(
        'admin-controls',
        'admin-preview',
        'Admin Controls',
        'As an admin, you have access to advanced controls and analytics.',
        'left'
      ),
      step => {
        // First apply the group
        const withGroup = stepInGroup('home-admin')(step);
        // Then apply role restriction and return the result
        return roleRestrictedStep(['admin'])(withGroup);
      }
    ),
  ],
  'Admin-specific features and controls',
  {
    tags: ['admin', 'controls'],
    experienceLevel: 'advanced',
    featureArea: 'admin-dashboard',
    requiredRoles: ['admin'],
    priority: 10
  }
);
