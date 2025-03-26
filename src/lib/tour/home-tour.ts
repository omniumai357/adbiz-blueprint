
import { createTourPath } from "./core/tourPathFactory";
import { 
  featureStepsGroup,
  welcomeStepsGroup
} from "./home/step-groups";

export const homeTourPath = createTourPath(
  "home-tour",
  "Home Page Tour",
  [
    ...welcomeStepsGroup.steps,
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
