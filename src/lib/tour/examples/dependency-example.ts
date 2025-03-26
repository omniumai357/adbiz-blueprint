
import { TourPath, TourStep } from "@/contexts/tour/types";
import { createStep } from "../core/steps/createStep";
import { createTourPath } from "../core/paths/createTourPath";

/**
 * Example of a tour path with dependencies between steps
 */
export const dependencyExamplePath: TourPath = createTourPath(
  "dependency-example",
  [
    // Step 1: Introduction step
    createStep(
      "intro-step",
      "intro-element",
      "Welcome to Dependencies",
      "This tour will show how steps can depend on each other.",
      "bottom"
    ),
    
    // Step 2: First feature that must be completed before step 3
    createStep(
      "feature-one",
      "feature-one-element",
      "First Feature",
      "This is the first feature. The next step depends on this one.",
      "right"
    ),
    
    // Step 3: Depends on step 2
    createStep(
      "feature-two",
      "feature-two-element",
      "Second Feature",
      "This step depends on the first feature step.",
      "top"
    ),
    
    // Step 4: Independent step
    createStep(
      "feature-three",
      "feature-three-element",
      "Third Feature",
      "This is an independent feature that doesn't have dependencies.",
      "left"
    ),
    
    // Step 5: Final step that depends on all previous steps
    createStep(
      "conclusion",
      "conclusion-element",
      "Conclusion",
      "You've seen all the features now!",
      "bottom"
    )
  ],
  {
    name: "Dependency Example Tour",
    allowSkip: true,
    showProgress: true
  }
);

/**
 * Function to add dependencies to steps after creation
 */
export function addDependenciesToSteps(path: TourPath): TourPath {
  // Create a deep copy of the path to avoid mutating the original
  const newPath = JSON.parse(JSON.stringify(path)) as TourPath;
  
  // Add dependencies
  if (newPath.steps.length >= 3) {
    // Step 3 depends on step 2
    if (newPath.steps[2].metadata === undefined) {
      newPath.steps[2].metadata = {};
    }
    newPath.steps[2].metadata.dependencies = ["feature-one"];
  }
  
  if (newPath.steps.length >= 5) {
    // Final step depends on all previous features
    if (newPath.steps[4].metadata === undefined) {
      newPath.steps[4].metadata = {};
    }
    newPath.steps[4].metadata.dependencies = ["feature-one", "feature-two", "feature-three"];
  }
  
  return newPath;
}
