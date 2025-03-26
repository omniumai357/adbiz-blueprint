
import { 
  createTourPath, 
  createStep,
  enhanceStep,
  dependentStep,
  branchingStep,
  sectionStep,
  reEntryPoint
} from '@/lib/tour/index';

/**
 * Example tour path showcasing advanced dependency management
 */
export const advancedTourPath = createTourPath(
  "advanced-tour",
  "Advanced Tour With Dependencies",
  [
    // Welcome step
    enhanceStep(
      createStep(
        "welcome",
        "header",
        "Welcome to Advanced Tour",
        "This tour demonstrates advanced dependency and branching features.",
        "bottom"
      ),
      sectionStep('introduction')
    ),
    
    // Basic features step
    enhanceStep(
      createStep(
        "basic-features",
        "features-section",
        "Basic Features",
        "Let's look at the basic features first.",
        "right"
      ),
      sectionStep('basics')
    ),
    
    // Advanced features step - depends on basic features
    enhanceStep(
      createStep(
        "advanced-features",
        "advanced-section",
        "Advanced Features",
        "Now that you understand the basics, let's explore advanced features.",
        "left"
      ),
      step => {
        // Chain multiple enhancers
        const withDependency = dependentStep(['basic-features'])(step);
        return sectionStep('advanced')(withDependency);
      }
    ),
    
    // Branching step - choose path based on user preference
    enhanceStep(
      createStep(
        "choose-path",
        "path-selection",
        "Choose Your Path",
        "Would you like to explore the technical details or see a quick overview?",
        "bottom"
      ),
      branchingStep([
        {
          condition: () => localStorage.getItem('userPreference') === 'technical',
          targetStepId: "technical-details",
          label: "Show Technical Details"
        },
        {
          condition: () => localStorage.getItem('userPreference') === 'overview',
          targetStepId: "quick-overview",
          label: "Show Quick Overview"
        }
      ])
    ),
    
    // Technical path
    enhanceStep(
      createStep(
        "technical-details",
        "technical-section",
        "Technical Details",
        "Here are the in-depth technical specifications and implementation details.",
        "right"
      ),
      sectionStep('technical')
    ),
    
    // Overview path
    enhanceStep(
      createStep(
        "quick-overview",
        "overview-section",
        "Quick Overview",
        "Here's a simplified overview of how everything works.",
        "left"
      ),
      sectionStep('overview')
    ),
    
    // Re-entry point after branching paths
    enhanceStep(
      createStep(
        "conclusion",
        "conclusion-section",
        "Conclusion",
        "Thanks for exploring our advanced tour system!",
        "bottom"
      ),
      step => {
        // This step is a re-entry point after either technical or overview paths
        const withReEntry = reEntryPoint()(step);
        return sectionStep('conclusion')(withReEntry);
      }
    )
  ],
  {
    allowSkip: true,
    showProgress: true,
    metadata: {
      category: 'advanced',
      difficulty: 'intermediate'
    }
  }
);
