
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "./useAuthActions";

export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const authActions = useAuthActions();

  const handleSignUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    const result = await authActions.signUp(email, password, metadata);
    
    // Check if result has 'success' property and it's true
    if (result && 'success' in result && result.success) {
      // Navigate to auth page with registrationSuccess flag to trigger coupon display
      navigate("/auth", { 
        state: { 
          message: "Account created! Check out your welcome discount below.", 
          registrationSuccess: true 
        } 
      });
    }
    return result;
  };

  const handleSignIn = async (email: string, password: string) => {
    const result = await authActions.signIn(email, password);
    
    if (result && 'success' in result && result.success) {
      navigate("/");
    }
    return result;
  };

  const handleSignOut = async () => {
    const result = await authActions.signOut();
    
    if (result && 'success' in result && result.success) {
      navigate("/");
    }
    return result;
  };

  const handleResetPassword = async (email: string) => {
    const result = await authActions.resetPassword(email);
    
    if (result && 'success' in result && result.success) {
      const message = 'message' in result ? result.message : undefined;
      navigate("/auth", { state: { message } });
    }
    return result;
  };

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
