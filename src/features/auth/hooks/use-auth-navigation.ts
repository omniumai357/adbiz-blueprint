
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "./use-auth-actions";

/**
 * Hook that combines authentication actions with navigation handling
 * to provide a unified interface for auth operations that need to redirect the user.
 */
export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const authActions = useAuthActions();

  /**
   * Handles user registration with navigation to welcome/coupon display
   */
  const handleSignUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    const result = await authActions.signUp(email, password, metadata);
    
    // Check if registration was successful
    if (result && 'success' in result && result.success) {
      // Navigate to auth page with registrationSuccess flag to trigger coupon display
      // Also include firstPurchaseDiscount flag to notify about the tiered discount
      navigate("/auth", { 
        state: { 
          message: "Account created! Check out your welcome discount below and enjoy an additional bonus on your first purchase.", 
          registrationSuccess: true,
          firstPurchaseDiscount: true
        } 
      });
    }
    return result;
  };

  /**
   * Handles user sign in with navigation to homepage on success
   */
  const handleSignIn = async (email: string, password: string) => {
    const result = await authActions.signIn(email, password);
    
    if (result && 'success' in result && result.success) {
      navigate("/");
    }
    return result;
  };

  /**
   * Handles user sign out with navigation to homepage
   */
  const handleSignOut = async () => {
    const result = await authActions.signOut();
    
    if (result && 'success' in result && result.success) {
      navigate("/");
    }
    return result;
  };

  /**
   * Handles password reset with navigation back to auth page
   */
  const handleResetPassword = async (email: string) => {
    const result = await authActions.resetPassword(email);
    
    if (result && 'success' in result && result.success) {
      const message = 'message' in result ? result.message : undefined;
      navigate("/auth", { state: { message } });
    }
    return result;
  };

  /**
   * Handles password update with navigation to homepage
   */
  const handleUpdatePassword = async (newPassword: string) => {
    const result = await authActions.updatePassword(newPassword);
    
    if (result && 'success' in result && result.success) {
      navigate("/");
    }
    return result;
  };

  return {
    handleSignUp,
    handleSignIn,
    handleSignOut,
    handleResetPassword,
    handleUpdatePassword
  };
};
