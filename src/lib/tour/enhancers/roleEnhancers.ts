
import { TourStep, StepUserRole } from "@/contexts/tour-context";

/**
 * Creates a role-restricted step that only shows for specific user roles
 * 
 * @param roles Array of user roles that can see this step
 * @returns A function that enhances the step with role restrictions
 */
export function roleRestrictedStep(
  roles: StepUserRole[]
): (step: TourStep) => TourStep {
  return (step: TourStep): TourStep => {
    return {
      ...step,
      userRoles: roles
    };
  };
}
