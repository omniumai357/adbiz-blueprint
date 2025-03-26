
import { createTourPath } from "./core/tourPathFactory";
import { 
  featureStepsGroup,
  welcomeStepsGroup
} from "./home/step-groups";
import { pathAnimatedStep } from "./enhancers/pathEnhancers";

// Add path animations to the welcome steps
const enhancedWelcomeSteps = welcomeStepsGroup.steps.map((step, index) => {
  // Only add path animation between steps (not for the last step)
  if (index < welcomeStepsGroup.steps.length - 1) {
    return pathAnimatedStep({
      style: "curved",
      color: "rgba(99, 102, 241, 0.7)",
      animationDuration: 1000,
      showArrow: true
    })(step);
  }
  return step;
});

export const homeTourPath = createTourPath(
  "home-tour",
  "Home Page Tour",
  [
    ...enhancedWelcomeSteps,
    ...featureStepsGroup.steps
  ],
  {
    allowSkip: true,
    showProgress: true,
    autoStart: false,
    metadata: {
      pageContext: "home",
      importance: "high"
    }
  }
);
