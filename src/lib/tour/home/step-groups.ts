
import { 
  createStep, 
  createStepGroup, 
  enhanceStep,
  animatedStep,
  dynamicContentStep,
  roleRestrictedStep,
  stepInGroup
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
      // Combine enhancers correctly by creating a function that applies both enhancers
      step => {
        // Apply stepInGroup first
        const withGroup = stepInGroup('home-introduction')(step);
        // Then apply animation and return the result
        return animatedStep()(withGroup);
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
      step => stepInGroup('home-introduction')(step)
    ),
  ],
  'Basic introduction steps for all users to learn about the platform'
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
      step => stepInGroup('home-features')(step)
    ),
    
    enhanceStep(
      createStep(
        'faq-section',
        'faq-section',
        'Frequently Asked Questions',
        'Find answers to common questions about our services and platform.',
        'top'
      ),
      step => stepInGroup('home-features')(step)
    ),
  ],
  'Highlights of key platform features for all users'
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
      step => roleRestrictedStep(['user', 'admin'])(stepInGroup('home-advanced')(step))
    ),
    
    enhanceStep(
      createStep(
        'user-dashboard',
        'dashboard-preview',
        'Your Dashboard',
        'Once you sign up, you'll have access to your personalized dashboard with analytics and controls.',
        'bottom'
      ),
      step => roleRestrictedStep(['user', 'admin'])(stepInGroup('home-advanced')(step))
    ),
  ],
  'Advanced features for registered users'
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
      step => roleRestrictedStep(['admin'])(stepInGroup('home-admin')(step))
    ),
  ],
  'Admin-specific features and controls'
);
